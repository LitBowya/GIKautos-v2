import React from "react";
import Rating from "../Rating/Rating";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    <>
      {product.countInStock === 0 ? (
        <Card className="my-3 rounded" style={{ height: "300px" }}>
          <>
            <div
              style={{
                textDecoration: "none",
                filter: "grayscale",
                opacity: "0.4",
                pointerEvents: "none",
                cursor: "not-allowed",
              }}
            >
              <Card.Img
                src={product.image}
                variant="top"
                style={{
                  textDecoration: "none",
                  filter: "grayscale",
                  opacity: "0.4",
                  pointerEvents: "none",
                  cursor: "not-allowed",
                  height: "200px",
                }}
                className="p-1"
              />

              <Card.Body className="p-2">
                <div
                  style={{
                    textDecoration: "none",
                    color: "gray",
                  }}
                >
                  <Card.Title as="div" className="product-title">
                    <span>{product.name}</span>
                  </Card.Title>
                </div>

                <span>Out Of Stock</span>

                <Card.Text as="p">${product.price}</Card.Text>
              </Card.Body>
            </div>
          </>
        </Card>
      ) : (
        <Card className="my-3 rounded" style={{ height: "300px" }}>
          <div>
            <Link to={`/product/${product._id}`}>
              <Card.Img
                src={product.image}
                variant="top"
                className="p-1"
                style={{ height: "180px" }}
              />
            </Link>

            <Card.Body className="p-2">
              <Link
                to={`/product/${product._id}`}
                style={{
                  textDecoration: "none",
                  color: "orange",
                }}
              >
                <Card.Title as="div" className="product-title">
                  <span>{product.name}</span>
                </Card.Title>
              </Link>

              <Card.Text as="div">
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </Card.Text>

              <Card.Text as="p">${product.price}</Card.Text>
            </Card.Body>
          </div>
        </Card>
      )}
    </>
  );
};

export default Product;
