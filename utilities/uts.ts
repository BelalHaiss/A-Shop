export const afterDiscount = (item) => {
  if (item.promotion && item.promotion.active) {
    let pricePercent = +item.promotion.percent / 100;
    let discount = pricePercent * item.price;

    const newPrice = item.price - discount;
    return newPrice;
  } else {
    return 1;
  }
};
