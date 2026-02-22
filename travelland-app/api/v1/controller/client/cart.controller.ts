import { Request, Response } from "express";
import Tour from "../../models/tour.model";

// [POST] /cart/list-json
export const listJson = async (req: Request, res: Response) => {
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
      }).select("-__v -createdAt -updatedAt").lean();

      if (infoTour) {
        tour["info"] = infoTour;
        tour["image"] = "";

        if (infoTour.images && infoTour.images.length > 0) {
          tour["image"] = infoTour.images[0];
        }

        tour["price_special"] = infoTour.price * (1 - infoTour.discount / 100);
        tour["total"] = tour.price_special * quantity;

        toursResult.push(tour);
      }
    }

    res.status(200).json({
      message: "Get list cart successfully",
      data: toursResult
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};