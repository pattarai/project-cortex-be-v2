const nodemailer = require("nodemailer")

export const sendPassword = (receiver: string, password: string): void => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
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