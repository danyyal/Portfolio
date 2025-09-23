import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useState, useMemo, useRef } from "react";
import * as THREE from "three";
import "./style.css";

const Measurement = ({ mesh }) => {
  // ThreeJs elements
  const { raycaster, camera, pointer, gl } = useThree();

  // Geometries for indicators
  const geometries = useMemo(() => {
    let box = new THREE.Box3().setFromObject(mesh);
    let sizes = new THREE.Vector3().subVectors(box.max, box.min);
    let min = Math.min(Math.min(sizes.x, sizes.y), sizes.z);

    let i0 = new THREE.CylinderGeometry(min * 0.005, min * 0.05, min * 0.15, 8);
    i0.translate(0, -min * 0.15 * 0.5, 0);
    let i1 = i0.clone();

    i0.rotateX(-Math.PI * 0.5);
    // i1.rotateX(Math.PI * 0.5);
    i1.rotateX(-Math.PI * 0.5);

    let l = new THREE.CylinderGeometry(min * 0.005, min * 0.005, 1, 12);
    l.translate(0, -0.5, 0);

    let i1h = new THREE.IcosahedronGeometry(min * 0.015, 2);

    return { i0, i1: { active: i1, hover: i1h }, l };
  }, [mesh]);

  // Indicators
  const iRef = useRef({
    i0: {
      visible: false,
      fixed: false,
      position: new THREE.Vector3(),
      rotation: new THREE.Euler(),
      point: null,
    },
    i1: {
      visible: false,
      fixed: false,
      position: new THREE.Vector3(),
      rotation: new THREE.Euler(),
      point: null,
      geometry: geometries.i1.hover,
    },
    l: {
      visible: false,
      position: new THREE.Vector3(),
      rotation: new THREE.Euler(),
      length: 0,
    },
  });
  const [indicators, setIndicators] = useState(iRef.current);

  useEffect(() => {
    let dragCheck = false;
    let hoverCheck = false;
    let fixedPoint;

    let castRay = () => {
      let points = { enter: null, exit: null };

      raycaster.setFromCamera(pointer, camera);
      let intersects = raycaster.intersectObjects([mesh], true);

      if (intersects[0]) {
        points.enter = intersects[0];

        let normal = points.enter.point.clone().add(points.enter.normal);
        let rayDirection = points.enter.point.clone().sub(normal).normalize();
        let ray = new THREE.Raycaster(normal, rayDirection);

        points.exit = ray.intersectObjects([mesh], true)[1];
      }

      return points;
    };

    let calcTransformations = (p0, p1) => {
      if (!p0 || !p1) {
        return false;
      }

      // Indicator0 rotation
      let placeholder = new THREE.Object3D();
      placeholder.position.copy(p0.point);
      let normal0 = p0.point.clone().add(p0.normal);
      placeholder.lookAt(normal0);
      let ri0 = placeholder.rotation.clone();
      // Indicator1 rotation
      placeholder.rotation.set(0, 0, 0);
      placeholder.position.copy(p1.point);
      let normal1 = p1.point.clone().add(p1.normal);
      placeholder.lookAt(normal1);
      let ri1 = placeholder.rotation.clone();

      // Line rotation
      placeholder.rotation.set(0, 0, 0);
      let qv1 = new THREE.Vector3(0, 1, 0);
      let qv2 = new THREE.Vector3().subVectors(p0.point, p1.point).normalize();
      placeholder.applyQuaternion(
        new THREE.Quaternion().setFromUnitVectors(qv1, qv2),
      );
      let rl = placeholder.rotation.clone();
      let length = p0.point.distanceTo(p1.point);

      return {
        i0: {
          position: p0.point,
          rotation: ri0,
        },
        i1: {
          position: p1.point,
          rotation: ri1,
        },
        l: {
          position: p0.point,
          rotation: rl,
          length,
        },
      };
    };

    let updateIndicators = (transformations) => {
      if (!transformations) {
        return;
      }

      let i = iRef.current;
      i.i0.position = transformations.i0.position;
      i.i0.rotation = transformations.i0.rotation;
      i.i1.position = transformations.i1.position;
      i.i1.rotation = transformations.i1.rotation;
      i.l.position = transformations.l.position;
      i.l.rotation = transformations.l.rotation;
      i.l.length = transformations.l.length;
    };

    let onMouseDown = () => {
      dragCheck = false;
    };

    let onMouseMove = () => {
      dragCheck = true;

      let i = iRef.current;
      let points = castRay();

      if (!points.enter) {
        if (!i.i0.fixed) {
          i.i0.visible = false;
          i.i1.visible = false;
          i.l.visible = false;
        } else if (!hoverCheck && !i.i1.fixed) {
          hoverCheck = true;
          i.i1.point = fixedPoint;
          let t = calcTransformations(i.i0.point, i.i1.point);
          updateIndicators(t);
          i.i1.geometry = geometries.i1.hover;
        }
        setIndicators({ ...i });
        return;
      }

      hoverCheck = false;

      i.i0.visible = true;
      i.i1.visible = true;
      i.l.visible = true;

      if (!i.i0.fixed) {
        i.i0.point = points.enter;
        i.i1.point = points.exit;
        i.i1.geometry = geometries.i1.hover;
        let t = calcTransformations(i.i0.point, i.i1.point);
        updateIndicators(t);
      } else if (!i.i1.fixed) {
        i.i1.point = points.enter;
        i.i1.geometry = geometries.i1.active;
        let t = calcTransformations(i.i0.point, i.i1.point);
        updateIndicators(t);
      }

      setIndicators({ ...i });
    };

    let onMouseUp = () => {
      if (dragCheck) {
        return;
      }

      let i = iRef.current;
      let points = castRay();

      if (i.i0.visible && !i.i0.fixed) {
        i.i0.fixed = true;
        i.i1.geometry = geometries.i1.active;
        fixedPoint = { ...points.exit };
      } else if (i.i1.visible && !i.i1.fixed) {
        i.i1.fixed = true;
      } else {
        i.i0.visible = false;
        i.i1.visible = false;
        i.l.visible = false;
        i.i0.fixed = false;
        i.i1.fixed = false;
      }

      setIndicators({ ...i });
    };

    gl.domElement.addEventListener("mousedown", onMouseDown);
    gl.domElement.addEventListener("mousemove", onMouseMove);
    gl.domElement.addEventListener("mouseup", onMouseUp);

    return () => {
      gl.domElement.removeEventListener("mousedown", onMouseDown);
      gl.domElement.removeEventListener("mousemove", onMouseMove);
      gl.domElement.removeEventListener("mouseup", onMouseUp);
    };
  }, [mesh, camera]);

  return (
    <group>
      {/* First indicator */}
      <mesh
        geometry={geometries.i0}
        visible={indicators.i0.visible}
        position={indicators.i0.position}
        rotation={indicators.i0.rotation}
        renderOrder={6}
      >
        <meshStandardMaterial
          color={0xddbb00}
          roughness={0.4}
          metalness={0.5}
          depthTest={false}
        />
      </mesh>

      {/* Second indicator */}
      <mesh
        geometry={indicators.i1.geometry}
        visible={indicators.i1.visible}
        position={indicators.i1.position}
        rotation={indicators.i1.rotation}
        renderOrder={5}
      >
        <meshStandardMaterial
          color={0xddbb00}
          depthTest={false}
          transparent
          roughness={0.4}
          metalness={0.5}
          opacity={indicators.i0.fixed ? 1.0 : 0.7}
        />
      </mesh>

      {/* Line */}
      <mesh
        geometry={geometries.l}
        visible={indicators.l.visible}
        scale-y={indicators.l.length}
        position={indicators.l.position}
        rotation={indicators.l.rotation}
      >
        <meshStandardMaterial
          color={0xddbb00}
          renderOrder={4}
          depthWrite={false}
          depthTest={false}
          transparent
          opacity={0.4}
        />
      </mesh>

      <object3D
        position={new THREE.Vector3().lerpVectors(
          indicators.i0.position,
          indicators.i1.position,
          0.5,
        )}
      >
        <Html
          center
          className="annotation-container"
          style={{ display: indicators.l.visible ? "block" : "none" }}
        >
          <div className="annotation">{indicators.l.length.toFixed(2)}</div>
        </Html>
      </object3D>
    </group>
  );
};

export default Measurement;
