1. create controller to manage posts (postController)

2. add required functions in postController (savePost, getAllPosts, getMyPost)

3. create postRoutes to link route (url) with controller funtions (postController) & connect middlewares when needed

// router.post("/", getAllPosts)

// router.post("/create", authenticate, authorization(Role.ADMIN, Role.AUTHOR), savePost)

// router.post("/me", authenticate, getMyPost)

4. Mount post route in index.ts (app.use("/api/v1/post", postRoutes))

5. Should able to upload images when creating a post.
But JSON cannot read files.  So, want to use multipart/form-data
But, express can't read form data by default.

so, need to use 'Multer' - Multer is a node.js middleware for handling multipart formdata  from express backend

Multer can temporarily store uploaded files in the storage/disk/RAM
Disk

NOTE: Multer will not process any form which is not multipart (multipart/form-data).

so, install multer by -> 
npm install multer
npm install --save-dev @types/multer

6. create middleware - upload.ts

7. connect upload middleware in postRoutes
router.post("/create", authenticate, authorization(Role.ADMIN, Role.AUTHOR), upload.single("image"), savePost)   // 

8. implement savePost in controller

9. create model for post  (create interface and define schema)

10. need to add cloudinary to store images (so go and create account in https://cloudinary.com/)   

11. install cloudinary -> npm install cloudinary

12. need to config cloudinary
 i) in .env -> 
// genearated api key name in claudinary - smart_blog
CLOUDINARY_NAME=<CLOUDINARY_NAME>
CLOUDINARY_API_KEY=<CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET=<CLOUDINARY_API_SECRET>

 ii) create config folder inside src to define configurations
 import { v2 as cloudinary } from "cloudinary"
cloudinary.config({ 
  cloud_name: 'my_cloud_name', 
  api_key: 'my_key', 
  api_secret: 'my_secret'
});

13. postController eke savePost implementation

14. Change a user in db as AUTHOR (bcz, user's appoval status is 'APPROVED')
and trly postman -> login & get accessToken to create new post

15. 







