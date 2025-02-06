import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAh4F4GJHzgslgFlYZXaJ49IaOc50owigc",
  authDomain: "filmy-6bd1a.firebaseapp.com",
  databaseURL: "https://filmy-6bd1a-default-rtdb.firebaseio.com",
  projectId: "filmy-6bd1a",
  storageBucket: "filmy-6bd1a.appspot.com",
  messagingSenderId: "409354230199",
  appId: "1:409354230199:web:d6e91050d7820a7397b032",
  measurementId: "G-NQM1E3PGVX",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken };
