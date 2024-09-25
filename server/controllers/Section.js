const Section = require("../models/Section");
const Course = require("../models/Course");

//creating a section
exports.createSection = async(req,res) => {
    
    try {
        const { sectionName,courseId } = req.body;

        if(!sectionName || !courseId){
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            })
        }
        const newSection = await Section.create({sectionName});
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {new:true},
        ).populate({
            path:"courseContent",
            populate:{
                path: "subSection",
            }
        }).exec();

        //Use populate to replace sections and subsections both in the updatedCourseDetails


        return res.status(200).json({
            success:true,
            message: "Section created successfully",
            data:updatedCourseDetails
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error in creating a section"
        })
    }

}

//updating section details
exports.updateSection = async(req,res) => {
    try {
        const {sectionName, sectionId} = req.body;

        const  section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        const updatedCourse = await Course.findOne({
            courseContent: sectionId // Directly check for the sectionId in courseContent
          })
          .populate({
            path: 'courseContent',  // Populate the courseContent field
            model: 'Section',       // Ensure it uses the Section model
          })
          .exec();


        console.log("-----------------------------");
        console.log(updatedCourse);
        console.log("-----------------------------");
       
        return res.status(200).json({
            success: true,
            message: "Section updated sucessfully",
            data:updatedCourse
        })
    } catch (error) {
        console.error("Error updating section:", error); 
        return res.status(500).json({
            success:true,
            message:"Error occured in updating the section"
        })
    }
}

//deleting a section
exports.deleteSection = async(req,res) => {
    try {
        const {sectionId} = req.body;

        if(!sectionId){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        await Section.findByIdAndDelete(sectionId);
        //Do we need to delete the section in the course

        return res.status(200).json({
            success: true,
            message: "Section Deleted  succefully"
        })
    } catch (error) {
        console.error("Error deleting section:", error); 
        return res.status(500).json({
            success: true,
            message: "Error occured during deleting the section"
        })
    }
}