import { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/Form/FormContainer";
import CheckoutSteps from "../components/Checkout Steps/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState("PayStack");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <span>
              <Form.Check
                type="radio"
                label="PayStack"
                id="PayStack"
                name="paymentMethod"
                value="PayStack"
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </span>
            <span>
              <Form.Check
                type="radio"
                label="On Delivery"
                id="On Delivery"
                name="paymentMethod"
                value="On Delivery"
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </span>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
