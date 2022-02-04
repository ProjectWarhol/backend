const nodemailer = require('nodemailer');
const { resetTemplate, welcomeTemplate } = require('../../lib/mailTemplates');

require('dotenv').config();

const transportObject = {
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: false, // do not use process.env for this otherwise it won't work
  auth: {
    user: process.env.EMAIL_USER_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD,
  },
};

const sendMail = async (email, subject, template) => {
  const transporter = nodemailer.createTransport(transportObject);

  const response = await transporter.sendMail({
    from: `"CallGuru" <${process.env.EMAIL_USER_ACCOUNT}>`,
    to: `${email}`,
    subject: `${subject}`,
    text: `CallGuru - update Password instructions`,
    html: template,
  });

  return response;
};

exports.welcomeUser = (req, res, next) => {
  // send Welcome Mail
  const { user } = res.locals;
  sendMail(user.email, 'Welcome User', welcomeTemplate(user.invitationToken))
    .then(() => {
      res.status(200).send({
        message: 'User successfully invited',
        user,
      });
    })
    .catch((err) => {
      const error = new Error(
        'Something went wrong while sending invitation instructions'
      );
      error.err = err;
      next(error);
    });
};

exports.sendResetPasswordInstructions = (req, res, next) => {
  const { user } = res.locals;
  sendMail(user.email, 'Password Reset', resetTemplate(user.resetPasswordToken))
    .then(() => {
      res.status(200).send({
        message: 'reset password instructions successfully send',
      });
    })
    .catch((err) => {
      const error = new Error(
        'Something went wrong while sending reset password instructions'
      );
      error.err = err;
      next(error);
    });
};
