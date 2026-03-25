import React, { useEffect } from "react";
import { notification } from "antd";
import { socket } from "../../socket/socket";

const PopupOrder = () => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    socket.on("SERVER_ORDER_SUCCESS", (data) => {
      if (!data || !data.tours || data.tours.length === 0) return;

      const mainTour = data.tours[0];

      api.open({
        message: (
          <div className="font-bold text-text1 text-[16px]">
            {data.fullName} vừa đặt tour thành công!
          </div>
        ),
        description: (
          <div className="flex gap-3 items-center mt-2">
            {mainTour.image && (
              <img
                src={mainTour.image}
                alt={mainTour.title}
                className="w-14 h-14 object-cover rounded-lg border border-gray-200"
              />
            )}
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-text1 line-clamp-2 leading-tight">
                {mainTour.title}
              </span>
              <span className="text-gray-500 text-[13px] mt-1 font-medium">
                Số lượng: <span className="text-primary">{mainTour.quantity} vé</span>
                {data.tours.length > 1 && ` (và ${data.tours.length - 1} tour khác)`}
              </span>
            </div>
          </div>
        ),
        placement: "topRight",
        duration: 5,
        className: "border-l-4 border-l-primary rounded-xl shadow-lg !w-[350px]",
        style: {
          padding: '16px',
        }
      });
    });

    return () => {
      socket.off("SERVER_ORDER_SUCCESS");
    };
  }, [api]);

  return <>{contextHolder}</>;
};

export default PopupOrder;