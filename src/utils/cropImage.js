/**
 * Image crop and manipulation utilities using Canvas API
 */

export const CROP_RATIOS = {
  SQUARE: { label: '1:1 (Square)', ratio: 1 },
  CARD: { label: '4:3 (Card)', ratio: 4 / 3 },
  BANNER: { label: '16:9 (Banner)', ratio: 16 / 9 }
};

/**
 * Load image from file and return Image object
 */
export const loadImageFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Get image URL from Image object
 */
export const getImageDataUrl = (img) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.95);
};

/**
 * Rotate image by angle (in degrees, clockwise)
 */
export const rotateImage = (img, angle) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Convert angle to radians
  const radians = (angle * Math.PI) / 180;

  // Calculate new canvas size to fit rotated image
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  const newWidth = img.width * cos + img.height * sin;
  const newHeight = img.width * sin + img.height * cos;

  canvas.width = newWidth;
  canvas.height = newHeight;

  // Move to center and rotate
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  // Create new image from rotated canvas
  const rotatedImg = new Image();
  rotatedImg.src = canvas.toDataURL();
  return rotatedImg;
};

/**
 * Crop image based on crop data
 */
export const cropImage = (img, cropData, targetWidth = 600) => {
  return new Promise((resolve, reject) => {
    try {
      const { x, y, width, height } = cropData;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          resolve({
            blob,
            dataUrl: canvas.toDataURL('image/jpeg', 0.85),
            width,
            height
          });
        },
        'image/jpeg',
        0.85
      );
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Calculate crop area to maintain aspect ratio
 */
export const calculateCropArea = (imgWidth, imgHeight, ratio) => {
  let cropWidth, cropHeight;

  // Calculate dimensions maintaining ratio
  if (imgWidth / imgHeight > ratio) {
    // Image is wider than target ratio
    cropHeight = imgHeight;
    cropWidth = imgHeight * ratio;
  } else {
    // Image is taller than target ratio
    cropWidth = imgWidth;
    cropHeight = imgWidth / ratio;
  }

  // Center the crop area
  const x = (imgWidth - cropWidth) / 2;
  const y = (imgHeight - cropHeight) / 2;

  return { x, y, width: cropWidth, height: cropHeight };
};

/**
 * Draw preview of cropped area on canvas
 */
export const drawCropPreview = (canvas, img, cropData, scale, offsetX, offsetY, rotation) => {
  const ctx = canvas.getContext('2d');

  // Clear canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Save context state
  ctx.save();

  // Move to center of crop area
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  ctx.translate(centerX, centerY);

  // Rotate if needed
  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  // Draw image
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;
  ctx.drawImage(
    img,
    offsetX - scaledWidth / 2,
    offsetY - scaledHeight / 2,
    scaledWidth,
    scaledHeight
  );

  // Draw crop rectangle
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 3;
  ctx.strokeRect(
    -cropData.width / 2,
    -cropData.height / 2,
    cropData.width,
    cropData.height
  );

  // Draw corner handles
  ctx.fillStyle = '#4ade80';
  const handleSize = 8;
  const corners = [
    [-cropData.width / 2, -cropData.height / 2],
    [cropData.width / 2, -cropData.height / 2],
    [-cropData.width / 2, cropData.height / 2],
    [cropData.width / 2, cropData.height / 2]
  ];

  corners.forEach(([x, y]) => {
    ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
  });

  ctx.restore();
};

/**
 * Calculate actual crop coordinates from canvas state
 */
export const getActualCropCoordinates = (
  canvasWidth,
  canvasHeight,
  imgWidth,
  imgHeight,
  cropData,
  scale,
  offsetX,
  offsetY,
  rotation
) => {
  // For simplicity, calculate based on centered image
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // Calculate image position after transformation
  const scaledImgWidth = imgWidth * scale;
  const scaledImgHeight = imgHeight * scale;

  const imgX = centerX + offsetX - scaledImgWidth / 2;
  const imgY = centerY + offsetY - scaledImgHeight / 2;

  // Crop coordinates relative to original image
  const cropX = Math.max(0, (centerX - cropData.width / 2 - imgX) / scale);
  const cropY = Math.max(0, (centerY - cropData.height / 2 - imgY) / scale);
  const cropW = Math.min(imgWidth - cropX, cropData.width / scale);
  const cropH = Math.min(imgHeight - cropY, cropData.height / scale);

  return {
    x: Math.round(cropX),
    y: Math.round(cropY),
    width: Math.round(cropW),
    height: Math.round(cropH)
  };
};
