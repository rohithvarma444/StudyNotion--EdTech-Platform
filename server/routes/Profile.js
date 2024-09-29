const express = require("express");
const router = express.Router();

const {
    updateProfile,
    deleteAccount,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
    getInstructorCourses
} =require("../controllers/Profile");

const { auth,isStudent,isAdmin,isInstructor} = require("../middleswares/auth");

//pprofile routes - tested
router.delete("/deleteProfile",auth,deleteAccount);
router.put("/updateProfile",auth,updateProfile);
router.get("/getUserDetails",auth,getAllUserDetails);

//todo: need to check payment routes after frontend intergration
router.get("/getEnrolledCourses",auth,isStudent,getEnrolledCourses);
//tested working fine
router.put("/updateDisplayPicture",auth,updateDisplayPicture);
//router.get("/getInstructorCourses",isInstructor,getInstructorCourses)

module.exports = router 