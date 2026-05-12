# Image Upload & Crop Feature Documentation

## Overview

The FarmPrice India app now includes a complete image upload and crop feature that allows farmers to upload product images, crop them to the optimal size, and automatically compress them for fast loading.

## Features

### ✅ Image Upload
- **Drag & Drop Support**: Farmers can drag images directly into the upload area
- **File Browser**: Click to browse and select images from device
- **Multi-image Support**: Upload up to 5 images per product
- **Validation**: Automatic validation of file type, size, and dimensions

### ✅ Image Crop
- **Interactive Crop Modal**: Beautiful, mobile-friendly crop interface
- **Multiple Aspect Ratios**:
  - 1:1 (Square) - for thumbnails
  - 4:3 (Card) - default for product cards
  - 16:9 (Banner) - optional for featured images
- **Zoom & Pan**: Scroll to zoom, drag to reposition
- **Rotate**: Rotate left/right in 90° increments
- **Reset**: Quick reset to original state
- **Real-time Preview**: See crop area in real-time

### ✅ Image Compression
- **Automatic Compression**: Images are compressed after cropping (85% quality)
- **File Size Reduction**: Significant reduction for faster loading
- **Quality Preserved**: Maintains visual quality while reducing file size
- **Responsive Sizing**: Automatically resizes based on device

### ✅ Image Management
- **Main Image Selection**: Set one image as the main/cover image
- **Image Reordering**: Drag to reorder images (future feature)
- **Remove Images**: Delete unwanted images easily
- **Image Info Display**: Shows dimensions, file size, compression status
- **Fallback Images**: Shows placeholder if crop is needed

## Component Architecture

### Components

#### 1. **ImageCropUploader** (`src/components/ImageCropUploader.jsx`)
Main component that handles the entire upload and crop workflow.

**Props:**
```javascript
{
  onImagesSelected: Function,        // Callback when images are processed
  maxImages: Number,                 // Maximum images allowed (default: 5)
  cropRatio: Object,                 // Crop aspect ratio (from CROP_RATIOS)
  allowMultiple: Boolean             // Allow multiple uploads (default: true)
}
```

**Usage:**
```jsx
import ImageCropUploader from '../components/ImageCropUploader.jsx';
import { CROP_RATIOS } from '../utils/cropImage.js';

<ImageCropUploader
  onImagesSelected={(images) => console.log(images)}
  maxImages={5}
  cropRatio={CROP_RATIOS.CARD}
  allowMultiple={true}
/>
```

**Returns (via callback):**
```javascript
[
  {
    id: 'unique-id',
    file: File,                    // Original file
    previewUrl: 'data:image/...',  // Original preview
    croppedUrl: 'data:image/...',  // Cropped & compressed preview
    croppedBlob: Blob,            // Cropped image blob
    metadata: {
      originalSize: 2500000,
      compressedSize: 450000,
      originalName: 'photo.jpg',
      originalType: 'image/jpeg',
      width: 3000,
      height: 2250,
      croppedWidth: 800,
      croppedHeight: 600,
      compressionRatio: '82%'
    }
  }
]
```

#### 2. **CropModal** (`src/components/CropModal.jsx`)
Modal dialog that provides the interactive crop interface.

**Props:**
```javascript
{
  imageDataUrl: String,              // Data URL of image to crop
  onCropApply: Function,             // Callback when crop is applied
  onCancel: Function,                // Callback when crop is cancelled
  aspectRatio: Object                // Crop aspect ratio object
}
```

**Features:**
- Drag to pan image
- Scroll wheel to zoom
- Buttons to rotate left/right
- Reset to original state
- Real-time preview of crop area
- Processing state indicator

#### 3. **ImagePlaceholder** (`src/components/ImagePlaceholder.jsx`)
Fallback component shown when images fail to load.

**Usage:**
```jsx
import ImagePlaceholder from '../components/ImagePlaceholder.jsx';

<ImagePlaceholder 
  className="aspect-video" 
  iconSize={48}
/>
```

### Utilities

#### 1. **imageValidation.js** (`src/utils/imageValidation.js`)
File and image validation utilities.

**Functions:**
- `validateImageFile(file)` - Validates file type and size
- `validateImageDimensions(img)` - Ensures minimum dimensions (200x200px)
- `getImageInfo(file)` - Gets file metadata
- `getFileSizeLabel(bytes)` - Formats file size for display

**Constraints:**
- Allowed types: JPG, JPEG, PNG, WebP
- Max file size: 10MB
- Min dimensions: 200x200px

#### 2. **cropImage.js** (`src/utils/cropImage.js`)
Canvas-based image cropping and transformation utilities.

**Functions:**
- `loadImageFromFile(file)` - Loads image from file
- `cropImage(img, cropData, targetWidth)` - Crops image to specified area
- `rotateImage(img, angle)` - Rotates image (0, 90, 180, 270)
- `calculateCropArea(imgWidth, imgHeight, ratio)` - Calculates crop area
- `drawCropPreview(canvas, img, cropData, ...)` - Draws preview on canvas
- `getActualCropCoordinates(...)` - Calculates actual crop coordinates

**Crop Ratios:**
```javascript
CROP_RATIOS = {
  SQUARE: { label: '1:1 (Square)', ratio: 1 },
  CARD: { label: '4:3 (Card)', ratio: 4/3 },
  BANNER: { label: '16:9 (Banner)', ratio: 16/9 }
}
```

#### 3. **compressImage.js** (`src/utils/compressImage.js`)
Image compression and thumbnail generation utilities.

**Functions:**
- `compressImage(file, quality, maxWidth, maxHeight)` - Compresses image
- `compressMultipleImages(files, quality)` - Compresses multiple images
- `createThumbnail(dataUrl, size)` - Creates thumbnail
- `formatFileSize(bytes)` - Formats file size for display

**Quality Levels:**
```javascript
COMPRESSION_QUALITY = {
  HIGH: 0.95,
  MEDIUM: 0.85,    // Default
  LOW: 0.75
}
```

## Integration with Product Form

The `ProductFormPage.jsx` has been updated to use the new ImageCropUploader:

```jsx
import ImageCropUploader from '../components/ImageCropUploader.jsx';
import { CROP_RATIOS } from '../utils/cropImage.js';

export default function ProductFormPage() {
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleImagesSelected = (images) => {
    setUploadedImages(images);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Convert to image URLs
    const imageUrls = uploadedImages.map(img => img.croppedUrl || img.previewUrl);
    
    // Save product with images
    const productData = { ...form, images: imageUrls };
    await addProduct(productData);
  };

  return (
    <ImageCropUploader
      onImagesSelected={handleImagesSelected}
      maxImages={5}
      cropRatio={CROP_RATIOS.CARD}
      allowMultiple={true}
    />
  );
}
```

## User Workflow

### For Farmers Adding Products:

1. **Upload Images**
   - Click upload area or drag images
   - Select one or multiple images
   - Files are validated automatically

2. **Crop First Image**
   - Crop modal opens automatically for first image
   - Drag to pan, scroll to zoom
   - Click rotate buttons to adjust
   - Click "Apply Crop" to confirm

3. **Manage Images**
   - Add more images if needed
   - Click "Crop" button on uncropped images
   - Click "Main" to set as cover image
   - Click "×" to remove image

4. **Save Product**
   - Fill in product details
   - Cropped images are ready
   - Click "Save Product"
   - Images are stored with product metadata

## Mobile Experience

The feature is fully optimized for mobile devices:

- **Touch-friendly**: Large touch targets
- **Responsive Layout**: Adapts to screen size
- **Gesture Support**: Drag and zoom work with touch
- **Portrait Mode**: Optimized for phone portrait orientation
- **Efficient**: Minimal data usage with compression
- **Storage**: Base64 data URLs (not stored in file system)

## Image Data Flow

```
User Selection
    ↓
File Validation
    ↓
Image Loading
    ↓
Crop Modal Open
    ↓
User Adjusts & Crops
    ↓
Canvas Processing
    ↓
Compression (85% quality)
    ↓
Thumbnail Generation
    ↓
State Update & Display
    ↓
Save to Firebase Storage (when configured)
```

## Error Handling

The component provides user-friendly error messages for:

- **Invalid File Type**: "Invalid file type. Allowed types: JPG, PNG, WebP"
- **File Too Large**: "File size exceeds 10MB limit"
- **Invalid Dimensions**: "Image dimensions must be at least 200x200 pixels"
- **Processing Errors**: "Error processing image: [specific error]"

All errors are displayed in a prominent error box above the upload area.

## Performance Optimization

- **Lazy Loading**: Images only load when needed
- **Compression**: Automatic 85% compression reduces file size by ~70-80%
- **Canvas Processing**: Uses native canvas for fast cropping
- **Blob Storage**: Efficient binary format for storage
- **Cleanup**: Automatic cleanup of object URLs to prevent memory leaks

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Canvas API**: Required for cropping
- **FileReader API**: Required for file handling
- **Blob API**: Required for compression
- **Mobile Browsers**: Works on iOS Safari, Chrome Mobile

## Future Enhancements

Potential features for future versions:

- Drag to reorder images
- Filter/effect tools (brightness, contrast, etc.)
- Batch crop multiple images
- Image gallery lightbox
- Firebase Storage integration
- Advanced compression options
- WebP format support
- Image optimization service integration

## Code Examples

### Basic Usage
```jsx
<ImageCropUploader
  onImagesSelected={(images) => setProductImages(images)}
/>
```

### With Custom Ratio
```jsx
<ImageCropUploader
  onImagesSelected={handleImages}
  cropRatio={CROP_RATIOS.SQUARE}
  maxImages={1}
/>
```

### Processing Uploaded Images
```jsx
const handleImagesSelected = (images) => {
  images.forEach((img) => {
    console.log('Filename:', img.metadata.originalName);
    console.log('Original size:', img.metadata.originalSize);
    console.log('Compressed size:', img.metadata.compressedSize);
    console.log('Compression ratio:', img.metadata.compressionRatio);
    console.log('Cropped dimensions:', 
      `${img.metadata.croppedWidth}x${img.metadata.croppedHeight}`);
    console.log('Preview URL:', img.croppedUrl);
    console.log('Blob for upload:', img.croppedBlob);
  });
};
```

## Troubleshooting

### Images Not Showing After Crop
- Check browser console for errors
- Verify canvas support in browser
- Try refreshing the page

### Crop Modal Not Opening
- Ensure imageDataUrl is valid
- Check that image is loaded before cropping
- Try a different image format

### Large File Sizes
- Reduce COMPRESSION_QUALITY in compressImage.js
- Lower MAX_IMAGE_WIDTH and MAX_IMAGE_HEIGHT
- Check original image resolution

## Support

For issues or questions about the image upload and crop feature, refer to:
- This documentation
- Component prop types and JSDoc comments
- Error messages in the UI
- Browser console logs
