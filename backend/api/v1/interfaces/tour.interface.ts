// ===== Shared Tour Interfaces =====

export interface BaseTour {
  title: string;
  code: string;
  images: string[];
  price: number;
  discount: number;
  information: string;
  schedule: string;
  timeStart: Date;
  startDeparture: string;
  endDeparture: string;
  timeTour: string;
  stock: number;
  status: string;
  position: number;
  slug: string;
  category_ids: string[];
}

export interface TourResponse extends BaseTour {
  image?: string;
  price_special?: number;
}
