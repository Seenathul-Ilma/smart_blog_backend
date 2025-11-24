import { Router } from "express";
import { Role } from "../models/userModels";
import { authenticate } from "../middleware/auth";
import { authorization } from "../middleware/authorizeRoles";
import { upload } from "../middleware/upload";
import { getAllPosts, savePost, getMyPost, generateContent} from "../controllers/postController"
import { aiGeneratedContent } from "../controllers/aiController";
//import { paginate } from "../middleware/pagination";

const router = Router()

router.get("/", getAllPosts)  // public. so auth middleware - no need, but, pagination middleware needed

router.post("/create", authenticate, authorization(Role.ADMIN, Role.AUTHOR), upload.single("image"), savePost)   //signle or array dhanna puluvan. form-data key name "image" kiyl dagattha (kemethi namak daganna puluvan. ) 

// if we install genai by using 'npm install @google/genai'
router.post("/generate", authenticate, authorization(Role.ADMIN, Role.AUTHOR), generateContent)

// if we use genai backend endpoint (without install genai by using 'npm install @google/genai')
router.post("/ai/generate", aiGeneratedContent)


router.get("/me", authenticate, authorization(Role.ADMIN, Role.AUTHOR), getMyPost)

export default router