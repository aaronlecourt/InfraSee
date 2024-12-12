import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send OTP email
const sendOtpEmail = async (user, otp) => {
  const mailOptions = {
    from: "i.iirs.infrasee@gmail.com",
    to: user.email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

// Function to send Welcome email
const sendWelcomeEmail = async (user, name, email, password) => {
  const mailOptions = {
    from: "i.iirs.infrasee@gmail.com",
    to: user.email,
    subject: "Welcome to Infrasee - Your Account Details",
    text: `Hello ${name},

Welcome to the Infrasee system! We are excited to have you on board as a valued ${user.isSubModerator ? 'sub-moderator' : 'moderator'} representing ${name}. Thank you for applying as a user of Infrasee a platform dedicated to streamlining infrastructure issue reporting and resolution.  

Here are the details of your account:  
Email Address: ${email}  
Temporary Password: ${password}

Please log in using these credentials at https://infrasee.onrender.com/moderator/login. For security reasons, we recommend changing your password immediately upon logging in.  

To change your password, follow these steps:
1) Login using the provided account details above.
2) Click on the '${user.isSubModerator ? 'S' : 'M'}' account avatar on the top-right corner of your screen.
3) Go to Settings, then go to the Security tab
4) Provide the required password details. Click on 'Update Password' when finished.

${user.isSubModerator ?
  `As a sub-moderator, you will have access to tools and resources designed to help you efficiently verify the resolution times made by moderators of the reports related to your company's services.` :
  `As a moderator, you will have access to tools and resources designed to help you efficiently manage reports related to your company's services.`
}

Should you have any questions or require assistance, feel free to reach out to us.

Thank you for joining Infrasee. We look forward to your contributions in improving infrastructure services for the community.  

Best regards,  
The Infrasee Team

`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent to moderator:", user.email);
  } catch (error) {
    console.error("Error sending welcome email to moderator:", error);
    throw new Error("Failed to send welcome email to moderator");
  }
};


export { sendOtpEmail, sendWelcomeEmail };
