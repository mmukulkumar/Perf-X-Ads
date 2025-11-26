import { AdSpec, ValidationResult } from '../types';

export const validateFile = async (file: File, spec: AdSpec): Promise<ValidationResult> => {
  const messages: ValidationResult['messages'] = [];
  let isValid = true;

  // 1. File Type Validation
  const extension = file.name.split('.').pop()?.toUpperCase();
  const allowedTypes = spec.fileType.map(t => t.toUpperCase());
  
  // Basic mapping for MIME types to extensions for checking
  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');
  
  if (spec.format === 'Video' && !isVideo) {
    isValid = false;
    messages.push({ type: 'error', text: `Expected video format, but got ${file.type}.` });
  } else if (spec.format === 'Image' && !isImage) {
    isValid = false;
    messages.push({ type: 'error', text: `Expected image format, but got ${file.type}.` });
  } else if (extension && !allowedTypes.includes(extension) && !allowedTypes.includes('JPEG') && extension !== 'JPG') {
    // Loose check for extension
    messages.push({ type: 'warning', text: `File extension .${extension} might not be supported. Recommended: ${spec.fileType.join(', ')}` });
  } else {
    messages.push({ type: 'success', text: `File format matches ${spec.format} (${extension}).` });
  }

  // 2. File Size Validation
  if (spec.maxFileSizeBytes && file.size > spec.maxFileSizeBytes) {
    isValid = false;
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    messages.push({ type: 'error', text: `File size ${sizeMB}MB exceeds limit of ${spec.maxFileSize}.` });
  } else {
    messages.push({ type: 'success', text: `File size within limit (${spec.maxFileSize}).` });
  }

  // 3. Dimensions Validation (Only for Images for now due to browser limitations reading video dimensions easily without loading full video)
  if (isImage && spec.width && spec.height) {
    try {
      const dimensions = await getImageDimensions(file);
      const tolerance = 0.05; // 5% tolerance for warning vs error
      
      if (dimensions.width === spec.width && dimensions.height === spec.height) {
        messages.push({ type: 'success', text: `Dimensions match exactly: ${dimensions.width}x${dimensions.height}.` });
      } else {
        const widthDiff = Math.abs(dimensions.width - spec.width) / spec.width;
        const heightDiff = Math.abs(dimensions.height - spec.height) / spec.height;

        if (widthDiff < tolerance && heightDiff < tolerance) {
           messages.push({ type: 'warning', text: `Dimensions ${dimensions.width}x${dimensions.height} are close to recommended ${spec.width}x${spec.height}.` });
        } else {
           isValid = false;
           messages.push({ type: 'error', text: `Incorrect dimensions: ${dimensions.width}x${dimensions.height}. Required: ${spec.width}x${spec.height}.` });
        }
      }
      
      // Aspect Ratio Check
      const targetRatio = spec.width / spec.height;
      const actualRatio = dimensions.width / dimensions.height;
      if (Math.abs(targetRatio - actualRatio) > 0.01) {
         messages.push({ type: 'warning', text: `Aspect ratio ${actualRatio.toFixed(2)} differs from target ${targetRatio.toFixed(2)} (${spec.aspectRatio}).` });
      }

    } catch (e) {
      messages.push({ type: 'error', text: 'Could not read image dimensions.' });
    }
  }

  return { isValid, messages };
};

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};