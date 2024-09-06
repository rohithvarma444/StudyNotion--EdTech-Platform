const User = require("../models/User");
const {contactForm} = require("../mail/templates/contactForm");
const { mailSender } = require("../utils/mailSender");
require("dotenv").config();

exports.contactUs = async(req,res) => {
    try {
        const { firstName, lastName, email, phoneNumber, message} = req.body;

        if(!firstName||!lastName||!email||!phoneNumber||!message){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //sending mails
        await mailSender(email,contactForm(firstName,lastName,email,phoneNumber,message));
        await mailSender(process.env.ADMIN_MAIL,"you have received a query ",message);


        return res.status(200).json({
            success: true,
            message: "contact us submitted successfully",
        })
    } catch (error) {
        console.error("Error occurred while submitting contact us form", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while submitting the form. Please try again later.",
        });
    }
}