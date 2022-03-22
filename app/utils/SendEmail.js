const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');
require('dotenv').config();

// const SendEmail = async options =>{

//     // Create Transforter
//     const transPorter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         service: 'SendGrid',      
//         auth: {
//             user: process.env.SEND_GRID_USERNAME,
//             pass: process.env.SEND_GRID_PASSWORD
//         }
//     });

//     // Email Options
//     const mailOptions = {
//         from: "Natours-App <hsoni2962@gmail.com>",
//         to: options.email,
//         subject: options.subject,
//         text: options.msg
//     }


//     // Actually send Email
//     await transPorter.sendMail(mailOptions);

// }

class sendEmail{

    constructor(user, url){
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
    }

    newTransport(){

        // Production environment
        if(process.env.NODE_ENV === 'production'){

            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                service: 'SendGrid',      
                auth: {
                    user: process.env.SEND_GRID_USERNAME,
                    pass: process.env.SEND_GRID_PASSWORD
                }
            })
            
        }

        // For Development Enviroment
        else{
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            })
        }

    }


    // Send real email
    async sendMail(subject, msg){

        const html = pug.renderFile(`${__dirname}/../../views/email/welcome.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
          });
      

        // Email Options
        const mailOptions = {
            from: `Natours-App <${process.env.SEND_GRID_VERIFY_EMAIL}>`,
            to: this.to,
            subject: subject,
            text: msg,
            html
        }

        // Actually send Email
        await this.newTransport().sendMail(mailOptions);
    }


    // Welcome email
    async welcome(subject, msg){
        await this.sendMail(subject, msg);
    }

    // resetToken email
    async resetTokenEmail(subject, msg){
        await this.sendMail(subject, msg);
    }

}

module.exports = sendEmail;