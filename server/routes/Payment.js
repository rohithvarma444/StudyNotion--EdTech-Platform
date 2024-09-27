const express = require("express");
const router = express.Router();

const {
    capturePayment,
    verifyPayment,
    sendPaymentSuccessEmail,
} = require("../controllers/Payments");

const { auth,isStudent,isAdmin,isInstructor} = require("../middleswares/auth");

router.post("/capturePatment",auth,isStudent,capturePayment);
router.post("/VerifyPayment",auth,isStudent,verifyPayment);
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);


module.exports = router