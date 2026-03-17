import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../actions/cart";
import { Table, Button } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

function CartItem({ items }) {
  const dispatch = useDispatch();

  const handleClearCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id, value) => {
    const newValue = value || 1;
    dispatch(updateQuantity(id, newValue, true));
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (text, record, index) => <span className="font-medium text-text1">{index + 1}</span>,
      width: 60,
      align: 'center',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image, record) => (
        <img
          src={image}
          alt={record?.info?.title || "Tour Image"}
          className="w-20 h-auto rounded object-cover shadow-sm mx-auto"
        />
      ),
      width: 120,
      align: 'center',
    },
    {
      title: 'Tên Tour',
      dataIndex: 'info',
      key: 'title',
      render: (info) => (
        <a
          href={`/tours/detail/${info?.slug}`}
          className="text-text1 font-semibold text-base hover:text-primary hover:underline transition-all line-clamp-2"
        >
          {info?.title}
        </a>
      ),
      width: 200,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price_special',
      key: 'price',
      render: (price) => (
        <span className="font-medium text-text1">{price?.toLocaleString()}đ</span>
      ),
      width: 150,
      align: 'center',
    },
    {
      title: 'Số lượng vé',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => {
        const stock = record?.info?.stock;
        return (
          <div className="flex items-center justify-center gap-3">
            <Button
              type="default"
              disabled={quantity <= 1}
              onClick={() => handleQuantityChange(record.id, quantity - 1)}
              icon={<MinusOutlined className="text-[12px] text-gray-600 font-bold" />}
              className="flex items-center justify-center w-[30px] h-[30px] p-0 border-gray-300 rounded hover:border-text1 hover:text-text1 transition-colors"
            />
            <span className="text-[16px] font-bold text-text1 min-w-[20px] text-center inline-block">
              {quantity}
            </span>
            <Button
              type="default"
              disabled={quantity >= stock}
              onClick={() => handleQuantityChange(record.id, quantity + 1)}
              icon={<PlusOutlined className="text-[12px] text-gray-600 font-bold" />}
              className="flex items-center justify-center w-[30px] h-[30px] p-0 border-gray-300 rounded hover:border-text1 hover:text-text1 transition-colors"
            />
          </div>
        );
      },
      width: 150,
      align: 'center',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total) => (
        <span className="font-bold text-text3 flex flex-col justify-center">{total?.toLocaleString()}đ</span>
      ),
      width: 150,
      align: 'center',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          danger
          type="primary"
          onClick={() => handleClearCart(record.id)}
          size="small"
        >
          Xóa
        </Button>
      ),
      width: 100,
      align: 'center',
    },
  ];

  return (
    <Table
      dataSource={items}
      columns={columns}
      pagination={false}
      rowKey="id"
      className="shadow-sm border border-gray-100 rounded-xl overflow-hidden font-sans"
      scroll={{ x: 800 }}
    />
  );
}

export default CartItem;
