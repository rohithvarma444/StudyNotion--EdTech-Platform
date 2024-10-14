const User = require("../models/User");
const { contactUsEmail } = require("../mail/templates/ContactFormRes");
const  mailSender  = require("../utils/mailSender"); 
require("dotenv").config();

exports.contactUs = async (req, res) => {
    const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
    console.log(req.body)
    try {
      const emailRes = await mailSender(
        email,
        "Your Data send successfully",
        contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
      )
      return res.json({
        success: true,
        message: "Email send successfully",
      })
    } catch (error) {
      console.log("Error", error)
      console.log("Error message :", error.message)
      return res.json({
        success: false,
        message: "Something went wrong...",
      })
    }
  }
