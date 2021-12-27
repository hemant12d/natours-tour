const nodemailer = require('nodemailer');
require('dotenv').config();

const SendEmail = async options =>{

    // Create Transforter
    const transPorter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Email Options
    const mailOptions = {
        from: "Natours-App <natours@camp.io>",
        to: options.email,
        subject: options.subject,
        text: options.msg
    }


    // Actually send Email
    await transPorter.sendMail(mailOptions);

}

module.exports = SendEmail;