const express = require("express");
const router = express.Router();

const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    deleteCourse,
    getFullCourseDetails,
    editCourse,
} = require("../controllers/Course");

const {
    showAllCategories,
    createCategory,
    categoryPageDetails,
} = require("../controllers/Category");

const {
    createSection,
    updateSection,
    deleteSection
} = require("../controllers/Section");

const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/SubSection");

const {
    createRatings,
    getAverageRating,
    getAllRating
} = require("../controllers/RatingAndReviews");

const { auth,isStudent,isAdmin,isInstructor} = require("../middleswares/auth");


//course routes - tested
router.post("/createCourse",auth,isInstructor,createCourse);
router.get("/getAllCourses",getAllCourses);
router.post("/getCourseDetails",getCourseDetails);
router.post("/deleteCourse",isInstructor,deleteCourse);
router.post("/getFullCourseDetails",getFullCourseDetails)
router.post("/editCourse",editCourse)

//section routes - tested
router.post("/addSection",auth,isInstructor,createSection);
router.post("/updateSection",auth,isInstructor,updateSection);
router.post("/deleteSection",auth,isInstructor,deleteSection);

//sub-section routes - tested
router.post("/addSubSection",auth,isInstructor,createSubSection);
router.post("/updateSubSection",auth,isInstructor,updateSubSection);
router.post("/deleteSubSection",auth,isInstructor,deleteSubSection);

//category routes - tested
router.post("/createCategory",auth,isAdmin,createCategory);
router.get("/showAllCategories",showAllCategories);
router.post("/getCategoryPageDetails",categoryPageDetails);

//ratings and reviews routes - tested
router.post("/createRatings",auth,isStudent,createRatings);
router.get("/getAverageRating",getAverageRating);
router.get("/getReviews",getAllRating);

module.exports = router;