export type GuestReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export const pageSize = 6;
export const reviewIdPattern = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i;
