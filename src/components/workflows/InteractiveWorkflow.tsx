'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WorkflowDefinition, WorkflowNode, WorkflowConnection } from '@/types/workflow';
import {
  getSavedWorkflowPositions,
  saveWorkflowPositions,
  clearWorkflowPositions,
} from '@/lib/storage';
import { exportSvgElement } from '@/lib/svgExport';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Crosshair,
  RotateCcw,
  Download,
  Info,
  ArrowRight,
  ArrowRightLeft,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Copy,
  Check,
  AlertTriangle,
  HelpCircle,
  FileCode,
  ShieldCheck,
  X,
  GitPullRequest,
  ExternalLink,
  Sliders,
  Terminal,
} from 'lucide-react';

interface Props {
  workflow: WorkflowDefinition;
  onNodeSelect?: (node: WorkflowNode | null) => void;
  className?: string;
  allowEdit?: boolean;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 88;

const DEFAULT_PALETTE = [
  '#00D9FF', // Cyan / Sky Blue (Phase 1)
  '#10B981', // Emerald / Mint Green (Phase 2)
  '#A855F7', // Electric Purple (Phase 3)
  '#3B82F6', // Royal Blue (Phase 4)
  '#FF1A2A', // Vivid Cyber Red (Phase 5)
  '#F59E0B', // Warm Amber (Phase 6)
  '#EC4899', // Hot Pink / Coral (Phase 7)
  '#FBBF24', // Golden Yellow (Phase 8)
  '#14B8A6', // Teal / Turquoise (Phase 9)
  '#22C55E', // Pure Success Green (Phase 10)
];

const ALL_MARKER_COLORS = [
  '#00D9FF',
  '#10B981',
  '#A855F7',
  '#3B82F6',
  '#FF1A2A',
  '#F59E0B',
  '#EC4899',
  '#FBBF24',
  '#14B8A6',
  '#22C55E',
  '#FFFFFF',
  '#FF4D6D',
  '#32D583',
  '#FFA500',
  '#FFB547',
  '#94A3B8',
  '#9BA8BC',
  '#7C5CFF',
  '#6366F1',
  '#06B6D4',
  '#8B5CF6',
];

const getNodeColor = (node: WorkflowNode, index: number): string => {
  if (node.color) return node.color;
  if (node.type === 'status-confirmed') return '#FF1A2A';
  if (node.type === 'status-fp') return '#22C55E';
  if (node.type === 'status-na') return '#FBBF24';
  if (node.type === 'status-inconclusive') return '#94A3B8';
  return DEFAULT_PALETTE[index % DEFAULT_PALETTE.length];
};

export default function InteractiveWorkflow({ workflow, onNodeSelect, className = '' }: Props) {
  const [nodes, setNodes] = useState<WorkflowNode[]>(workflow.defaultNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<WorkflowConnection | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragDistance, setDragDistance] = useState<number>(0);

  // Pan and Zoom
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [hasCustomPositions, setHasCustomPositions] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedCommand, setCopiedCommand] = useState<boolean>(false);
  const [checkedActivities, setCheckedActivities] = useState<Record<string, boolean>>({});

  // Fullscreen expansion state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Fullscreen handler (supports both native API and robust CSS viewport overlay fallback)
  const handleToggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      showToast('Expanded to Fullscreen • Press Esc or F to exit');
      if (wrapperRef.current && wrapperRef.current.requestFullscreen) {
        wrapperRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      setIsFullscreen(false);
      showToast('Exited Fullscreen');
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, [isFullscreen]);

  // Sync fullscreen state with document events and keyboard shortcuts
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isDocFullscreen = Boolean(document.fullscreenElement);
      if (!isDocFullscreen && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        handleToggleFullscreen();
      }
      if (
        (e.key === 'f' || e.key === 'F') &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        handleToggleFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, handleToggleFullscreen]);

  // Prevent background scrolling while in fullscreen mode
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const handleCanvasDoubleClick = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === 'svg') {
      handleToggleFullscreen();
    }
  };

  // Load saved positions or reset when workflow changes
  useEffect(() => {
    const saved = getSavedWorkflowPositions(workflow.id);
    if (saved) {
      setNodes((prevNodes) =>
        prevNodes.map((n) => {
          if (saved[n.id]) {
            return { ...n, x: saved[n.id].x, y: saved[n.id].y };
          }
          return n;
        })
      );
      setHasCustomPositions(true);
    } else {
      setNodes(workflow.defaultNodes);
      setHasCustomPositions(false);
    }

    // Default select the first node so information is immediately available
    if (workflow.defaultNodes.length > 0) {
      setSelectedNodeId(workflow.defaultNodes[0].id);
      setSelectedConnection(null);
      setIsInspectorOpen(true);
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [workflow.id, workflow.defaultNodes]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;
  const selectedNodeIndex = nodes.findIndex((n) => n.id === selectedNodeId);
  const activeInspectorColor = selectedNode
    ? getNodeColor(selectedNode, selectedNodeIndex)
    : selectedConnection?.color || '#FF1A2A';

  // Inbound & outbound connections for current selected node
  const inboundConnections = selectedNode
    ? workflow.connections.filter((c) => c.to === selectedNode.id)
    : [];
  const outboundConnections = selectedNode
    ? workflow.connections.filter((c) => c.from === selectedNode.id)
    : [];

  useEffect(() => {
    if (onNodeSelect) {
      onNodeSelect(selectedNode);
    }
  }, [selectedNode, onNodeSelect]);

  // Touch / Pointer Down on a Node
  const handleNodePointerDown = (e: React.PointerEvent, nodeId: string) => {
    e.stopPropagation();
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (err) {
      // Fallback
    }

    const node = nodes.find((n) => n.id === nodeId);
    if (!node || !svgRef.current) return;

    setDraggedNodeId(nodeId);
    setDragDistance(0);

    const ctm = svgRef.current.getScreenCTM();
    if (ctm) {
      const svgPoint = svgRef.current.createSVGPoint();
      svgPoint.x = e.clientX;
      svgPoint.y = e.clientY;
      const transformed = svgPoint.matrixTransform(ctm.inverse());
      setDragOffset({
        x: transformed.x - node.x,
        y: transformed.y - node.y,
      });
    }
  };

  // Pointer Move (Drag Node or Pan Canvas)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggedNodeId && svgRef.current) {
      const ctm = svgRef.current.getScreenCTM();
      if (!ctm) return;

      const svgPoint = svgRef.current.createSVGPoint();
      svgPoint.x = e.clientX;
      svgPoint.y = e.clientY;
      const transformed = svgPoint.matrixTransform(ctm.inverse());

      let newX = transformed.x - dragOffset.x;
      let newY = transformed.y - dragOffset.y;

      const minX = 10;
      const maxX = workflow.viewBox.width - (NODE_WIDTH + 10);
      const minY = 10;
      const maxY = workflow.viewBox.height - (NODE_HEIGHT + 10);

      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));

      setDragDistance((prev) => prev + 1);

      setNodes((prevNodes) =>
        prevNodes.map((n) => (n.id === draggedNodeId ? { ...n, x: newX, y: newY } : n))
      );
      setHasCustomPositions(true);
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  // Pointer Up (Select Node if touch was a tap/click)
  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggedNodeId) {
      // Touch or click selects the node and immediately presents information
      setSelectedNodeId(draggedNodeId);
      setSelectedConnection(null);
      setIsInspectorOpen(true);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window && isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }

      setDraggedNodeId(null);
      if (dragDistance > 5) {
        const positions: Record<string, { x: number; y: number }> = {};
        nodes.forEach((n) => {
          positions[n.id] = { x: n.x, y: n.y };
        });
        saveWorkflowPositions(workflow.id, positions);
        showToast('Custom layout saved');
      }
    }
    if (isPanning) {
      setIsPanning(false);
    }
  };

  // Touch / Pointer on a Flow Connection Arrow or Label
  const handleConnectionClick = (conn: WorkflowConnection) => {
    setSelectedConnection(conn);
    setSelectedNodeId(null);
    setIsInspectorOpen(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleResetPositions = () => {
    clearWorkflowPositions(workflow.id);
    setNodes(workflow.defaultNodes);
    setHasCustomPositions(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    showToast('Reset to default positions');
  };

  const handleDownloadSvg = () => {
    if (svgRef.current) {
      exportSvgElement(svgRef.current, `${workflow.id}-workflow.svg`);
      showToast('Downloaded standalone SVG diagram');
    }
  };

  // Text-to-speech audio explanation
  const handleToggleSpeech = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const toggleActivityCheck = (actKey: string) => {
    setCheckedActivities((prev) => ({ ...prev, [actKey]: !prev[actKey] }));
  };

  // Step Navigation
  const handlePrevNode = () => {
    if (selectedNodeIndex > 0) {
      setSelectedNodeId(nodes[selectedNodeIndex - 1].id);
      setSelectedConnection(null);
      setIsInspectorOpen(true);
      if (isSpeaking && typeof window !== 'undefined') window.speechSynthesis.cancel();
    }
  };

  const handleNextNode = () => {
    if (selectedNodeIndex < nodes.length - 1) {
      setSelectedNodeId(nodes[selectedNodeIndex + 1].id);
      setSelectedConnection(null);
      setIsInspectorOpen(true);
      if (isSpeaking && typeof window !== 'undefined') window.speechSynthesis.cancel();
    }
  };

  // Geometry Calculation
  const getNodeCenter = (nodeId: string): { x: number; y: number; left: number; right: number; top: number; bottom: number } => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) {
      return { x: 0, y: 0, left: 0, right: 0, top: 0, bottom: 0 };
    }
    const w = node.width || NODE_WIDTH;
    const h = node.height || NODE_HEIGHT;
    return {
      x: node.x + w / 2,
      y: node.y + h / 2,
      left: node.x,
      right: node.x + w,
      top: node.y,
      bottom: node.y + h,
    };
  };

  // Connection Renderer with Touch Hitbox and Selection Highlighting
  const renderConnectionPath = (conn: WorkflowConnection) => {
    const fromCenter = getNodeCenter(conn.from);
    const toCenter = getNodeCenter(conn.to);

    const isSelected =
      selectedConnection &&
      selectedConnection.from === conn.from &&
      selectedConnection.to === conn.to;

    let startX = fromCenter.right;
    let startY = fromCenter.y;
    let endX = toCenter.left;
    let endY = toCenter.y;

    const fromNodeIndex = nodes.findIndex((n) => n.id === conn.from);
    const fromNode = fromNodeIndex >= 0 ? nodes[fromNodeIndex] : null;
    const fromColor = fromNode ? getNodeColor(fromNode, fromNodeIndex) : '#FF1A2A';

    const baseColor = conn.color || fromColor;
    const activeColor = isSelected ? 'var(--accent-secondary, #FFFFFF)' : baseColor;

    let pathData = '';
    let midX = 0;
    let midY = 0;

    if (conn.style === 'loopback' || fromCenter.x > toCenter.x) {
      const isLoopUnder = fromCenter.y >= toCenter.y;
      const controlY = isLoopUnder
        ? Math.max(fromCenter.bottom, toCenter.bottom) + 60
        : Math.min(fromCenter.top, toCenter.top) - 60;

      pathData = `M ${fromCenter.x} ${fromCenter.bottom} C ${fromCenter.x} ${controlY}, ${toCenter.x} ${controlY}, ${toCenter.x} ${toCenter.bottom + 10}`;
      midX = (fromCenter.x + toCenter.x) / 2;
      midY = controlY - 8;
    } else {
      if (Math.abs(fromCenter.x - toCenter.x) < 80) {
        if (fromCenter.y < toCenter.y) {
          startX = fromCenter.x;
          startY = fromCenter.bottom;
          endX = toCenter.x;
          endY = toCenter.top;
        } else {
          startX = fromCenter.x;
          startY = fromCenter.top;
          endX = toCenter.x;
          endY = toCenter.bottom;
        }
      }

      const deltaX = endX - startX;
      const cp1x = startX + deltaX * 0.5;
      const cp1y = startY;
      const cp2x = startX + deltaX * 0.5;
      const cp2y = endY;

      pathData = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
      midX = (startX + endX) / 2;
      midY = (startY + endY) / 2;
    }

    const hexClean = baseColor.startsWith('#') ? baseColor.replace('#', '').toUpperCase() : '';
    const markerId = isSelected
      ? 'arrow-FFFFFF'
      : hexClean
      ? `arrow-${hexClean}`
      : 'arrow-primary';

    return (
      <g
        key={`${conn.from}-${conn.to}`}
        className="cursor-pointer group select-none"
        onPointerDown={(e) => {
          e.stopPropagation();
          handleConnectionClick(conn);
        }}
      >
        {/* Generous Invisible Touch Hitbox for Mobile / Desktop Taps */}
        <path
          d={pathData}
          fill="none"
          stroke="transparent"
          strokeWidth="32"
          className="cursor-pointer"
        />

        {/* Outer Glow Halo on Selection */}
        {isSelected && (
          <path
            d={pathData}
            fill="none"
            stroke="var(--accent-secondary, #FFFFFF)"
            strokeWidth="7"
            strokeOpacity="0.4"
            className="animate-pulse"
          />
        )}

        {/* Visible Flow Line */}
        <path
          d={pathData}
          fill="none"
          stroke={activeColor}
          strokeWidth={isSelected ? '3.5' : '2.4'}
          strokeDasharray={isSelected ? '8 4' : conn.style === 'loopback' ? '6 4' : 'none'}
          markerEnd={`url(#${markerId})`}
          className="transition-all duration-150 group-hover:stroke-[var(--accent-secondary)] group-hover:stroke-width-[3.2]"
        />

        {/* Interactive Flow Label Badge */}
        {conn.label && (
          <g transform={`translate(${midX}, ${midY})`}>
            <rect
              x={-(conn.label.length * 3.3 + 8)}
              y="-10"
              width={conn.label.length * 6.6 + 16}
              height="20"
              rx="5"
              fill={isSelected ? baseColor : 'var(--bg-card, #111111)'}
              stroke={isSelected ? '#FFFFFF' : `${baseColor}66`}
              strokeWidth={isSelected ? '1.8' : '1'}
              filter={
                isSelected
                  ? `drop-shadow(0 0 12px ${baseColor})`
                  : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
              }
              className="transition-all duration-150 group-hover:stroke-white"
            />
            <text
              x="0"
              y="3.5"
              fill={isSelected ? '#FFFFFF' : baseColor}
              fontSize="10"
              fontWeight={isSelected ? '700' : '600'}
              textAnchor="middle"
              className="select-none pointer-events-none transition-colors group-hover:fill-white"
            >
              {conn.label}
            </text>
          </g>
        )}
      </g>
    );
  };

  // Find source & target nodes for selected connection
  const connFromNode = selectedConnection
    ? nodes.find((n) => n.id === selectedConnection.from)
    : null;
  const connToNode = selectedConnection
    ? nodes.find((n) => n.id === selectedConnection.to)
    : null;

  return (
    <div
      ref={wrapperRef}
      className={`flex flex-col transition-all duration-150 ${
        isFullscreen
          ? 'fixed inset-0 z-[99999] w-screen h-screen bg-[var(--bg-main)] rounded-none border-0 overflow-hidden'
          : `rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden shadow-2xl ${className}`
      }`}
    >
      {/* Top Workflow Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/95 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm md:text-base font-bold text-[var(--text-primary)]">{workflow.title}</h3>
              {isFullscreen && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/40 animate-pulse">
                  Fullscreen Mode
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{workflow.subtitle}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setZoom((prev) => Math.min(prev + 0.15, 2.5))}
            title="Zoom In (+)"
            className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-color)] transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.5))}
            title="Zoom Out (-)"
            className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-color)] transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            title="Fit Canvas to View"
            className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-color)] text-xs font-semibold flex items-center gap-1.5 px-3 transition-colors"
          >
            <Crosshair className="w-3.5 h-3.5" /> Fit View
          </button>
          <button
            onClick={handleResetPositions}
            title="Reset Nodes to Default Layout"
            className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-color)] text-xs font-semibold flex items-center gap-1.5 px-3 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>

          {/* Fullscreen Expand / Exit Button */}
          <button
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (Esc or F)' : 'Expand to Fullscreen (F)'}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 px-3.5 transition-all shadow-sm ${
              isFullscreen
                ? 'bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/85 text-white shadow-[0_0_15px_rgba(255,26,42,0.4)]'
                : 'bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-color)] hover:border-[var(--accent-primary)]/50'
            }`}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>Fullscreen</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadSvg}
            title="Download Standalone SVG File"
            className="p-2 rounded-xl bg-[var(--accent-primary)]/15 hover:bg-[var(--accent-primary)]/30 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] hover:text-white text-xs font-bold flex items-center gap-1.5 px-3.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export SVG
          </button>
        </div>
      </div>

      {/* Main Interactive SVG Canvas Container */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleCanvasDoubleClick}
        className={`relative w-full bg-[var(--canvas-bg)] overflow-hidden select-none cursor-grab active:cursor-grabbing ${
          isFullscreen ? 'flex-1 h-full min-h-0' : 'h-[620px] md:h-[660px]'
        }`}
      >
        {/* Visual Cyber Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `radial-gradient(var(--border-color) 1.2px, transparent 1.2px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* SVG Diagram Canvas */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${workflow.viewBox.width} ${workflow.viewBox.height}`}
          onPointerDown={handleCanvasPointerDown}
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            <marker id="arrow-primary" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--accent-primary, #FF1A2A)" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#FFFFFF" />
            </marker>
            <marker id="arrow-FFFFFF" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#FFFFFF" />
            </marker>
            {ALL_MARKER_COLORS.map((hex) => {
              const markerKey = hex.replace('#', '').toUpperCase();
              return (
                <marker
                  key={markerKey}
                  id={`arrow-${markerKey}`}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6.5"
                  markerHeight="6.5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill={hex} />
                </marker>
              );
            })}
          </defs>

          {/* Interactive Connection Lines Layer */}
          <g className="connections-layer">
            {workflow.connections.map((conn) => renderConnectionPath(conn))}
          </g>

          {/* Interactive Nodes Layer */}
          <g className="nodes-layer">
            {nodes.map((node, nodeIdx) => {
              const isSelected = node.id === selectedNodeId;
              const width = node.width || NODE_WIDTH;
              const height = node.height || NODE_HEIGHT;
              const nodeColor = getNodeColor(node, nodeIdx);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onPointerDown={(e) => handleNodePointerDown(e, node.id)}
                  className="cursor-pointer select-none transition-all duration-75 group"
                  style={{ touchAction: 'none' }}
                >
                  {/* Outer Pulsing Glow when Selected */}
                  {isSelected && (
                    <rect
                      x="-4"
                      y="-4"
                      width={width + 8}
                      height={height + 8}
                      rx="14"
                      fill="none"
                      stroke={nodeColor}
                      strokeWidth="2.5"
                      strokeOpacity="0.85"
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Node Box */}
                  <rect
                    width={width}
                    height={height}
                    rx="10"
                    fill="var(--node-bg, #111111)"
                    stroke={isSelected ? nodeColor : `${nodeColor}55`}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter={
                      isSelected
                        ? `drop-shadow(0 0 20px ${nodeColor})`
                        : 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
                    }
                    className="transition-all duration-150 group-hover:stroke-white"
                  />

                  {/* Top Status Accent Bar */}
                  <rect
                    width={width}
                    height="4.5"
                    rx="2"
                    fill={nodeColor}
                    opacity={isSelected ? 1 : 0.9}
                  />

                  {/* Phase Tag */}
                  {node.phase && (
                    <text
                      x="14"
                      y="22"
                      fill={nodeColor}
                      fontSize="9.5"
                      fontWeight="bold"
                      letterSpacing="0.6"
                    >
                      {node.phase.toUpperCase()}
                    </text>
                  )}

                  {/* Node Title */}
                  <text
                    x="14"
                    y={node.phase ? "41" : "32"}
                    fill="var(--node-text, #F4F7FB)"
                    fontSize="13"
                    fontWeight="700"
                    width={width - 28}
                  >
                    {node.label}
                  </text>

                  {/* Short Snippet */}
                  <text
                    x="14"
                    y={node.phase ? "58" : "50"}
                    fill="var(--text-secondary, #9BA8BC)"
                    fontSize="10"
                    width={width - 28}
                  >
                    {node.description.length > 34 ? `${node.description.substring(0, 32)}…` : node.description}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>


        {/* Floating Quick Banner when Drawer is closed */}
        {!isInspectorOpen && (selectedNode || selectedConnection) && (
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-[var(--bg-secondary)]/95 backdrop-blur-md border rounded-2xl px-5 py-2.5 shadow-2xl animate-in fade-in"
            style={{ borderColor: `${activeInspectorColor}80` }}
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: activeInspectorColor }}
              />
              <span>
                {selectedNode ? selectedNode.label : `Flow: ${selectedConnection?.label}`}
              </span>
            </div>
            <button
              onClick={() => setIsInspectorOpen(true)}
              className="flex items-center gap-1 px-3 py-1 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:opacity-90"
              style={{ backgroundColor: activeInspectorColor }}
            >
              <Info className="w-3.5 h-3.5" /> Show Flow Details
            </button>
          </div>
        )}

        {/* FLOATING IN-VIEW INSPECTOR DRAWER (Directly on the Workflow Canvas) */}
        {isInspectorOpen && (selectedNode || selectedConnection) && (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 bottom-0 w-full sm:w-[460px] md:w-[490px] z-30 bg-[var(--bg-secondary)]/95 backdrop-blur-2xl border-l border-[var(--border-color)] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
          >
            {/* Top Colored Accent Strip */}
            <div className="h-1.5 w-full flex-shrink-0" style={{ backgroundColor: activeInspectorColor }} />

            {/* Drawer Header */}
            <div className="flex items-center justify-between gap-3 p-4 border-b border-[var(--border-color)] bg-[var(--bg-card)]/80">
              <div className="flex items-center gap-2 overflow-hidden">
                <span
                  className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border"
                  style={{
                    backgroundColor: `${activeInspectorColor}22`,
                    borderColor: `${activeInspectorColor}66`,
                    color: activeInspectorColor,
                  }}
                >
                  {selectedNode ? selectedNode.phase || 'Workflow Step' : 'Flow Transition'}
                </span>
                {selectedNode && (
                  <span className="text-xs text-[var(--text-secondary)] font-medium">
                    Step {selectedNodeIndex + 1} of {nodes.length}
                  </span>
                )}
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-1.5">
                {/* Voice Speech Audio Button */}
                <button
                  onClick={() => {
                    if (selectedNode) {
                      handleToggleSpeech(
                        `${selectedNode.label}. ${selectedNode.details || selectedNode.description}. Core question: ${selectedNode.keyQuestion || ''}`
                      );
                    } else if (selectedConnection) {
                      handleToggleSpeech(
                        `Flow Transition: ${selectedConnection.label}. ${selectedConnection.description || ''}. Transferred data: ${selectedConnection.dataArtifact || ''}`
                      );
                    }
                  }}
                  title={isSpeaking ? 'Stop Audio' : 'Explain Audio'}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                    isSpeaking
                      ? 'text-white border-transparent animate-pulse'
                      : 'bg-[var(--bg-main)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-white'
                  }`}
                  style={isSpeaking ? { backgroundColor: activeInspectorColor } : undefined}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Audio'}</span>
                </button>

                {/* Step Navigation (When inspecting nodes) */}
                {selectedNode && (
                  <>
                    <button
                      onClick={handlePrevNode}
                      disabled={selectedNodeIndex === 0}
                      title="Previous Step"
                      className="p-1.5 rounded-lg bg-[var(--bg-main)] hover:bg-[var(--bg-card-hover)] disabled:opacity-30 border border-[var(--border-color)] text-[var(--text-primary)]"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleNextNode}
                      disabled={selectedNodeIndex === nodes.length - 1}
                      title="Next Step"
                      className="p-1.5 rounded-lg bg-[var(--bg-main)] hover:bg-[var(--bg-card-hover)] disabled:opacity-30 border border-[var(--border-color)] text-[var(--text-primary)]"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {/* Close Drawer Button */}
                <button
                  onClick={() => setIsInspectorOpen(false)}
                  className="p-1.5 rounded-lg bg-[var(--bg-main)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-color)] ml-1"
                  title="Close Inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5">
              {/* === MODE 1: NODE INSPECTION === */}
              {selectedNode && (
                <>
                  {/* Title and Short Description */}
                  <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-black text-[var(--text-primary)] tracking-tight">
                      {selectedNode.label}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {selectedNode.description}
                    </p>
                  </div>

                  {/* Connected Flows Handover Context */}
                  {(inboundConnections.length > 0 || outboundConnections.length > 0) && (
                    <div className="p-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-secondary)] flex items-center gap-1">
                        <GitPullRequest className="w-3.5 h-3.5" /> Lifecycle Flow Handover
                      </span>

                      {/* Inbound Flow Transition */}
                      {inboundConnections.map((c, idx) => {
                        const fromN = nodes.find((n) => n.id === c.from);
                        return (
                          <div
                            key={idx}
                            onClick={() => handleConnectionClick(c)}
                            className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card)] hover:border-[var(--accent-secondary)] border border-[var(--border-color)] cursor-pointer text-xs transition-colors"
                          >
                            <span className="text-[var(--text-secondary)] truncate">
                              ⬅️ From <strong className="text-[var(--text-primary)]">{fromN?.label || c.from}</strong>
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] shrink-0 ml-2">
                              {c.label || 'Flow Input'}
                            </span>
                          </div>
                        );
                      })}

                      {/* Outbound Flow Transition */}
                      {outboundConnections.map((c, idx) => {
                        const toN = nodes.find((n) => n.id === c.to);
                        return (
                          <div
                            key={idx}
                            onClick={() => handleConnectionClick(c)}
                            className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card)] hover:border-[var(--accent-secondary)] border border-[var(--border-color)] cursor-pointer text-xs transition-colors"
                          >
                            <span className="text-[var(--text-secondary)] truncate">
                              ➡️ Hands off to <strong className="text-[var(--text-primary)]">{toN?.label || c.to}</strong>
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--accent-secondary)]/15 text-[var(--accent-secondary)] shrink-0 ml-2">
                              {c.label || 'Flow Output'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Core Objective Question */}
                  {selectedNode.keyQuestion && (
                    <div
                      className="p-3.5 rounded-xl bg-[var(--bg-card)] border flex items-start gap-2.5"
                      style={{
                        borderColor: `${activeInspectorColor}55`,
                        borderLeftWidth: '4px',
                        borderLeftColor: activeInspectorColor,
                      }}
                    >
                      <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: activeInspectorColor }} />
                      <div className="text-xs">
                        <span className="font-bold text-[var(--text-primary)] block">Core Objective Question:</span>
                        <span className="text-[var(--text-primary)] font-medium leading-relaxed">
                          &ldquo;{selectedNode.keyQuestion}&rdquo;
                        </span>
                      </div>
                    </div>
                  )}

                  {/* In-depth Detailed Narrative */}
                  <div className="space-y-1.5">
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: activeInspectorColor }}
                    >
                      In-Depth Explanation & Purpose
                    </span>
                    <p className="text-xs md:text-sm text-[var(--text-primary)] leading-relaxed">
                      {selectedNode.details || selectedNode.description}
                    </p>
                  </div>

                  {/* Real-World Cyber Incident / Scenario */}
                  {selectedNode.realWorldExample && (
                    <div className="p-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                      <span className="text-[11px] font-bold text-[var(--accent-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Real-World Cyber Incident / Field Example
                      </span>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {selectedNode.realWorldExample}
                      </p>
                    </div>
                  )}

                  {/* Sample Command or Technical Snippet */}
                  {selectedNode.sampleCommand && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1 font-mono text-[var(--accent-primary)] font-semibold">
                          <FileCode className="w-3.5 h-3.5" /> Technical Execution Snippet
                        </span>
                        <button
                          onClick={() => handleCopyCommand(selectedNode.sampleCommand!)}
                          className="flex items-center gap-1 text-[10px] text-[var(--accent-secondary)] hover:underline"
                        >
                          {copiedCommand ? <Check className="w-3 h-3 text-[#32D583]" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCommand ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs font-mono text-[var(--accent-secondary)] overflow-x-auto whitespace-pre-wrap select-all">
                        {selectedNode.sampleCommand}
                      </pre>
                    </div>
                  )}

                  {/* Phase Activities Checklist */}
                  {selectedNode.activities && (
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
                      <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block">
                        Phase Activities Checklist
                      </span>
                      <div className="space-y-1.5">
                        {selectedNode.activities.map((act, idx) => {
                          const actKey = `${selectedNode.id}_${idx}`;
                          const isChecked = !!checkedActivities[actKey];
                          return (
                            <label
                              key={idx}
                              onClick={() => toggleActivityCheck(actKey)}
                              className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer select-none"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="mt-0.5 rounded border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--accent-primary)] focus:ring-0"
                              />
                              <span className={isChecked ? 'line-through opacity-60 text-[var(--color-success)]' : ''}>
                                {act}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tools & Deliverables */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedNode.tools && (
                      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-primary)] block mb-1.5">
                          Tools
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedNode.tools.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-[var(--bg-main)] text-[var(--accent-secondary)] px-2 py-0.5 rounded border border-[var(--border-color)] font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedNode.deliverables && (
                      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-success)] block mb-1.5">
                          Deliverables
                        </span>
                        <div className="text-[11px] text-[var(--text-secondary)] space-y-1">
                          {selectedNode.deliverables.map((d, idx) => (
                            <div key={idx} className="flex items-center gap-1 truncate">
                              <CheckCircle2 className="w-3 h-3 text-[var(--color-success)] shrink-0" />
                              <span className="truncate">{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Common Operational Pitfalls */}
                  {selectedNode.pitfalls && (
                    <div className="p-3.5 rounded-xl bg-[var(--color-critical)]/10 border border-[var(--color-critical)]/30 space-y-1.5">
                      <span className="text-[11px] font-bold text-[var(--color-critical)] uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Common Operational Pitfalls
                      </span>
                      <ul className="text-xs text-[var(--text-secondary)] space-y-1 list-disc list-inside">
                        {selectedNode.pitfalls.map((pf, idx) => (
                          <li key={idx}>{pf}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* === MODE 2: FLOW TRANSITION INSPECTION === */}
              {selectedConnection && (
                <div className="space-y-5 animate-in fade-in">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-[var(--accent-secondary)] flex items-center gap-1">
                        <ArrowRightLeft className="w-3.5 h-3.5" /> Flow Transition
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-[var(--text-primary)]">
                      {selectedConnection.label || 'Workflow Connection Flow'}
                    </h3>
                  </div>

                  {/* Flow Origin and Target Journey Box */}
                  <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                      Transition Sequence
                    </span>
                    <div className="flex flex-col gap-2">
                      {/* Origin Node */}
                      <button
                        onClick={() => {
                          if (connFromNode) {
                            setSelectedNodeId(connFromNode.id);
                            setSelectedConnection(null);
                          }
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-card)] hover:border-[var(--accent-primary)] border border-[var(--border-color)] text-left transition-all"
                      >
                        <div>
                          <span className="text-[10px] text-[var(--text-secondary)] block uppercase">Origin Phase</span>
                          <span className="text-xs font-bold text-[var(--text-primary)]">
                            {connFromNode?.label || selectedConnection.from}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] font-bold">
                          Inspect ➔
                        </span>
                      </button>

                      {/* Direction Arrow */}
                      <div className="flex items-center justify-center text-[var(--accent-secondary)] font-bold text-xs py-0.5">
                        <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
                        <span className="text-[11px] ml-1.5 uppercase tracking-wider">
                          Hands over {selectedConnection.label}
                        </span>
                      </div>

                      {/* Target Node */}
                      <button
                        onClick={() => {
                          if (connToNode) {
                            setSelectedNodeId(connToNode.id);
                            setSelectedConnection(null);
                          }
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-card)] hover:border-[var(--accent-secondary)] border border-[var(--border-color)] text-left transition-all"
                      >
                        <div>
                          <span className="text-[10px] text-[var(--text-secondary)] block uppercase">Destination Phase</span>
                          <span className="text-xs font-bold text-[var(--text-primary)]">
                            {connToNode?.label || selectedConnection.to}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--accent-secondary)]/15 text-[var(--accent-secondary)] font-bold">
                          Inspect ➔
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Transferred Data Artifact */}
                  {selectedConnection.dataArtifact && (
                    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--color-success)]/40 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-success)] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Transferred Data Artifact / Payload
                      </span>
                      <p className="text-xs font-mono font-semibold text-[var(--text-primary)]">
                        {selectedConnection.dataArtifact}
                      </p>
                    </div>
                  )}

                  {/* Flow Narrative & Preconditions */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                      Why This Flow Exists & Operational Objective
                    </span>
                    <p className="text-xs md:text-sm text-[var(--text-primary)] leading-relaxed">
                      {selectedConnection.description ||
                        'This transition transfers verified artifacts, scan configurations, or remediation evidence from the preceding phase to the subsequent phase, ensuring closed-loop accountability.'}
                    </p>
                  </div>

                  {/* Return Loop Explanation if applicable */}
                  {selectedConnection.style === 'loopback' && (
                    <div className="p-3.5 rounded-xl bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/30 space-y-1">
                      <span className="text-[11px] font-bold text-[var(--accent-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" /> Closed-Loop Feedback Loopback
                      </span>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        This return loop represents automated quality assurance. If retesting detects that vulnerabilities were not properly mitigated or new regressions occurred, the task is rejected back to scanning and development with fresh reproduction evidence.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[var(--accent-primary)] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl z-40 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            {toastMessage}
          </div>
        )}
      </div>

    </div>
  );
}
