import { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import ThreeJSDemo from "./ThreeJSDemo";
import GLTFViewer from "./GLTFViewer";
import { DepWindow } from "./Depwindow";
import { OpenInNew } from "@mui/icons-material";

function App() {
  const [activeView, setActiveView] = useState("demo");
  const [modelUrl, setModelUrl] = useState("/models/rim.gltf");
  const [inputUrl, setInputUrl] = useState(modelUrl);
  const [tabValue, setTabValue] = useState("browse");
  const [showDocumentWindow, setShowDocumentWindow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const fileInputRef = useRef(null) as any;

  const models = [
    {
      name: "2 Cylinder Engine",
      path: "/models/2CylinderEngine/2CylinderEngine.gltf",
      category: "Automotive",
      icon: "🔧",
      size: "2.3 MB",
      description:
        "Detailed 2-cylinder automotive engine model with moving parts",
      badge: "New",
    },
    {
      name: "Angled Tool",
      path: "/models/angled-tool.glb",
      category: "Tools",
      icon: "🔨",
      size: "1.8 MB",
      description: "Professional angled tool for precision work",
      badge: "Popular",
    },
    {
      name: "Racing Helmet",
      path: "/models/helmet.glb",
      category: "Sports",
      icon: "🏎️",
      size: "3.1 MB",
      description: "High-quality racing helmet with reflective materials",
      badge: "Premium",
    },
    {
      name: "Car Rim",
      path: "/models/rim.gltf",
      category: "Automotive",
      icon: "🚗",
      size: "1.5 MB",
      description: "Detailed car wheel rim with metallic finish",
      badge: "Featured",
    },
  ];

  const categories = ["All", ...new Set(models.map((model) => model.category))];
  const filteredModels =
    selectedCategory === "All"
      ? models
      : models.filter((model) => model.category === selectedCategory);

  const handleSwitch = (view: any) => {
    setActiveView(view);
  };

  const handleUrlChange = (e: any) => {
    setInputUrl(e.target.value);
  };

  const applyUrl = () => {
    if (inputUrl.includes(".dae")) {
      alert("DAE files are not supported. Please use GLTF or GLB format.");
      setInputUrl("");
      return;
    }
    if (inputUrl.trim()) {
      setModelUrl(inputUrl.trim());
    }
  };

  const handleModelSelect = (modelPath: string) => {
    setInputUrl(modelPath);
    setModelUrl(modelPath);
  };

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setInputUrl(url);
      setModelUrl(url);
    }
  };

  const getSelectedModel = () => {
    return models.find((model) => model.path === modelUrl) as any;
  };

  const getBadgeClass = (badge: string) => {
    switch (badge) {
      case "New":
        return "bg-success";
      case "Popular":
        return "bg-warning text-dark";
      case "Premium":
        return "bg-gradient text-white";
      case "Featured":
        return "bg-primary";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="min-vh-100 bg-gradient-primary">
      <style>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .model-card {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: none;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(15px);
        }
        .model-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
        }
        .model-card.selected {
          border: 3px solid #0d6efd;
          transform: scale(1.05);
          box-shadow: 0 15px 35px rgba(13, 110, 253, 0.3) !important;
        }
        .floating-controls {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.9);
        }
        .nav-pills .nav-link.active {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
        }
        .btn-gradient {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          color: white;
          transition: all 0.3s ease;
        }
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          color: white;
        }
      `}</style>

      <div className="container-fluid p-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="glass-card rounded-4 shadow-lg p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-primary rounded-3 p-3 me-3 d-flex align-items-center justify-content-center"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i className="bi bi-box text-white fs-2">🎯</i>
                  </div>
                  <div>
                    <h1 className="mb-0 fw-bold text-primary">
                      3D Model Viewer
                    </h1>
                    <p className="mb-0 text-muted">
                      Professional 3D model visualization platform
                    </p>
                  </div>
                </div>

                <div className="d-flex justify-content-center mb-4">
                  <div className="btn-group btn-group-lg" role="group">
                    <button
                      type="button"
                      className={`btn ${activeView === "demo" ? "btn-gradient" : "btn-outline-primary"} rounded-start-pill`}
                      onClick={() => handleSwitch("demo")}
                    >
                      🎭 Demo Scene
                    </button>
                    <button
                      type="button"
                      className={`btn ${activeView === "viewer" ? "btn-gradient" : "btn-outline-primary"} rounded-end-pill`}
                      onClick={() => handleSwitch("viewer")}
                    >
                      👁️ Model Viewer
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setShowDocumentWindow(true)}
                  >
                    <OpenInNew
                      style={{ fontSize: "16px", marginRight: "6px" }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Controls */}
        <div className="row mb-4">
          <div className="col-12">
            {activeView === "viewer" && (
              <div className="glass-card rounded-4 shadow-lg p-4">
                <div>
                  {/* Navigation Tabs */}
                  <ul className="nav nav-pills nav-fill mb-4" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${tabValue === "browse" ? "active" : ""} rounded-pill`}
                        onClick={() => setTabValue("browse")}
                      >
                        📚 Browse Models
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${tabValue === "url" ? "active" : ""} rounded-pill`}
                        onClick={() => setTabValue("url")}
                      >
                        🔗 Custom URL
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${tabValue === "upload" ? "active" : ""} rounded-pill`}
                        onClick={() => setTabValue("upload")}
                      >
                        📤 Upload File
                      </button>
                    </li>
                  </ul>

                  {/* Tab Content */}
                  <div className="tab-content">
                    {/* Browse Models Tab */}
                    {tabValue === "browse" && (
                      <div>
                        {/* Category Filter */}
                        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                          {categories.map((category) => (
                            <button
                              key={category}
                              className={`btn ${selectedCategory === category ? "btn-primary" : "btn-outline-primary"} rounded-pill btn-sm`}
                              onClick={() => setSelectedCategory(category)}
                            >
                              {category}
                            </button>
                          ))}
                        </div>

                        {/* Model Grid */}
                        <div className="row g-4">
                          {filteredModels.map((model, index) => (
                            <div
                              key={index}
                              className="col-lg-3 col-md-6 col-sm-12"
                            >
                              <div
                                className={`card model-card h-100 shadow-sm ${modelUrl === model.path ? "selected" : ""}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleModelSelect(model.path)}
                              >
                                <div className="card-body text-center p-4">
                                  <div className="position-relative mb-3">
                                    <div className="fs-1 mb-3">
                                      {model.icon}
                                    </div>
                                    <span
                                      className={`position-absolute top-0 end-0 badge ${getBadgeClass(model.badge)} rounded-pill`}
                                    >
                                      {model.badge}
                                    </span>
                                  </div>
                                  <h5 className="card-title fw-bold mb-2">
                                    {model.name}
                                  </h5>
                                  <span className="badge bg-light text-dark mb-2">
                                    {model.category}
                                  </span>
                                  <p className="card-text text-muted small">
                                    {model.size}
                                  </p>
                                  <div
                                    className="progress"
                                    style={{ height: "3px" }}
                                  >
                                    <div
                                      className="progress-bar bg-success"
                                      style={{ width: "100%" }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Custom URL Tab */}
                    {tabValue === "url" && (
                      <div className="row justify-content-center">
                        <div className="col-md-8">
                          <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                              <div className="input-group input-group-lg mb-3">
                                <span className="input-group-text bg-primary text-white border-0">
                                  🔗
                                </span>
                                <input
                                  type="text"
                                  className="form-control border-0 shadow-sm"
                                  value={inputUrl}
                                  onChange={handleUrlChange}
                                  placeholder="https://example.com/model.gltf"
                                />
                              </div>
                              <button
                                className="btn btn-gradient btn-lg w-100 shadow"
                                onClick={applyUrl}
                              >
                                🚀 Load Model
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Upload File Tab */}
                    {tabValue === "upload" && (
                      <div className="row justify-content-center">
                        <div className="col-md-6">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".gltf,.glb"
                            className="d-none"
                          />
                          <div
                            className="card border-2 border-dashed border-primary text-center p-5 shadow-sm"
                            style={{
                              cursor: "pointer",
                              borderStyle: "dashed !important",
                            }}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <div className="display-1 text-primary mb-3">
                              📤
                            </div>
                            <h4 className="fw-bold text-primary mb-2">
                              Drop your 3D model here
                            </h4>
                            <p className="text-muted mb-0">
                              Supports GLTF and GLB formats
                            </p>
                            <small className="text-muted">
                              or click to browse files
                            </small>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {showDocumentWindow && (
          <DepWindow closeWindowPortal={() => setShowDocumentWindow(false)}>
            <div style={{ width: "100%", height: "600px" }}>
              {activeView === "demo" ? (
                <ThreeJSDemo />
              ) : (
                <GLTFViewer url={modelUrl} />
              )}
            </div>
          </DepWindow>
        )}

        {/* 3D Viewer */}
        <div className="row">
          <div className="col-12">
            <div className="glass-card rounded-4 shadow-lg overflow-hidden position-relative">
              {showDocumentWindow ? null : activeView === "demo" ? (
                <ThreeJSDemo />
              ) : (
                <GLTFViewer url={modelUrl} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <div className="modal fade" id="settingsModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title d-flex align-items-center gap-2">
                <span className="fs-4">⚙️</span>
                Viewer Settings
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <span className="fs-4">🎨</span>
                      <div>
                        <div className="fw-semibold">Rendering Quality</div>
                        <small className="text-muted">
                          High performance rendering
                        </small>
                      </div>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        defaultChecked
                      />
                    </div>
                  </div>
                </div>

                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <span className="fs-4">🚀</span>
                      <div>
                        <div className="fw-semibold">Animation Speed</div>
                        <small className="text-muted">1.0x normal speed</small>
                      </div>
                    </div>
                    <input
                      type="range"
                      className="form-range"
                      style={{ width: "100px" }}
                      min="0.1"
                      max="3"
                      step="0.1"
                      defaultValue="1"
                    />
                  </div>
                </div>

                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <span className="fs-4">🔍</span>
                      <div>
                        <div className="fw-semibold">Show Wireframe</div>
                        <small className="text-muted">
                          Display model wireframe
                        </small>
                      </div>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" />
                    </div>
                  </div>
                </div>

                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <span className="fs-4">🌙</span>
                      <div>
                        <div className="fw-semibold">Dark Mode</div>
                        <small className="text-muted">
                          Switch to dark theme
                        </small>
                      </div>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-gradient w-100"
                data-bs-dismiss="modal"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Model Info Modal */}
      <div className="modal fade" id="modelInfoModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title d-flex align-items-center gap-2">
                <span className="fs-4">ℹ️</span>
                Model Information
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              {getSelectedModel() && (
                <div>
                  {/* Model Preview */}
                  <div className="text-center mb-4">
                    <div
                      className="bg-light rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: "80px",
                        height: "80px",
                        fontSize: "2.5rem",
                      }}
                    >
                      {getSelectedModel().icon}
                    </div>
                    <h4 className="fw-bold mb-2">{getSelectedModel().name}</h4>
                    <p className="text-muted">
                      {getSelectedModel().description}
                    </p>
                  </div>

                  {/* Model Details */}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="card bg-light border-0">
                        <div className="card-body text-center">
                          <div className="fs-4 mb-2">📁</div>
                          <div className="fw-semibold">Category</div>
                          <span className="badge bg-primary mt-1">
                            {getSelectedModel().category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card bg-light border-0">
                        <div className="card-body text-center">
                          <div className="fs-4 mb-2">💾</div>
                          <div className="fw-semibold">File Size</div>
                          <div className="text-muted mt-1 font-monospace">
                            {getSelectedModel().size}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card bg-light border-0">
                        <div className="card-body text-center">
                          <div className="fs-4 mb-2">🎯</div>
                          <div className="fw-semibold">Format</div>
                          <span
                            className={`badge mt-1 ${getSelectedModel().path.endsWith(".glb") ? "bg-success" : "bg-info"}`}
                          >
                            {getSelectedModel().path.endsWith(".glb")
                              ? "GLB"
                              : "GLTF"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card bg-light border-0">
                        <div className="card-body text-center">
                          <div className="fs-4 mb-2">⭐</div>
                          <div className="fw-semibold">Status</div>
                          <span
                            className={`badge mt-1 ${getBadgeClass(getSelectedModel().badge)}`}
                          >
                            {getSelectedModel().badge}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="row g-2 mt-3">
                    <div className="col-6">
                      <button className="btn btn-outline-primary w-100">
                        📤 Export
                      </button>
                    </div>
                    <div className="col-6">
                      <button className="btn btn-gradient w-100">
                        🔗 Share
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
