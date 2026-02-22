// Generate Mã code đơn hàng
export const generateOrderCode = (orderId: string): string => {
  const code = `OD${String(orderId).toUpperCase()}`;
  return code;
};

// Generate Mã code tour
export const generateTourCode = (number: number): string => {
  const code = `TOUR${String(number).padStart(6, '0')}`;
  return code;
};