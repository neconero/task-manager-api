const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from:'neroneco9@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}, Let me know how you get along with the app`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from:'neroneco9@gmail.com',
        subject: 'Cancellation',
        text: `Bye, ${name}, Is there anything we would have done`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}

