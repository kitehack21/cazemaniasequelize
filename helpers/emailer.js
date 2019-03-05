
const nodemailer = require('nodemailer');
var fs = require('fs');
var handlebars = require('handlebars')
const { sequelize, generalSetting } = require('../models');

// import logger from '../log/logger';
// import { generalSetting } from '../database/models';

module.exports = {
    emailer(to, subject, html, replacements, attachments){
        console.log(email, password, to)
        let transporter = nodemailer.createTransport({
            secure: true,
            service: 'gmail',
            auth: {
                    user: 'cazemania.official@gmail.com',
                    pass: 'Tambunbekasi123'
                },
            tls: {
                rejectUnauthorized: false
            }
        });

        // read and parse HTML template fiel
        fs.readFile(html, {encoding: 'utf-8'}, (err, readHTML) => {
            if(err){
                return false
            }
            else{
                var template = handlebars.compile(readHTML);
                var htmlToSend = template(replacements);

                // setup email data with unicode symbols
                let mailOptions = {
                    from: `"Purwadhika" <${email}>`, // sender address
                    to: to, // 'hasbifadillah@outlook.com', // list of receivers
                    subject: subject, // 'Hello ✔', // Subject line
                    // text: text || '', // plain text body
                    html: htmlToSend || '', // html body
                    attachments: attachments
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        // logger.error(error.message);
                        console.log("emailer error", error.message)
                        return false;
                    }
                    console.log("sent", info)
                    return true;
                    // console.log('Message sent: %s', info.messageId);
                    // // Preview only available when sending through an Ethereal account
                    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                    // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });
            }
        })
    }
}