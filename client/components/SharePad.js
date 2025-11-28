"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "next-themes";
import { Button, cn } from "@/components/ui/design-system";
import { Copy, LogOut, Sun, Moon } from "lucide-react";
import { useSocket } from "@/hooks/use-socket";
import { Lobby } from "@/components/sharepad/lobby";
import { Room } from "@/components/sharepad/room";

export default function SharePad() {
  const { setTheme, theme } = useTheme();
  const { socket, joinRoom } = useSocket();

  const [status, setStatus] = useState("lobby"); // 'lobby' | 'joined'
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [textContent, setTextContent] = useState("");

  // Handlers
  const handleCreateRoom = () => {
    if (!username) return alert("Please enter a nickname");
    const newRoomId = uuidv4().slice(0, 6).toUpperCase();

    joinRoom(newRoomId, username);
    setRoomId(newRoomId);
    setStatus("joined");
  };

  const handleJoinRoom = () => {
    if (!username) return alert("Please enter a nickname");
    if (!joinCode) return alert("Please enter a Room ID");

    joinRoom(joinCode.toUpperCase(), username);
    setRoomId(joinCode.toUpperCase());
    setStatus("joined");
  };

  const handleLeave = () => {
    setStatus("lobby");
    setRoomId("");
    // Note: We don't clear textContent so you can keep working on your draft locally
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room Code copied!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-zinc-200 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background font-bold">
              S
            </div>
            <h1 className="text-xl font-bold tracking-tight">SharePad</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-full border border-border"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {status === "joined" && (
              <>
                <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border border-border shadow-sm">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Code:
                  </span>
                  <span className="font-mono font-bold">{roomId}</span>
                  <button
                    onClick={copyToClipboard}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleLeave}
                  className="h-9 text-xs"
                >
                  <LogOut size={14} className="mr-2" /> Leave
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Content Switcher */}
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
          {status === "lobby" ? (
            <Lobby
              username={username}
              setUsername={setUsername}
              joinCode={joinCode}
              setJoinCode={setJoinCode}
              textContent={textContent}
              setTextContent={setTextContent}
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
            />
          ) : (
            <Room
              socket={socket}
              roomId={roomId}
              textContent={textContent}
              setTextContent={setTextContent}
            />
          )}
        </div>
      </div>
    </div>
  );
}
