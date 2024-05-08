import { Row, Col } from "react-bootstrap";
import { useGetAllProductsQuery } from "../slices/productsApiSlice";
import Product from "../components/Product/Product";
import Loader from "../components/Loader/Loader";
import Message from "../components/Message/Message";

const ShopPage = () => {
  const { data: products, isLoading, error } = useGetAllProductsQuery();

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.message}</Message>
      ) : products && products.length > 0 ? (
        <div>
          <h2>Shop</h2>
          <Row>
            {products.map((product) => (
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

export default ShopPage;
