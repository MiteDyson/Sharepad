"use client";

import { useEffect, useRef } from "react";
import { Button, cn } from "@/components/ui/design-system";

export function CanvasBoard({ socket, roomId, color, setColor }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const prevPoint = useRef(null);

  // Sync Incoming Draws
  useEffect(() => {
    if (!socket) return;

    const handleRemoteDraw = ({ prevPoint, currentPoint, color }) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) drawLine(ctx, prevPoint, currentPoint, color);
    };

    const handleClear = () => {
      const ctx = canvasRef.current?.getContext("2d");
      ctx?.clearRect(0, 0, 1000, 800);
    };

    socket.on("draw-line", handleRemoteDraw);
    socket.on("clear-canvas", handleClear);

    return () => {
      socket.off("draw-line", handleRemoteDraw);
      socket.off("clear-canvas", handleClear);
    };
  }, [socket]);

  // Drawing Logic
  const drawLine = (ctx, start, end, strokeColor) => {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = strokeColor;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  };

  const computePoint = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onMouseDown = (e) => {
    isDrawing.current = true;
    prevPoint.current = computePoint(e);
  };

  const onMouseMove = (e) => {
    if (!isDrawing.current) return;
    const currentPoint = computePoint(e);
    const ctx = canvasRef.current.getContext("2d");

    // Draw Locally
    drawLine(ctx, prevPoint.current, currentPoint, color);

    // Broadcast
    socket.emit("draw-line", {
      roomId,
      drawData: { prevPoint: prevPoint.current, currentPoint, color },
    });

    prevPoint.current = currentPoint;
  };

  return (
    <div className="absolute inset-0 bg-white z-0 flex flex-col">
      {/* Toolbar */}
      <div className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="flex gap-2">
          {["#000000", "#EF4444", "#3B82F6", "#10B981", "#F59E0B"].map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "w-6 h-6 rounded-full border-2 transition-transform",
                color === c
                  ? "border-zinc-900 dark:border-white scale-110"
                  : "border-transparent hover:scale-105"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(0, 0, 1000, 800);
            socket.emit("clear-canvas", { roomId });
          }}
          className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          Clear Board
        </Button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={1000}
          height={800}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={() => (isDrawing.current = false)}
          onMouseLeave={() => (isDrawing.current = false)}
          className="absolute top-0 left-0 w-full h-full touch-none"
        />
      </div>
    </div>
  );
}
