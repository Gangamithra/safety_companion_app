
import React, { useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  Circle
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

  const [dangerZones, setDangerZones] = useState([]);

  /* LIVE USER LOCATION */

  const getUserLocation = () => {

    navigator.geolocation.watchPosition((position) => {

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const location = { lat, lng };

      setCenter(location);
      setOrigin(location);
      setUserLocation(location);

    });

  };

  /* SAFETY SCORE + DANGER ZONES */

  const calculateSafetyScores = async (routesData) => {

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const scores = await Promise.all(
      routesData.map(async (route) => {

        const leg = route.legs[0];

        const midIndex = Math.floor(leg.steps.length / 2);
        const midpoint = leg.steps[midIndex].end_location;

        const request = {
          location: midpoint,
          radius: 1000,
          keyword: "restaurant OR shop OR mall OR hospital OR police"
        };

        const places = await new Promise((resolve) => {

          service.nearbySearch(request, (results, status) => {

            if (
              status ===
              window.google.maps.places.PlacesServiceStatus.OK
            ) {
              resolve(results);
            } else {
              resolve([]);
            }

          });

        });

        let shopCount = 0;
        let hospitalCount = 0;
        let policeCount = 0;

        places.forEach((place) => {

          const types = place.types || [];

          if (
            types.includes("restaurant") ||
            types.includes("store") ||
            types.includes("shopping_mall")
          ) shopCount++;

          if (types.includes("hospital")) hospitalCount++;

          if (types.includes("police")) policeCount++;

        });

        /* SAFETY FORMULA */

        let score = 5;

        score += Math.min(shopCount / 5, 3);
        score += Math.min(hospitalCount, 1);
        score += Math.min(policeCount, 1);

        if (score > 10) score = 10;

        /* DANGER ZONE if score < 6 */

        if (score < 6) {
          setDangerZones((prev) => [
            ...prev,
            {
              lat: midpoint.lat(),
              lng: midpoint.lng()
            }
          ]);
        }

        return Math.round(score);

      })
    );

    return scores;

  };

  /* ROUTE CALCULATION */

  const calculateRoute = async (destination) => {

    if (!origin) {
      alert("Click Start Live Location first");
      return;
    }

    const directionsService =
      new window.google.maps.DirectionsService();

    const result = await directionsService.route({
      origin: origin,
      destination: destination,
      travelMode:
        window.google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true
    });

    setDirections(result);
    setRoutes(result.routes);
    setSelectedRoute(0);

    const scores = await calculateSafetyScores(result.routes);

    setSafetyScores(scores);

  };

  /* DESTINATION SEARCH */

  const onPlaceChanged = (autocomplete) => {

    const place = autocomplete.getPlace();

    if (place.geometry) {

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      const destination = { lat, lng };

      setCenter(destination);

      calculateRoute(destination);

    }

  };

  if (!isLoaded) return <div>Loading Map...</div>;

  const safestScore =
    safetyScores.length > 0 ? Math.max(...safetyScores) : null;

  return (

    <div style={{ display: "flex" }}>

      {/* ROUTE PANEL */}

      <div
        style={{
          width: "300px",
          padding: "15px",
          background: "#ffffff",
          overflowY: "auto",
          height: "100vh",
          borderRight: "1px solid #ddd"
        }}
      >

        <h2>Available Routes</h2>

        {routes.map((route, index) => {

          const leg = route.legs[0];
          const score = safetyScores[index] || "...";

          const safest =
            score === safestScore;

          return (

            <div
              key={index}
              onClick={() => setSelectedRoute(index)}
              style={{
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                cursor: "pointer",
                background:
                  safest
                    ? "#d4edda"
                    : selectedRoute === index
                    ? "#e8f0fe"
                    : "#f8f8f8"
              }}
            >

              <h4>
                Route {index + 1} {safest && "⭐ Safest"}
              </h4>

              <p>Distance: {leg.distance.text}</p>

              <p>Time: {leg.duration.text}</p>

              <p>Safety Score: {score}/10</p>

            </div>

          );

        })}

      </div>

      {/* MAP AREA */}

      <div style={{ flex: 1, padding: "15px" }}>

        <h2>Safe Route Navigation</h2>

        <p style={{ color: "#555", fontSize: "14px" }}>
          Click <b>Start Live Location</b> first, then search destination.
        </p>

        <Autocomplete
          onLoad={(auto) =>
            (window.autocomplete = auto)
          }
          onPlaceChanged={() =>
            onPlaceChanged(window.autocomplete)
          }
        >
          <input
            type="text"
            placeholder="Search destination"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              border: "2px solid #2563eb",
              borderRadius: "6px"
            }}
          />
        </Autocomplete>

        <button
          onClick={getUserLocation}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "15px"
          }}
        >
          Start Live Location
        </button>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={center}
        >

          {/* LIVE USER BLUE DOT */}

          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "white"
              }}
            />
          )}

          {/* ROUTES */}

          {directions && (
            <DirectionsRenderer
              directions={directions}
              routeIndex={selectedRoute}
            />
          )}

          {/* DANGER ZONES */}

          {dangerZones.map((zone, i) => (
            <Circle
              key={i}
              center={zone}
              radius={300}
              options={{
                fillColor: "red",
                fillOpacity: 0.35,
                strokeColor: "red",
                strokeOpacity: 0.8
              }}
            />
          ))}

        </GoogleMap>

      </div>

    </div>

  );

}

export default MapPage;

