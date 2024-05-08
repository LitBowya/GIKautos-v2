import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/Message/Message";
import CheckoutSteps from "../components/Checkout Steps/CheckoutSteps";
import Loader from "../components/Loader/Loader";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import {
  useGetCartItemsQuery,
  useClearCartItemsMutation,
} from "../slices/cartApiSlice";

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const { data: cartItems } = useGetCartItemsQuery();
  const [clearCartItems] = useClearCartItemsMutation();

  const calculateTotalItemPrice = () => {
    if (!cartItems || cartItems.length === 0) return 0;

    return cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  };

  const totalPrice = calculateTotalItemPrice() + cart.shippingPrice;

  const clearCartHandler = async () => {
    try {
      await clearCartItems();
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const orderItems =
    cartItems &&
    cartItems.map((item) => ({
      _id: item._id,
      product: {
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
      },
      qty: item.quantity,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
    }));

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: orderItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: calculateTotalItemPrice(),
        shippingPrice: cart.shippingPrice,
        totalPrice: totalPrice,
      }).unwrap();
      await clearCartHandler();
      navigate(`/order/${res._id}`);
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  };

  const orderNow = async () => {
    try {
      const res = await createOrder({
        orderItems: orderItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: calculateTotalItemPrice(),
        shippingPrice: cart.shippingPrice,
        totalPrice: totalPrice,
      }).unwrap();
      await clearCartHandler();
      navigate(`/order/${res._id}`);
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>Shipping</h4>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Payment Method</h4>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Order Items</h4>
              {cartItems && cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems && (
                    <div>
                      {cartItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row className="d-flex align-items-center">
                            <Col md={2}>
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col>
                              <Link to={`/product/${item.product}`}>
                                {item.product.name}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {parseInt(item.quantity)} x ${item.product.price}{" "}
                              = $
                              {(
                                parseInt(item.quantity) * item.product.price
                              ).toFixed(2)}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </div>
                  )}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h4>Order Summary</h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${calculateTotalItemPrice().toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && (
                  <Message variant="danger">{error.data.message}</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                {cart.paymentMethod === "On Delivery" ? (
                  <Button
                    type="button"
                    className="btn-block w-100"
                    disabled={cartItems && cartItems === 0}
                    onClick={placeOrderHandler}
                  >
                    Order Now
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="btn-block w-100"
                    disabled={cartItems && cartItems === 0}
                    onClick={orderNow}
                  >
                    Order Now
                  </Button>
                )}
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderPage;
