const RouteFallback = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // fills the viewport so the footer does not jump when the page arrives
      minHeight: "calc(100dvh - 72px)",
    }}
  >
    <span className="route-spinner" role="status" aria-label="Loading" />
  </div>
);

export default RouteFallback;
