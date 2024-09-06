const express = require("express");
const router = express.Router();

const {
    capturePayment,
    verifySignature,
} = require("../controllers/Payments");

const { auth,isStudent,isAdmin,isInstructor} = require("../middleswares/auth");

router.post("/capturePatment",auth,isStudent,capturePayment);
router.post("/verifySignature",verifySignature);

module.exports = router