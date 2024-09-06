const nodemailer = require("nodemailer");

const mailSender = async(email,title,body) => {
    try {

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })

        let info = await transporter.sendMail({
            from: 'Edumy || Support by r0h17h',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        console.log(info);
        return info;
    } catch (error) {
        console.log("Error occured in nodemailer config:",error);
        throw error;
    }
}

module.exports =  mailSender;