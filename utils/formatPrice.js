export const formatPrice = (priceInUSD, language) => {
  const rate = 25000;
  if (language === 'VI') {
    const priceInVND = priceInUSD * rate;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceInVND);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(priceInUSD);
};

