"use client";

import { Button, Input, Card } from "@/components/ui/design-system";
import { Users, QrCode } from "lucide-react";

export function Lobby({
  username,
  setUsername,
  joinCode,
  setJoinCode,
  textContent,
  setTextContent,
  onCreateRoom,
  onJoinRoom,
}) {
  return (
    <div className="flex-1 flex flex-col md:flex-row gap-8 items-center justify-center">
      {/* Local Preview */}
      <div className="w-full md:w-1/2 h-[500px] relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <Card className="relative h-full flex flex-col overflow-hidden border-border bg-white dark:bg-zinc-950">
          {/* Header with macOS Buttons */}
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center gap-4 transition-colors">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/30" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/30" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/30" />
            </div>
            <span className="text-xs font-medium text-zinc-400 tracking-wide">
              LOCAL DRAFT
            </span>
          </div>

          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            // FIXED: Using !important classes to FORCE visibility
            // Light Mode: Dark Text | Dark Mode: White Text
            className="flex-1 w-full p-6 resize-none focus:outline-none bg-transparent font-mono text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 leading-relaxed z-10"
            placeholder="Start typing your ideas here..."
            spellCheck={false}
          />
        </Card>
      </div>

      {/* Actions */}
      <div className="w-full md:w-1/3 space-y-6">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold mb-2">Collaborate instantly.</h2>
          <p className="text-muted-foreground mb-6">
            Create a secure session or join one to sketch and write together.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Your Name
            </label>
            <Input
              placeholder="Enter your name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-card text-foreground border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button onClick={onCreateRoom} className="w-full">
              <QrCode size={16} className="mr-2" /> Create Room
            </Button>
            <div className="relative">
              <Input
                placeholder="CODE"
                className="text-center uppercase tracking-widest font-mono bg-card text-foreground border-border"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={onJoinRoom}
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            <Users size={16} className="mr-2" /> Join Session
          </Button>
        </div>
      </div>
    </div>
  );
}
