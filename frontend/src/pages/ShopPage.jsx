import React, { useState } from "react";
import { Row, Col, Form, Container } from "react-bootstrap";
import {
  useGetAllProductsQuery,
  useGetBrandsQuery,
  useGetCategoriesQuery,
} from "../slices/productsApiSlice";
import Product from "../components/Product/Product";
import Loader from "../components/Loader/Loader";
import Message from "../components/Message/Message";

const ShopPage = () => {
  const [filters, setFilters] = useState({
    category: "",
    brand: [],
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useGetAllProductsQuery(filters);
  const {
    data: brandsData,
    isLoading: brandsLoading,
    error: brandsError,
  } = useGetBrandsQuery(filters.category);
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();

  const brands = brandsData || [];
  const categories = categoriesData || [];

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "category") {
      const updatedCategory = checked ? value : ""; // Toggle the category selection
      setFilters({ ...filters, category: updatedCategory, brand: [] }); // Reset brand filter when category changes
    } else if (name === "brand") {
      const updatedBrands = checked
        ? [...filters.brand, value]
        : filters.brand.filter((brand) => brand !== value);
      setFilters({ ...filters, brand: updatedBrands });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  return (
    <Container>
      <div>
        <h2>Shop</h2>
        <Row>
          <Col md={3}>
            {/* Filters */}
            <Form>
              {/* Category filter */}
              <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                {categoriesLoading ? (
                  <Loader />
                ) : categoriesError ? (
                  <p>Brands</p>
                ) : (
                  <div>
                    {categories.map((category) => (
                      <Form.Check
                        key={category}
                        type="checkbox"
                        label={category}
                        id={`category-${category}`}
                        name="category"
                        value={category}
                        checked={filters.category === category}
                        onChange={handleFilterChange}
                      />
                    ))}
                  </div>
                )}
              </Form.Group>
              {/* Brand filter */}
              <Form.Group controlId="brand">
                <Form.Label>Brand</Form.Label>
                {brandsLoading ? (
                  <Loader />
                ) : brandsError ? (
                  <Message>{brandsError.message}</Message>
                ) : (
                  <div>
                    {brands.map((brand) => (
                      <Form.Check
                        key={brand}
                        type="checkbox"
                        label={brand}
                        id={`brand-${brand}`}
                        name="brand"
                        value={brand}
                        checked={filters.brand.includes(brand)}
                        onChange={handleFilterChange}
                      />
                    ))}
                  </div>
                )}
              </Form.Group>
              {/* Price range filter */}
              <Form.Group controlId="minPrice">
                <Form.Label>Min Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter min price"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
              </Form.Group>
              <Form.Group controlId="maxPrice">
                <Form.Label>Max Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter max price"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </Form.Group>
              {/* Sort by filter */}
              <Form.Group controlId="sort">
                <Form.Label>Sort By</Form.Label>
                <div>
                  <Form.Check
                    type="radio"
                    label="Newest In"
                    id="sort-newestIn"
                    name="sort"
                    value="newestIn"
                    checked={filters.sort === "newestIn"}
                    onChange={handleFilterChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Most Reviewed"
                    id="sort-mostReviewed"
                    name="sort"
                    value="mostReviewed"
                    checked={filters.sort === "mostReviewed"}
                    onChange={handleFilterChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Rating"
                    id="sort-rating"
                    name="sort"
                    value="rating"
                    checked={filters.sort === "rating"}
                    onChange={handleFilterChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Lowest Price"
                    id="sort-lowestPrice"
                    name="sort"
                    value="lowestPrice"
                    checked={filters.sort === "lowestPrice"}
                    onChange={handleFilterChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Highest Price"
                    id="sort-highestPrice"
                    name="sort"
                    value="highestPrice"
                    checked={filters.sort === "highestPrice"}
                    onChange={handleFilterChange}
                  />
                </div>
              </Form.Group>
            </Form>
          </Col>
          <Col md={9}>
            {/* Products */}
            {productsLoading ? (
              <Loader />
            ) : productsError ? (
              <Message variant="danger">{productsError.message}</Message>
            ) : products && products.length > 0 ? (
              <Row>
                {products.map((product) => (
                  <Col key={product._id} xs={6} md={4} xl={3} className="mb-3">
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Message variant="info">No products available</Message>
            )}
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default ShopPage;
