"use client";

import { useState, useEffect } from "react";
import { Card, cn } from "@/components/ui/design-system";
import { Type, PenTool } from "lucide-react";
import { CanvasBoard } from "./canvas-board";

export function Room({ socket, roomId, textContent, setTextContent }) {
  const [view, setView] = useState("text");
  const [color, setColor] = useState("#000000");

  // Text Sync Listener
  useEffect(() => {
    if (!socket) return;
    const handleTextUpdate = (content) => setTextContent(content);
    socket.on("text-update", handleTextUpdate);
    return () => socket.off("text-update", handleTextUpdate);
  }, [socket, setTextContent]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setTextContent(val);
    socket.emit("text-update", { roomId, content: val });
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* View Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-muted p-1 rounded-lg inline-flex shadow-inner border border-border">
          <button
            onClick={() => setView("text")}
            className={cn(
              "px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              view === "text"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Type size={16} /> Text
          </button>
          <button
            onClick={() => setView("draw")}
            className={cn(
              "px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              view === "draw"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <PenTool size={16} /> Draw
          </button>
        </div>
      </div>

      {/* Workspace */}
      <Card className="flex-1 overflow-hidden relative shadow-lg border-border bg-card">
        {/* Text View */}
        <div
          className={cn(
            "absolute inset-0 bg-card z-10 transition-opacity duration-300",
            view === "text"
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          <textarea
            value={textContent}
            onChange={handleTextChange}
            className="w-full h-full p-8 resize-none focus:outline-none font-mono text-lg leading-relaxed text-foreground bg-transparent"
            placeholder="Type here to sync with the room..."
          />
        </div>

        {/* Canvas View */}
        <div
          className={cn(
            "absolute inset-0 z-0",
            view === "draw" ? "opacity-100" : "opacity-0"
          )}
        >
          <CanvasBoard
            socket={socket}
            roomId={roomId}
            color={color}
            setColor={setColor}
          />
        </div>
      </Card>
    </div>
  );
}
