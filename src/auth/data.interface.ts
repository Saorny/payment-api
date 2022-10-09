export interface AuthCustomer extends Express.User {
  type: string;
  email: string;
  customerId: string;
}
