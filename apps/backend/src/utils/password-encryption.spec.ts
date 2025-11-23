import { encryptPassword } from './password-encryption';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('Password Encryption Utils', () => {
  describe('when encrypting a password', () => {
    it('should hash the password using bcrypt with 12 salt rounds', async () => {
      const plainPassword = 'myPassword123';
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      await encryptPassword(plainPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 12);
    });

    it('should return the hashed password', async () => {
      const plainPassword = 'myPassword123';
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await encryptPassword(plainPassword);

      expect(result).toBe(hashedPassword);
    });
  });
});
