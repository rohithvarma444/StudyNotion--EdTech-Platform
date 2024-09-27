const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollment");
const crypto = require("crypto");
require("dotenv").config();
const sendPaymentSuccessEmail = require("../mail/templates/paymentSuccessEmail")

// capturing the payment
exports.capturePayment = async (req, res) => {
    const { courses } = req.body;
    const userId = req.user;

    let totalAmount = 0;

    try {
        for (const course_id of courses) {
            const course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found",
                });
            }

            totalAmount += course.price;

            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(400).json({
                    success: false,
                    message: "Student already enrolled in this course",
                });
            }
        }

        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: Math.random(Date.now()).toString(),
        };

        // Create an order instance
        const paymentResponse = await instance.orders.create(options);
        return res.status(200).json({
            success: true,
            message: paymentResponse,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error initiating payment",
        });
    }
};

exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
        return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        try {
            await enrollStudents(courses, userId, res);
            return res.status(200).json({
                success: true,
                message: "Payment verified and students enrolled",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error enrolling students",
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: "Invalid payment signature",
        });
    }
};


const enrollStudents = async(courses,userId,res) => {
    for(const courseId of courses){
        try {
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{studentsEnrolled:userId}},
                {$new: true}
            )

            if(!enrolledCourse) {
                return res.status(500).json({success:false,message:"Course not Found"});
            }

            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push:{
                        courses: courseId,
                    }
                },{new:true}
            )

            const emailResponse = await mailSender(
                enrollStudents.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName}`)
            )
        } catch (error) {
            
        }
    }
}


exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }

    try{
        //student ko dhundo
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
             paymentSuccessEmail(`${enrolledStudent.firstName}`,
             amount/100,orderId, paymentId)
        )
    }
    catch(error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
}