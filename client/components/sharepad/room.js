"use client";

import { useState, useEffect } from "react";
import { Card, cn } from "@/components/ui/design-system";
import { Type, PenTool } from "lucide-react";
import { CanvasBoard } from "./canvas-board";

export function Room({ socket, roomId, textContent, setTextContent }) {
  const [view, setView] = useState("text");
  const [color, setColor] = useState("#000000");

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
      <div className="flex justify-center mb-4">
        <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg inline-flex shadow-inner border border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => setView("text")}
            className={cn(
              "px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 border-2",
              view === "text"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm border-zinc-300 dark:border-zinc-500"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 border-transparent"
            )}
          >
            <Type size={16} /> Text
          </button>
          <button
            onClick={() => setView("draw")}
            className={cn(
              "px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 border-2",
              view === "draw"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm border-zinc-300 dark:border-zinc-500"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 border-transparent"
            )}
          >
            <PenTool size={16} /> Draw
          </button>
        </div>
      </div>

      <Card
        className={cn(
          "flex-1 overflow-hidden relative border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950",
          // FIX: Explicitly handle shadows for the main canvas card
          "shadow-lg dark:shadow-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-white dark:bg-zinc-950 z-10 transition-opacity duration-300",
            view === "text"
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          <textarea
            value={textContent}
            onChange={handleTextChange}
            className="w-full h-full p-8 resize-none focus:outline-none font-mono text-lg leading-relaxed text-zinc-800 dark:text-zinc-200 bg-transparent"
            placeholder="Type here to sync with the room..."
          />
        </div>

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
