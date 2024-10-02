const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");

exports.updateCourseProgress = async (req, res) => {
    const { courseId, subSectionId } = req.body;
    const userId = req.user.id;

    try {
        const subSection = await SubSection.findById(subSectionId);
        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "Subsection not found"
            });
        }

        let courseProgress = await CourseProgress.findOne({
            courseId: courseId,
            userId: userId
        });

        if (!courseProgress) {
            return res.status(404).json({
                success: false,
                message: "Course Progress does not exist"
            });
        }

        if (courseProgress.completedVideos.includes(subSectionId)) {
            return res.status(400).json({
                success: false,
                message: "Subsection already completed"
            });
        }

        courseProgress.completedVideos.push(subSectionId);
        await courseProgress.save();

        return res.status(200).json({
            success: true,
            message: "Course Progress Updated Successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating course progress",
            error: error.message,
        });
    }
};
