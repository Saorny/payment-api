import fs from 'fs';
import crypto, {
  KeyLike,
  RsaPrivateKey,
  RsaPublicKey,
  generateKeyPairSync,
} from 'crypto';
import { AppConfig } from '../modules/shared/config/interfaces/config.interface';
import { ConfigService } from '../modules/shared/config/config.service';
import * as crypto2 from 'crypto-js';

export class Encryptor {
  public static encrypt(content: string): string {
    const buffer = Buffer.from(content, 'utf8');

    return crypto.publicEncrypt(this.encryptOptions, buffer).toString('base64');
  }

  public static decrypt(content: string): string {
    const buffer = Buffer.from(content, 'base64');

    return crypto.privateDecrypt(this.decryptOptions, buffer).toString('utf8');
  }

  public static generateKeysIfNecessary(): void {
    if (!fs.existsSync(this.publicKeyPath)) {
      this.generateKeys();
    }
  }

  private static get encryptOptions(): RsaPublicKey | RsaPrivateKey | KeyLike {
    return {
      key: fs.readFileSync(this.publicKeyPath, 'utf8'),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      passphrase: this.passphrase,
    };
  }

  private static get decryptOptions(): RsaPublicKey | RsaPrivateKey | KeyLike {
    return {
      key: fs.readFileSync(this.privateKeyPath, 'utf8'),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      passphrase: this.passphrase,
    };
  }

  public static generateKeys(modulusLength = 512): number {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: this.passphrase,
      },
    });

    fs.writeFileSync(this.publicKeyPath, publicKey);
    fs.writeFileSync(this.privateKeyPath, privateKey);
    return modulusLength;
  }

  public static encryptWithMD5(raw: string): string {
    return crypto2.MD5(raw).toString().toUpperCase();
  }

  public static formatMaskPhoneNumber(origPhone: string): string {
    return origPhone.replace(/(?<=\d\d)\d(?=\d{4})/g, '*');
  }

  private static get publicKeyPath(): string {
    return `${this.path}/public.pem`;
  }

  private static get privateKeyPath(): string {
    return `${this.path}/private.pem`;
  }

  private static get path(): string {
    return `./encrypt`;
  }

  private static get passphrase(): string {
    return this.mpConfig.encryptionPassphrase;
  }

  private static get mpConfig(): AppConfig {
    return ConfigService.appConfig;
  }
}
