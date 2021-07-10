import { Promotion } from '../models/product';
export const afterDiscount = (item) => {
  if (
    item.promotion &&
    item.promotion.expired.setHours(0, 0, 0, 0) <
      new Date().setHours(0, 0, 0, 0)
  ) {
    const deletePromotion = Promotion.findOneAndDelete({
      name: item.promotion.name
    }).then();
  }
  if (
    item.promotion &&
    item.promotion.active &&
    item.promotion.expired.setHours(0, 0, 0, 0) >=
      new Date().setHours(0, 0, 0, 0)
  ) {
    let pricePercent = +item.promotion.percent / 100;
    let discount = pricePercent * item.price;
    const newPrice = item.price - discount;

    return { price: newPrice, discount, itemPrice: item.price };
  } else {
    return { price: item.price, discount: 0, itemPrice: item.price };
  }
};
