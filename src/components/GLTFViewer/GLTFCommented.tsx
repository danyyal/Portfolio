// import { Canvas, useLoader } from '@react-three/fiber';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import * as THREE from 'three';
// import {
//   Environment,
//   OrbitControls,
//   PerspectiveCamera,
// } from '@react-three/drei';
// import { useControls } from 'leva';
// import { Lights } from './Lights';
// import { useEffect, useRef, useState } from 'react';
// import Postprocessing from './Postprocessing';
// import Measurement from './Measurement';

// import type { GeometricalInfo } from '../utils/utils';
// import { getGeometricalInfo } from '../Attachments';

// interface GLTFViewerProps {
//   url: string;
// }
// //

// const canvasStyles = {
//   width: '80vw',
//   height: '100vh',
//   minHeight: '500px',
//   overflow: 'hidden',
//   display: 'flex',`
// };
// const GLTFViewer = ({ url }: GLTFViewerProps) => {
//   /* Moving s and v into a useEffect to prevent calculating
//   them again when control panel values are changed */
//   const [v, setV] = useState<THREE.Vector3>(new THREE.Vector3());
//   const [s, setS] = useState<THREE.Sphere>(new THREE.Sphere());
//   const [b, setB] = useState<THREE.Box3>(
//     new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1)),
//   ); // Bounding box values for section planes positions

//   const gltf = useLoader(GLTFLoader, url);
//   const [geometricalInfo] = useState<GeometricalInfo>(getGeometricalInfo(gltf));
//   useEffect(() => {
//     if (gltf) {
//       const { boundingBox } = geometricalInfo;
//       const v = new THREE.Vector3();
//       boundingBox.getCenter(v);
//       setV(v);
//       const s = new THREE.Sphere();
//       boundingBox.getBoundingSphere(s);
//       setS(s);
//       const b = new THREE.Box3().setFromObject(gltf.scene);
//       // The scale to disect the image if we disect it
//       const scale = 1.1;
//       b.min.sub(v).multiplyScalar(scale);
//       b.max.sub(v).multiplyScalar(scale);
//       setB(b);
//     }
//   }, [geometricalInfo, gltf]);

//   /*
//     Section Planes
//   */
//   const { enableX, sectionX, directionX, helperX } = useControls(
//     'planeX',
//     {
//       enableX: { value: false },
//       sectionX: { value: 0, min: b.min.x, max: b.max.x, step: 0.01 },
//       directionX: { value: false },
//       helperX: { value: false },
//     },
//     [b],
//   );
//   const { enableY, sectionY, directionY, helperY } = useControls(
//     'planeY',
//     {
//       enableY: { value: false },
//       sectionY: { value: 0, min: b.min.y, max: b.max.y, step: 0.01 },
//       directionY: { value: false },
//       helperY: { value: false },
//     },
//     [b],
//   );
//   const { enableZ, sectionZ, directionZ, helperZ } = useControls(
//     'planeZ',
//     {
//       enableZ: { value: false },
//       sectionZ: { value: 0, min: b.min.z, max: b.max.z, step: 0.01 },
//       directionZ: { value: false },
//       helperZ: { value: false },
//     },
//     [b],
//   );
//   const planeX = useRef<THREE.Plane>(
//     new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0),
//   );
//   const planeY = useRef<THREE.Plane>(
//     new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
//   );
//   const planeZ = useRef<THREE.Plane>(
//     new THREE.Plane(new THREE.Vector3(0, 0, -1), 0),
//   );
//   const [enabledPlanes, setEnabledPlanes] = useState<THREE.Plane[]>([]);

//   useEffect(() => {
//     planeX.current.normal.x = directionX ? 1 : -1;
//     planeY.current.normal.y = directionY ? 1 : -1;
//     planeZ.current.normal.z = directionZ ? 1 : -1;
//     planeX.current.constant = sectionX * -planeX.current.normal.x;
//     planeY.current.constant = sectionY * -planeY.current.normal.y;
//     planeZ.current.constant = sectionZ * -planeZ.current.normal.z;
//   }, [sectionX, sectionY, sectionZ, directionX, directionY, directionZ]);

//   useEffect(() => {
//     const enabled: any = [];
//     if (enableX) enabled.push(planeX.current);
//     if (enableY) enabled.push(planeY.current);
//     if (enableZ) enabled.push(planeZ.current);
//     setEnabledPlanes(enabled);
//   }, [enableX, enableY, enableZ]);

//   /*
//     Display modes
//   */
//   const materials = useRef<{
//     default: { [key: number]: THREE.Material };
//     wireframe: THREE.MeshBasicMaterial;
//     xray: THREE.ShaderMaterial;
//   }>({
//     default: {},
//     wireframe: new THREE.MeshBasicMaterial({ wireframe: true }),
//     // Xray material is taken from:
//     // https://stackoverflow.com/questions/26336585/three-js-webgl-x-ray-effect
//     // To make the clipping works in ShaderMaterial:
//     // https://stackoverflow.com/questions/42532545/add-clipping-to-three-shadermaterial

//     xray: new THREE.ShaderMaterial({
//       uniforms: {
//         p: { value: 2 },
//         glowColor: { value: new THREE.Color(0xddddff) },
//       },
//       vertexShader: `
//         uniform float p;
//         varying float intensity;
//         #include <clipping_planes_pars_vertex>
//         void main() {
//             #include <begin_vertex>
//             vec3 vNormal = normalize( normalMatrix * normal );
//             intensity = pow(1.0 - abs(dot(vNormal, vec3(0, 0, 1))), p);
//             gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
//             #include <project_vertex>
//             #include <clipping_planes_vertex>
//         }
//       `,
//       fragmentShader: `
//         uniform vec3 glowColor;
//         varying float intensity;
//         #include <clipping_planes_pars_fragment>
//         void main() {
//             #include <clipping_planes_fragment>
//             vec3 glow = glowColor * intensity;
//             gl_FragColor = vec4( glow, 1.0 );
//         }
//       `,
//       side: THREE.DoubleSide,
//       blending: THREE.AdditiveBlending,
//       transparent: true,
//       depthWrite: false,
//       clipping: true,
//     }),
//   });

//   useEffect(() => {
//     if (gltf) {
//       gltf.scene.traverse((node) => {
//         if (node instanceof THREE.Mesh) {
//           materials.current.default[node.id] = node.material;
//         }
//       });
//     }
//   }, [gltf]);

//   const { mode, wireframeColor, xrayColor, xrayUniformP } = useControls(
//     'Display modes',
//     {
//       mode: { value: 'default', options: ['wireframe', 'xray', 'outline'] },
//       wireframeColor: { value: '#FFFFFF' },
//       xrayColor: { value: '#DDDDFF' },
//       xrayUniformP: { value: 2, min: 0.1, max: 5, ste: 0.01 },
//     },
//   );

//   useEffect(() => {
//     if (gltf) {
//       const app = document?.querySelector('.file-viewer-div');
//       if (app) {
//         switch (mode) {
//           case 'default':
//             app.classList.remove('app_dark-mode');
//             gltf.scene.traverse((node) => {
//               if (node instanceof THREE.Mesh) {
//                 node.material = materials.current.default[node.id];
//               }
//             });
//             break;
//           case 'wireframe':
//             app.classList.add('app_dark-mode');
//             gltf.scene.traverse((node) => {
//               if (node instanceof THREE.Mesh) {
//                 node.material = materials.current.wireframe;
//               }
//             });
//             break;
//           case 'xray':
//             app.classList.add('app_dark-mode');
//             gltf.scene.traverse((node) => {
//               if (node instanceof THREE.Mesh) {
//                 node.material = materials.current.xray;
//               }
//             });
//             break;
//         }
//       }
//     }
//   }, [mode, gltf]);

//   const getFormattedNumber = (num: number) => {
//     if (num)
//       return new Intl.NumberFormat()
//         .format(num)
//         .toString()
//         .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//     return 0;
//   };
//   useEffect(() => {
//     if (gltf) {
//       gltf.scene.traverse((node) => {
//         if (node instanceof THREE.Mesh) {
//           node.material.side = THREE.DoubleSide;
//           node.material.clippingPlanes = enabledPlanes;
//         }
//       });
//       const { boundingBox, volume, surface } = getGeometricalInfo(gltf);
//       if (gltf) {
//         const modal = document.querySelector('.leva-c-hBtFDW');

//         const element = document.querySelector('.calcs-container');
//         if (element) {
//           document.querySelector('.calcs-container')?.remove();
//         }
//         const customHTML = `
//   <div style="padding:15px;" class="calcs-container">
//   <style>
//   .colored-box {
//     display: inline-block;
//     width: 10px; /* Adjust width as needed */
//     height: 10px; /* Adjust height as needed */
//     margin-right: 10px; /* Adjust spacing between boxes */
// }

// .red {
//     background-color: #FF5733; /* Red color */
// }

// .blue {
//     background-color: #3366FF; /* Blue color */
// }

// .green {
//     background-color: #33FF57; /* Green color */
// }

// </style>
//     <h2 style="color: white; font-size: 14px;">Volume: ${volume
//             .toFixed(2)
//             .toString()
//             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} mm<sup>3</sup></h2>
//     <h2 style="color: white; font-size: 14px;">Surface Area: ${surface
//             .toFixed(2)
//             .toString()
//             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} mm<sup>2</sup></h2>
//     <h2 style="color: white; font-size: 14px;">Bounding Box:</h2>
//     <h2 style="color: white; font-size: 14px; margin-left:10px;"><div class="colored-box red"></div>x: ${getFormattedNumber(Number((Math.abs(boundingBox.max.x) + Math.abs(boundingBox.min.x)).toFixed(2)))} mm</h2>
//     <h2 style="color: white; font-size: 14px; margin-left:10px;"><div class="colored-box green"></div>y: ${getFormattedNumber(Number((Math.abs(boundingBox.max.y) + Math.abs(boundingBox.min.y)).toFixed(2)))} mm</h2>
//     <h2 style="color: white; font-size: 14px; margin-left:10px;"><div class="colored-box blue"></div>z: ${getFormattedNumber(Number((Math.abs(boundingBox.max.z) + Math.abs(boundingBox.min.z)).toFixed(2)))} mm</h2>
//   </div>
// `;

//         // Convert the HTML string into DOM elements
//         const tempElement = document.createElement('div');
//         tempElement.className = 'calcs-container';
//         tempElement.innerHTML = customHTML;

//         // Extract the child nodes (your custom HTML content)
//         const customContent = tempElement.childNodes;

//         // Append the custom content to the modal
//         customContent.forEach((node) => {
//           modal?.appendChild(node.cloneNode(true));
//         });
//       }
//     }
//   }, [enabledPlanes, mode, gltf]);

//   useEffect(() => {
//     materials.current.wireframe.color = new THREE.Color(wireframeColor);
//   }, [wireframeColor]);

//   useEffect(() => {
//     materials.current.xray.uniforms.glowColor.value = new THREE.Color(
//       xrayColor,
//     );
//     materials.current.xray.uniforms.p.value = xrayUniformP;
//   }, [xrayColor, xrayUniformP]);

//   return (
//     <Canvas
//       style={canvasStyles}
//       resize={{
//         scroll: true,
//       }}
//       className="file-viewer-div"
//       gl={{ localClippingEnabled: true }}
//     >
//       <PerspectiveCamera
//         makeDefault
//         position={[
//           ((s.radius * 2) / Math.sqrt(3)) * 1.3,
//           ((s.radius * 2) / Math.sqrt(3)) * 1.3,
//           ((s.radius * 2) / Math.sqrt(3)) * 1.3,
//         ]}
//       />
//       {mode === 'outline' ? (
//         <Postprocessing
//           mesh={gltf.scene}
//           clippingPlanes={enabledPlanes}
//           position={[-v.x, -v.y, -v.z]}
//           enabled={mode === 'outline'}
//         />
//       ) : (
//         <primitive
//           object={gltf.scene}
//           position={[-v.x, -v.y, -v.z]}
//           renderOrder={5}
//         />
//       )}
//       <Measurement mesh={gltf.scene} />
//       <OrbitControls />
//       <Lights altitude={30} />
//       {/* Section Plane Helpers */}
//       <group>
//         <axesHelper args={[100]} />
//         {/* PlaneX */}
//         <mesh
//           visible={helperX}
//           scale={[b.max.z - b.min.z, b.max.y - b.min.y, 1]}
//           rotation-y={-Math.PI * 0.5}
//           position-x={sectionX}
//         >
//           <planeGeometry args={[1, 1]} />
//           <meshBasicMaterial
//             transparent
//             side={THREE.DoubleSide}
//             opacity={0.25}
//             color={0xff0000}
//           />
//         </mesh>
//         {/* PlaneY */}
//         <mesh
//           visible={helperY}
//           scale={[b.max.x - b.min.x, b.max.z - b.min.z, 1]}
//           rotation-x={-Math.PI * 0.5}
//           position-y={sectionY}
//         >
//           <planeGeometry args={[1, 1]} />
//           <meshBasicMaterial
//             transparent
//             side={THREE.DoubleSide}
//             opacity={0.25}
//             color={0x00ff00}
//           />
//         </mesh>
//         {/* PlaneZ */}
//         <mesh
//           visible={helperZ}
//           scale={[b.max.x - b.min.x, b.max.y - b.min.y, 1]}
//           position-z={sectionZ}
//         >
//           <planeGeometry args={[1, 1]} />
//           <meshBasicMaterial
//             transparent
//             side={THREE.DoubleSide}
//             opacity={0.25}
//             color={0x0000ff}
//           />
//         </mesh>
//       </group>
//       <Environment preset="city" />
//     </Canvas>
//   );
// };
// export default GLTFViewer;
