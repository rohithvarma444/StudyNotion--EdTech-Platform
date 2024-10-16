const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");


//create ratings
exports.createRatings = async (req, res) => {
    try {
        const user = req.user;
        const { rating, review, courseId } = req.body;

        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: user.id } }
        });



        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "User not enrolled in this course"
            });
        }

        const alreadyReviewed = await RatingAndReview.findOne({
            user: user.id,
            course: courseId
        });


        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "User has already reviewed this course"
            });
        }

        if (!rating || !review) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: user.id
        });


        await Course.findByIdAndUpdate(courseId, {
            $push: {
                ratingAndReviews: ratingReview._id
            }
        }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Course reviewed successfully",
            ratingReview
        });
        console
    } catch (error) {
        console.log("Error while creating rating and review:", error);
        return res.status(500).json({
            success: false,
            message: "Server error, please try again later"
        });
    }
};

//get-avg ratings
exports.getAverageRating = async (req, res) => {
    try {
        const { courseId } = req.body;

        // Calculate the average rating for the course
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                },
            },
        ]);

        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }

        return res.status(200).json({
            success: true,
            message: "No ratings available for this course",
            averageRating: 0,
        });
    } catch (error) {
        console.log("Error while fetching average rating:", error);
        return res.status(500).json({
            success: false,
            message: "Server error, please try again later",
        });
    }
};

//get allratingss
exports.getAllRating = async (req, res) => {
    try {


        const allReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image"
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews, please try again later",
        });
    }
};

