export const addDecimals = (num) => {
  return Math.round(num * 100) / 100;
};

export const updateCart = (state) => {
  state.itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  state.shippingPrice = state.itemsPrice > 500 ? 0 : 20;

  state.totalPrice = Number(state.itemsPrice) + Number(state.shippingPrice);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
