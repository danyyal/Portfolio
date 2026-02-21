import Typewriter from "typewriter-effect";
import "./Type.css";
import { useTranslation } from "react-i18next";

function Type() {
  const { t } = useTranslation();
  const strings = (
    t("home.typewriter", { returnObjects: true }) as string[]
  ).map((s, i) => ["💻", "🌐", "🧑‍💻", "🚀", "⚙️"][i] + " " + s);

  return (
    <div className="typewriter-container">
      <Typewriter
        options={{
          strings,
          autoStart: true,
          loop: true,
          deleteSpeed: 50,
          delay: 75,
        }}
      />
    </div>
  );
}

export default Type;
