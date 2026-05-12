import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, GripVertical } from 'lucide-react';
import CropModal from './CropModal.jsx';
import { validateImageFile, getFileSizeLabel, validateImageDimensions } from '../utils/imageValidation.js';
import { CROP_RATIOS, loadImageFromFile } from '../utils/cropImage.js';
import { compressImage, formatFileSize } from '../utils/compressImage.js';

export default function ImageCropUploader({ 
  onImagesSelected = () => {},
  maxImages = 5,
  cropRatio = CROP_RATIOS.CARD,
  allowMultiple = true
}) {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [selectedImageForCrop, setSelectedImageForCrop] = useState(null);
  const [currentCropFile, setCurrentCropFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = async (files) => {
    setErrors([]);
    const newImages = [];
    const newErrors = [];

    const filesToProcess = allowMultiple
      ? Array.from(files).slice(0, maxImages - images.length)
      : Array.from(files).slice(0, 1);

    for (const file of filesToProcess) {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        newErrors.push(`${file.name}: ${validation.errors.join(', ')}`);
        continue;
      }

      try {
        // Load image to validate dimensions
        const img = await loadImageFromFile(file);
        const dimValidation = validateImageDimensions(img);
        if (!dimValidation.valid) {
          newErrors.push(`${file.name}: ${dimValidation.errors.join(', ')}`);
          continue;
        }

        // Store file for cropping
        newImages.push({
          id: Date.now() + Math.random(),
          file,
          previewUrl: URL.createObjectURL(file),
          croppedUrl: null,
          croppedBlob: null,
          metadata: {
            originalSize: file.size,
            originalName: file.name,
            originalType: file.type,
            width: img.width,
            height: img.height
          }
        });
      } catch (error) {
        newErrors.push(`${file.name}: ${error.message}`);
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
    }

    if (newImages.length > 0) {
      // Start cropping the first new image
      setCurrentCropFile(newImages[0]);
      setSelectedImageForCrop(newImages[0].previewUrl);
      // Store remaining images
      if (newImages.length > 1) {
        setImages((prev) => [...prev, ...newImages.slice(1)]);
      }
    }
  };

  const handleCropApply = async (cropResult) => {
    if (!currentCropFile) return;

    setIsProcessing(true);
    try {
      // Compress the cropped image
      const blob = cropResult.blob;
      const file = new File([blob], currentCropFile.metadata.originalName, {
        type: 'image/jpeg'
      });

      const compressed = await compressImage(file, 0.85);

      // Create thumbnail
      const croppedImage = {
        ...currentCropFile,
        croppedUrl: compressed.dataUrl,
        croppedBlob: compressed.blob,
        metadata: {
          ...currentCropFile.metadata,
          croppedWidth: cropResult.width,
          croppedHeight: cropResult.height,
          compressedSize: compressed.compressedSize,
          compressionRatio: compressed.compressionRatio
        }
      };

      const updatedImages = [...images, croppedImage];
      setImages(updatedImages);
      onImagesSelected(updatedImages);

      // Reset crop state
      setSelectedImageForCrop(null);
      setCurrentCropFile(null);
    } catch (error) {
      setErrors([...errors, `Failed to process image: ${error.message}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCropCancel = () => {
    setSelectedImageForCrop(null);
    setCurrentCropFile(null);
  };

  const handleRemoveImage = (id) => {
    const updatedImages = images.filter((img) => img.id !== id);
    setImages(updatedImages);
    onImagesSelected(updatedImages);

    // Adjust main image index if needed
    if (mainImageIndex >= updatedImages.length && updatedImages.length > 0) {
      setMainImageIndex(updatedImages.length - 1);
    }
  };

  const handleSetMainImage = (index) => {
    setMainImageIndex(index);
  };

  const handleReplaceImage = (id) => {
    const imageToReplace = images.find((img) => img.id === id);
    if (imageToReplace) {
      setCurrentCropFile(imageToReplace);
      setSelectedImageForCrop(imageToReplace.previewUrl);
    }
  };

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
          <p className="font-semibold text-red-900 dark:text-red-100">Upload errors:</p>
          <ul className="mt-2 space-y-1">
            {errors.map((error, idx) => (
              <li key={idx} className="text-sm text-red-800 dark:text-red-200">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
            dragActive
              ? 'border-farmgreen bg-farmgreen/10'
              : 'border-farmsoil bg-farmsoil/30 hover:border-farmgreen'
          } dark:border-slate-600 dark:bg-slate-800/50`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={allowMultiple}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-farmgreen/20 p-3">
              <Upload size={24} className="text-farmgreen" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-sm text-farmgray">
                JPG, PNG, WebP • Max {maxImages} images • Max 10MB each
              </p>
            </div>
            <button
              onClick={handleAddMore}
              className="mt-2 rounded-2xl bg-farmgreen px-4 py-2 text-sm font-semibold text-white transition hover:bg-farmleaf"
            >
              Choose Files
            </button>
          </div>
        </div>
      )}

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              Images ({images.length}/{maxImages})
            </p>
            {images.length < maxImages && (
              <button
                onClick={handleAddMore}
                className="inline-flex items-center gap-2 rounded-2xl bg-farmsoil px-3 py-1 text-sm font-medium text-farmgreen transition hover:bg-farmsoil/80 dark:bg-slate-800"
              >
                <Upload size={16} /> Add More
              </button>
            )}
          </div>

          <div className="space-y-2">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                  mainImageIndex === index
                    ? 'border-farmgreen bg-farmgreen/10 dark:bg-farmgreen/5'
                    : 'border-farmsoil dark:border-slate-700'
                }`}
              >
                {/* Drag Handle */}
                <GripVertical size={18} className="flex-shrink-0 text-farmgray" />

                {/* Image Thumbnail */}
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-farmsoil">
                  <img
                    src={image.croppedUrl || image.previewUrl}
                    alt="Upload preview"
                    className="h-full w-full object-cover"
                  />
                  {mainImageIndex === index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="text-xs font-bold text-white">MAIN</span>
                    </div>
                  )}
                </div>

                {/* Image Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {image.metadata.originalName}
                  </p>
                  <p className="text-xs text-farmgray">
                    {image.metadata.width}x{image.metadata.height}px •{' '}
                    {formatFileSize(image.metadata.compressedSize || image.metadata.originalSize)}
                  </p>
                  {image.croppedUrl && (
                    <p className="text-xs text-farmgreen font-medium">✓ Cropped</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 gap-2">
                  {!image.croppedUrl && (
                    <button
                      onClick={() => handleReplaceImage(image.id)}
                      className="rounded-lg bg-farmsoil px-2 py-1 text-xs font-medium text-farmgreen transition hover:bg-farmsoil/80 dark:bg-slate-800"
                      title="Crop this image"
                    >
                      Crop
                    </button>
                  )}

                  {mainImageIndex !== index && (
                    <button
                      onClick={() => handleSetMainImage(index)}
                      className="rounded-lg bg-farmsoil px-2 py-1 text-xs font-medium text-slate-600 transition hover:bg-farmsoil/80 dark:bg-slate-800 dark:text-slate-400"
                      title="Set as main image"
                    >
                      Main
                    </button>
                  )}

                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    className="rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-400"
                    title="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && errors.length === 0 && (
        <div className="text-center text-farmgray">
          <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No images uploaded yet. Start by uploading an image above.</p>
        </div>
      )}

      {/* Crop Modal */}
      {selectedImageForCrop && (
        <CropModal
          imageDataUrl={selectedImageForCrop}
          onCropApply={handleCropApply}
          onCancel={handleCropCancel}
          aspectRatio={cropRatio}
        />
      )}
    </div>
  );
}
