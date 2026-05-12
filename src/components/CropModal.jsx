import { useState, useRef, useEffect } from 'react';
import { RotateCw, RotateCcw, RotateCcwIcon, RefreshCw, X, Check } from 'lucide-react';
import { CROP_RATIOS, drawCropPreview, calculateCropArea, getActualCropCoordinates, cropImage } from '../utils/cropImage.js';

export default function CropModal({ 
  imageDataUrl, 
  onCropApply, 
  onCancel,
  aspectRatio = CROP_RATIOS.SQUARE
}) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [img, setImg] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load image on mount
  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setImg(image);
      const initialCrop = calculateCropArea(image.width, image.height, aspectRatio.ratio);
      setCropData(initialCrop);
      setScale(1);
      setOffsetX(0);
      setOffsetY(0);
    };
    image.onerror = () => alert('Failed to load image');
    image.src = imageDataUrl;
  }, [imageDataUrl, aspectRatio]);

  // Draw preview
  useEffect(() => {
    if (!canvasRef.current || !img || !cropData) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    drawCropPreview(canvas, img, cropData, scale, offsetX, offsetY, rotation);
  }, [img, cropData, scale, offsetX, offsetY, rotation]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setOffsetX((prev) => prev + deltaX);
    setOffsetY((prev) => prev + deltaY);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
    setRotation(0);
  };

  const handleApplyCrop = async () => {
    if (!img || !cropData) return;

    setIsProcessing(true);
    try {
      // Get actual crop coordinates
      const actualCrop = getActualCropCoordinates(
        canvasRef.current.width,
        canvasRef.current.height,
        img.width,
        img.height,
        cropData,
        scale,
        offsetX,
        offsetY,
        rotation
      );

      // Crop the image
      const result = await cropImage(img, actualCrop);
      onCropApply(result);
    } catch (error) {
      alert('Error processing image: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!img) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl p-6 dark:bg-slate-900">
          <p className="text-slate-900 dark:text-slate-100">Loading image...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col bg-black/50 p-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col rounded-2xl bg-white shadow-lg dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-farmsoil p-4 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Crop Image ({aspectRatio.label})
          </h2>
          <button
            onClick={onCancel}
            className="rounded-full p-2 transition hover:bg-farmsoil dark:hover:bg-slate-800"
          >
            <X size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="h-full w-full cursor-move bg-black"
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
          />
        </div>

        {/* Controls */}
        <div className="border-t border-farmsoil p-4 dark:border-slate-700">
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <button
              onClick={handleRotateLeft}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-farmsoil px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-farmsoil/80 dark:bg-slate-800 dark:text-slate-100"
              title="Rotate left (Ctrl+L)"
            >
              <RotateCcw size={18} /> Rotate Left
            </button>

            <button
              onClick={handleRotateRight}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-farmsoil px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-farmsoil/80 dark:bg-slate-800 dark:text-slate-100"
              title="Rotate right (Ctrl+R)"
            >
              <RotateCw size={18} /> Rotate Right
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-farmsoil px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-farmsoil/80 dark:bg-slate-800 dark:text-slate-100"
              title="Reset to original"
            >
              <RefreshCw size={18} /> Reset
            </button>

            <div className="flex items-center justify-center rounded-2xl bg-farmsoil px-3 py-2 dark:bg-slate-800">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Zoom: {(scale * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Zoom Slider */}
          <div className="mb-4">
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="h-2 w-full rounded-lg bg-farmsoil accent-farmgreen dark:bg-slate-700"
              title="Zoom (scroll wheel also works)"
            />
            <p className="mt-2 text-xs text-farmgray">
              Drag to move • Scroll to zoom • Click buttons to rotate
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 rounded-2xl border border-farmsoil px-4 py-3 font-semibold text-farmgray transition hover:bg-farmsoil disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyCrop}
              disabled={isProcessing}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-farmgreen px-4 py-3 font-semibold text-white transition hover:bg-farmleaf disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <Check size={18} /> Apply Crop
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
