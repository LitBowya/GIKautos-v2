import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { PAYSTACK_URL } from "../../constants.js";
import { usePayOrderMutation } from "../../slices/ordersApiSlice.js";
import Message from "../Message/Message.jsx";

const VerifyPayment = ({ orderId }) => {
  const [reference, setReference] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [payOrder] = usePayOrderMutation();

  useEffect(() => {
    // Fetch the reference from paymentResponse stored in localStorage when the component mounts
    const paymentResponse = JSON.parse(localStorage.getItem("paymentResponse"));
    if (
      paymentResponse &&
      paymentResponse.data &&
      paymentResponse.data.reference
    ) {
      setReference(paymentResponse.data.reference);
    }
  }, []);

  const handleVerifyPayment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${PAYSTACK_URL}/verifypayment/${reference}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to your verify payment");
      }

      const data = await response.json();

      setIsLoading(false);
      setVerificationResult(data);
      localStorage.removeItem("paymentResponse");

      if (data.status) {
        await payOrder({ orderId: orderId, details: { isPaid: true } });
      }

      window.location.reload()
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  return (
    <div>
      <Button
        variant="info"
        onClick={handleVerifyPayment}
        disabled={isLoading}
        className="text-white my-2 d-block w-100"
      >
        Verify Payment
      </Button>
      {isLoading && <p>Loading...</p>}
      {error && <Message variant="danger">{error.message}</Message>}
      {verificationResult && (
        <Message variant="success">
          {verificationResult.status ? "Successful" : "failed"}!
        </Message>
      )}
    </div>
  );
};

export default VerifyPayment;
