const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const contactRoutes = require("./routes/Contact");


const db = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

db.connect();
app.use(express.json()); 
app.use(cookieParser()); 
app.use(cors({
    origin: "https://studynotion-c1tnpvq7a-rohithvarma444s-projects.vercel.app",
    credentials: true,
}));

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

cloudinaryConnect();
app.use("/api/v1/auth", userRoutes);    
app.use("/api/v1/profile", profileRoutes); 
app.use("/api/v1/course", courseRoutes);  
app.use("/api/v1/payment", paymentRoutes); 
app.use("/api/v1/reach", contactRoutes);

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Server is running all fine",
    });
});

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
