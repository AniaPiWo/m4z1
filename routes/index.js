import { Router } from "express";
import authRouter from "./authRouter.js";
import listRouter from "./listRouter.js";
import authMiddleware from "../middleware/jwt.js";

const router = Router();

router.use("/auth", authRouter);
//zabezpieczone ścieżki
// jesli token bedzie bledny to nie przejdzie dalej(unauthorized)
router.use("/list", authMiddleware, listRouter);

export default router;
