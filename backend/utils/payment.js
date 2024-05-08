import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const MySecretKey = process.env.PAYSTACK_SECRET_KEY;

if (!MySecretKey) {
  throw new Error("PAYSTACK_SECRET_KEY environment variable is not set!");
}

const paystack = () => {
  const initializePayment = async (form) => {
    try {
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        form,
        {
          headers: {
            Authorization: `Bearer ${MySecretKey}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error; // Re-throw for handling in calling code
    }
  };

  const verifyPayment = async (ref) => {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`,
        {
          headers: {
            Authorization: `Bearer ${MySecretKey}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error; // Re-throw for handling in calling code
    }
  };

  return { initializePayment, verifyPayment };
};

export default paystack;
