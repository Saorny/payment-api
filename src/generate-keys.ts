import { Encryptor } from './util/encryptor.interface';

export function generateKeys(): void {
  Encryptor.generateKeysIfNecessary();
}
