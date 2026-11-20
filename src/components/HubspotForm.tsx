import { useEffect, useRef, useState } from "react";

const PORTAL_ID = "247508858";
const FORM_ID = "c61eea63-409c-44ef-a283-8daaf30c47d2";
const REGION = "na2";
const SCRIPT_SRC = `https://js-${REGION}.hsforms.net/forms/embed/${PORTAL_ID}.js`;

/* HubSpot contact form. The embed script is only fetched once the form is
   about to scroll into view, so it costs nothing on first load. */
function HubspotForm({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.defer = true;
    document.body.appendChild(script);
  }, [near]);

  return (
    <div className={`hubspot-form ${className}`} ref={hostRef}>
      {near && (
        <div
          className="hs-form-frame"
          data-region={REGION}
          data-form-id={FORM_ID}
          data-portal-id={PORTAL_ID}
        />
      )}
    </div>
  );
}

export default HubspotForm;
