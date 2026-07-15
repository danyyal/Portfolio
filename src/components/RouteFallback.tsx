const RouteFallback = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "60vh",
    }}
  >
    <span className="route-spinner" role="status" aria-label="Loading" />
  </div>
);

export default RouteFallback;
