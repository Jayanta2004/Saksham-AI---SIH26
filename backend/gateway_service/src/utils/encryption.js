import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY || 'saksham_ai_mospi_secure_key_2026_32char!!'; // Must be 32 bytes
const IV_LENGTH = 16;

/**
 * AES-256-CBC Field-Level Encryption utility for sensitive officer data (Aadhaar, PAN, Appraisal scores).
 */
export class DataEncryption {
  static getKey() {
    return crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest();
  }

  static encrypt(text) {
    if (!text) return text;
    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv('aes-256-cbc', this.getKey(), iv);
      let encrypted = cipher.update(String(text), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return `ENC_${iv.toString('hex')}:${encrypted}`;
    } catch (err) {
      console.error('[Encryption] Encrypt error:', err);
      return text;
    }
  }

  static decrypt(encryptedText) {
    if (!encryptedText || !encryptedText.startsWith('ENC_')) return encryptedText;
    try {
      const parts = encryptedText.replace('ENC_', '').split(':');
      if (parts.length !== 2) return encryptedText;
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedData = parts[1];
      const decipher = crypto.createDecipheriv('aes-256-cbc', this.getKey(), iv);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (err) {
      console.error('[Encryption] Decrypt error:', err);
      return encryptedText;
    }
  }

  static maskNationalId(nationalId) {
    if (!nationalId) return 'XXXX-XXXX-XXXX';
    const plain = this.decrypt(nationalId);
    if (plain.length >= 4) {
      return `XXXX-XXXX-${plain.slice(-4)}`;
    }
    return 'XXXX-XXXX-9921';
  }
}
