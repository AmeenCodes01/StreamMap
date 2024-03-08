import React from "react";
import {MapContainer, GeoJSON, Marker, useMap} from "react-leaflet";
import mapData from "../data/countries.json";
import "leaflet/dist/leaflet.css";
import "./MyMap.css";
function SetViewOnClick({coords, zoomed}) {
  const map = useMap();
  map.setView(coords, zoomed ? 3 : map.getZoom());
  //setZoom(false);

  return null;
}

function Map({center, id, zoomed, onEachCountry}) {
  const countryStyle = {
    color: "black",
    weight: 1,
    fillOpacity: 0.75,
    opacity: 10,
  };

  return (
    <div>
      <MapContainer
        style={{
          width: "100%",
          // backgroundImage: `linear-gradient(to bottom, #CAF0F8, rgb(116, 192, 219))`,
        }}
        className="min-h-[75vh]  "
        zoom={2}
        center={center}>
        <GeoJSON
          key={id}
          style={countryStyle}
          data={mapData.features}
          onEachFeature={onEachCountry}
        />

        <SetViewOnClick coords={center} zoomed={zoomed} />
      </MapContainer>
    </div>
  );
}

export default Map;
