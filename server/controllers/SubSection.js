const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { findByIdAndUpdate } = require("../models/User");
const {videoUploader} = require("../utils/videoUploader");

//create subSection

exports.createSubSection = async(req,res) => {
    
    try {
        const { sectionId,title,timeDuration,description} = req.body;
        const video = req.files.videoFile;

    
        if(!sectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
    
        const uploadDetails = await videoUploader(video,process.env.FOLDER_NAME);
    
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })
        
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
        {
            $push:{
                subSection: SubSectionDetails._id,
            },
        },
        {new:true}).populate("subSection").exec();
    
    
        return res.status(200).json({
            success: true,
            message: "Sub Section created Successfully",
            updatedSection
        })
    } catch (error) {
        console.log("Error while adding a sub section",error);
        return res.status(500).json({
            success: false,
            message: "Error occured while creating the subsection",
        })
    }
}

//update subSection
exports.updateSubSection = async(req,res) => {
    try {
        console.log("TOKEN-----: ",req.headers.authorization);
        const {subSectionId,title,timeDuration,description} = req.body;
        
        const subSection = await SubSection.findById(subSectionId);

        if(!subSection){
            return res.status(404).json({
                success: false,
                message: "Subsection not found",
            })
        }

        if(title != undefined) subSection.title = title;
        if(description != undefined) subSection.description = description;
        if (timeDuration !== undefined) subSection.timeDuration = timeDuration; 
        if(req.files && req.files.video_file !== undefined){
            const video = req.files.video_file;
            const uploadDetails = await upload_video(video, process.env.FOLDER_NAME);

            subSection.video_url = uploadDetails.secure_url;
            subSection.duration = uploadDetails.duration;
        }
        
        await subSection.save();
        console.log(subSection);

        return res.status(200).json({
            success: true,
            message: "Sub section updated successfully",
        })
    } catch (error) {
        console.log("Error in updating the subsection",error);
        return res.status(500).json({
            success:false,
            message: "Error occured during updating the subsection",
        })
    }
}


//todo: need to add a function to remove the video from cloudinary while deleting the subsection
// delete subsection route
exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId } = req.body;

        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: "subSectionId not provided",
            });
        }

        // Check if the subsection exists before attempting to delete
        const subSection = await SubSection.findById(subSectionId);
        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "Subsection not found",
            });
        }

        await SubSection.findByIdAndDelete(subSectionId);

        return res.status(200).json({
            success: true,
            message: "Subsection deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting subsection:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while deleting the subsection",
        });
    }
};
