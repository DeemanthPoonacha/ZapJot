import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDblWYZc_w3PixkSFY3JAX3U9jI5NAd5Kk",
  authDomain: "zapjot-8ea6d.firebaseapp.com",
  projectId: "zapjot-8ea6d",
  storageBucket: "zapjot-8ea6d.firebasestorage.app",
  messagingSenderId: "665739064935",
  appId: "1:665739064935:web:001a41473ebb4be92f86c2",
  measurementId: "G-EWLG7TQJ50",
};

export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
