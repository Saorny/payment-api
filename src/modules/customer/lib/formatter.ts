import { Customer } from 'src/database/entities/customer';
import { Encryptor } from 'src/util/encryptor.interface';
import { LoginResponseInfoDto } from '../dto/login-response-info.dto';

export class Formatter {
  public static formatLoginResponse(
    customer: Customer,
    token: string,
  ): LoginResponseInfoDto {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phoneNumber: Encryptor.formatMaskPhoneNumber(
        Encryptor.decrypt(customer.phoneNumber),
      ),
      token,
    };
  }
}
