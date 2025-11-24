import dotenv from "dotenv" // mostly, only import in index.ts (but sometimes, methana trigger vune nettam mehema rpt import krl ganna venava)
dotenv.config()   

import { v2 as cloudinary } from "cloudinary"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary