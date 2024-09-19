const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//updating user Profile
exports.updateProfile = async (req,res) => {
    try {
        const {dateOfBirth = "",about = "",contactNumber = "", gender} = req.body;
        const id = req.user.id;

        if(!contactNumber || !gender){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const updatedProfileDetails = await Profile.findById(profileId);

        updatedProfileDetails.dateOfBirth = dateOfBirth;
        updatedProfileDetails.about = about;
        updatedProfileDetails.gender = gender;
        updatedProfileDetails.contactNumber = contactNumber;
        await updatedProfileDetails.save();

        return res.status(200).json({
            success:true,
            message:"Profile Updated successfully",
            updatedProfileDetails,
        })
    } catch (error) {
        console.log("Error in handling update profile",error);
        return res.status(500).json({
            success: false,
            message:"Error occured during the updating user profile",
        })
    }
}
//deleting user account
exports.deleteAccount = async (req, res) => {
    try {
        const id = req.user.id;
        console.log(id);
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete the associated profile
        const profileId = userDetails.additionalDetails;
        if (profileId) {
            await Profile.findByIdAndDelete(profileId);
        }
        await User.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Successfully deleted user", 
        });

    } catch (error) {
        console.error("Error in deleting account:", error); 
        return res.status(500).json({
            success: false,
            message: "Error occurred while deleting the user account",
        });
    }
};

//get details of the user
exports.getAllUserDetails = async(req,res) => {
    try {
        const id = req.user.id;

        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        console.log(userDetails);

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

        console.log(image);

        // Update user profile with new image URL
        const updatedProfile = await User.findByIdAndUpdate(
            userId,
            { image: image.secure_url },
            { new: true }
        );

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
        const userDetails = await User.findById(userId).populate("courses").exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found or unable to fetch courses",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Successfully fetched the courses",
            data: userDetails.courses,
        });
    } catch (error) {
        console.error("Error occurred while fetching enrolled courses", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the courses",
        });
    }
};

exports.getInstructorCourses = async (req, res) => {
    try {
      console.log("I am being called")
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
  
