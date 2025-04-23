import { genSalt, hashSync } from 'bcrypt';

export async function hashStr(toHash: string) {
  const saltRounds = 12;
  const salt = await genSalt(saltRounds);
  return hashSync(toHash, salt);
}
