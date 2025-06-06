import { getAuth } from "firebase/auth";
import { app } from "./base";

export const auth = getAuth(app);
