import { useState, type JSX } from "react";
import {
  FileText,
  ArrowRight,
  FolderTree,
  CheckCircle,
  ChevronsDownUp,
  Rocket,
  Zap,
  Target,
} from "lucide-react";

interface FolderNode {
  name: string;
  type: "file" | "folder";
  icon?: string;
  children?: FolderNode[];
}

const DocumentToCodeTransform = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStructure, setShowStructure] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["root"]),
  );

  // Sample requirements document
  const requirementsDoc = `
PROJECT REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━

✓ Full-stack application
✓ NestJS Backend API
✓ React Frontend
✓ PostgreSQL Database
✓ AWS Infrastructure
✓ Drawing Management System
✓ User Authentication
✓ Document Processing
  `.trim();

  // Simplified folder structure with config files
  const folderStructure: FolderNode[] = [
    { name: "README.md", type: "file", icon: "📘" },
    { name: ".gitignore", type: "file", icon: "🚫" },
    { name: ".prettierrc", type: "file", icon: "💅" },
    { name: ".eslintrc.json", type: "file", icon: "✅" },
    { name: "package.json", type: "file", icon: "📦" },
    { name: "tsconfig.json", type: "file", icon: "🔧" },
    { name: "docker-compose.yml", type: "file", icon: "🐳" },
    { name: "Dockerfile", type: "file", icon: "🐳" },
    { name: ".env.example", type: "file", icon: "🔐" },
    { name: "nx.json", type: "file", icon: "⚙️" },
    {
      name: ".github",
      type: "folder",
      children: [
        {
          name: "workflows",
          type: "folder",
          children: [
            { name: "ci.yml", type: "file", icon: "🔄" },
            { name: "deploy.yml", type: "file", icon: "🚀" },
          ],
        },
        { name: "PULL_REQUEST_TEMPLATE.md", type: "file", icon: "📋" },
      ],
    },
    {
      name: "apps",
      type: "folder",
      children: [
        {
          name: "api",
          type: "folder",
          children: [
            { name: "jest.config.ts", type: "file", icon: "🧪" },
            { name: "tsconfig.json", type: "file", icon: "🔧" },
            { name: "project.json", type: "file", icon: "📄" },
            {
              name: "src",
              type: "folder",
              children: [
                { name: "main.ts", type: "file", icon: "🎯" },
                { name: "app.module.ts", type: "file", icon: "📦" },
                {
                  name: "auth",
                  type: "folder",
                  children: [
                    { name: "auth.controller.ts", type: "file", icon: "🎮" },
                    { name: "auth.service.ts", type: "file", icon: "⚙️" },
                    { name: "auth.module.ts", type: "file", icon: "📦" },
                  ],
                },
                {
                  name: "organizations",
                  type: "folder",
                  children: [
                    {
                      name: "organization.entity.ts",
                      type: "file",
                      icon: "🗃️",
                    },
                    {
                      name: "organization.service.ts",
                      type: "file",
                      icon: "⚙️",
                    },
                  ],
                },
                {
                  name: "common",
                  type: "folder",
                  children: [
                    { name: "decorators", type: "folder" },
                    { name: "guards", type: "folder" },
                    { name: "interceptors", type: "folder" },
                  ],
                },
                {
                  name: "database",
                  type: "folder",
                  children: [
                    { name: "ormconfig.ts", type: "file", icon: "🔧" },
                  ],
                },
              ],
            },
            {
              name: "migrations",
              type: "folder",
              children: [
                { name: "20231116-initial.ts", type: "file", icon: "📊" },
              ],
            },
          ],
        },
        {
          name: "frontend",
          type: "folder",
          children: [
            { name: "vite.config.mjs", type: "file", icon: "⚡" },
            { name: "tsconfig.json", type: "file", icon: "🔧" },
            { name: "index.html", type: "file", icon: "🌐" },
            { name: "package.json", type: "file", icon: "📦" },
            {
              name: "src",
              type: "folder",
              children: [
                { name: "App.tsx", type: "file", icon: "⚛️" },
                { name: "main.tsx", type: "file", icon: "🎯" },
                {
                  name: "components",
                  type: "folder",
                  children: [
                    { name: "Header", type: "folder" },
                    { name: "Modal", type: "folder" },
                    { name: "Chart", type: "folder" },
                  ],
                },
                {
                  name: "pages",
                  type: "folder",
                  children: [
                    { name: "Login", type: "folder" },
                    { name: "Drawings", type: "folder" },
                    { name: "Customers", type: "folder" },
                  ],
                },
                {
                  name: "services",
                  type: "folder",
                  children: [
                    { name: "AuthService.tsx", type: "file", icon: "🔐" },
                    { name: "DrawingsService.tsx", type: "file", icon: "📐" },
                  ],
                },
                { name: "utils", type: "folder" },
              ],
            },
          ],
        },
        {
          name: "drawingpreprocessor",
          type: "folder",
          children: [
            { name: "requirements.txt", type: "file", icon: "🐍" },
            { name: "main.py", type: "file", icon: "🐍" },
            {
              name: "ai",
              type: "folder",
              children: [
                { name: "paddle_ocr_general", type: "folder" },
                { name: "rotation_detection", type: "folder" },
              ],
            },
            { name: "routes", type: "folder" },
            { name: "services", type: "folder" },
          ],
        },
      ],
    },
    {
      name: "libs",
      type: "folder",
      children: [
        {
          name: "shared-domain",
          type: "folder",
          children: [
            { name: "tsconfig.json", type: "file", icon: "🔧" },
            {
              name: "src",
              type: "folder",
              children: [
                { name: "index.ts", type: "file", icon: "📄" },
                { name: "lib", type: "folder" },
              ],
            },
          ],
        },
        { name: "shared-domain-functions", type: "folder" },
      ],
    },
    {
      name: "scripts",
      type: "folder",
      children: [
        { name: "setup.sh", type: "file", icon: "🔧" },
        { name: "deploy.sh", type: "file", icon: "🚀" },
      ],
    },
  ];

  const handleTransform = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowStructure(true);
    }, 1500);
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderTreeNode = (
    node: FolderNode,
    level = 0,
    parentPath = "",
  ): JSX.Element => {
    const path = parentPath ? `${parentPath}/${node.name}` : node.name;
    const isExpanded = expandedFolders.has(path);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div
        key={path}
        className="tree-node"
        style={{ marginLeft: `${level * 20}px` }}
      >
        <div
          className="tree-item"
          onClick={() => hasChildren && toggleFolder(path)}
          style={{ cursor: hasChildren ? "pointer" : "default" }}
        >
          {hasChildren && (
            <span className="folder-icon">{isExpanded ? "📂" : "📁"}</span>
          )}
          {!hasChildren && <span className="file-icon">📄</span>}
          <span className="node-name">{node.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="children">
            {node.children!.map((child) =>
              renderTreeNode(child, level + 1, path),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Transform Requirements into
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {" "}
              Structured Code
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Watch how we turn your ideas into production-ready architecture
          </p>
        </div>

        {/* Main Transformation Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input Section - Requirements Document */}
          <div
            className={`transition-all duration-700 ${isAnimating ? "opacity-50 scale-95" : "opacity-100 scale-100"}`}
          >
            <div className="p-2 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="pb-2 flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg shrink-0">
                  <FileText className="text-blue-400" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white leading-none">
                  What You Provide
                </h2>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap shadow-inner">
                {requirementsDoc}
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm leading-none">
                  Requirements
                </span>
                <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm leading-none">
                  Ideas
                </span>
                <span className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-sm leading-none">
                  Concepts
                </span>
              </div>
            </div>
          </div>

          {/* Output Section - Code Structure */}
          <div
            className={`transition-all duration-700 ${showStructure ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            <div className="p-2 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="p-2 flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <FolderTree className="text-green-400" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-white">What You Get</h2>
                <button
                  onClick={() => setExpandedFolders(new Set())}
                  className="ml-auto p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                  title="Collapse all"
                >
                  <ChevronsDownUp className="text-gray-400" size={14} />
                </button>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 font-mono text-sm text-gray-300 max-h-96 overflow-y-auto custom-scrollbar">
                {folderStructure.map((node) => renderTreeNode(node))}
              </div>

              <div className="pt-2 mt-6 flex items-center gap-3 text-green-400">
                <CheckCircle size={24} />
                <span className="font-semibold">
                  Production-Ready Architecture
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Transform Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={handleTransform}
            disabled={isAnimating}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-3">
              {isAnimating ? "Transforming..." : "Transform Now"}
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={24}
              />
            </span>

            {/* Animated glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-50 blur-xl transition-opacity"></div>
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex justify-center mt-2 mb-4">
              <Rocket className="text-purple-400" size={36} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Fast Development
            </h3>
            <p className="text-gray-400">
              Get your project structure in minutes, not days
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex justify-center mt-2 mb-4">
              <Zap className="text-yellow-400" size={36} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Best Practices
            </h3>
            <p className="text-gray-400">
              Industry-standard architecture and patterns
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex justify-center mt-2 mb-4">
              <Target className="text-pink-400" size={36} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Scalable</h3>
            <p className="text-gray-400">
              Built to grow with your business needs
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .tree-node {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .tree-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .tree-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .folder-icon,
        .file-icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        .node-name {
          color: #e5e7eb;
          font-size: 14px;
        }

        .children {
          margin-top: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default DocumentToCodeTransform;
