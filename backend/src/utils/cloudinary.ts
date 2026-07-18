import { Readable } from 'stream';
import cloudinary from '../config/cloudinary';

export const uploadImageToCloudinary = (
  buffer: Buffer,
  folder = 'cde/notes'
): Promise<{
  secure_url: string;
  public_id: string;
}> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        overwrite: false,
        use_filename: false
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('No se pudo subir la imagen'));
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id
        });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

export const deleteImageFromCloudinary = async (publicId: string) => {
  if (!publicId) return;
  return cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
    invalidate: true
  });
};
