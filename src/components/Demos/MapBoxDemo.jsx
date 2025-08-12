import React, { useEffect, useRef } from 'react';
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import Map from 'react-map-gl';

// mapboxgl.accessToken = 'pk.eyJ1IjoiZGFueXlhbCIsImEiOiJjbWF6MXluZXYwZDQxMmpzaGhmODFseHJiIn0.qZWNaS6U03CBBA7Cm-aGYg';

const MapBoxDemo = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  // useEffect(() => {
  //   if (map.current) return; // Initialize map only once

  //   map.current = new mapboxgl.Map({
  //     container: mapContainer.current,
  //     style: 'mapbox://styles/mapbox/streets-v11',
  //     center: [74.253564, 31.479281],
  //     zoom: 15.5,
  //     pitch: 45,
  //     bearing: -17.6,
  //     antialias: true // For smoother 3D rendering
  //   });

  //   map.current.on('load', () => {
  //     // Add 3D buildings layer
  //     map.current.addLayer({
  //       id: '3d-buildings',
  //       source: 'composite',
  //       'source-layer': 'building',
  //       filter: ['==', 'extrude', 'true'],
  //       type: 'fill-extrusion',
  //       minzoom: 15,
  //       paint: {
  //         'fill-extrusion-color': '#aaa',
  //         'fill-extrusion-height': [
  //           'interpolate',
  //           ['linear'],
  //           ['zoom'],
  //           15, 0,
  //           15.05, ['get', 'height']
  //         ],
  //         'fill-extrusion-base': [
  //           'interpolate',
  //           ['linear'],
  //           ['zoom'],
  //           15, 0,
  //           15.05, ['get', 'min_height']
  //         ],
  //         'fill-extrusion-opacity': 0.6
  //       }
  //     });

  //     // Add a marker
  //     new mapboxgl.Marker()
  //       .setLngLat([74.253564, 31.479281])
  //       .addTo(map.current);

  //     // Add navigation controls
  //     map.current.addControl(new mapboxgl.NavigationControl());
  //     map.current.addControl(new mapboxgl.ScaleControl());
  //   });

  //   // Clean up on unmount
  //   return () => {
  //     if (map.current) {
  //       map.current.remove();
  //       map.current = null;
  //     }
  //   };
  // }, []);

  return (
    <div
      // ref={mapContainer}
      style={{
        height: '400px',
        width: '400px'
      }}
    />
  );
};

export default MapBoxDemo;