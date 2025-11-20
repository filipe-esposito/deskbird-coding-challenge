import * as bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS = 12;

export async function encryptPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}
