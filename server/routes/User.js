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


const {
    updateProfile,
    deleteAccount,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses
} = require("../controllers/Profile");

const { auth,isStudent,isAdmin,isInstructor} = require("../middleswares/auth");

//auth routes -tested
router.post("/login",signIn);
router.post("/signup",signUp);
router.post("/sendOtp",sendOTP);
router.post("/changePassword",auth,changePassword);

//reset-password- tested
router.post("/reset-password-token",resetPasswordToken);
router.post("/reset-password",resetPassword);

//profile-routes- tested
router.post("/deleteProfile",auth,deleteAccount);
router.put("/updateProfile",auth,updateProfile);
router.get("/getalluserdetails",auth,getAllUserDetails);
router.get("/getEnrolledCourses",auth,getEnrolledCourses);
router.put("/updatedisplaypricture",auth,updateDisplayPicture);
module.exports = router
