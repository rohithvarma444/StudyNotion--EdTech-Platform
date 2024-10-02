const express = require("express");
const router = express.Router();

const{
    sendOTP,
    signUp,
    signIn,
    changePassword,
} = require("../controllers/Auth");

const {
    resetPasswordToken,
    resetPassword
} = require("../controllers/ResetPassword");


const { auth,isStudent,isAdmin,isInstructor} = require("../middleswares/auth");

//auth routes -tested
router.post("/login",signIn);
router.post("/signup",signUp);
router.post("/sendOtp",sendOTP);
router.post("/changePassword",auth,changePassword);

//reset-password- tested
router.post("/reset-password-token",resetPasswordToken);
router.post("/reset-password",resetPassword);

module.exports = router
