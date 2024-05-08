import { CART_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCartItems: builder.query({
      query: (data) => ({
        url: `${CART_URL}/getcartitems`,
        method: "GET",
        body: data,
      }),
    }),

    addToCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `${CART_URL}/addtocart`,
        method: "POST",
        body: { productId, quantity },
      }),
    }),

    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `${CART_URL}/${productId}`,
        method: "DELETE",
      }),
    }),

    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `${CART_URL}/updatecart`,
        method: "PUT",
        body: { productId, quantity },
      }),
    }),

    clearCartItems: builder.mutation({
      query: () => ({
        url: `${CART_URL}/clearcart`,
        method: "PUT",
      }),
    }),

  }),
});

export const {
  useGetCartItemsQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useClearCartItemsMutation,
} = cartApiSlice;
