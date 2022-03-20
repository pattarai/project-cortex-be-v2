import * as nodemailer from "nodemailer"
require('dotenv').config();

export const sendPassword = (receiver: string, password: string): void => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "infantvalan02@gmail.com",
            pass: "nfnviufphnoqzgho",
        },
    });

    var mailOptions = {
        from: "Project Cortex",
        to: receiver,
        subject: "Account Password",
        text: "Your new password is " + password,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });

}