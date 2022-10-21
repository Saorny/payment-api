export interface ProductSeederInterface {
  skuId: string;
  price: number;
  skuName: string;
  description: string;
  quantity: number;
}

export const dataToSeed: ProductSeederInterface[] = [
  {
    skuId: '1',
    price: 1,
    skuName: 'iPhone 13',
    description: 'This is iPhone 13',
    quantity: 10,
  },
  {
    skuId: '2',
    price: 2,
    skuName: 'iPhone 14',
    description: 'This is iPhone 14',
    quantity: 11,
  },
];
