import { generateCombinations } from "./utils/utils";

interface LightsProps {
  altitude: number;
}

export const Lights = ({ altitude }: LightsProps) => {
  const elements = [altitude, 0, -altitude];
  const allCombinations: any = [];
  generateCombinations(
    Array.from({ length: elements.length }, () => []),
    [],
    0,
    allCombinations,
    elements,
  );
  return (
    <>
      {allCombinations.map((combination: any, index: number) => (
        <directionalLight key={index} position={combination} intensity={0.2} />
      ))}
    </>
  );
};
