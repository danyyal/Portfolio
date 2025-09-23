import * as THREE from "three";
import type { MaterialResponse } from "../types";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { ThreeVolume } from "three-volume";
import { Box3 } from "three";

export const calculateWeight = (
  material?: MaterialResponse,
  volume?: number,
  density?: number,
): number => {
  let volumeValue = 0;
  let densityValue = 0;
  if (material) {
    volumeValue = calculateVolumeInMM3(material) / 1000 / 1000 / 1000; // conversion from mm3 to m3
    densityValue = (material?.density ?? 0) * 1000; // conversion from g/cm3 to kg/mm3
  } else if (volume && density) {
    volumeValue = volume / 1000 / 1000 / 1000; // conversion from mm3 to m3
    densityValue = density * 1000; // conversion from g/cm3 to kg/mm3
  }
  const weight = volumeValue * densityValue;

  return weight;
};

export type GeometricalInfo = {
  volume: number;
  surface: number;
  boundingBox: THREE.Box3;
};
export const convertToMM = (unit: string, value: number) => {
  if (unit === "m") {
    return value * 1000;
  }
  if (unit === "dm") {
    return value * 100;
  }
  if (unit === "cm") {
    return value * 10;
  }
  if (unit === "mm") {
    return value;
  }
  return 0;
};

export const calculateVolumeInMM3 = (material: MaterialResponse): number => {
  if (material === null) return 0;
  const volumeInMM3 =
    material.shape === "flat"
      ? convertToMM(
          material.dimension_a_unit as string,
          material.dimension_a as number,
        ) *
        convertToMM(
          material.dimension_b_unit as string,
          material.dimension_b as number,
        ) *
        convertToMM(
          material.dimension_c_unit as string,
          material.dimension_c as number,
        )
      : material.shape === "round"
        ? Math.pow(
            convertToMM(
              material.dimension_a_unit as string,
              material.dimension_a as number,
            ) / 2,
            2,
          ) *
          Math.PI *
          convertToMM(
            material.dimension_b_unit as string,
            material.dimension_b as number,
          )
        : material.shape === "tube"
          ? Math.pow(
              convertToMM(
                material.dimension_a_unit as string,
                material.dimension_a as number,
              ) / 2,
              2,
            ) *
              Math.PI *
              convertToMM(
                material.dimension_c_unit as string,
                material.dimension_c as number,
              ) -
            Math.pow(
              (convertToMM(
                material.dimension_a_unit as string,
                material.dimension_a as number,
              ) -
                convertToMM(
                  material.dimension_b_unit as string,
                  material.dimension_b as number,
                )) /
                2,
              2,
            ) *
              Math.PI *
              convertToMM(
                material.dimension_c_unit as string,
                material.dimension_c as number,
              )
          : 0;

  return volumeInMM3;
};
export const viewFile = (attachmentId: string) => {
  window.open(
    window.location.protocol +
      "//" +
      window.location.host +
      `/view-file?attachmentId=${attachmentId}`,
    "_blank",
    "width=800,height=800,resizable=yes,scrollbars=yes",
  );
};

export const downloadPDFFromUrl = async (url: string) => {
  window.open(url, "_blank")?.focus();
};

export const generateCombinations = (
  arrays: number[][],
  currentCombination: number[],
  depth: number,
  allCombinations: number[][],
  elements: number[],
): void => {
  if (depth === arrays.length) {
    allCombinations.push([...currentCombination]); // Make a copy to avoid mutation
    return;
  }

  for (const element of elements) {
    currentCombination[depth] = element;
    generateCombinations(
      arrays,
      currentCombination,
      depth + 1,
      allCombinations,
      elements,
    );
  }
};

const findGeometries = (
  object:
    | THREE.Object3D<THREE.Object3DEventMap>
    | THREE.Group<THREE.Object3DEventMap>,
  geometries: THREE.BufferGeometry[] = [],
) => {
  if (
    "isMesh" in object &&
    object.isMesh &&
    "geometry" in object &&
    object.geometry
  ) {
    geometries.push(object.geometry as THREE.BufferGeometry);
  } else if (object.children && object.children.length > 0) {
    for (const child of object.children) {
      findGeometries(child, geometries);
    }
  }
  return geometries;
};

const getBoundingBox = (gltf: GLTF): THREE.Box3 => {
  const box = new Box3();
  box.setFromObject(gltf.scene);
  return box;
};
const calculateSurfaceAreaFromGeometry = (
  geometry: THREE.BufferGeometry,
): number => {
  const triangles = geometry.index ? geometry.index.array : null;
  const positions = geometry.attributes["position"].array;

  let surfaceArea = 0;

  if (triangles && positions) {
    for (let i = 0; i < triangles.length; i += 3) {
      const vertex1 = new THREE.Vector3().fromArray(
        positions,
        triangles[i] * 3,
      );
      const vertex2 = new THREE.Vector3().fromArray(
        positions,
        triangles[i + 1] * 3,
      );
      const vertex3 = new THREE.Vector3().fromArray(
        positions,
        triangles[i + 2] * 3,
      );

      const triangle = new THREE.Triangle(vertex1, vertex2, vertex3);
      surfaceArea += triangle.getArea();
    }
  }

  return surfaceArea;
};
export const getGeometricalInfo = (gltf: GLTF): GeometricalInfo => {
  return {
    volume: +findGeometries(gltf.scene).reduce(
      // TODO: check volume formula, since is having a big difference towards STL free online viewer.
      (acc: number, geometry: THREE.BufferGeometry) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        acc + ThreeVolume({ geometry, precision: true } as any),
      0,
    ),
    surface: +findGeometries(gltf.scene).reduce(
      (acc: number, geometry: THREE.BufferGeometry) =>
        acc + calculateSurfaceAreaFromGeometry(geometry),
      0,
    ),
    boundingBox: getBoundingBox(gltf),
  };
};
