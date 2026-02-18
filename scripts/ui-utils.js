// Utilidades para la interfaz
import { getCurrentUser, logoutUser } from './firebase-auth.js';

// Mostrar/ocultar categorías en móvil
export const initMobileCategories = () => {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
};

// Actualizar estado de autenticación en el navbar
export const updateAuthUI = () => {
  const user = getCurrentUser();
  const authContainer = document.getElementById('auth-container');

  if (!authContainer) return;

  if (user) {
    authContainer.innerHTML = `
      <div class="relative group">
        <button class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
          <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
            ${user.avatar}
          </div>
          <span class="hidden md:inline text-sm font-medium">${user.name}</span>
          <span class="material-icons-round text-lg">keyboard_arrow_down</span>
        </button>
        <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg hidden group-hover:block overflow-hidden z-[9999]">
          <div class="px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
            <p class="text-sm font-medium">${user.name}</p>
            <p class="text-xs text-slate-500 dark:text-zinc-400">${user.email}</p>
            ${user.type === 'admin' ? '<span class="inline-block mt-2 px-2 py-1 text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">ADMINISTRADOR</span>' : ''}
          </div>
          <a href="#" class="flex items-center px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 border-b border-slate-100 dark:border-zinc-800">
            <span class="material-icons-round text-lg mr-2">person</span> Mi Cuenta
          </a>
          <a href="#" class="flex items-center px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 border-b border-slate-100 dark:border-zinc-800">
            <span class="material-icons-round text-lg mr-2">shopping_bag</span> Mis Pedidos
          </a>
          <button onclick="logout()" class="w-full text-left flex items-center px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
            <span class="material-icons-round text-lg mr-2">logout</span> Cerrar Sesión
          </button>
        </div>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <div class="flex items-center gap-2">
        <a href="login_and_registration/code.html" class="px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
          Iniciar Sesión
        </a>
        <a href="login_and_registration/code.html" class="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Registrarse
        </a>
      </div>
    `;
  }
};

// Función logout para el window global
window.logout = () => {
  logoutUser();
  window.location.href = 'login_and_registration/code.html';
};

// Renderizar categorías en navbar/mega menu
// ⚠️ DEPRECATED: Las categorías ahora vienen de categories.js
// export const renderCategories = (containerId) => { ... }

// Toggle subcategorías (para móvil)
window.toggleSubcategories = (categoryId) => {
  const subcatsContainer = document.getElementById(`subcats-${categoryId}`);
  if (subcatsContainer) {
    subcatsContainer.classList.toggle('hidden');
  }
};

export default {
  initMobileCategories,
  updateAuthUI,
  renderCategories,
};
