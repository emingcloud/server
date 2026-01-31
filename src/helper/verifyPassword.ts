import bcrypt from "bcrypt";
export default async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
