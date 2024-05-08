import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { useGetProductsByCategoryQuery } from "../../slices/productsApiSlice";
import Product from "../Product/Product";
import Loader from "../Loader/Loader";
import Message from "../Message/Message";

const ProductByCategory = ({ category }) => {
  const {
    data: products,
    isLoading,
    error,
  } = useGetProductsByCategoryQuery({ category });

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.message}</Message>
      ) : products && products.length > 0 ? (
        <div>
          <h2>Products in {category}</h2>
          <Link to={`/category/${category}`}>see more</Link>
          <Row>
            {products.slice(0, 6).map((product) => (
              <Col key={product._id} xs={6} md={4} xl={2} className="mb-3">
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <Message variant="info">No products available</Message>
      )}
    </div>
  );
};

export default ProductByCategory;
