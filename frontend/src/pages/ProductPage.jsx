import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice";
import { useAddToCartMutation } from "../slices/cartApiSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import Rating from "../components/Rating/Rating";
import Loader from "../components/Loader/Loader";
import Message from "../components/Message/Message";

const ProductPage = () => {
  const { id: productId } = useParams();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [addToCartItems] = useAddToCartMutation();

  const {
    data: productSelected,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const { data: orders } = useGetMyOrdersQuery();

  const { userInfo } = useSelector((state) => state.auth);

  let productNumber = null;

  if (orders) {
    orders.forEach((order) => {
      if (order.orderItems && order.orderItems.length > 0) {
        order.orderItems.forEach((orderItem) => {
          if (orderItem.product === productId) {
            productNumber = orderItem.product;
          }
        });
      }
    });
  }

  const addToCartHandler = async () => {
    try {
      await addToCartItems({
        productId: productSelected._id,
        quantity: qty,
      });
      refetch();
      toast.success("Item added to cart successfully");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col lg={5}>
              <Image
                src={productSelected.image}
                alt={productSelected.name}
                fluid
              />
            </Col>
            <Col lg={7}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{productSelected.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={productSelected.rating}
                    text={`${productSelected.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${productSelected.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {productSelected.description}
                </ListGroup.Item>
              </ListGroup>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${productSelected.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {productSelected.countInStock > 0
                          ? "In Stock"
                          : "Out Of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {productSelected.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <div className="d-flex">
                            <Button
                              variant="outline-secondary"
                              onClick={() => setQty(qty > 1 ? qty - 1 : qty)}
                            >
                              {" "}
                              -{" "}
                            </Button>
                            <Form.Control
                              className="mx-2"
                              as="select"
                              value={qty}
                              onChange={(e) => setQty(Number(e.target.value))}
                            >
                              {[
                                ...Array(productSelected.countInStock).keys(),
                              ].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </Form.Control>
                            <Button
                              variant="outline-secondary"
                              onClick={() =>
                                setQty(
                                  qty < productSelected.countInStock
                                    ? qty + 1
                                    : qty
                                )
                              }
                            >
                              {" "}
                              +{" "}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={productSelected.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="review">
            <Col md={6}>
              <h2>Reviews</h2>
              {productSelected.reviews.length === 0 && (
                <Message>No Reviews</Message>
              )}
              <ListGroup variant="flush">
                {productSelected.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                    <span className="text-success">
                      <FaCheckCircle className="mx-1"/>
                      Verified Purchase
                    </span>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>

                  {loadingProductReview && <Loader />}

                  {userInfo && productId === productNumber ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group className="my-2" controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className="my-2" controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <>
                      <div>
                        {!userInfo ? (
                          <Message variant="warning">
                            Please <Link to="/login">sign in</Link> to write a
                            review
                          </Message>
                        ) : (
                          <>
                            {productId !== productNumber ? (
                              <Message variant="warning">
                                Kindly make a purchase in order to review
                              </Message>
                            ) : null}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductPage;
