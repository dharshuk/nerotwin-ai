import React, { useRef, useState, useEffect } from 'react';
import { Pencil, RotateCcw } from 'lucide-react';

/**
 * DrawingPad Component
 * Canvas for drawing spiral or straight line for motor control assessment
 */
const DrawingPad = ({ onComplete, isActive }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingData, setDrawingData] = useState([]);
  const [testType, setTestType] = useState('spiral'); // spiral or line

  useEffect(() => {
    if (isActive) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // Draw template
        drawTemplate(ctx);
      }
    }
  }, [isActive, testType]);

  const drawTemplate = (ctx) => {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    if (testType === 'spiral') {
      // Draw spiral template
      const centerX = 250;
      const centerY = 200;
      ctx.beginPath();
      for (let i = 0; i < 720; i++) {
        const angle = 0.1 * i;
        const x = centerX + (1 + angle * 0.3) * Math.cos(angle);
        const y = centerY + (1 + angle * 0.3) * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else {
      // Draw straight line template
      ctx.beginPath();
      ctx.moveTo(50, 200);
      ctx.lineTo(450, 200);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    setDrawingData([{ x, y, timestamp: Date.now() }]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setDrawingData(prev => [...prev, { x, y, timestamp: Date.now() }]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTemplate(ctx);
    setDrawingData([]);
  };

  const submitDrawing = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      onComplete({ 
        drawingBlob: blob, 
        drawingData,
        testType 
      });
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Pencil className="text-purple-600" />
        Drawing Test
      </h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTestType('spiral')}
          className={`px-4 py-2 rounded-lg ${testType === 'spiral' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Spiral
        </button>
        <button
          onClick={() => setTestType('line')}
          className={`px-4 py-2 rounded-lg ${testType === 'line' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          Straight Line
        </button>
      </div>

      <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-4">
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          className="cursor-crosshair bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={clearCanvas}
          className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          Clear
        </button>
        <button
          onClick={submitDrawing}
          disabled={drawingData.length === 0}
          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Submit Drawing
        </button>
      </div>

      <p className="text-sm text-gray-600 mt-3">
        {testType === 'spiral' ? 'Trace the spiral pattern' : 'Draw a straight line between the endpoints'}
      </p>
    </div>
  );
};

export default DrawingPad;
