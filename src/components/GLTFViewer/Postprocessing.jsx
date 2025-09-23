import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { CustomOutlinePass } from "./utils/outline/CustomOutlinePass.js";
import FindSurfaces from "./utils/outline/FindSurfaces.js";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";

export default function Postprocessing({
  mesh,
  clippingPlanes,
  position,
  enabled,
}) {
  const { gl, size, scene, camera } = useThree();

  const composer = useMemo(() => {
    // https://github.com/OmarShehata/webgl-outlines
    // Set up post processing
    let depthTexture = new THREE.DepthTexture();
    let renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
      depthTexture: depthTexture,
      depthBuffer: true,
    });

    // Initial render pass.
    let composer = new EffectComposer(gl);
    composer.setSize(size.width, size.height);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    let pass = new RenderPass(scene, camera);
    composer.addPass(pass);

    // Outline pass.
    let customOutline = new CustomOutlinePass(
      new THREE.Vector2(size.width, size.height),
      scene,
      camera,
    );
    composer.addPass(customOutline);

    let surfaceFinder = new FindSurfaces();

    surfaceFinder.surfaceId = 0;

    mesh.traverse((node) => {
      if (node.isMesh) {
        const colorsTypedArray = surfaceFinder.getSurfaceIdAttribute(node);
        node.geometry.setAttribute(
          "color",
          new THREE.BufferAttribute(colorsTypedArray, 4),
        );
      }
    });

    customOutline.updateMaxSurfaceId(surfaceFinder.surfaceId + 1);

    // Antialias pass.
    let effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms["resolution"].value.set(
      1 / size.width,
      1 / size.height,
    );
    composer.addPass(effectFXAA);

    return composer;
  }, [camera]);

  useFrame(() => {
    composer.render();
  }, 1);

  const material = useRef(
    new THREE.MeshStandardMaterial({
      color: 0xddddff,
      roughness: 0.8,
      metalness: 0.4,
      clippingPlanes: clippingPlanes,
      side: THREE.DoubleSide,
    }),
  );

  useEffect(() => {
    if (enabled) {
      document
        .querySelector(".file-viewer-div")
        .classList.remove("app_dark-mode");

      mesh.traverse((node) => {
        if (node.isMesh) {
          node.material = material.current;
        }
      });
    }
  }, [enabled]);

  useEffect(() => {
    material.current.clippingPlanes = clippingPlanes;
  }, [clippingPlanes]);

  return (
    <>
      <primitive object={mesh} position={position} />
    </>
  );
}
