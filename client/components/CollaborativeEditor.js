'use client';

import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export default function CollaborativeEditor() {
  const socketRef = useRef(null);
  const canvasRef = useRef(null);
  const [text, setText] = useState('');
  const [color, setColor] = useState('#000000');
  
  // Drawing state
  const isDrawing = useRef(false);
  const prevPoint = useRef(null);

  useEffect(() => {
    // 1. Initialize Socket - CONNECTING TO BACKEND PORT 3001
    socketRef.current = io('http://localhost:3001');

    // 2. Incoming Text Listener
    socketRef.current.on('text-update', (newText) => {
      setText(newText);
    });

    // 3. Incoming Draw Listener
    socketRef.current.on('draw-line', ({ prevPoint, currentPoint, color }) => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) drawLine(ctx, prevPoint, currentPoint, color);
    });

    // 4. Incoming Clear Listener
    socketRef.current.on('clear-canvas', () => {
      clearCanvasLocal();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // --- Drawing Logic ---
  
  const drawLine = (ctx, start, end, strokeColor) => {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = strokeColor;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  };

  const computePointInCanvas = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    prevPoint.current = computePointInCanvas(e);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    
    const currentPoint = computePointInCanvas(e);
    const ctx = canvasRef.current.getContext('2d');
    
    // Draw locally
    drawLine(ctx, prevPoint.current, currentPoint, color);

    // Emit to others
    socketRef.current.emit('draw-line', {
      prevPoint: prevPoint.current,
      currentPoint,
      color
    });

    prevPoint.current = currentPoint;
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    prevPoint.current = null;
  };

  const handleClear = () => {
    clearCanvasLocal();
    socketRef.current.emit('clear-canvas');
  };

  const clearCanvasLocal = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // --- Text Logic ---

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    socketRef.current.emit('text-update', newText);
  };

  return (
    <div className="flex h-full flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
      
      {/* Left Panel: Text Editor */}
      <div className="w-full md:w-1/2 p-4 flex flex-col bg-white">
        <h2 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
          Editor
        </h2>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Start typing to collaborate..."
          className="flex-1 w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none bg-gray-50 text-gray-800 font-mono"
        />
      </div>

      {/* Right Panel: Canvas */}
      <div className="w-full md:w-1/2 flex flex-col bg-white">
        
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-gray-50">
          <div className="flex gap-2">
            {['#000000', '#EF4444', '#3B82F6', '#10B981'].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 ${
                  color === c ? 'border-gray-600 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <button 
            onClick={handleClear}
            className="text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors"
          >
            Clear Board
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative cursor-crosshair overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800} 
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="absolute top-0 left-0 w-full h-full touch-none"
          />
        </div>
      </div>
    </div>
  );
}