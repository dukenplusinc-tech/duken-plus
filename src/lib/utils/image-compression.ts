/**
 * Compresses an image to target a maximum file size (default ~1MB)
 * @param file - The image file to compress
 * @param maxSizeBytes - Maximum file size in bytes (default: 1MB)
 * @param maxWidth - Maximum width in pixels (default: 1920)
 * @param maxHeight - Maximum height in pixels (default: 1920)
 * @returns Promise that resolves to a compressed File
 */
export async function compressImage(
  file: File,
  maxSizeBytes: number = 1024 * 1024, // 1MB default
  maxWidth: number = 1920,
  maxHeight: number = 1920
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        
        if (ratio < 1) {
          width *= ratio;
          height *= ratio;
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Try different quality levels to achieve target size
        const tryCompress = (quality: number): void => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              
              // If size is acceptable or quality is too low, use this blob
              if (blob.size <= maxSizeBytes || quality <= 0.1) {
                const compressedFile = new File(
                  [blob],
                  file.name,
                  {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  }
                );
                resolve(compressedFile);
              } else {
                // Reduce quality and try again
                tryCompress(quality - 0.1);
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        // Start with 0.9 quality
        tryCompress(0.9);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses a base64 data URL image to target a maximum file size
 * @param dataUrl - The base64 data URL to compress
 * @param maxSizeBytes - Maximum file size in bytes (default: 1MB)
 * @param maxWidth - Maximum width in pixels (default: 1920)
 * @param maxHeight - Maximum height in pixels (default: 1920)
 * @returns Promise that resolves to a compressed base64 data URL
 */
export async function compressDataUrl(
  dataUrl: string,
  maxSizeBytes: number = 1024 * 1024, // 1MB default
  maxWidth: number = 1920,
  maxHeight: number = 1920
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
      
      if (ratio < 1) {
        width *= ratio;
        height *= ratio;
      }
      
      // Create canvas and draw resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Try different quality levels to achieve target size
      const tryCompress = (quality: number): void => {
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64Data = compressedDataUrl.split(',')[1];
        const sizeBytes = (base64Data.length * 3) / 4;
        
        // If size is acceptable or quality is too low, use this
        if (sizeBytes <= maxSizeBytes || quality <= 0.1) {
          resolve(compressedDataUrl);
        } else {
          // Reduce quality and try again
          tryCompress(quality - 0.1);
        }
      };
      
      // Start with 0.9 quality
      tryCompress(0.9);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = dataUrl;
  });
}

