import React from "react";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { useGetProductsByCategoryQuery } from "../slices/productsApiSlice";
import Product from "../components/Product/Product";
import Loader from "../components/Loader/Loader";
import Message from "../components/Message/Message";

const ProductByCategoryPage = () => {
  const { category } = useParams();

  // Fetch products query
  const {
    data: fetchedProducts,
    isLoading,
    error,
  } = useGetProductsByCategoryQuery({ category });

  return (
    <div>
      <h2>Products in {category}</h2>
      <Row>
        <Col md={12}>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error.message}</Message>
          ) : (
            <Row>
              {fetchedProducts.map((product) => (
                <Col key={product._id} xs={6} md={4} xl={2} className="mb-3">
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductByCategoryPage;
