import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCXNAOZHIuNOC4E2TFqtp_lEjv4tP1pn6A",
  authDomain: "ipi-dashboard-7c646.firebaseapp.com",
  projectId: "ipi-dashboard-7c646",
  storageBucket: "ipi-dashboard-7c646.firebasestorage.app",
  messagingSenderId: "464051685582",
  appId: "1:464051685582:web:6c11b77511858ab354e89f"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
