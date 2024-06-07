import { v2 as cloudinary } from 'cloudinary';
import log from './logger';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadThumb(file: Express.Multer.File) {
  try {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString('base64');
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      transformation: [
        { width: 500, crop: 'thumb' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      folder: 'quickeatz',
    });

    return {
      image: uploadResponse.url,
      coudinary_id: uploadResponse.public_id
    };
  } catch (error) {
   log.error(`Error uploading picture: ${error}`);
  }
};

export async function uploadImage(file: Express.Multer.File) {
  try {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString('base64');
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      transformation: [
        { width: 1000, crop: 'scale' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      folder: 'quickeatz',
    });

    return {
      image: uploadResponse.url,
      coudinary_id: uploadResponse.public_id
    };
  } catch (error) {
   log.error(`Error uploading picture: ${error}`);
  }
};
