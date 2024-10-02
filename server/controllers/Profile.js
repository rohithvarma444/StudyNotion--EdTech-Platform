const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//updating user Profile
exports.updateProfile = async (req, res) => {
	try {
        console.log("received")
        const {
            firstName,
            lastName,
            dateOfBirth,
            gender,
            contactNumber,
            about,
        } = req.body

        console.log("PARSED")

        const userId = req.user.id;

        const userDetails = await User.findById(userId);
        const profileDetails = await Profile.findById(userDetails.additionalDetails)

        console.log("GOT MODELS")
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        if(!profileDetails){
            console.log("got wrong model profile")
        }

        userDetails.firstName = firstName;
        console.log(firstName);
        userDetails.lastName = lastName;
        console.log(firstName);

        profileDetails.dateOfBirth = dateOfBirth;
        console.log(typeof dateOfBirth);
        console.log(firstName);
        profileDetails.gender = gender;
        console.log(firstName);
        profileDetails.contactNumber = contactNumber;
        console.log(firstName);
        profileDetails.about = about;
        console.log(firstName);

        await profileDetails.save();
        await userDetails.save();

        console.log("REACHED HERE")


        const updatedUserDetails = await User.findById(userId).
        populate("additionalDetails")
        .populate("courses")
        .populate("courseProgress").exec();

        console.log("Finally sent this: ",updatedUserDetails);

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
        ).populate("additionalDetails").populate("courses").populate("courseProgress");

        console.log("User Details",updatedProfile);
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

  
