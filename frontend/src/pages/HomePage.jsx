
import { Container } from "react-bootstrap";
import TopProduct from "../components/Product/TopProduct";
import LatestProducts from '../components/Product/LatestProducts'
import MostPurchasedProducts from '../components/Product/MostPurchasedProducts'
import ProductByCategory from "../components/Product/ProductByCategory";

const HomePage = () => {
  return (
    <Container>
      <TopProduct />
      <LatestProducts />
      <MostPurchasedProducts />
      <ProductByCategory category="Lubricants" />
      <ProductByCategory category="Batteries" />
      <ProductByCategory category="Belts" />
      <ProductByCategory category="Filters" />
    </Container>
  );
};

export default HomePage;
