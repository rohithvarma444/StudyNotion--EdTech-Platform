const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

const convertSecondsToDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

//updating user Profile
exports.updateProfile = async (req, res) => {
	try {
        const {
            firstName,
            lastName,
            dateOfBirth,
            gender,
            contactNumber,
            about,
        } = req.body


        const userId = req.user.id;

        const userDetails = await User.findById(userId);
        const profileDetails = await Profile.findById(userDetails.additionalDetails)

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        if(!profileDetails){
        }

        userDetails.firstName = firstName;
        userDetails.lastName = lastName;

        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        profileDetails.about = about;

        await profileDetails.save();
        await userDetails.save();



        const updatedUserDetails = await User.findById(userId).
        populate("additionalDetails")
        .populate("courses")
        .populate("courseProgress").exec();


        return res.status(200).json({
            success:true,
            message: "User Details have been updated sucessfully",
            data:updatedUserDetails
        })
        

    } catch (error) {
        
    }
};

//get details of the user
exports.getAllUserDetails = async(req,res) => {
    try {
        const id = req.user.id;

        const userDetails = await User.findById(id).populate("additionalDetails")
        .populate("courses")
        .populate("completedCourses")
        .exec()

        return res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: userDetails,
        });

    } catch (error) {
        console.log("Error while fetching the details of the user",error);
        return res.status(200).json({
            success:false,
            message: "Error occured during fetching user details",
        });
    }
}

//updating with new Profile Picture
exports.updateDisplayPicture = async (req, res) => {
    try {
        const { displayPicture } = req.files;
        const userId = req.user.id;

        if (!displayPicture) {
            return res.status(400).json({
                success: false,
                message: "No image file provided",
            });
        }

        // Upload image to Cloudinary
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        );


        // Update user profile with new image URL
        const updatedProfile = await User.findByIdAndUpdate(
            userId,
            { image: image.secure_url },
            { new: true }
        ).populate("additionalDetails").populate("courses").populate("courseProgress");

        return res.status(200).json({
            success: true,
            message: "Image updated successfully",
            data: updatedProfile,
        });
    } catch (error) {
        console.error("Error occurred while updating display picture", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the display picture",
        });
    }
};

//fetching all the current User enrolled courses
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        let userDetails = await User.findOne({ _id: userId })
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    },
                },
            })
            .exec();

        userDetails = userDetails.toObject();
        
        for (let i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0;
            let subSectionLength = 0;
            
            for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce(
                    (acc, curr) => acc + parseInt(curr.timeDuration), 0
                );
                subSectionLength += userDetails.courses[i].courseContent[j].subSection.length;
            }
            
            userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);
            
            const courseProgressCount = await CourseProgress.findOne({
                courseId: userDetails.courses[i]._id,
                userId: userId,
            });
            
            const completedVideos = courseProgressCount?.completedVideo.length || 0;
            
            userDetails.courses[i].progressPercentage = subSectionLength === 0 ? 100 :
                Math.round((completedVideos / subSectionLength) * 100 * 100) / 100;
        }

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find user with id: ${userId}`,
            });
        }
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        });


        
    } catch (error) {
        console.error("Error occurred while fetching enrolled courses", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the courses",
            error: error.message,
        });
    }
};


exports.instructorDashboard = async (req, res) => {


    try {
        const userId = req.user.id;
        const courseDetails = await Course.find({
            instructor: userId,
        });

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length;
            const totalAmountGenerated = course.price * totalStudentsEnrolled;

            return {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            };
        });

        res.status(200).json({
            success: true,
            message: "Successfully fetched the data",
            courses: courseData,
        });

    } catch (error) {
        console.error(error); 
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the data.",
            error: error.message, 
        });
    }
};


exports.deleteProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const userDetails = await User.findById(userId);

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (userDetails.accountType === "Student") {
            await Course.updateMany(
                { studentsEnrolled: userId },
                { $pull: { studentsEnrolled: userId } }
            );

            await CourseProgress.deleteMany({ user: userId }); // 
        }

        if (userDetails.accountType === "Instructor") {
            await Course.deleteMany({ instructor: userId });
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "User has been deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting profile:", error); 
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the user",
            error: error.message 
        });
    }
}

  
