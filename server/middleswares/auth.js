const jwt = require("jsonwebtoken");
require("dotenv").config();


const User = require("../models/User");


//auth middleware for all the users (student) and (tutor)
exports.auth = async(req,res,next) => {
    try {
        console.log(req.headers);
        const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "").trim();
        console.log("REQUEST --------------------------------------");
        console.log(req);
        console.log(req.header("Authorization"));
        console.log("END-OF-REQUEST---------------------------------");
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            })
        }

        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log("I am decoded: ",decode);
            req.user = decode;
            next();

        } catch(error){
            return  res.status(401).json({
                success: false,
                message: "Token is not valid",
            });
        }
    } catch (error) {
        console.log("Error in auth",error);
        return  res.status(500).json({
            success: false,
            message: "Token is not valid",
        });
    }
}


//student middleware
exports.isStudent = async(req,res,next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for student"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role is not verified",
        });
    }
}

//admin middleware
exports.isAdmin = async(req,res,next) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role is not verified",
        });
    }
}

//Instructor middleware
exports.isInstructor = async(req,res,next) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructor"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role is not verified",
        });
    }
}