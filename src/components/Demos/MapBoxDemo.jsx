// ES6
import ReactMapboxGl, { Layer, Feature, ZoomControl,ScaleControl } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Container } from 'react-bootstrap';
 
const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiZGFueXlhbCIsImEiOiJjbWF6MXluZXYwZDQxMmpzaGhmODFseHJiIn0.qZWNaS6U03CBBA7Cm-aGYg',
    keyboard: true,
   
});

const MapBoxDemo = () => (
   <Map
    style="mapbox://styles/mapbox/streets-v9"
    containerStyle={{
      height: '400px',
      width: '400px'
    }}
    renderWorldCopies
    animationOptions={{
      animate: true,
      duration: 1000,
    }}

  >
    <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
      <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
      <ZoomControl/>
      <ScaleControl/>

    </Layer>
  </Map>
);

export default MapBoxDemo;