import React, { useRef, useEffect, useState } from 'react';

interface SignaturePadProps {
    onSave: (signatureDataUrl: string) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSigned, setHasSigned] = useState(false);
    const currentDate = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    const getCoords = (event: MouseEvent | TouchEvent): { x: number; y: number } | null => {
        if (!canvasRef.current) return null;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        if (event instanceof MouseEvent) {
            return { x: event.clientX - rect.left, y: event.clientY - rect.top };
        }
        if (event.touches && event.touches.length > 0) {
            return { x: event.touches[0].clientX - rect.left, y: event.touches[0].clientY - rect.top };
        }
        return null;
    };

    const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const coords = getCoords(event.nativeEvent);
        if (coords) {
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(coords.x, coords.y);
                setIsDrawing(true);
                setHasSigned(true);
            }
        }
    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        event.preventDefault(); // Prevent scrolling on touch devices
        const coords = getCoords(event.nativeEvent);
        if (coords) {
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
                ctx.lineTo(coords.x, coords.y);
                ctx.stroke();
            }
        }
    };

    const stopDrawing = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.closePath();
            setIsDrawing(false);
        }
    };
    
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setHasSigned(false);
            }
        }
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            // Draw the date on the canvas before saving
            const ctx = canvas.getContext('2d');
            if(ctx) {
                ctx.font = '14px Inter, sans-serif';
                ctx.fillStyle = '#94a3b8'; // slate-400
                ctx.textAlign = 'right';
                ctx.fillText(currentDate, canvas.width - 10, canvas.height - 10);
            }
            const dataUrl = canvas.toDataURL('image/png');
            onSave(dataUrl);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            // Set canvas size based on its container to avoid distortion
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;

            if (ctx) {
                ctx.strokeStyle = '#f1f5f9'; // slate-100
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
            }
        }
    }, []);

    return (
        <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
            <div className="relative w-full aspect-[2/1] border border-slate-600 rounded-md cursor-crosshair bg-slate-700 touch-none">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full"
                />
                <p className="absolute bottom-2 right-3 text-sm text-slate-400 pointer-events-none">{currentDate}</p>
                 {!hasSigned && <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">Firme aquí</p>}
            </div>
            <div className="flex space-x-4 mt-6">
                <button
                    onClick={clearCanvas}
                    className="w-full bg-slate-600 text-slate-100 font-bold py-2 px-4 rounded-md hover:bg-slate-500 transition"
                >
                    Limpiar
                </button>
                <button
                    onClick={handleSave}
                    disabled={!hasSigned}
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    Guardar Firma
                </button>
            </div>
        </div>
    );
};

export default SignaturePad;