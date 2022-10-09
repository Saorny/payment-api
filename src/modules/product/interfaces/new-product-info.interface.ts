export interface NewProductBasicInfo {
  skuId: number | string;
  skuName: string;
  model: string;
  warranty: string;
  placeOfProduction: string;
  imgUrl: string;
  price: number;
  selfName: string;
  weight: string;
  noCard: boolean;
  isPublished: boolean;
  publishedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date | null;
  order: number;
  promotedOrder?: number;
  maxPurchases: number;
  noInvitation: boolean;
  memberOnly: boolean;
  color: string;
}
