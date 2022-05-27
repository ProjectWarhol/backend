const nodemailer = require('nodemailer');
const { resetTemplate } = require('../../lib/templates');

require('dotenv').config();

const transportObject = {
  service: 'hotmail', // using gmail requires added security authentication check nodemailer docs
  secure: false, // do not use process.env for this otherwise it won't work
  auth: {
    user: process.env.EMAIL_USER_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
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

exports.sendResetPasswordInstructions = async (req, res, next) => {
  const { email } = req.body;
  const { resetToken } = req.body.resetToken[0].dataValues;
  await sendMail(
    email,
    'Reseting Password Instructions',
    resetTemplate(resetToken)
  ).catch((err) => {
    const error = new Error(
      'Something went wrong while sending reset instructions'
    );
    error.err = err;
    next(error);
  });

  res.status(200).send({
    message: 'reset instructions successfully send',
  });
};
