const nodemailer = require('nodemailer');

module.exports = {
    mailer(){
        return (
            nodemailer.createTransport({
                service: 'gmail',
                auth: {
                        user: 'cazemania.official@gmail.com',
                        pass: 'Tambunbekasi123'
                    },
                tls: {
                    rejectUnauthorized: false
                }
            })
        )
    }
}