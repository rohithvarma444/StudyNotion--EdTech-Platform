const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");

//generating the token for password reset
exports.resetPasswordToken = async(req,res) => {

    try {
        const email = req.body.email;
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message: "Your Email is not registered with us"
            })
        }
        const token = crypto.randomUUID();
    
        const updateDetails = await User.findOneAndUpdate(
            {email:email},
            {
                token: token,
                resetPasswordExpires: Date.now() + 5*60*1000,
            },
            {new:true}
        );
        const url = `https://studynotion-c1tnpvq7a-rohithvarma444s-projects.vercel.app/update-password/${token}`;
        await mailSender(email,"Password reset link",`Password Reset Link ${url}`);
    
        return res.status(200).json({
            success:true,
            message: "Password reset link sent to your mail",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Error in forgot password",
        })
    }

}

//password reset functionality
exports.resetPassword = async(req,res) => {
    const {password, confirmPassword,token } = req.body;

    if(password != confirmPassword){
        return res.status(401).json({
            success:false,
            message:"Password and confirm Password fields are not same",
        })
    }

    const userDetails = await User.findOne( {token: token});

    if(!userDetails){
        return res.json({
            success: false,
            message: "Token is not valid",
        });
    }
    
    if(userDetails.resetPasswordExpires < Date.now()){
        return res.json({
            success: false,
            message: "Token expired",
        });
    }

    const hashedPassword = await bcrypt.hash(password,10);

    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true},
    );
     return res.json({
        success:true,
        message:"Successfully resetted the password"
     })
}