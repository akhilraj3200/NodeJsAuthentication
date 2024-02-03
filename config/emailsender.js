const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider
    auth: {
        user: 'uchiha.sasuke.ly3200@gmail.com', // Your email address
        pass: 'tlpk pdjo rvqa pedo' // Your email password or app password (for Gmail)
    }
});

function sendEmail(to, subject, text) {
    // Define email options
    const mailOptions = {
        from: 'uchiha.sasuke.ly3200@gmail.com', // Sender address
        to: to, // List of recipients
        subject: subject, // Subject line
        text: text // Plain text body
    };

    // Send email
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = function sendEmail(to, subject, text) {
    // Define email options
    const mailOptions = {
        from: 'uchiha.sasuke.ly3200@gmail.com', // Sender address
        to: to, // List of recipients
        subject: subject, // Subject line
        text: text // Plain text body
    };

    // Send email
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}
;

// Example usage
