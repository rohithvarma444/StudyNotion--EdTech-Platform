import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false); 
        };
        document.body.appendChild(script);
    });
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    try {
        // Load the Razorpay SDK
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("Error loading Razorpay SDK");
            return;
        }

        // Make request to capturePayment endpoint
        const orderResponse = await apiConnector(
            'POST',
            COURSE_PAYMENT_API,
            courses,
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (!orderResponse?.data?.success) {
            toast.error("Error capturing payment request");
            return;
        }

        const options = {
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`, // Fixed typo: 'amounnt'
            order_id: orderResponse.data.message.id,
            name: "Rohith's StudyNotion",
            description: "Thank you for purchasing the course",
            prefill: {
                name: `${userDetails.firstName}`,
                email: userDetails.email,
            },
            handler: function (response) {
                verifyPayment({ ...response, courses }, token, navigate, dispatch); // Fix: Verify first, then send email
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
            toast.error("Payment failed");
            console.log(response.error);
        });
    } catch (error) {
        console.log("PAYMENT API ERROR...", error);
        toast.error("Could not complete payment");
    }
}

async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector(
            "POST",
            SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount,
            },
            {
                Authorization: `Bearer ${token}`, // Fix: Correct Authorization header
            }
        );
    } catch (error) {
        console.log("Payment Success Email Error...", error);
    }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment...");
    dispatch(setPaymentLoading(true));

    try {
        const response = await apiConnector(
            'POST',
            COURSE_VERIFY_API,
            bodyData,
            {
                Authorization: `Bearer ${token}`, // Fix: Corrected typo from "Beater" to "Bearer"
            }
        );

        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        toast.success("Payment successful! You are now enrolled in the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());

        sendPaymentSuccessEmail(bodyData, bodyData.amount, token); 

    } catch (error) {
        console.log("Payment Verification Error...", error);
        toast.error("Could not verify payment");
    } finally {
        toast.dismiss(toastId);
        dispatch(setPaymentLoading(false));
    }
}
