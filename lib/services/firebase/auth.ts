// firebase/firebaseAuth.ts
import { getAuth } from "firebase/auth";
import { app } from "./base";

const auth = getAuth(app);
export { auth };
