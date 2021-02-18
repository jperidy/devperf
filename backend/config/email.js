const nodemailer = require("nodemailer");

async function sendAMail(subject, to, html) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    //let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.GMAIL_HOST,
        port: process.env.GMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.GMAIL_USER, // generated ethereal user
            pass: process.env.GMAIL_PASS, // generated ethereal password
        },
    });

    /*
    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });
    */

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"PefApp" <jprdevapp@gmail.com>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: "Hello world?", // plain text body
        html: html, // html body
    });

    console.log("Message sent: %s", info.response);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    return info;

}

module.exports = { sendAMail };