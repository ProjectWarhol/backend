const nodemailer = require('nodemailer');
const { resetTemplate, welcomeTemplate } = require('../../lib/templates');

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
    from: `"Warhol" <${process.env.EMAIL_USER_ACCOUNT}>`,
    to: `${email}`,
    subject: `${subject}`,
    text: `Warhol - update Password instructions`,
    html: template,
  });

  return response;
};

exports.welcomeUser = (req, res, next) => {
  const { user } = res.locals;
  sendMail(
    user.email,
    'Hello there fellow Jedi',
    welcomeTemplate(user.invitationToken)
  )
    .then(() => {
      res.status(200).send({
        message: 'User successfully invited',
        user,
      });
    })
    .catch((err) => {
      const error = new Error('Something went wrong while inviting user');
      error.err = err;
      next(error);
    });
};

exports.sendResetPasswordInstructions = (req, res, next) => {
  const { user } = res.locals;
  sendMail(
    user.email,
    'Reseting Password Instructions',
    resetTemplate(user.resetPasswordToken)
  )
    .then(() => {
      res.status(200).send({
        message: 'reset instructions successfully send',
      });
    })
    .catch((err) => {
      const error = new Error(
        'Something went wrong while sending reset instructions'
      );
      error.err = err;
      next(error);
    });
};
