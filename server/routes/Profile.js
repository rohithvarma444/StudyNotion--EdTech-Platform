const express = require("express");
const router = express.Router();

const {
    updateProfile,
    deleteAccount,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
} =require("../controllers/Profile");

const { auth,isStudent,isAdmin,isInstructor} = require("../middleswares/auth");

//pprofile routes - tested
router.delete("/deleteProfile",deleteAccount);
router.put("/updateProfile",auth,updateProfile);
router.get("/getUserDetails",auth,getAllUserDetails);

//todo: need to check payment routes after frontend intergration
router.get("/getEnrolledCourses",auth,getEnrolledCourses);
//tested working fine
router.put("/updateDisplayPicture",auth,updateDisplayPicture);

module.exports = router 