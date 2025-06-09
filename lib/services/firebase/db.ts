import { getFirestore } from "firebase/firestore";
import { app } from "./base";

export const db = getFirestore(app);
