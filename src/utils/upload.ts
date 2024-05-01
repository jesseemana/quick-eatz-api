import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(file: Express.Multer.File) {
  try {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString('base64');
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.uploader.upload(dataURI);
    return uploadResponse.url;
  } catch (error) {
    console.log(`Error occured while uploading picture: ${error}`);
  }
};

export default uploadImage;
