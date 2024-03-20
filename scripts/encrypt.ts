/* eslint-disable @typescript-eslint/no-unused-vars */
import crypto from 'crypto';
import { ethers } from 'ethers';

/**
 * Encrypts a message using a key and a salt.
 *
 * @param message - The message to encrypt.
 * @param key - The key to use for encryption.
 * @param salt - The salt to use for encryption.
 * @returns The encrypted message.
 */
export function encrypt(message: string, key: string, salt: string): string {
  const keyHash = crypto.scryptSync(key, salt, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', keyHash, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted;
}

/**
 * Decrypts a message using a key and a salt.
 *
 * @param encryptedMessage - The encrypted message to decrypt.
 * @param key - The key to use for decryption.
 * @param salt - The salt to use for decryption.
 * @returns The decrypted message.
 */
export function decrypt(encryptedMessage: string, key: string, salt: string): string {
  const keyHash = crypto.scryptSync(key, salt, 32);
  const iv = Buffer.from(encryptedMessage.substring(0, 32), 'hex');
  const encrypted = Buffer.from(encryptedMessage.substring(32), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyHash, iv);
  let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// add salt
const key = '';
// add salt
const salt = '';
// add private key
const messageToEncrypt = '';

// USE THIS TO ENCRYPT YOUR PRIVATE KEY AND THEN ADD IT TO YOUR .env FILE
// const encryptedMessage = encrypt(messageToEncrypt, key, salt);
// console.log('Encrypted message:', encryptedMessage);