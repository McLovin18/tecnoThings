/**
 * 🔐 SISTEMA DE AUTENTICACIÓN CON FIREBASE
 * Reemplaza users-data.js
 */

import { 
  auth, 
  db 
} from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

/**
 * Crear documento de usuario en Firestore
 */
export const createUserDocument = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const docData = {
      name: userData.name,
      email: userData.email,
      role: userData.role || 'cliente', // 'admin' o 'cliente'
      createdAt: Timestamp.now(),
      address: {
        street: userData.street || '',
        city: userData.city || '',
        postalCode: userData.postalCode || '',
        country: userData.country || ''
      },
      phone: userData.phone || '',
      avatar: userData.avatar || null
    };

    await setDoc(userRef, docData);
    return docData;
  } catch (error) {
    console.error('Error creando documento de usuario:', error);
    throw error;
  }
};

/**
 * Obtener datos del usuario desde Firestore
 */
export const getUserDocument = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        id: userSnap.id,
        ...userSnap.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo documento de usuario:', error);
    return null;
  }
};

/**
 * Registrar nuevo usuario
 */
export const registerUser = async (email, password, userData) => {
  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Actualizar perfil
    await updateProfile(user, {
      displayName: userData.name
    });

    // Crear documento en Firestore
    await createUserDocument(user.uid, {
      ...userData,
      email: email,
      role: 'cliente' // Los nuevos registros son siempre clientes
    });

    return {
      success: true,
      userId: user.uid,
      email: user.email,
      message: 'Usuario registrado exitosamente'
    };
  } catch (error) {
    console.error('Error registrando usuario:', error);
    throw {
      code: error.code,
      message: mapFirebaseError(error.code)
    };
  }
};

/**
 * Iniciar sesión
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Obtener datos completos del usuario
    const userDoc = await getUserDocument(user.uid);

    return {
      success: true,
      user: {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        ...userDoc
      }
    };
  } catch (error) {
    console.error('Error iniciar sesión:', error);
    throw {
      code: error.code,
      message: mapFirebaseError(error.code)
    };
  }
};

/**
 * Cerrar sesión
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true, message: 'Sesión cerrada' };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

/**
 * Obtener usuario actual
 */
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getUserDocument(user.uid);
        resolve({
          id: user.uid,
          email: user.email,
          displayName: user.displayName,
          ...userDoc
        });
      } else {
        resolve(null);
      }
    }, reject);
  });
};

/**
 * Escuchar cambios de autenticación
 */
export const onAuthChanged = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getUserDocument(user.uid);
      callback({
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        ...userDoc
      });
    } else {
      callback(null);
    }
  });
};

/**
 * Mapear errores de Firebase a mensajes legibles
 */
const mapFirebaseError = (code) => {
  const errors = {
    'auth/email-already-in-use': 'Este correo ya está registrado',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/invalid-email': 'Correo electrónico inválido',
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/account-exists-with-different-credential': 'La cuenta existe con credenciales diferentes'
  };
  return errors[code] || 'Error de autenticación';
};

/**
 * Crear admin inicial (SOLO EJECUTAR UNA VEZ EN CONSOLA)
 * Nota: Los admins se definen en Firestore con el campo role: "admin"
 * Las reglas de seguridad validan esto
 */
export const createInitialAdmin = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    await createUserDocument(user.uid, {
      name: name,
      email: email,
      role: 'admin', // ⚠️ Solo administrador del sistema debe hacer esto
      phone: '',
      avatar: null
    });

    console.log('✅ Admin creado exitosamente:', user.uid);
    return user.uid;
  } catch (error) {
    console.error('❌ Error creando admin:', error);
    throw error;
  }
};
