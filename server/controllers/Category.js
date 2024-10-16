const Category = require("../models/Category");
const Course = require("../models/Course");

// creating a category
exports.createCategory = async(req,res) => {

    try {
        const { name,description } = req.body;
        if(!name || !description) {
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
    
        const categoryDetails = await Category.create({
            name:name,
            description: description,
        });
    
        return res.status(200).json({
            success: true,
            message: "Tag created successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"An error occurred while creating the category",
        })
    }
}

//fetch all the category
exports.showAllCategories = async(req,res) => {
    try {
        
        const allCategory = await Category.find({},{name:true,description:true});
        res.status(200).json({
            success: true,
            message: "All  category returned successfully",
            data:allCategory,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Error occurred during fetching all the categories",
        })
    }
}

//create category page details
exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Fetch the selected category with populated courses and instructors
        const selectedCategory = await Category.findById(categoryId).populate({
            path: 'courses',
            populate: [
                { path: 'instructor' },
                { path: 'ratingAndReviews' }
            ]
        });

        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Get popular courses of the selected category
        const selectedCategoryPopularCourses = selectedCategory.courses
            .sort((a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length)
            .slice(0, 10);

        // Get new courses of the selected category
        const selectedCategoryNewCourses = selectedCategory.courses
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 10);

        // Fetch courses from different categories with more students enrolled
        const differentCourses = await Category.find({
            _id: { $ne: categoryId }
        }).populate({
            path: "courses",
            populate: [
                { path: 'instructor' },
                { path: 'ratingAndReviews' }
            ]
        });

        // Flatten and sort courses from different categories
        const otherPopularCourses = differentCourses
            .flatMap(category => category.courses)
            .sort((a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length)
            .slice(0, 10);

        // Fetch top 10 courses overall
        const topOverallCourses = await Course.find({ status: "Published" })
            .populate(['instructor', 'ratingAndReviews'])
            .sort({ studentsEnrolled: -1 })
            .limit(10);

        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                selectedCategoryPopularCourses,
                selectedCategoryNewCourses,
                otherPopularCourses,
                topOverallCourses
            },
        });

    } catch (error) {
        console.log("Error occurred during fetching of courses by category", error);
        return res.status(500).json({
            success: false,
            message: "Error during fetching courses by category",
        });
    }
}
