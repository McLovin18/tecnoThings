/**
 * 🔐 PROTECCIÓN DE RUTAS
 * Verificar autenticación y roles
 */

import { getCurrentUser, logoutUser } from './firebase-auth.js';

/**
 * Proteger ruta: requiere autenticación
 */
export const protectRoute = async (requiredRole = null) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      // No autenticado
      window.location.href = '/login_and_registration/login.html';
      return null;
    }

    if (requiredRole && user.role !== requiredRole) {
      // No tiene el rol requerido
      alert('No tienes permiso para acceder a esta página');
      
      // Redirigir según su rol
      if (user.role === 'admin') {
        window.location.href = '/admin_dashboard/dashboard.html';
      } else {
        window.location.href = '/customer_dashboard/clientDashboard.html';
      }
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error protegiendo ruta:', error);
    window.location.href = '/login_and_registration/login.html';
    return null;
  }
};

/**
 * Permitir acceso público pero redirigir si el usuario autenticado no tiene el rol
 */
export const ensureRoleAccess = async (allowedRole = null) => {
  try {
    const user = await getCurrentUser();
    if (user && allowedRole && user.role !== allowedRole) {
      if (user.role === 'admin') {
        window.location.href = '/admin_dashboard/dashboard.html';
      } else {
        window.location.href = '/customer_dashboard/clientDashboard.html';
      }
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error verificando acceso por rol:', error);
    return null;
  }
};

/**
 * Obtener usuario para mostrar en navbar
 */
export const setupUserDisplay = async () => {
  try {
    const user = await getCurrentUser();
    
    if (user) {
      // Actualizar navbar con información del usuario
      const userElements = document.querySelectorAll('[data-user-name]');
      userElements.forEach(el => {
        el.textContent = user.displayName || user.email;
      });

      const roleElements = document.querySelectorAll('[data-user-role]');
      roleElements.forEach(el => {
        el.textContent = user.role === 'admin' ? '👨‍💼 Administrador' : '👤 Cliente';
      });

      // Mostrar botón de logout
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.style.display = 'block';
        logoutBtn.addEventListener('click', handleLogout);
      }

      // Ocultar botón de login
      const loginNav = document.getElementById('login-nav');
      if (loginNav) {
        loginNav.style.display = 'none';
      }
    } else {
      // No autenticado - mostrar botón de login
      const loginNav = document.getElementById('login-nav');
      if (loginNav) {
        loginNav.style.display = 'block';
      }

      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.style.display = 'none';
      }
    }

    return user;
  } catch (error) {
    console.error('Error configurando display de usuario:', error);
    return null;
  }
};

/**
 * Manejar logout
 */
export const handleLogout = async () => {
  try {
    await logoutUser();
    alert('Sesión cerrada');
    window.location.href = '/tecno_things_landing_page/index.html';
  } catch (error) {
    console.error('Error al logout:', error);
    alert('Error al cerrar sesión');
  }
};

/**
 * Esperar a que Firebase esté listo
 */
export const waitForFirebase = async (timeout = 5000) => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const checkFirebase = async () => {
      try {
        const user = await getCurrentUser();
        resolve(user);
      } catch (error) {
        if (Date.now() - startTime < timeout) {
          setTimeout(checkFirebase, 100);
        } else {
          resolve(null);
        }
      }
    };

    checkFirebase();
  });
};
