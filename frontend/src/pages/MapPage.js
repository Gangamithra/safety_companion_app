import React, { useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  Circle,
  InfoWindow
} from "@react-google-maps/api";

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%"
};

function MapPage() {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const [center, setCenter] = useState({ lat: 11.0168, lng: 76.9558 });
  const [origin, setOrigin] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [directions, setDirections] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(0);

  const [safetyScores, setSafetyScores] = useState([]);

  const [dangerZones, setDangerZones] = useState([]);
  const [hoveredZone, setHoveredZone] = useState(null);

  const [aiRecommendation, setAiRecommendation] = useState("");

  /* LIVE LOCATION */
  const getUserLocation = () => {
    navigator.geolocation.watchPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCenter(loc);
        setOrigin(loc);
        setUserLocation(loc);
      },
      () => alert("Location access denied"),
      { enableHighAccuracy: true }
    );
  };

  /* SAFETY */
  const calculateSafetyScores = async (routesData) => {

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    let zones = [];
    let statsArray = [];

    const scores = await Promise.all(
      routesData.map(async (route) => {

        const leg = route.legs[0];
        const midIndex = Math.floor(leg.steps.length / 2);

        const midpoint =
          leg.steps[midIndex]?.end_location ||
          leg.steps[0]?.end_location;

        if (!midpoint) return 5;

        const request = {
          location: midpoint,
          radius: 1500,
          keyword: "shop OR mall OR market OR hospital OR police OR restaurant",
          type: "point_of_interest"
        };

        const places = await new Promise((resolve) => {
          service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK)
              resolve(results);
            else resolve([]);
          });
        });

        let shops = 0, hospitals = 0, police = 0;

        places.forEach((p) => {
          const types = p.types || [];
          if (types.includes("store") || types.includes("shopping_mall") || types.includes("restaurant")) shops++;
          if (types.includes("hospital")) hospitals++;
          if (
            types.includes("police") ||
            (p.name && p.name.toLowerCase().includes("police"))
          ) {
            police++;
          }
        });

        let score = 0;
        score += Math.min(shops * 1.5, 5);
        score += Math.min(hospitals * 2, 3);
        score += Math.min(police * 3, 3);

        if (shops === 0 && hospitals === 0 && police === 0) score = 2;
        if (score > 10) score = 10;

        /* DANGER ZONES */
        if (score < 7) {
          let reason = "Low safety area";

          if (shops === 0) reason = "Isolated area";
          else if (hospitals === 0) reason = "No hospitals nearby";
          else if (police === 0) reason = "No police nearby";

          zones.push({
            lat: midpoint.lat(),
            lng: midpoint.lng(),
            reason
          });
        }

        statsArray.push({ shops, hospitals, police });

        return Math.round(score);
      })
    );

    setDangerZones(zones);


    return { scores, statsArray };
  };

  /* AI */
  const getAIRecommendation = (scores, stats) => {

    const safestIndex = scores.indexOf(Math.max(...scores));
    const safest = stats[safestIndex];
  
    let explanation = "";
  
    /* CROWD ANALYSIS */
    if (safest.shops > 6) {
      explanation += "This route has a high level of public activity, indicating a active area. ";
    } else if (safest.shops > 2) {
      explanation += "This route has a moderate level of crowd presence, which provides a reasonable sense of safety. ";
    } else {
      explanation += "This route appears relatively less crowded, which may indicate quieter surroundings. ";
    }
  
    /* HOSPITAL ANALYSIS */
    if (safest.hospitals > 0) {
      explanation += "Nearby hospitals are available along this route. ";
    } else {
      explanation += "There are limited medical facilities nearby, which slightly reduces emergency preparedness. ";
    }
  
  
    /* COMPARISON */
    explanation += "Compared to other available routes, this path offers better overall safety conditions based on available data.";
  
    setAiRecommendation({
      route: safestIndex + 1,
      text: explanation
    });
  };

  /* ROUTE */
  const calculateRoute = async (destination) => {

    if (!origin) {
      alert("Start live location first");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    const result = await directionsService.route({
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true
    });

    setDirections(result);
    setRoutes(result.routes);
    setSelectedRoute(0);

    const { scores, statsArray } =
      await calculateSafetyScores(result.routes);

    setSafetyScores(scores);
    getAIRecommendation(scores, statsArray);
  };

  /* DESTINATION */
  const onPlaceChanged = (autocomplete) => {

    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    const dest = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };

    setCenter(dest);
    calculateRoute(dest);
  };

  if (!isLoaded) return <div>Loading...</div>;

  const safestScore =
    safetyScores.length > 0 ? Math.max(...safetyScores) : null;

  return (

    <div className="flex h-screen bg-gray-900 text-white">

      {/* LEFT PANEL */}
      <div className="w-80 bg-gray-900 border-r border-gray-700 p-5">

        <h2 className="text-lg font-semibold text-blue-400 mb-4">
          Routes Overview
        </h2>

        {routes.map((route, i) => {

          const leg = route.legs[0];
          const score = safetyScores[i] || "...";
          const safest = score === safestScore;

          return (
            <div
              key={i}
              onClick={() => setSelectedRoute(i)}
              className={`p-4 mb-3 rounded-xl cursor-pointer
                ${safest ? "bg-green-700" : "bg-gray-800 hover:bg-gray-700"}
              `}
            >
              <div className="flex justify-between">
                <span>Route {i + 1}</span>
                {safest && <span className="text-xs">Best</span>}
              </div>

              <p className="text-sm text-gray-300">
                {leg.distance.text} • {leg.duration.text}
              </p>

              <p className="text-sm text-blue-300">
                Safety: {score}/10
              </p>
            </div>
          );
        })}

        {aiRecommendation && (
           <div className="mt-4 p-4 bg-blue-900/80 rounded-xl shadow-md">

             <h4 className="text-blue-300 font-semibold mb-2">
               Insight
             </h4>

             <p className="text-sm text-gray-200 leading-relaxed">
               <span className="font-medium text-white">
               Route {aiRecommendation.route} is recommended.
               </span>{" "}
               {aiRecommendation.text}
             </p>

           </div>
        )}

      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="p-4 bg-gray-800 border-b border-gray-700 flex flex-col items-center">

          <p className="text-sm text-gray-400 mb-3">
            Start live location first, then search destination
          </p>

          <div className="flex items-center gap-4 w-full max-w-6xl">

            <div className="w-[65%]">
              <Autocomplete
                onLoad={(a) => (window.autocomplete = a)}
                onPlaceChanged={() => onPlaceChanged(window.autocomplete)}
              >
                <input
                  placeholder="Search destination..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Autocomplete>
            </div>

            <button
              onClick={getUserLocation}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
            >
              Start Live Location
            </button>

          </div>

        </div>

        {/* MAP */}
        <div className="flex-1">

          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={center}
          >

            {userLocation && <Marker position={userLocation} />}

            {directions && (
              <DirectionsRenderer
                directions={directions}
                routeIndex={selectedRoute}
              />
            )}

            {/* ✅ SUBTLE DANGER ZONES */}
            {dangerZones.map((zone, i) => (
              <React.Fragment key={i}>

                <Circle
                  center={zone}
                  radius={300}
                  options={{
                    fillColor: "#ef4444",
                    fillOpacity: 0.25,
                    strokeColor: "#ef4444",
                    strokeOpacity: 0.5,
                    strokeWeight: 1
                  }}
                />

                {/* Invisible marker for hover FIX */}
                <Marker
                  position={zone}
                  opacity={0}
                  onMouseOver={() => setHoveredZone(zone)}
                  onMouseOut={() => setHoveredZone(null)}
                />

              </React.Fragment>
            ))}

            {hoveredZone && (
              <InfoWindow position={hoveredZone}>
                <div className="text-black text-sm">
                  <strong>Unsafe Area</strong>
                  <p>{hoveredZone.reason}</p>
                </div>
              </InfoWindow>
            )}

          </GoogleMap>

        </div>

      </div>

    </div>
  );
}

export default MapPage;