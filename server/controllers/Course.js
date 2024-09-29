const Course = require("../models/Course");
const Category = require("../models/Category");  
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")



require("dotenv").config();

exports.createCourse = async (req, res) => {
    try {
        // Fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, category,instructions } = req.body;
        console.log("Course Name:", courseName);
        console.log("Course Description:", courseDescription);
        console.log("Price:", price);
        console.log("What You Will Learn:", whatYouWillLearn);
        console.log("Category:", category);
        console.log("Instructions:", JSON.parse(instructions));
        const thumbnail = req.files?.thumbnailImage? req.files.thumbnailImage:null;

        if (!courseName || !courseDescription || !whatYouWillLearn || !price ) {
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

        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details not found"
            });
        }

        //Uploading image to Cloudinary
        //if(thumbnail){
        //  const thumbnailImage = await uploadImageToCloudinary(
        //    thumbnail,
        //    process.env.FOLDER_NAME,
        //    1000,
        //    1000
        //  );
        //}

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            category: categoryDetails._id,  // Updated from tag to category
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
        }).populate("Cateogry")  
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

//adding controller for editCourse
//adding few other controllers 
exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body;
      const course = await Course.findById(courseId)
        .populate("Category")
        .populate("courseContent")
        .populate("ratingAndReviews")
        .exec();
  
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
  
      const updates = req.body;
  
      if (req.files) {
        const image = req.files[0];
        const uploadImage = await uploadImageToCloudinary(
          image,
          process.env.FOLDER_NAME
        );
        course.thumbnail = uploadImage.secure_url; 
      }
  
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key]);
          } else {
            course[key] = updates[key];
          }
        }
      }
  
      await course.save();
  
      const updatedCourse = await Course.findById(courseId)
        .populate("Category")
        .populate("ratingAndReviews") 
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec();
  
      return res.status(200).json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
};


exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body;
      const userId = req.user.id;
  
      // Fetch course details and populate necessary fields
      const courseDetails = await Course.findById(courseId)
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .populate("ratingsAndReviews")
        .populate("category")
        .exec();
  
      // Check if the course exists
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: "No such course found",
        });
      }
  
      const courseProgressCount = await CourseProgress.findOne({
        userId: userId,
        courseId: courseId,
      });
  
      let totalWatchTime = 0;
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          totalWatchTime += parseInt(subSection.timeDuration, 10);
        });
      });
  
      
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration: totalWatchTime,
          completeVideos: courseProgressCount?.completedVideos ? courseProgressCount.completedVideos : [],
        },
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
};


exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body;
      const userId = req.user.id;
      const courseDetails = await Course.findById(courseId);
  
      if (!courseDetails) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
  
      if (String(userId) !== String(courseDetails.instructor)) {
        return res.status(403).json({
          success: false,
          message: "You are not the instructor for this course",
        });
      }
  
      const studentsEnrolled = courseDetails.studentsEnrolled;
      for (const studentId of studentsEnrolled) {
        await User.updateOne(
          { _id: studentId },
          { $pull: { courses: courseId } } 
        );
      }
  
      for (const sectionId of courseDetails.courseContent) {
        const section = await Section.findById(sectionId);
        if (section) {
          for (const subSectionId of section.subSection) {
            await SubSection.findByIdAndDelete(subSectionId); 
          }
        }
        await Section.findByIdAndDelete(sectionId); 
      }
      await Course.findByIdAndDelete(courseId);
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  

exports.getInstructorCourses = async (req, res) => {
    try {
      console.log("I am being called-----------------------------------------------------------------------------------------")
      const userId = req.user.id;
  
      const userDetails = await User.findById(userId).populate("courses");
  
      if (!userDetails) {
        console.log("No such Instructor");
        return res.status(403).json({
          success: false,
          message: "No such user found to fetch courses",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Fetched the courses successfully", 
        data: userDetails.courses,
      });
    } catch (error) {
      console.error("Error in fetching the instructor courses:", error);
      return res.status(500).json({
        success: false,
        message: "Error in fetching the course details",
      });
    }
};
  
