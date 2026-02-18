/**
 * 🎯 COMPONENTE GLOBAL DE NAVEGACIÓN DE CATEGORÍAS
 * Se usa en: Landing Page, Admin Panel, Customer Dashboard
 * Gestiona el menú desplegable con 3 niveles de profundidad
 */

import { 
  CATEGORIES_STRUCTURE,
  getSubcategoriesByCategoryId,
  getSubsubcategoriesBySubcategoryId
} from './categories.js';

/**
 * Renderizar el menú de navegación de categorías (Desktop)
 * Retorna HTML para insertar en el navbar
 */
export function renderCategoriesMenu() {
  const categories = Object.values(CATEGORIES_STRUCTURE);
  
  return `
    <div class="hidden lg:flex items-center gap-1 group">
      <button class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <span class="material-icons-round text-lg">menu</span>
        <span class="text-sm font-medium">Categorías</span>
        <span class="material-icons-round text-sm">expand_more</span>
      </button>
      
      <!-- Submenu Nivel 1 -->
      <div class="absolute left-0 mt-0 pt-0 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 top-full">
        <div class="py-2">
          ${categories.map(category => `
            <div class="group/subcat">
              <a href="./products-by-category.html?category=${category.id}" class="flex items-center justify-between px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm">
                <div class="flex items-center gap-3">
                  <span class="material-icons-round text-sm">${category.icon}</span>
                  <span>${category.name}</span>
                </div>
                <span class="material-icons-round text-xs">chevron_right</span>
              </a>
              
              <!-- Submenu Nivel 2 -->
              <div class="absolute left-full top-0 mt-0 ml-0 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover/subcat:opacity-100 group-hover/subcat:visible transition-all duration-200 z-50">
                <div class="py-2 grid grid-cols-2 gap-1">
                  ${Object.values(category.subcategories || {}).map(subcategory => `
                    <div class="group/subsubcat relative">
                      <a href="./products-by-category.html?category=${category.id}&subcategory=${subcategory.id}" class="flex items-center justify-between px- py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xs font-medium pl-2">
                        <div class="flex items-center gap-2 flex-1">
                          <span class="material-icons-round text-xs">${subcategory.icon}</span>
                          <span>${subcategory.name}</span>
                        </div>
                        ${Object.keys(subcategory.subsubcategories || {}).length > 0 ? `<span class="material-icons-round text-xs">chevron_right</span>` : ''}
                      </a>
                      
                      <!-- Submenu Nivel 3 -->
                      ${Object.keys(subcategory.subsubcategories || {}).length > 0 ? `
                        <div class="absolute left-full top-0 mt-0 ml-0 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover/subsubcat:opacity-100 group-hover/subsubcat:visible transition-all duration-200 z-50">
                          <div class="py-1 max-h-48 overflow-y-auto">
                            ${Object.values(subcategory.subsubcategories || {}).map(subsubcategory => `
                              <a href="./products-by-category.html?category=${category.id}&subcategory=${subcategory.id}&subsubcategory=${subsubcategory.id}" class="block px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xs">
                                ${subsubcategory.name}
                              </a>
                            `).join('')}
                          </div>
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderizar el menú de navegación de categorías (Móvil)
 * Retorna HTML expandible para el menú de móvil
 */
export function renderCategoriesMenuMobile() {
  const categories = Object.values(CATEGORIES_STRUCTURE);
  
  return `
    <div class="border-t border-slate-200 dark:border-white/10 mt-2 pt-2">
      <div class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-4 py-2">Categorías</div>
      
      ${categories.map((category, idx) => `
        <div>
          <button onclick="toggleCategoryMenu('category-${idx}')" class="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-sm font-medium">
            <div class="flex items-center gap-2">
              <span class="material-icons-round text-sm">${category.icon}</span>
              <span>${category.name}</span>
            </div>
            <span class="material-icons-round text-sm category-chevron-${idx}">expand_more</span>
          </button>
          
          <!-- Subcategorías Nivel 2 -->
          <div id="category-${idx}" class="hidden bg-slate-50 dark:bg-white/5">
            ${Object.values(category.subcategories || {}).map((subcategory, subIdx) => `
              <div>
                <button onclick="toggleCategoryMenu('subcategory-${idx}-${subIdx}')" class="w-full flex items-center justify-between px-8 py-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-xs">
                  <div class="flex items-center gap-2">
                    <span class="material-icons-round text-xs">${subcategory.icon}</span>
                    <span>${subcategory.name}</span>
                  </div>
                  ${Object.keys(subcategory.subsubcategories || {}).length > 0 ? `<span class="material-icons-round text-xs subcat-chevron-${idx}-${subIdx}">expand_more</span>` : ''}
                </button>
                
                <!-- Subcategorías Nivel 3 -->
                ${Object.keys(subcategory.subsubcategories || {}).length > 0 ? `
                  <div id="subcategory-${idx}-${subIdx}" class="hidden bg-slate-100 dark:bg-white/10">
                    ${Object.values(subcategory.subsubcategories || {}).map(subsubcategory => `
                      <a href="./products-by-category.html?category=${category.id}&subcategory=${subcategory.id}&subsubcategory=${subsubcategory.id}" class="block px-12 py-2 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors text-xs">
                        ${subsubcategory.name}
                      </a>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

export function renderCategoriesBarHorizontal(basePath = './') {
  const categories = Object.values(CATEGORIES_STRUCTURE);
  return `
    <div class="flex items-center justify-center gap-2">
      ${categories.map(category => `
        <div class="relative group">
          <a href="${basePath}products-by-category.html?category=${category.id}" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center gap-2">
            <span class="material-icons-round text-sm">${category.icon}</span>
            <span>${category.name}</span>
            ${Object.keys(category.subcategories || {}).length > 0 ? '<span class="material-icons-round text-xs">expand_more</span>' : ''}
          </a>
          ${Object.keys(category.subcategories || {}).length > 0 ? `
            <div class="absolute left-0 top-full mt-0 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl hidden group-hover:block z-50 overflow-visible">
              <div class="py-2 grid grid-cols-2 gap-1">
                ${Object.values(category.subcategories || {}).map(subcat => `
                  <div class="relative group/submenu">
                    <a href="${basePath}products-by-category.html?category=${category.id}&subcategory=${subcat.id}" class="flex items-center justify-between gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs transition-colors">
                      <span class="flex items-center gap-2">
                        <span class="material-icons-round text-xs">${subcat.icon || 'chevron_right'}</span>
                        <span>${subcat.name}</span>
                      </span>
                      ${Object.keys(subcat.subsubcategories || {}).length > 0 ? '<span class="material-icons-round text-xs">chevron_right</span>' : ''}
                    </a>
                    ${Object.keys(subcat.subsubcategories || {}).length > 0 ? `
                      <div class="absolute left-full top-0 mt-0 ml-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl hidden group-hover/submenu:block z-50 overflow-hidden">
                        ${Object.values(subcat.subsubcategories || {}).map(third => `
                          <a href="${basePath}products-by-category.html?category=${category.id}&subcategory=${subcat.id}&subsubcategory=${third.id}" class="block px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs">
                            ${third.name}
                          </a>
                        `).join('')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Inicializar funciones globales para manejo de menú móvil
 */
export function initializeCategoriesMenu() {
  window.toggleCategoryMenu = function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.toggle('hidden');
      
      // Cambiar icono del chevron
      const chevron = document.querySelector(`[class*="${elementId}-chevron"], .${elementId}-chevron`);
      if (chevron) {
        if (element.classList.contains('hidden')) {
          chevron.textContent = 'expand_more';
        } else {
          chevron.textContent = 'expand_less';
        }
      }
    }
  };
}

export default {
  renderCategoriesMenu,
  renderCategoriesMenuMobile,
  renderCategoriesBarHorizontal,
  initializeCategoriesMenu
};
