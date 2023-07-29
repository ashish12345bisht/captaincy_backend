import { addSubadmin, changePassword, login, newUser, register } from "../controllers/auth.js";
import { Router } from "express";
import authMiddleware from "../middleware/authentication.js";
const router = Router();

router.post("/sign-up", register);
router.post("/sign-in", login);
router.post("/newUser", authMiddleware, newUser)
router.post("/addSubadmin", authMiddleware, addSubadmin)
router.post("/changePassword", authMiddleware, changePassword)


// export default Router;
export { router as authRoute }