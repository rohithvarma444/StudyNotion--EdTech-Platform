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
        console.log(categoryDetails);
    
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
exports.categoryPageDetails = async(req,res) => {
    try{
        const { categoryId } = req.body;

        if(!categoryId){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        const selectedCategory = await Category.findById(categoryId).populate("courses").exec();

        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message: "Courses not found for this category",
            })
        }

        //other courses from this category
        const differentCourses = await Category.find({
            _id: { $ne: categoryId }
        }).populate("courses").exec();

        //finding top-selling courses
        const allCourses = await Course.find({ status: "Published" }).populate([
            {
                path: "ratingsAndReviews"
            },
            {
                path: "instructor"
            }
        ]).exec();


        const topCourses = allCourses
            .sort((a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length)
            .slice(0, 10);


        return res.status(200).json({
            success: true,
            data:{
                selectedCategory,
                differentCourses,
                topCourses
            },
        })



    } catch(error){
        console.log("Error occured during fetching of courses by category",error);
        return res.status(500).json({
            success: false,
            message: "Error during fetching courses by cateogry",
        })
    }
}