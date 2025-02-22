const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection")

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
exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId,courseId } = req.body;
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

		res.status(200).json({
			success: true,
			message: section,
			data:course,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

//deleting a section
exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
}; 