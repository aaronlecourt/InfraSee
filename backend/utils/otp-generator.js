import otpGenerator from "otp-generator";

const generateOtp = () => {
  return otpGenerator.generate(6, {
    digits: true,
    specialChars: false,
    alphabets: false,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
  });
};

export default generateOtp;
