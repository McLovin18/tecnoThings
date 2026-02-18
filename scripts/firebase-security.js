/**
 * 🔐 VALIDADOR DE SEGURIDAD - Firebase Only Authentication
 * 
 * Este módulo verifica que:
 * 1. Solo Firebase Authentication se está usando
 * 2. No hay usuarios hardcodeados en el código
 * 3. No hay localStorage sin validación de Firebase
 * 4. Todas las sesiones son validadas por Firebase
 */

import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getCurrentUser as getFirebaseUser } from './firebase-auth.js';

/**
 * Limpiar datos legacy de localStorage
 */
export const cleanupLegacyData = () => {
  const legacyKeys = ['tecnoThingsUser', 'tecnoThingsUsers'];
  legacyKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      console.warn(`🧹 Limpiando dato legacy: ${key}`);
      localStorage.removeItem(key);
    }
  });
};

/**
 * Verificar que el usuario está autenticado mediante Firebase
 * NO permite usuarios de localStorage sin validación de Firebase
 */
export const enforceFirebaseAuth = async () => {
  return new Promise((resolve) => {
    // Limpiar datos legacy
    cleanupLegacyData();
    
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuario autenticado en Firebase
        try {
          const userData = await getFirebaseUser();
          console.log('✅ Usuario autenticado mediante Firebase:', userData.email);
          resolve(userData);
        } catch (error) {
          console.error('Error obteniendo datos del usuario:', error);
          resolve(null);
        }
      } else {
        // No hay usuario en Firebase
        console.warn('⚠️ No hay usuario autenticado en Firebase');
        resolve(null);
      }
    });
  });
};

/**
 * Requiere autenticación - Redirige si no está autenticado
 */
export const requireAuth = async (redirectPath = '../login_and_registration/login.html') => {
  const user = await enforceFirebaseAuth();
  if (!user) {
    console.error('❌ Acceso denegado - No hay usuario autenticado');
    window.location.href = redirectPath;
    return null;
  }
  return user;
};

/**
 * Requiere rol específico
 */
export const requireRole = async (role, redirectPath = '../tecno_things_landing_page/index.html') => {
  const user = await enforceFirebaseAuth();
  if (!user) {
    console.error('❌ Acceso denegado - No hay usuario autenticado');
    window.location.href = redirectPath;
    return null;
  }
  
  if (user.role !== role) {
    console.error(`❌ Acceso denegado - Se requiere rol: ${role}, usuario tiene: ${user.role}`);
    window.location.href = redirectPath;
    return null;
  }
  
  return user;
};

/**
 * Inicializar validaciones de seguridad al cargar
 */
export const initSecurityValidation = () => {
  cleanupLegacyData();
  
  // Validar que Firebase está disponible
  if (!auth) {
    console.error('🚨 ERROR CRÍTICO: Firebase Auth no está configurado');
    console.error('   Verifica que firebase-config.js está importado correctamente');
  }
  
  console.log('✅ Sistema de seguridad iniciado - Solo Firebase Auth permitido');
};

export default {
  enforceFirebaseAuth,
  requireAuth,
  requireRole,
  initSecurityValidation,
  cleanupLegacyData
};
