import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useGetCartItemsQuery,
  useRemoveFromCartMutation,
  useClearCartItemsMutation,
  useUpdateCartItemMutation,
} from "../slices/cartApiSlice";
import Message from "../components/Message/Message";
import Loader from "../components/Loader/Loader";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    data: cartItems,
    isLoading: cartItemsLoading,
    refetch,
  } = useGetCartItemsQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCartItems, { loading: clearCartLoading, isError, error }] =
    useClearCartItemsMutation();
  
  const [updateCartItem] = useUpdateCartItemMutation();

  useEffect(() => {
    refetch();
  }, [cartItems, refetch]);

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const removeItemHandler = async (productId) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        await removeFromCart(productId);
        refetch();
        toast.success("Item removed from cart");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    try {
      await updateCartItem({ productId, quantity });
      refetch();
      toast.success("Cart item quantity updated");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const clearCartItemsHandler = async () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      try {
        await clearCartItems();
        refetch();
        toast.success("Cart cleared");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  const subtotal = cartItems
    ? cartItems.reduce(
        (acc, item) => acc + item.quantity * item.product.price,
        0
      )
    : 0;
  const totalItems = cartItems
    ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  return (
    <Row>
      <Col md={8}>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="my-2">Shopping Cart</h1>
          {clearCartLoading ? (
            <Loader />
          ) : (
            <div className="">
              <Button className="d-block" onClick={clearCartItemsHandler}>
                Clear Cart
              </Button>
            </div>
          )}
        </div>
        {isError && <Message variant="danger">{error.message}</Message>}
        {cartItemsLoading ? (
          <Loader />
        ) : (
          <Card className="px-2 py-1">
            {cartItems && cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id} className="my-2 rounded-3">
                    <Row className="my-2 rounded d-flex align-items-center">
                      <Col md={2}>
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fluid
                          rounded
                        />
                      </Col>
                      <Col md={4}>
                        <Link to={`/product/${item.product._id}`}>
                          {item.product.name}
                        </Link>
                      </Col>
                      <Col md={2}>${item.product.price}</Col>
                      <Col md={2}>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => {
                              const newQty = item.quantity - 1;
                              if (newQty >= 1) {
                                updateCartItemQuantity(
                                  item.product._id,
                                  newQty
                                );
                              }
                            }}
                          >
                            -
                          </Button>

                          <span className="mx-2">{item.quantity}</span>

                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => {
                              const newQty = item.quantity + 1;
                              if (newQty <= item.product.countInStock) {
                                updateCartItemQuantity(
                                  item.product._id,
                                  newQty
                                );
                              }
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </Col>

                      <Col md={2}>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => removeItemHandler(item.product._id)}
                        >
                          <FaTrash />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Subtotal ({totalItems} items)</h2>
              <p>Total Price: ${subtotal.toFixed(2)}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block w-100"
                disabled={cartItems && cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartPage;
