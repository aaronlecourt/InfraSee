import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Function to send OTP email
const sendOtpEmail = async (user, otp) => {
  const mailOptions = {
    from: 'ortizlester777@gmail.com',
    to: user.email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

export default sendOtpEmail;
