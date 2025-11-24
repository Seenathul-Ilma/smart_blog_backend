import { Router } from "express";
import { getMyProfile, login, register, adminRegister, refreshAccessToken } from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { authorization } from "../middleware/authorizeRoles";
import { Role } from "../models/userModels";

const router = Router()

// public
router.post("/refresh", refreshAccessToken)

router.post("/login", login)
router.post("/register", register)

// protected - need middleware
// have access to USER, AUTHOR, ADMIN
router.get("/me", authenticate, getMyProfile)
// if admintath access krnna beriwa thiynna onenam
//router.get("/me", authenticate, authorization("USER"), getMyProfile)

// protected
// ADMIN only
// need to create middleware for ensure the req is from ADMIN
router.post("/admin/register", authenticate, authorization(Role.ADMIN, Role.AUTHOR), adminRegister)

export default router