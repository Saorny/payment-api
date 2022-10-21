import { Encryptor } from 'src/util/encryptor.interface';

export interface CustomerSeederInterface {
  phoneNumber: string;
  name: string;
  email: string;
}

export const dataToSeed: CustomerSeederInterface[] = [
  {
    phoneNumber: Encryptor.encrypt('18318171151'),
    name: 'Remi',
    email: 'remi.bartel@mobilenowgroup.com',
  },
];
