import TopProduct from "../components/Product/TopProduct";
import LatestProducts from '../components/Product/LatestProducts'
import MostPurchasedProducts from '../components/Product/MostPurchasedProducts'
import ProductByCategory from "../components/Product/ProductByCategory";

const HomePage = () => {
  return (
    <div>
      <TopProduct />
      <LatestProducts />
      <MostPurchasedProducts />
      <ProductByCategory category="Lubricants" />
      <ProductByCategory category="Batteries" />
      <ProductByCategory category="Belts" />
      <ProductByCategory category="Filters" />
    </div>
  );
};

export default HomePage;
