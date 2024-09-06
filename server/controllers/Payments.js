const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail
} = require("../mail/templates/courseEnrollment");

//capturing the payment
exports.capturePayment = async(req,res) => {
    const {course_id} = req.body;
    const userId = req.user.id;

    if(!course_id){
        return res.status(400).json({
            success: false,
            message: "CouseId not found",
        })
    }
    let course;
    try {
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success: false,
                message: "Couldn't find the course"
            })
        }

        const uid  = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success: false,
                message: "Students is already enrolled",
            })
        }
    } catch (error) {
        console.log("Error in capturing the payment request",error);
        return res.status(500).json({
            success: false,
            message: "error while capturing payment",
        })
    }

    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount*100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId,
        }
    }

    try {

        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail ,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        })
        
    } catch (error) {
        console.log("Error while creating payment order", error);
        return res.status(500).json({
            success: false,
            message: "Error while creating payment order",
        });
    }
}

//verifying the callbackURL() signature
exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678";
    const signature = req.headers['x-razorpay-signature'];

    // Initialize the HMAC with the secret
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
    if (signature === digest) {
        console.log("Payment is authorized");
        const { courseId, userId } = req.body.payload.entity.notes;

        try {
            // Enroll the student in the course
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true }
            );

            if (!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "Course not found",
                });
            }

            console.log(enrolledCourse);

            // Update the user's course list
            const userDetails = await User.findOneAndUpdate(
                { _id: userId },
                { $push: { courses: courseId } },
                { new: true }
            );

            console.log(userDetails);

            // Send course registration email
            await courseEnrollmentEmail(userDetails.email, enrolledCourse.courseName);

            return res.status(200).json({
                success: true,
                message: "Payment verified and course enrollment successful",
            });

        } catch (error) {
            console.log("Error in verifying payment", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    } else {
        return res.status(400).json({
            success: false,
            message: 'Signature mismatch, payment could not be verified',
        });
    }
};
