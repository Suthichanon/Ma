import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDrbPr4ymeHtbb6rFT9iI7zDUvDF0k_kjM",
  authDomain: "ma-typescript-app.firebaseapp.com",
  projectId: "ma-typescript-app",
  storageBucket: "ma-typescript-app.appspot.com",
  messagingSenderId: "489125610874",
  appId: "1:489125610874:web:906e7d0cbd84ca93d402c3",
};

const app = initializeApp(firebaseConfig);

export default app;
