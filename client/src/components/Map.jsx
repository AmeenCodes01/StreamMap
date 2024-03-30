import React, {useState} from "react";
import {MapContainer, GeoJSON, Marker, useMap} from "react-leaflet";
import mapData from "../data/countries.json";
import "leaflet/dist/leaflet.css";
import "./MyMap.css";
import useGetUsers from "../hooks/useGetUsers";

function SetViewOnClick({coords, zoomed}) {
  const map = useMap();
  map.setView(coords, zoomed ? 3 : map.getZoom());
  //setZoom(false);

  return null;
}

function Map() {
  const [center, setCenter] = useState([40, 0]);
  const [key, setKey] = useState(1);
  // saves country, color + offset
  // selectedMap saves geoJSON of selected country.
  const [zoomed, setZoom] = useState(false);

  const countryStyle = {
    color: "black",
    weight: 1,
    fillOpacity: 0.75,
    opacity: 10,
  };
  const { users, loading } = useGetUsers();
if (loading){
  return;
}
  const onEachCountry = (country, layer) => {
    let countryName = country.properties.ADMIN;
    let color = "#e6dfdf";

    for (let i = 0; i < users.length; i++) {
      if (countryName === users[i].country) {
        color = users[i].color;
      }
    }
    layer.setStyle({
      fillColor: color,
    });
    layer.bindPopup(countryName);
  };
  return (
      <MapContainer
        style={{
          width: "100%",
          // backgroundImage: `linear-gradient(to bottom, #CAF0F8, rgb(116, 192, 219))`,
        }}
        className="min-h-[75vh]  "
        zoom={2}
        center={center}>
        <GeoJSON
          key={key}
          style={countryStyle}
          data={mapData.features}
          onEachFeature={onEachCountry}
        />

        <SetViewOnClick coords={center} zoomed={zoomed} />
      </MapContainer>
  );
}

export default Map;
