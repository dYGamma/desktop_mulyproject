const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP error:', error);
    } else {
        console.log('SMTP готов к работе:', success);
    }
});

/**
 * Отправка email
 * @param {object} options Объект с параметрами: subject, text, attachments, recipient
 */
async function sendMail({ subject, text, attachments, recipient = process.env.MAIL_USER }) {
    try {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: recipient,
            subject: subject,
            text: text
        };

        if (attachments) {
            mailOptions.attachments = attachments;
        }

        const result = await transporter.sendMail(mailOptions);
        console.log('Письмо отправлено:', result.messageId);
        return true;
        
    } catch (error) {
        console.error('Ошибка отправки:', error);
        return false;
    }
}

module.exports = { sendMail };
