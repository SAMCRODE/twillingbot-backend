const nodemailer = require('nodemailer');
const config = require('../config/email');

// eslint-disable-next-line require-jsdoc
async function sendResetPassEmail(code, email) {
  const transporter = nodemailer.createTransport({
    host: config.smtpServer,
    port: 587,
    secure: false,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  await transporter.sendMail({
    from: '"TwillingInc 👻" <twilling@contact.com>',
    to: email,
    subject: 'Seu código para alterar a senha',
    text: `Seu código para alterar o password é ${code}`,
    html: `Digite o código ${code} 
    para poder alterar a sua senha`,
  });

//   console.log(info);
}

module.exports = {
  sendResetPassEmail: sendResetPassEmail,
};
