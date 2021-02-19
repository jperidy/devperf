const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require('path');

const __dir = path.resolve();

class MailService {
    constructor(host, port, user, password) {
        const options = {
            viewEngine: {
                partialsDir: __dir + "/backend/views/partials",
                layoutsDir: __dir + "/backend/views/layouts",
                extname: ".hbs",
            },
            extName: ".hbs",
            viewPath: "backend/views"
        };

        this._transporter = nodemailer.createTransport({
            host: process.env.GMAIL_HOST,
            port: process.env.GMAIL_PORT,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        this._transporter.use("compile", hbs(options));
    }
    sendMail({ to, subject, template, context, attachments }) {
        //console.log(__dir);
        return this._transporter.sendMail({
            to,
            from: process.env.GMAIL_USER,
            subject,
            template,
            context,
            attachments
        });
    }
}

module.exports = MailService;