import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ pageNumber, keyword }) => ({
        url: PRODUCTS_URL,
        params: { pageNumber, keyword },
      }),
      providesTags: ["Products"],
      keepUnusedDataFor: 5,
    }),
    getAllProducts: builder.query({
      query: ({ category, brand, minPrice, maxPrice, sort }) => ({
        url: `${PRODUCTS_URL}/shop`,
        method: "GET",
        params: {
          category,
          brand,
          minPrice,
          maxPrice,
          sort,
        },
      }),
      providesTags: ["Products"],
      keepUnusedDataFor: 5,
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: "POST",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
      providesTags: ["Product"],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5,
    }),
    getLatestProducts: builder.query({
      query: () => `${PRODUCTS_URL}/latest`,
      keepUnusedDataFor: 5,
    }),
    getMostPurchasedProducts: builder.query({
      query: () => `${PRODUCTS_URL}/purchased`,
      keepUnusedDataFor: 5,
    }),
    getProductsByCategory: builder.query({
      query: ({ category, brand, minPrice, maxPrice, sort }) => {
        let url = `${PRODUCTS_URL}/category/${category}?`;

        // Add brand filter if provided
        if (brand) {
          url += `&brand=${brand}`;
        }

        // Add price filter if provided
        if (minPrice || maxPrice) {
          if (minPrice) {
            url += `&minPrice=${minPrice}`;
          }
          if (maxPrice) {
            url += `&maxPrice=${maxPrice}`;
          }
        }

        // Add sorting criteria
        if (sort === "newestIn") {
          url += `&sort=newestIn`;
        } else if (sort === "mostReviewed") {
          url += `&sort=mostReviewed`;
        } else if (sort === "rating") {
          url += `&sort=rating`;
        } else if (sort === "lowestPrice") {
          url += `&sort=lowestPrice`;
        } else if (sort === "highestPrice") {
          url += `&sort=highestPrice`;
        }

        return { url };
      },
      keepUnusedDataFor: 5,
    }),
    getBrands: builder.query({
      query: (category) => ({
        url: `${PRODUCTS_URL}/brands/${category}`,
      }),
    }),
    getCategories: builder.query({
      query: () => `${PRODUCTS_URL}/categories`,
    })
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetLatestProductsQuery,
  useGetMostPurchasedProductsQuery,
  useGetProductsByCategoryQuery,
  useGetAllProductsQuery,
  useGetBrandsQuery,
  useGetCategoriesQuery,
} = productsApiSlice;
