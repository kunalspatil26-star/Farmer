/**
 * Image validation utilities
 */

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MIN_DIMENSION = 200; // Minimum width/height in pixels

export const validateImageFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push('No file selected');
    return { valid: false, errors };
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    errors.push('Invalid file type. Allowed types: JPG, PNG, WebP');
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateImageDimensions = (img) => {
  const errors = [];

  if (img.width < MIN_DIMENSION || img.height < MIN_DIMENSION) {
    errors.push(`Image dimensions must be at least ${MIN_DIMENSION}x${MIN_DIMENSION} pixels`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const getImageInfo = (file) => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  };
};

export const getFileSizeLabel = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};
