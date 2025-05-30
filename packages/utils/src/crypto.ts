import CryptoJS from 'crypto-js';

export class Crypto<T extends string | object> {
  /** Secret */
  secret: string;
  // iv: CryptoJS.lib.WordArray;

  constructor(secret: string) {
    this.secret = secret;
    // 固定 IV
    // this.iv = CryptoJS.enc.Utf8.parse(secret.substring(0, 16));
  }

  encrypt(data: T): string {
    // 生成随机 IV
    const iv = CryptoJS.lib.WordArray.random(16);

    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(dataString, this.secret, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // 拼接 IV 和密文，转为 Base64
    const encryptedHex = encrypted.ciphertext.toString();
    const ivHex = iv.toString();
    const combined = ivHex + encryptedHex;
    const base64Result = CryptoJS.enc.Hex.parse(combined).toString(CryptoJS.enc.Base64);

    console.log('base64Str1', encrypted.ciphertext.toString(CryptoJS.enc.Base64));
    console.log('base64Str2', CryptoJS.enc.Base64.stringify(encrypted.ciphertext));
    console.log('encrypted', base64Result);

    return encrypted.toString();
  }

  decrypt(encrypted: string) {
    const decrypted = CryptoJS.AES.decrypt(encrypted, this.secret, {
      // iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const dataString = decrypted.toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(dataString) as T;
    } catch {
      // avoid parse error
      return null;
    }
  }
}
