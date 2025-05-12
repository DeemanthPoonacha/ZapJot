import { Settings } from "./settings";

export type UserEncryptedKey = {
  encryptedKey: string;
  iv: string;
};

export type UserInDb = {
  settings: Settings;
  encryption: UserEncryptedKey;
  email: string;
  createdAt: string;
  updatedAt: string;
};
