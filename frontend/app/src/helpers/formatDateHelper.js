const formatDateHelper = (dateString, fallback = 'Đang cập nhật') => {
  return dateString
    ? new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    : fallback;
};

export default formatDateHelper;
