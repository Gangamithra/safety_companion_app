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
  height: "100vh"
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
  const [routeStats, setRouteStats] = useState([]);

  const [dangerZones, setDangerZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);

  const [aiRecommendation, setAiRecommendation] = useState("");

  /* LIVE LOCATION */

  const getUserLocation = () => {
    navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        setCenter(location);
        setOrigin(location);
        setUserLocation(location);
      },
      () => alert("Location access denied"),
      { enableHighAccuracy: true }
    );
  };

  /* SAFETY SCORE */

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
          keyword: "shop OR mall OR market OR hospital OR police OR restaurant"
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

          if (
            types.includes("store") ||
            types.includes("shopping_mall") ||
            types.includes("restaurant")
          ) shops++;

          if (types.includes("hospital")) hospitals++;
          if (types.includes("police")) police++;
        });

        let score = 0;

        score += Math.min(shops * 1.5, 5);
        score += Math.min(hospitals * 2, 3);
        score += Math.min(police * 3, 3);

        if (shops === 0 && hospitals === 0 && police === 0) {
          score = 2;
        }

        if (score > 10) score = 10;

        /* DANGER ZONES */

        if (score < 7) {
          let reason = "Low safety area";

          if (shops === 0) reason = "No nearby shops (isolated)";
          else if (hospitals === 0) reason = "No hospital nearby";
          else if (police === 0) reason = "No police presence";

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
    setRouteStats(statsArray);

    return { scores, statsArray };
  };

  /* 🔥 SMART AI-LIKE RECOMMENDATION (NO API) */

  const getAIRecommendation = (scores, stats) => {

    const safestIndex = scores.indexOf(Math.max(...scores));
    const safest = stats[safestIndex];

    let reasons = [];

    if (safest.shops > 5) reasons.push("high crowd activity");
    else if (safest.shops > 2) reasons.push("moderate crowd presence");

    if (safest.hospitals > 0) reasons.push("nearby hospitals");

    if (safest.police > 0) reasons.push("police presence");

    if (reasons.length === 0) {
      reasons.push("relatively better conditions compared to other routes");
    }

    const reasonText = reasons.join(", ");

    setAiRecommendation(
      `Route ${safestIndex + 1} is recommended as the safest because it has ${reasonText}, making it more secure than the other available routes.`
    );
  };

  /* ROUTE */

  const calculateRoute = async (destination) => {

    if (!origin) {
      alert("Click Start Live Location first");
      return;
    }

    const directionsService =
      new window.google.maps.DirectionsService();

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

    getAIRecommendation(scores, statsArray); // 🔥 updated
  };

  /* DESTINATION */

  const onPlaceChanged = (autocomplete) => {

    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    const destination = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };

    setCenter(destination);
    calculateRoute(destination);
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  const safestScore =
    safetyScores.length > 0 ? Math.max(...safetyScores) : null;

  return (

    <div style={{ display: "flex" }}>

      {/* SIDE PANEL */}

      <div style={{
        width: "320px",
        padding: "15px",
        background: "#fff",
        height: "100vh",
        overflowY: "auto"
      }}>

        <h2>Routes</h2>

        {routes.map((route, i) => {

          const leg = route.legs[0];
          const score = safetyScores[i] || "...";
          const safest = score === safestScore;

          return (
            <div
              key={i}
              onClick={() => setSelectedRoute(i)}
              style={{
                padding: "10px",
                marginBottom: "10px",
                background: safest ? "#d4edda" : "#f1f1f1",
                cursor: "pointer"
              }}
            >
              <h4>Route {i + 1} {safest && "⭐"}</h4>
              <p>{leg.distance.text} • {leg.duration.text}</p>
              <p>Safety: {score}/10</p>
            </div>
          );
        })}

        {aiRecommendation && (
          <div style={{ marginTop: "15px", background: "#eef", padding: "10px" }}>
            <h4>AI Recommendation</h4>
            <p>{aiRecommendation}</p>
          </div>
        )}

      </div>

      {/* MAP */}

      <div style={{ flex: 1, padding: "15px" }}>

        <p>👉 Click <b>Start Live Location</b> first</p>

        <Autocomplete
          onLoad={(a) => (window.autocomplete = a)}
          onPlaceChanged={() => onPlaceChanged(window.autocomplete)}
        >
          <input
            placeholder="Search destination"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid blue",
              borderRadius: "6px"
            }}
          />
        </Autocomplete>

        <button
          onClick={getUserLocation}
          style={{
            background: "blue",
            color: "#fff",
            padding: "10px",
            marginTop: "10px",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Start Live Location
        </button>

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

          {dangerZones.map((zone, i) => (
            <Circle
              key={i}
              center={zone}
              radius={400}
              onClick={() => setSelectedZone(zone)}
              options={{
                fillColor: "red",
                fillOpacity: 0.4,
                strokeColor: "red"
              }}
            />
          ))}

          {selectedZone && (
            <InfoWindow
              position={selectedZone}
              onCloseClick={() => setSelectedZone(null)}
            >
              <div>
                <strong>Danger Zone</strong>
                <p>{selectedZone.reason}</p>
              </div>
            </InfoWindow>
          )}

        </GoogleMap>

      </div>

    </div>
  );
}

export default MapPage;