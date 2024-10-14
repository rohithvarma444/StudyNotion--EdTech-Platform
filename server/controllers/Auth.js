const User = require("../models/User");
const OTP = require("../models/OTP");
const optGenerator = require("otp-generator");
var bcrypt = require('bcryptjs');
const Profile = require('../models/Profile');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");

//generate-otp
exports.sendOTP = async(req,res) => {

    try {
        const {email} = req.body;

        const checkUserPresent = await User.findOne({email});

        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message: 'User already registered',
            })
        }

        var otp = optGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });


        let unique = await OTP.findOne({otp: otp})

        while(unique){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = OTP.findOne({otp: otp});
        }


         const otpPayload = {email,otp};
         const otpBody = await OTP.create(otpPayload);

         res.status(200).json({
            success:true,
            message: "OTP sent Successfully",
            otp,
         })
    } catch (error) {
        console.log("Error at otp generation:",error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        })
    }
}

//sign-up
exports.signUp = async(req,res) => {
    try {
        const { 
            firstName,
            lastName,
            email,
            contactNumber,
            password,
            accountType,
            confirmPassword,
            otp
        } = req.body;
    
    
        // checking for input fields
        if( !firstName || !lastName || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }
    
        //checking for password and confrimPassword
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password values do not match",

            });
        }
    
        // check if the user already exsists
        const checkIfUserExsists = await User.findOne({email});
        if(checkIfUserExsists){
            return res.status(400).json({
                status: false,
                message: 'User already exists',

            });
        }
    
        //checking for valid OTP
        const recentOTP = await OTP.find({email: email}).sort({created_at : -1}).limit(1);
        if(recentOTP.length == 0){
            return res.status(400).json({
                success: false,
                message: "OTP not valid"
            })
        } else if(otp != recentOTP[0].otp){
            return res.status(400).json({
                success:false,
                message: "Invalid OTP",
            });
        }
    
    
        //hashing password and storing it in database
        const hashedPassword = await bcrypt.hash(password,10);
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        })

        return res.status(200).json({
            success:true,
            message:'User is successfully registered'
        });
    } catch (error) {
        console.log("Error while registering the user:",error);
        res.status(500).json({
            success:false,
            message:"User cannot be registered successfully please try again"
        })
    }
}


//sign-in
exports.signIn = async(req,res) => {
    try {
        const { email,password } = req.body;


        //check for empty-fields
        if( !email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        //check if user exsists?
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message: "User is not registered, please signup first"
            });
        }

        //checking the password 
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
                sameSite: 'Strict',
            }
    
            res.cookie("TOKEN",token,options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in Succesfully"
            })
        }
        else{
            return res.status(401).json({
                success: false,
                message:'Password is incorrect'
            });
        }
    } catch (error) {
        console.log("Error in logging in User",error);
        res.status(500).json({
            success:false,
            message:"Error in logging  in user"
        });
    }
}

//update-password
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword, email } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                status: false,
                message: "All the fields are required",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                status: false,
                message: "Password and Confirm Password fields do not match",
            });
        }

        const sendPasswordResetEmail = async (email) => {
            try {
                const mailResponse = await mailSender(email, "Password reset mail sent successfully");
                console.log("Email sent successfully", mailResponse);
            } catch (error) {
                console.log("Error while sending password reset email:", error);
                throw error;
            }
        }

        const user = await User.findById(req.user.id);
        if (await bcrypt.compare(oldPassword, user.password)) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            user.password = hashedPassword;
            await user.save();

            await sendPasswordResetEmail(email); 
            return res.status(200).json({
                status: true,
                message: "Password updated successfully",
            });

        } else {
            return res.status(400).json({
                status: false,
                message: "Old Password is incorrect",
            });
        }
    } catch (error) {
        console.log("Error occurred while updating password:", error);
        return res.status(500).json({
            status: false,
            message: "Cannot update the password, please try again later",
        });
    }
};
