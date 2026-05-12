/**
 * Image compression utilities
 */

export const COMPRESSION_QUALITY = {
  HIGH: 0.95,
  MEDIUM: 0.85,
  LOW: 0.75
};

export const MAX_IMAGE_WIDTH = 1200;
export const MAX_IMAGE_HEIGHT = 1200;

/**
 * Compress image using canvas
 */
export const compressImage = async (file, quality = COMPRESSION_QUALITY.MEDIUM, maxWidth = MAX_IMAGE_WIDTH, maxHeight = MAX_IMAGE_HEIGHT) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');

        // Calculate new dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve({
              blob,
              dataUrl: canvas.toDataURL('image/jpeg', quality),
              width,
              height,
              originalSize: file.size,
              compressedSize: blob.size,
              compressionRatio: ((1 - blob.size / file.size) * 100).toFixed(2)
            });
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to compress image'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Compress multiple images
 */
export const compressMultipleImages = async (files, quality = COMPRESSION_QUALITY.MEDIUM) => {
  const results = await Promise.all(
    files.map((file) => compressImage(file, quality))
  );
  return results;
};

/**
 * Create thumbnail from image
 */
export const createThumbnail = async (dataUrl, size = 150) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');

      // Calculate crop to center
      const scale = Math.max(size / img.width, size / img.height);
      const x = (size / scale - img.width) / 2;
      const y = (size / scale - img.height) / 2;

      ctx.scale(scale, scale);
      ctx.drawImage(img, x, y);

      canvas.toBlob(
        (blob) => {
          resolve({
            blob,
            dataUrl: canvas.toDataURL('image/jpeg', 0.8)
          });
        },
        'image/jpeg',
        0.8
      );
    };

    img.onerror = () => reject(new Error('Failed to create thumbnail'));
    img.src = dataUrl;
  });
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
