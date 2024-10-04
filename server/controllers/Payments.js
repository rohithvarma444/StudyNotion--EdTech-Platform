const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollment");
const crypto = require("crypto");
require("dotenv").config();
const sendPaymentSuccessEmail = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress")


// Capturing the payment
exports.capturePayment = async (req, res) => {
    console.log("--------------------------------------");
    console.log("Here In Payment: ", req.body);
    console.log("--------------------------------------");
    
    const { courses } = req.body;
    const userId = req.user;

    let totalAmount = 0;

    if (!Array.isArray(courses) || courses.length === 0) {
        return res.status(400).json({ success: false, message: "Courses must be a non-empty array" });
    }

    try {
        for (const course_id of courses) {
            const course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            // Validate course price
            if (!course.price || typeof course.price !== 'number') {
                return res.status(400).json({ success: false, message: "Invalid course price" });
            }

            totalAmount += course.price;

            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(400).json({ success: false, message: "Student already enrolled in this course" });
            }
        }

        const options = {
            amount: totalAmount * 100, // Convert to paise
            currency: "INR",
            receipt: `${Date.now()}_${Math.floor(Math.random() * 10000)}`, // Unique receipt ID
        };

        // Create an order instance
        const paymentResponse = await instance.orders.create(options);
        console.log("Payment Response: ", paymentResponse); // Log payment response for debugging
        return res.status(200).json({ success: true, message: paymentResponse });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error initiating payment" });
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

            console.log("--------------------------------");
            console.log("Signature Verified");
            console.log("---------------------------------")
            await enrollStudents(courses, userId);
            return res.status(200).json({ success: true, message: "Payment verified and students enrolled" });
        } catch (error) {
            console.error("Error enrolling students:", error);
            return res.status(500).json({ success: false, message: "Error enrolling students" });
        }
    } else {
        return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
};

const enrollStudents = async (courses, userId) => {
    console.log("Am I reaching here?");
    for (const courseId of courses) {
        try {
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true } 
            );

            if (!enrolledCourse) {
                throw new Error("Course not found");
            }

            console.log("Step-1 ")
            const courseProgress = await CourseProgress.create({
                courseId: courseId,
                userId: userId,
                completedVideo: [],
            });

            console.log("Step-2");
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: courseProgress._id
                    }
                },
                { new: true }
            );

            console.log("Step-3");
            if (enrolledStudent) {
                await mailSender(
                    enrolledStudent.email,
                    `Successfully Enrolled into ${enrolledCourse.courseName}`,
                    courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
                );
            }
        } catch (error) {
            console.error("Error during enrollment process:", error);
            throw error; // Rethrow to handle in verifyPayment
        }
    }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({ success: false, message: "Please provide all the fields" });
    }

    try {
        const enrolledStudent = await User.findById(userId);
        if (!enrolledStudent) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        
        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`, amount / 100, orderId, paymentId)
        );

        return res.status(200).json({ success: true, message: "Payment success email sent" });
    } catch (error) {
        console.error("Error in sending mail", error);
        return res.status(500).json({ success: false, message: "Could not send email" });
    }
};
