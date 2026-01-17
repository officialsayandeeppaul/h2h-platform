import { v2 as cloudinary } from 'cloudinary';

if (process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export async function uploadImage(
  file: string,
  folder: string = 'h2h'
): Promise<UploadResult | null> {
  if (!process.env.CLOUDINARY_API_KEY) {
    console.warn('Cloudinary not configured');
    return null;
  }

  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
}

export async function uploadAvatar(file: string, userId: string): Promise<UploadResult | null> {
  if (!process.env.CLOUDINARY_API_KEY) {
    return null;
  }

  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'h2h/avatars',
      public_id: userId,
      overwrite: true,
      transformation: [
        { width: 200, height: 200, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Avatar upload error:', error);
    return null;
  }
}

export async function uploadPrescription(
  file: string,
  appointmentId: string
): Promise<UploadResult | null> {
  if (!process.env.CLOUDINARY_API_KEY) {
    return null;
  }

  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'h2h/prescriptions',
      public_id: `prescription_${appointmentId}_${Date.now()}`,
      resource_type: 'auto',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width || 0,
      height: result.height || 0,
    };
  } catch (error) {
    console.error('Prescription upload error:', error);
    return null;
  }
}

export async function deleteImage(publicId: string): Promise<boolean> {
  if (!process.env.CLOUDINARY_API_KEY) {
    return false;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

export function getOptimizedUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
}): string {
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    return '';
  }

  const transformations = [];
  
  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.crop) transformations.push(`c_${options.crop}`);
  transformations.push('q_auto', 'f_auto');

  const transform = transformations.join(',');
  
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transform}/${publicId}`;
}
