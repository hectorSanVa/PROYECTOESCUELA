import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAcQh48c4ZfT3Cy7OeLLX-hD4mHTA5mHZQ",
  authDomain: "plataforma-matematicas.firebaseapp.com",
  projectId: "plataforma-matematicas",
  storageBucket: "plataforma-matematicas.appspot.com",
  messagingSenderId: "193021544646",
  appId: "1:193021544646:web:43224c2fc8518e307e6fc7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 