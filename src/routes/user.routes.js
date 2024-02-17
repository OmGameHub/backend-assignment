import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    forgotPasswordRequest,
    resetForgottenPassword,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/forget-password").post(forgotPasswordRequest);
router.route("/reset-password/:resetToken").post(resetForgottenPassword);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

export default router;
