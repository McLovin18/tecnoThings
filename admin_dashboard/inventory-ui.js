// Admin Dashboard - Inventory Management Logic
import {
  getInventoryProducts,
  createInventoryProduct,
  updateInventoryProduct,
  deleteInventoryProduct,
  getInventoryProductById,
  searchInventoryProducts,
  getInventoryStats,
  exportInventoryJSON,
  validateProduct,
  CATEGORIES,
  getSubcategoriesByCategory,
  updateProductStock,
  toggleProductPublish
} from './inventory-module.js';

// Inicializar inventario
export async function initializeInventory() {
  await loadProductsTable();
  await loadInventoryStats();
  setupEventListeners();
}

// Cargar tabla de productos desde Firebase
async function loadProductsTable(productsToDisplay = null) {
  const products = productsToDisplay || await getInventoryProducts();
  const tableBody = document.getElementById('products-table-body');
  
  if (!tableBody) return;
  
  if (!products || products.length === 0) {
    tableBody.innerHTML = `
      <tr class="border-b border-slate-100 dark:border-slate-700">
        <td colspan="6" class="px-6 py-8 text-center text-slate-500 dark:text-neutral-400">
          <span class="material-icons-round text-4xl opacity-40 mb-2 block">inbox</span>
          <p>No hay productos. Crea uno.</p>
        </td>
      </tr>
    `;
    return;
  }
  
  tableBody.innerHTML = products.map(product => {
    const stockColor = product.stock === 0 
      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      : product.stock < 10
      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    
    const activeStatus = product.isActive 
      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    
    return `
      <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50">
        <td class="px-4 lg:px-6 py-4 text-xs lg:text-sm font-mono text-slate-500">${product.id.substring(0, 8)}</td>
        <td class="px-4 lg:px-6 py-4 text-xs lg:text-sm font-medium">${product.name}</td>
        <td class="px-4 lg:px-6 py-4 text-xs lg:text-sm capitalize">${product.subcategory || product.category}</td>
        <td class="px-4 lg:px-6 py-4 text-xs lg:text-sm font-semibold">$${product.price.toFixed(2)}</td>
        <td class="px-4 lg:px-6 py-4">
          <span class="px-2 py-1 rounded-full text-xs font-medium ${stockColor}">
            ${product.stock}
          </span>
        </td>
        <td class="px-4 lg:px-6 py-4">
          <span class="px-2 py-1 rounded-full text-xs font-medium ${activeStatus}">
            ${product.isActive ? 'Publicado' : 'Borrador'}
          </span>
        </td>
        <td class="px-4 lg:px-6 py-4">
          <div class="flex gap-1 justify-center">
            <button onclick="window.editProduct('${product.id}')" class="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Editar">
              <span class="material-icons-round text-sm">edit</span>
            </button>
            <button onclick="window.togglePublish('${product.id}', ${product.isActive})" class="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Publicar/Despublicar">
              <span class="material-icons-round text-sm ${product.isActive ? 'text-blue-500' : 'text-gray-500'}">visibility</span>
            </button>
            <button onclick="window.deleteProductHandler('${product.id}')" class="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Eliminar">
              <span class="material-icons-round text-sm text-red-500">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Cargar estadísticas desde Firebase
async function loadInventoryStats() {
  try {
    const stats = await getInventoryStats();
    
    const totalElem = document.getElementById('stats-total');
    const valueElem = document.getElementById('stats-value');
    const lowElem = document.getElementById('stats-low');
    const outElem = document.getElementById('stats-out');
    
    if (totalElem) totalElem.textContent = stats.totalProducts;
    if (valueElem) valueElem.textContent = `$${stats.totalValue.toFixed(2)}`;
    if (lowElem) lowElem.textContent = stats.lowStockCount;
    if (outElem) outElem.textContent = stats.outOfStock;
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  }
}

// Configurar event listeners
function setupEventListeners() {
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', async (e) => {
      const query = e.target.value;
      const results = query ? await searchInventoryProducts(query) : await getInventoryProducts();
      await loadProductsTable(results);
    });
  }
}

// Mostrar formulario de producto (modal)
export async function showProductForm(productId = null) {
  const product = productId ? await getInventoryProductById(productId) : null;
  const isEditing = !!product;
  const productCategory = product?.category || '';
  const productSubcategory = product?.subcategory || '';
  
  // Generar opciones de categorías
  const categoryOptions = Object.entries(CATEGORIES)
    .map(([key, value]) => `<option value="${key}" ${productCategory === key ? 'selected' : ''}>${value.name}</option>`)
    .join('');
  
  // Generar opciones de subcategorías (vacío por defecto, se llena con JS)
  let subcategoryOptions = '';
  if (productCategory) {
    const subcats = getSubcategoriesByCategory(productCategory);
    subcategoryOptions = Object.entries(subcats)
      .map(([key, value]) => `<option value="${key}" ${productSubcategory === key ? 'selected' : ''}>${value}</option>`)
      .join('');
  }
  
  const modalHTML = `
    <div id="product-modal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 p-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold">${isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button onclick="document.getElementById('product-modal').remove()" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <span class="material-icons-round">close</span>
          </button>
        </div>
        
        <form id="product-form" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium mb-2">Nombre del Producto *</label>
              <input type="text" name="name" value="${product?.name || ''}" required class="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Precio *</label>
              <input type="number" name="price" value="${product?.price || ''}" step="0.01" required class="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Stock *</label>
              <input type="number" name="stock" value="${product?.stock || ''}" min="0" required class="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Categoría *</label>
              <select name="category" id="category-select" required class="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500">
                <option value="">Selecciona una categoría</option>
                ${categoryOptions}
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Subcategoría *</label>
              <select name="subcategory" id="subcategory-select" required class="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500">
                <option value="">Selecciona una subcategoría</option>
                ${subcategoryOptions}
              </select>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Se actualiza automáticamente según la categoría</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">URL de Imagen</label>
              <input type="url" name="image" value="${product?.image || ''}" placeholder="https://..." class="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500">
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Descripción</label>
            <textarea name="detail" placeholder="Describe el producto..." rows="3" class="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500">${product?.detail || ''}</textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Características (una por línea)</label>
            <textarea name="characteristics" placeholder="4GB RAM&#10;256GB SSD&#10;Pantalla 15.6&quot;" rows="3" class="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500">${(product?.characteristics || []).join('\n')}</textarea>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Escribe cada característica en una línea nueva</p>
          </div>
          
          <div class="flex gap-3 pt-4">
            <button type="submit" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
              ${isEditing ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
            <button type="button" onclick="document.getElementById('product-modal').remove()" class="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-4 py-2 rounded-lg font-medium">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  const form = document.getElementById('product-form');
  const categorySelect = document.getElementById('category-select');
  const subcategorySelect = document.getElementById('subcategory-select');
  
  // Event listener para actualizar subcategorías cuando cambie la categoría
  categorySelect.addEventListener('change', (e) => {
    const selectedCategory = e.target.value;
    
    // Limpiar opciones previas
    subcategorySelect.innerHTML = '<option value="">Selecciona una subcategoría</option>';
    
    if (selectedCategory) {
      const subcats = getSubcategoriesByCategory(selectedCategory);
      Object.entries(subcats).forEach(([key, value]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value;
        subcategorySelect.appendChild(option);
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveProduct(form, productId);
  });
}

// Guardar producto en Firebase
async function saveProduct(form, productId = null) {
  const formData = new FormData(form);
  const characteristics = formData.get('characteristics')
    .split('\n')
    .map(c => c.trim())
    .filter(c => c);
  
  const productData = {
    name: formData.get('name'),
    price: parseFloat(formData.get('price')),
    stock: parseInt(formData.get('stock')),
    category: formData.get('category'),
    subcategory: formData.get('subcategory'),
    image: formData.get('image') || 'https://via.placeholder.com/400x400?text=Producto',
    detail: formData.get('detail'),
    characteristics
  };
  
  const validation = validateProduct(productData);
  
  if (!validation.valid) {
    alert('Errores:\n' + validation.errors.join('\n'));
    return;
  }
  
  try {
    if (productId) {
      await updateInventoryProduct(productId, productData);
      alert('✓ Producto actualizado correctamente');
    } else {
      await createInventoryProduct(productData);
      alert('✓ Producto creado correctamente');
    }
    
    document.getElementById('product-modal').remove();
    await loadProductsTable();
    await loadInventoryStats();
  } catch (error) {
    console.error('Error guardando producto:', error);
    alert('❌ Error: ' + error.message);
  }
}

// Editar producto
export async function editProduct(productId) {
  await showProductForm(productId);
}

// Eliminar producto
export async function deleteProductHandler(productId) {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    try {
      await deleteInventoryProduct(productId);
      await loadProductsTable();
      await loadInventoryStats();
      alert('✓ Producto eliminado');
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('❌ Error al eliminar: ' + error.message);
    }
  }
}

// Cambiar publicación de producto
export async function togglePublish(productId, currentStatus) {
  try {
    await toggleProductPublish(productId, !currentStatus);
    await loadProductsTable();
    alert(`✓ Producto ${!currentStatus ? 'publicado' : 'despublicado'} correctamente`);
  } catch (error) {
    console.error('Error cambiando estado:', error);
    alert('❌ Error: ' + error.message);
  }
}

// Exportar inventario
export async function exportInventory() {
  try {
    await exportInventoryJSON();
    alert('✓ Inventario exportado correctamente');
  } catch (error) {
    console.error('Error exportando:', error);
    alert('❌ Error al exportar: ' + error.message);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeInventory);

// Exportar funciones al scope global
window.showProductForm = showProductForm;
window.editProduct = editProduct;
window.deleteProductHandler = deleteProductHandler;
window.exportInventory = exportInventory;
window.togglePublish = togglePublish;
