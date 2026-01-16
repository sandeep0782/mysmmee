import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import * as authController from "../controllers/authController";
import { generateToken } from "../utils/generateToken";
import { IUser } from "../models/User";
import { authenticateUser } from "../middleware/authMiddleware";
import { loginLimiter } from "../middleware/loginLimiter";

const router = Router();

router.post("/register", authController.register);
router.post("/vendor/register", authController.registerVendor);
router.post("/login", loginLimiter, authController.login);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/forgot-password", loginLimiter, authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/verify-auth", authenticateUser, authController.checkUserAuth);
router.get("/logout", authController.logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

//google callback routes
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}`,
    session: false,
  }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Cast req.user to IUser
      const user = req.user as IUser;
      const accessToken = await generateToken(user);

      // Set the token in the cookie
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.redirect(`${process.env.FRONTEND_URL}`);
    } catch (error) {
      next(error);
    }
  }
);
export default router;
