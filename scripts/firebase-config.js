/**
 * 🔥 CONFIGURACIÓN DE FIREBASE
 * Inicializar antes que cualquier otro script
 */

// Importar Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, setPersistence, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';

// 🔑 CONFIGURACIÓN (REEMPLAZAR CON TUS CREDENCIALES)
const firebaseConfig = {
  apiKey: "AIzaSyCt6_qCI_vSXuIQ84mo-H68NgW1YD-V_L8",
  authDomain: "tecnothingsdb.firebaseapp.com",
  projectId: "tecnothingsdb",
  storageBucket: "tecnothingsdb.firebasestorage.app",
  messagingSenderId: "983420493689",
  appId: "1:983420493689:web:c99fa232c06c88607dd9a8"
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configurar persistencia de sesión
setPersistence(auth, browserLocalPersistence)
  .catch(error => console.error('Error al configurar persistencia:', error));

export default app;
