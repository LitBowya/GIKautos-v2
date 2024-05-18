import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";
import {
  useGetProductsByCategoryQuery,
  useGetBrandsQuery,
} from "../slices/productsApiSlice";
import Product from "../components/Product/Product";
import Loader from "../components/Loader/Loader";
import Message from "../components/Message/Message";

const ProductByCategoryPage = () => {
  const { category } = useParams();
  const [filters, setFilters] = useState({
    brand: [],
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  // Fetch products query
  const {
    data: fetchedProducts,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useGetProductsByCategoryQuery({ category, ...filters });

  // Fetch brands query
  const {
    data: brands,
    isLoading: isLoadingBrands,
    error: brandsError,
  } = useGetBrandsQuery(category); // Pass the category parameter here

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // For brand filter, toggle checked status
    if (name === "brand") {
      const selectedBrands = filters.brand.includes(value)
        ? filters.brand.filter((brand) => brand !== value)
        : [...filters.brand, value];
      setFilters({ ...filters, brand: selectedBrands });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  return (
    <div>
      <h2>Products in {category}</h2>
      <Row>
        <Col md={3}>
          {/* Filters and sorting */}
          <Form>
            <Form.Group>
              <Form.Label>Brands</Form.Label>
              <div>
                {brands &&
                  brands.map((brand) => (
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
            </Form.Group>
            <Form.Group>
              <Form.Label>Min Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter min price"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Max Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter max price"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </Form.Group>
            <Form.Group>
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
          {isLoadingProducts || isLoadingBrands ? (
            <Loader />
          ) : productsError || brandsError ? (
            <Message variant="danger">
              {productsError && productsError.message}
              {brandsError && brandsError.message}
            </Message>
          ) : (
            <Row>
              {fetchedProducts.map((product) => (
                <Col key={product._id} xs={6} md={4} xl={3} className="mb-3">
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
