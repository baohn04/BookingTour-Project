import { Request, Response } from "express";
import Tour from "../../models/tour.model";

export interface ICartItem {
  tourId: string;
  quantity: number;
  info?: any;
  image?: string;
  price_special?: number;
  total?: number;
}

// [POST] /cart/list-json
export const listJson = async (req: Request<{}, any, ICartItem[]>, res: Response): Promise<void> => {
  try {
    const tours = req.body;
    const toursResult = [];

    for (const tour of tours) {
      const tourId = tour.tourId;
      const quantity = tour.quantity;

      const infoTour = await Tour.findOne({
        _id: tourId,
        deleted: false,
        status: "active"
      }).select("-__v -createdAt -updatedAt").lean() as any;

      if (infoTour) {
        tour["info"] = infoTour;
        tour["image"] = "";

        if (infoTour.images && infoTour.images.length > 0) {
          tour["image"] = infoTour.images[0];
        }

        const price = infoTour.price || 11990000;
        const discount = infoTour.discount || 0;
        let priceAdult = infoTour.price_special;

        if (!priceAdult) {
          priceAdult = price * (1 - discount / 100);
        }

        tour["price_special"] = priceAdult;
        tour["total"] = priceAdult * (Number(quantity) || 1);

        toursResult.push(tour);
      }
    }

    res.status(200).json({
      message: "Lấy danh sách giỏ hàng thành công",
      data: toursResult
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};