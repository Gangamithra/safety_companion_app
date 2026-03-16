import React, { useState } from "react";
import { GoogleMap, useLoadScript, Marker, Autocomplete } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px"
};

function MapPage() {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"]
  });

  const [center, setCenter] = useState({
    lat: 11.0168,
    lng: 76.9558
  });

  const [marker, setMarker] = useState(null);

  const getUserLocation = () => {

    navigator.geolocation.getCurrentPosition((position) => {

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setCenter({ lat, lng });
      setMarker({ lat, lng });

    });

  };

  const onPlaceChanged = (autocomplete) => {

    const place = autocomplete.getPlace();

    if (place.geometry) {

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setCenter({ lat, lng });
      setMarker({ lat, lng });

    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Safe Route Map
      </h1>

      {/* SEARCH BAR */}

      <Autocomplete
        onLoad={(auto) => (window.autocomplete = auto)}
        onPlaceChanged={() => onPlaceChanged(window.autocomplete)}
      >
        <input
          type="text"
          placeholder="Search destination"
          className="border p-3 w-full mb-4"
        />
      </Autocomplete>

      {/* LOCATION BUTTON */}

      <button
        onClick={getUserLocation}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Detect My Location
      </button>

      {/* MAP */}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
      >

        {marker && <Marker position={marker} />}

      </GoogleMap>

    </div>

  );

}

export default MapPage;