# 🔧 Developer Reference - Image Crop Feature

## Architecture Overview

### Component Tree
```
ProductFormPage (state: uploadedImages)
  └── ImageCropUploader
      ├── File input (hidden)
      ├── Drag-drop zone
      ├── Error display (if any)
      ├── Image list
      │   └── Image item (map)
      └── CropModal (conditional render)
          ├── Canvas element
          └── Control buttons
```

### State Management
```
ProductFormPage
  uploadedImages: [ImageObject, ...]
  
ImageCropUploader
  images: [ImageObject, ...]
  selectedImageForCrop: ImageObject | null
  currentCropFile: ImageObject | null
  isProcessing: boolean
  errors: string[]
  dragActive: boolean
  mainImageIndex: number
```

---

## API Reference

### ImageCropUploader Props

```typescript
interface ImageCropUploaderProps {
  // Callback fired when images are selected/processed
  onImagesSelected?: (images: ImageObject[]) => void;
  
  // Maximum number of images allowed
  maxImages?: number; // default: 5
  
  // Crop aspect ratio
  cropRatio?: {
    label: string;  // e.g. "4:3 (Card)"
    ratio: number;  // e.g. 4/3
  };
  
  // Allow multiple image uploads
  allowMultiple?: boolean; // default: true
}
```

### ImageObject Structure

```typescript
interface ImageObject {
  id: string | number;
  file: File;                // Original file
  previewUrl: string;        // data:image/... original preview
  croppedUrl: string | null; // data:image/... cropped preview
  croppedBlob: Blob | null;  // Binary cropped data
  metadata: {
    originalSize: number;     // File size in bytes
    compressedSize?: number;  // After compression
    originalName: string;
    originalType: string;
    width: number;            // Original image width
    height: number;           // Original image height
    croppedWidth?: number;    // After crop
    croppedHeight?: number;   // After crop
    compressionRatio?: string; // "82%"
  };
}
```

### CropModal Props

```typescript
interface CropModalProps {
  // Data URL of the image to crop
  imageDataUrl: string;
  
  // Callback when crop is applied
  onCropApply: (result: CropResult) => void;
  
  // Callback when crop is cancelled
  onCancel: () => void;
  
  // Aspect ratio for cropping
  aspectRatio: {
    label: string;
    ratio: number;
  };
}

interface CropResult {
  blob: Blob;     // Binary cropped image
  dataUrl: string; // data:image/... URL
  width: number;  // Cropped dimensions
  height: number;
}
```

---

## Utility Functions Reference

### imageValidation.js

```javascript
// Validate a file
validateImageFile(file: File): {
  valid: boolean;
  errors: string[];
}

// Validate image dimensions
validateImageDimensions(img: HTMLImageElement): {
  valid: boolean;
  errors: string[];
}

// Get file info
getImageInfo(file: File): {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// Format file size for display
getFileSizeLabel(bytes: number): string;
```

**Configuration:**
```javascript
ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
MIN_DIMENSION = 200 // pixels
```

### cropImage.js

```javascript
// Aspect ratio presets
CROP_RATIOS = {
  SQUARE: { label: '1:1 (Square)', ratio: 1 },
  CARD: { label: '4:3 (Card)', ratio: 4/3 },
  BANNER: { label: '16:9 (Banner)', ratio: 16/9 }
}

// Load image from file
loadImageFromFile(file: File): Promise<HTMLImageElement>

// Crop image to specified area
cropImage(
  img: HTMLImageElement,
  cropData: { x, y, width, height },
  targetWidth: number = 600
): Promise<{
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
}>

// Rotate image
rotateImage(img: HTMLImageElement, angle: number): HTMLImageElement

// Calculate crop area maintaining aspect ratio
calculateCropArea(
  imgWidth: number,
  imgHeight: number,
  ratio: number
): { x, y, width, height }

// Draw crop preview on canvas
drawCropPreview(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  cropData: { x, y, width, height },
  scale: number,
  offsetX: number,
  offsetY: number,
  rotation: number
): void

// Get actual crop coordinates considering transformations
getActualCropCoordinates(
  canvasWidth: number,
  canvasHeight: number,
  imgWidth: number,
  imgHeight: number,
  cropData: { x, y, width, height },
  scale: number,
  offsetX: number,
  offsetY: number,
  rotation: number
): { x, y, width, height }
```

### compressImage.js

```javascript
// Quality presets
COMPRESSION_QUALITY = {
  HIGH: 0.95,
  MEDIUM: 0.85,
  LOW: 0.75
}

// Size limits
MAX_IMAGE_WIDTH = 1200
MAX_IMAGE_HEIGHT = 1200

// Compress single image
compressImage(
  file: File,
  quality: number = 0.85,
  maxWidth: number = 1200,
  maxHeight: number = 1200
): Promise<{
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  compressionRatio: string;
}>

// Compress multiple images
compressMultipleImages(
  files: File[],
  quality: number = 0.85
): Promise<CompressionResult[]>

// Create thumbnail
createThumbnail(
  dataUrl: string,
  size: number = 150
): Promise<{
  blob: Blob;
  dataUrl: string;
}>

// Format file size for display
formatFileSize(bytes: number): string
```

---

## Customization Guide

### Change Crop Aspect Ratio

**Current (4:3 for product cards):**
```jsx
<ImageCropUploader
  cropRatio={CROP_RATIOS.CARD}
/>
```

**For squares (1:1):**
```jsx
<ImageCropUploader
  cropRatio={CROP_RATIOS.SQUARE}
/>
```

**For custom ratio (e.g., 3:2):**
```jsx
<ImageCropUploader
  cropRatio={{ label: '3:2 (Custom)', ratio: 3/2 }}
/>
```

### Change Compression Quality

**In compressImage.js:**
```javascript
// Default is MEDIUM (0.85)
// Change in ImageCropUploader handleCropApply():

const compressed = await compressImage(file, 0.95); // HIGH quality
// or
const compressed = await compressImage(file, 0.75); // LOW quality
```

### Increase Max Images

**In ProductFormPage or where used:**
```jsx
<ImageCropUploader
  maxImages={10}  // Instead of 5
/>
```

### Disable Cropping

To skip crop modal and use uploaded images as-is:
```jsx
// In ImageCropUploader, modify handleFiles():
// Remove: setCurrentCropFile(newImages[0]);
// Remove: setSelectedImageForCrop(newImages[0].previewUrl);
// Add: setImages([...newImages]);
```

### Custom Error Messages

**In imageValidation.js:**
```javascript
export const validateImageFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push('Custom: Please select an image'); // Change this
  }

  // ... rest of validation
};
```

### Add Image Filters

**Extend CropModal with new buttons:**
```jsx
// In CropModal.jsx, add new handler:
const handleBrightness = (amount) => {
  // Use canvas filter API
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  ctx.filter = `brightness(${amount}%)`;
  ctx.drawImage(img, 0, 0);
};

// Add button in JSX:
<button onClick={() => handleBrightness(120)}>Brighten</button>
```

### Add Preset Crop Sizes

**In CropModal.jsx:**
```jsx
// Add to state:
const [presetSize, setPresetSize] = useState('auto');

// Add buttons:
<button onClick={() => {
  // Set to Instagram square
  setCropData(calculateCropArea(img.width, img.height, 1));
}}>
  Instagram (1:1)
</button>
```

### Add Image Reordering

**In ImageCropUploader.jsx:**
```jsx
// Add drag handler:
const handleReorderStart = (id) => {
  setDraggedImageId(id);
};

const handleReorderDrop = (targetId) => {
  // Swap positions in array
  const draggedIndex = images.findIndex(img => img.id === draggedImageId);
  const targetIndex = images.findIndex(img => img.id === targetId);
  
  const newImages = [...images];
  [newImages[draggedIndex], newImages[targetIndex]] = 
  [newImages[targetIndex], newImages[draggedIndex]];
  
  setImages(newImages);
};

// Add in JSX with onDragStart, onDragOver, onDrop handlers
```

---

## Performance Optimization

### Current Optimizations
- Canvas-based cropping (no server calls)
- 85% compression by default (70-80% size reduction)
- Automatic object URL cleanup
- Lazy image loading
- Minimal re-renders with React

### Further Optimization

**Use Web Workers for compression:**
```javascript
// Create worker-compress.js
self.onmessage = (e) => {
  const { file, quality } = e.data;
  compressImage(file, quality).then(result => {
    self.postMessage(result);
  });
};

// Use in compressImage.js
const worker = new Worker('worker-compress.js');
```

**Implement Service Worker caching:**
```javascript
// Cache compressed images
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
```

**Progressive image loading:**
```jsx
// Show blur-up while loading
<img src={blurredPreview} />
<img src={fullImage} onLoad={() => setLoaded(true)} />
```

---

## Browser Compatibility

### Required APIs
- **Canvas API**: For image manipulation
- **FileReader API**: For file reading
- **Blob API**: For image compression
- **Promise API**: For async operations
- **Modern JS**: ES6+ features

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Polyfills Needed
- Blob: None (widely supported)
- Promise: Include if supporting IE11
- Object URL: None (widely supported)

---

## Testing

### Unit Tests Example

```javascript
// imageValidation.test.js
describe('imageValidation', () => {
  test('validates correct file', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  test('rejects invalid type', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid file type');
  });
});
```

### Integration Tests

```javascript
// ImageCropUploader.test.jsx
describe('ImageCropUploader', () => {
  test('opens crop modal on image select', async () => {
    const { getByText } = render(<ImageCropUploader />);
    const input = screen.getByDisplayValue(/choose files/i);
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText(/crop image/i)).toBeInTheDocument();
    });
  });
});
```

---

## Debugging Tips

### Enable Console Logging

```javascript
// In ImageCropUploader.jsx, add debug logs:
console.log('Files selected:', filesToProcess);
console.log('Validation:', validation);
console.log('Cropped image:', result);
```

### Debug Canvas Drawing

```javascript
// In CropModal.jsx, add visual debug:
// Draw grid on canvas to verify positioning
ctx.strokeStyle = '#FF0000';
ctx.lineWidth = 1;
for (let i = 0; i < canvas.width; i += 50) {
  ctx.beginPath();
  ctx.moveTo(i, 0);
  ctx.lineTo(i, canvas.height);
  ctx.stroke();
}
```

### Monitor File Sizes

```javascript
// Add to handleCropApply:
console.log('Before compression:', file.size);
console.log('After compression:', compressed.blob.size);
console.log('Ratio:', `${((1 - compressed.blob.size/file.size)*100).toFixed(2)}%`);
```

---

## Common Issues & Solutions

### Issue: Crop modal doesn't open
**Solution**: Check that image loaded successfully (check console for errors)

### Issue: Cropped image is black
**Solution**: Ensure canvas context is properly initialized

### Issue: Zoom not working
**Solution**: Check that wheel event listener is attached correctly

### Issue: Large file sizes
**Solution**: Reduce quality parameter or max dimensions

### Issue: Memory leaks
**Solution**: Ensure object URLs are revoked with URL.revokeObjectURL()

---

## Extending the Feature

### Add Filters Plugin System

```javascript
// Create filters/brightness.js
export const applyBrightness = (imageData, amount) => {
  // Manipulate pixel data
  return modifiedImageData;
};

// Use in component
import { applyBrightness } from '../filters/brightness.js';
```

### Add Cloud Upload

```javascript
// Extend ImageCropUploader
const uploadToCloud = async (blob) => {
  const formData = new FormData();
  formData.append('image', blob);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

### Add Batch Processing

```javascript
// Process multiple images in parallel
const processBatch = async (files) => {
  return Promise.all(
    files.map(file => compressImage(file))
  );
};
```

---

## Version History

### v1.0 (Current)
- Basic image upload and crop
- Multi-image support
- Automatic compression
- Mobile-friendly interface
- Error handling and validation

### v1.1 (Planned)
- Image filters
- Reorder images with drag-drop
- Firebase Storage integration
- Advanced compression options

### v2.0 (Future)
- Image effects (blur, sepia, etc.)
- Cloud processing service
- Batch operations
- Advanced compression settings

---

## Contributing Guidelines

To extend this feature:

1. **Maintain Structure**: Keep utilities and components separated
2. **Document Changes**: Add JSDoc comments
3. **Test Thoroughly**: Test on mobile and desktop
4. **Handle Errors**: Provide user-friendly error messages
5. **Optimize Performance**: Use efficient algorithms
6. **Keep Simple**: Avoid unnecessary complexity

---

## Resources

### Documentation
- IMAGE_CROP_FEATURE.md - Full feature documentation
- This file - Developer reference
- Component JSDoc - Code comments

### Related Files
- src/components/ImageCropUploader.jsx
- src/components/CropModal.jsx
- src/utils/imageValidation.js
- src/utils/cropImage.js
- src/utils/compressImage.js

### External Resources
- Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- FileReader API: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
- Blob API: https://developer.mozilla.org/en-US/docs/Web/API/Blob

---

## License & Usage

This feature is part of FarmPrice India and follows the same license terms.
Feel free to modify and extend for your needs.

**Remember**: Always test thoroughly before deploying to production!
