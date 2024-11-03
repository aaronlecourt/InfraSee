import axios from 'axios';

const SEMAPHORE_API_KEY = process.env.SEMAPHORE_API_KEY
const SEMAPHORE_BASE_URL = process.env.SEMAPHORE_BASE_URL;

export const sendSMS = async (phoneNumber, message) => {
  try {
    const response = await axios.post(SEMAPHORE_BASE_URL, null, {
      params: {
        apikey: SEMAPHORE_API_KEY,
        number: phoneNumber,
        message: message,
      },
    });
    console.log('SMS sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw error;
  }
};