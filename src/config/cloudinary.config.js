import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: 'dlcizzaa8',
  api_key: '252984694466497',
  api_secret: 'w6uGWoqWxioFTquswkQ_jjPA2j0', // Click 'View API Keys' above to copy your API secret
});

export default cloudinary;
