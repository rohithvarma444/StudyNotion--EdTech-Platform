const Course = require("../models/Course");
const Category = require("../models/Category");  
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.createCourse = async (req, res) => {
    try {
        // Fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, category } = req.body;
        const thumbnail = req.files.thumbnailImage;

        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log(instructorDetails);

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details not found"
            });
        }

        const categoryDetails = await Category.findOne({ name: category });
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details not found"
            });
        }

        // Uploading image to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME,
            1000,
            1000
        );

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            category: categoryDetails._id,  // Updated from tag to category
            thumbnail: thumbnailImage.secure_url,
        });

        // Add the newCourse to the courses array in instructor
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },  // Fixed id to _id
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true },
        );

        // Updating Category model (formerly Tag)
        await Category.findByIdAndUpdate(
            { _id: categoryDetails._id },  // Fixed id to _id
            {
                $push: {
                    courses: newCourse._id,
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            data: newCourse,
        });

    } catch (error) {
        console.error("Error creating course:", error);
        return res.status(500).json({
            success: false,
            message: "Error in creating the course"
        });
    }
};

// Show all courses
exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingsAndReviews: true,
            studentsEnrolled: true,
        }).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            data: allCourses,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching all the courses",
        });
    }
};

// Get Course Details
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;

        // Fetching all the details of the course
        const courseDetails = await Course.find(
            { _id: courseId },
        ).populate({
            path: "instructor",
            populate: {
                path: "additionalDetails"
            },
        }).populate("Cateogry")  // Updated from tag to category
          .populate("ratingAndReviews")
          .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            }
        }).exec();

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Could not find the course",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course Details fetched successfully",
            data: courseDetails
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in fetching the course details"
        });
    }
};
