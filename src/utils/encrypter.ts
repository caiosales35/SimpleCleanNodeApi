import bcrypt from "bcrypt";

export class Encrypter {
  async compare(value: string, hash: string) {
    return await bcrypt.compare(value, hash);
  }
}
