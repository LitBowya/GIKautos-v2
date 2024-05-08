import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import {
  useAcceptPaymentMutation,
  useGetOrderDetailsQuery,
} from "../../slices/ordersApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const PayStack = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { id: orderId } = useParams();
  const { data: order } = useGetOrderDetailsQuery(orderId);

  const [acceptPayment, { isLoading, isError, error }] =
    useAcceptPaymentMutation();

  const handlePayment = async () => {
    try {
      const paymentDetails = {
        name: userInfo.name,
        email: userInfo.email,
        amount: Math.round(Number(order.totalPrice)),
      };

      const response = await acceptPayment(paymentDetails);
      const authorizationUrl = response.data.data?.authorization_url;

      if (authorizationUrl) {
        localStorage.setItem("paymentResponse", JSON.stringify(response.data));
        window.location.href = authorizationUrl;
      }
    } catch (error) {
      console.error("Error accepting payment:", error);
    }
  };

  return (
    <div>
      {/* Render payment button */}
      <Button onClick={handlePayment} disabled={isLoading} className="d-block w-100">
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>

      {/* Render error message if any */}
      {isError && toast.error(error.message)}
    </div>
  );
};

export default PayStack;
