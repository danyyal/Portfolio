import { Box, Grid, Typography, TextField, Paper } from "@mui/material";
import React, { useRef, useEffect, useState, useCallback } from "react";

interface ThreeJSPreviewProps {
  modelUrl?: string;
  textureUrl?: string;
  width?: number;
  height?: number;
  autoRotate?: boolean;
  showControls?: boolean;
  backgroundColor?: string;
  onModelLoad?: () => void;
  onError?: (error: string) => void;
}

interface ModelInfo {
  name: string;
  vertices: number;
  faces: number;
  size: string;
}

const ThreeJSPreview: React.FC<ThreeJSPreviewProps> = ({
  modelUrl,
  textureUrl,
  width = 800,
  height = 600,
  autoRotate = true,
  showControls = true,
  backgroundColor = "#000000",
  onModelLoad,
  onError,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Simulate scene initialization
    const initScene = () => {
      setLoading(true);
      setError(null);

      // Simulate loading time
      setTimeout(() => {
        try {
          // Mock model info
          setModelInfo({
            name: modelUrl
              ? modelUrl.split("/").pop() || "Unknown"
              : "Default Cube",
            vertices: 8,
            faces: 12,
            size: "1.2 MB",
          });

          setLoading(false);
          onModelLoad?.();
        } catch (err) {
          setError("Failed to load 3D model");
          setLoading(false);
          onError?.("Failed to load 3D model");
        }
      }, 1000);
    };

    initScene();
  }, [modelUrl, textureUrl, width, height, onModelLoad, onError]);

  // Animation loop simulation
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      // Clear canvas
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, width, height);

      // Draw wireframe cube simulation
      if (!loading && !error) {
        const centerX = width / 2;
        const centerY = height / 2;
        const size = 100 * zoom;

        context.strokeStyle = "#00ff00";
        context.lineWidth = 2;

        // Apply rotation
        const time = Date.now() * 0.001;
        const rotX = isRotating ? time * 0.5 + rotation.x : rotation.x;
        const rotY = isRotating ? time * 0.3 + rotation.y : rotation.y;

        // Simple 3D wireframe cube simulation
        const vertices = [
          [-1, -1, -1],
          [1, -1, -1],
          [1, 1, -1],
          [-1, 1, -1],
          [-1, -1, 1],
          [1, -1, 1],
          [1, 1, 1],
          [-1, 1, 1],
        ];

        const edges = [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 0], // back face
          [4, 5],
          [5, 6],
          [6, 7],
          [7, 4], // front face
          [0, 4],
          [1, 5],
          [2, 6],
          [3, 7], // connecting edges
        ];

        // Project 3D to 2D
        const projected = vertices.map((vertex) => {
          let [x, y, z] = vertex;

          // Apply rotation
          const cosX = Math.cos(rotX),
            sinX = Math.sin(rotX);
          const cosY = Math.cos(rotY),
            sinY = Math.sin(rotY);

          // Rotate around X axis
          const y1 = y * cosX - z * sinX;
          const z1 = y * sinX + z * cosX;

          // Rotate around Y axis
          const x2 = x * cosY + z1 * sinY;
          const z2 = -x * sinY + z1 * cosY;

          // Project to 2D
          const scale = 300 / (300 + z2);
          return [centerX + x2 * size * scale, centerY + y1 * size * scale];
        });

        // Draw edges
        context.beginPath();
        edges.forEach((edge) => {
          const [start, end] = edge;
          const [x1, y1] = projected[start];
          const [x2, y2] = projected[end];

          context.moveTo(x1, y1);
          context.lineTo(x2, y2);
        });
        context.stroke();

        // Add some surface shading
        context.fillStyle = "rgba(0, 255, 0, 0.1)";
        context.beginPath();
        const face = [projected[0], projected[1], projected[2], projected[3]];
        context.moveTo(face[0][0], face[0][1]);
        face.forEach((point) => context.lineTo(point[0], point[1]));
        context.closePath();
        context.fill();
      }

      // Draw loading or error states
      if (loading) {
        context.fillStyle = "#ffffff";
        context.font = "20px Arial";
        context.textAlign = "center";
        context.fillText("Loading 3D Model...", width / 2, height / 2);

        // Loading spinner
        const spinnerTime = Date.now() * 0.01;
        context.strokeStyle = "#ffffff";
        context.lineWidth = 3;
        context.beginPath();
        context.arc(
          width / 2,
          height / 2 + 40,
          20,
          spinnerTime,
          spinnerTime + Math.PI,
        );
        context.stroke();
      }

      if (error) {
        context.fillStyle = "#ff0000";
        context.font = "18px Arial";
        context.textAlign = "center";
        context.fillText("Error loading model", width / 2, height / 2);
        context.fillText(error, width / 2, height / 2 + 30);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [
    loading,
    error,
    isRotating,
    zoom,
    rotation,
    backgroundColor,
    width,
    height,
  ]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (loading || error) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startRotation = { ...rotation };

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        setRotation({
          x: startRotation.x + deltaY * 0.01,
          y: startRotation.y + deltaX * 0.01,
          z: startRotation.z,
        });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [rotation, loading, error],
  );

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.1, Math.min(3, prev * zoomDelta)));
  }, []);

  const resetView = () => {
    setRotation({ x: 0, y: 0, z: 0 });
    setZoom(1);
  };

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  const exportScreenshot = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = "threejs-preview.png";
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        border: "2px solid #333",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#1a1a1a",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Controls Panel */}
      {showControls && (
        <div
          style={{
            backgroundColor: "#2a2a2a",
            padding: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={toggleRotation}
              style={{
                backgroundColor: isRotating ? "#4CAF50" : "#666",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {isRotating ? "⏸️ Pause" : "▶️ Rotate"}
            </button>

            <button
              onClick={resetView}
              style={{
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              🔄 Reset View
            </button>

            <button
              onClick={exportScreenshot}
              style={{
                backgroundColor: "#FF9800",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              📸 Screenshot
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#ccc", fontSize: "12px" }}>Zoom:</span>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: "80px" }}
            />
            <span style={{ color: "#ccc", fontSize: "12px", minWidth: "40px" }}>
              {(zoom * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <div style={{ position: "relative", backgroundColor }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          style={{
            display: "block",
            cursor: loading || error ? "default" : "grab",
            userSelect: "none",
          }}
        />

        {/* Overlay Info */}
        {!loading && !error && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              backdropFilter: "blur(4px)",
            }}
          >
            <div>🎯 Click and drag to rotate</div>
            <div>🔍 Scroll to zoom</div>
          </div>
        )}

        {/* Model Info Panel */}
        {modelInfo && !loading && !error && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "12px",
              borderRadius: "4px",
              fontSize: "11px",
              backdropFilter: "blur(4px)",
              minWidth: "150px",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
              Model Info
            </div>
            <div>📁 {modelInfo.name}</div>
            <div>🔺 {modelInfo.vertices} vertices</div>
            <div>🔷 {modelInfo.faces} faces</div>
            <div>💾 {modelInfo.size}</div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div
        style={{
          backgroundColor: "#2a2a2a",
          padding: "8px 12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
          color: "#ccc",
          borderTop: "1px solid #333",
        }}
      >
        <div>
          Status: {loading ? "⏳ Loading..." : error ? "❌ Error" : "✅ Ready"}
        </div>
        <div>
          Rotation: X({((rotation.x * 180) / Math.PI).toFixed(1)}°) Y(
          {((rotation.y * 180) / Math.PI).toFixed(1)}°) Z(
          {((rotation.z * 180) / Math.PI).toFixed(1)}°)
        </div>
      </div>
    </div>
  );
};

const ThreeJSDemo: React.FC = () => {
  const [modelUrl] = useState<string>("");
  const [autoRotate] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const handleModelLoad = () => {
    console.log("3D Model loaded successfully!");
  };

  const handleError = (error: string) => {
    console.error("3D Model loading error:", error);
  };

  useEffect(() => {
    return () => {
      if (modelUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [modelUrl]);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Box sx={{ p: 4, bgcolor: "#f0f0f0", minHeight: "100vh" }}>
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Typography variant="h4" color="black" gutterBottom>
              🎮 Three.js 3D Model Preview Component
            </Typography>

            {/* Configuration Panel */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Configuration
              </Typography>

              <Grid container spacing={3}>
                {/* Background Color Picker */}
                <Grid>
                  <Typography gutterBottom>Background Color</Typography>
                  <TextField
                    fullWidth
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    variant="outlined"
                    InputProps={{ style: { height: 56 } }}
                  />
                </Grid>

                {/* Dimensions */}
                <Grid>
                  <Typography gutterBottom>Canvas Dimensions</Typography>
                  <Grid container spacing={2}>
                    <Grid>
                      <TextField
                        label="Width"
                        type="number"
                        value={dimensions.width}
                        onChange={(e) =>
                          setDimensions((prev) => ({
                            ...prev,
                            width: Number(e.target.value),
                          }))
                        }
                        fullWidth
                        InputProps={{ inputProps: { min: 400, max: 1200 } }}
                      />
                    </Grid>
                    <Grid>
                      <TextField
                        label="Height"
                        type="number"
                        value={dimensions.height}
                        onChange={(e) =>
                          setDimensions((prev) => ({
                            ...prev,
                            height: Number(e.target.value),
                          }))
                        }
                        fullWidth
                        InputProps={{ inputProps: { min: 300, max: 800 } }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>

            <Box display="flex" justifyContent="center">
              <ThreeJSPreview
                modelUrl={modelUrl}
                width={dimensions.width}
                height={dimensions.height}
                autoRotate={autoRotate}
                showControls={true}
                backgroundColor={backgroundColor}
                onModelLoad={handleModelLoad}
                onError={handleError}
              />
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default ThreeJSDemo;
