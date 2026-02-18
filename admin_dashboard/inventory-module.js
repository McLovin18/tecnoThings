// Módulo de Inventario - Gestión completa de productos (Firebase)

import { 
  getActiveProducts,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive
} from '../scripts/firebase-products.js';

import { 
  CATEGORIES_STRUCTURE,
  getCategoryById,
  getSubcategoryById,
  getSubsubcategoryById,
  getSubcategoriesByCategoryId,
  getSubsubcategoriesBySubcategoryId
} from '../scripts/categories.js';

// Exportar CATEGORIES_STRUCTURE como CATEGORIES para compatibilidad
export const CATEGORIES = CATEGORIES_STRUCTURE;

// Obtener subcategorías de una categoría
export function getSubcategoriesByCategory(categoryId) {
  const subcats = getSubcategoriesByCategoryId(categoryId);
  const result = {};
  subcats.forEach(subcat => {
    result[subcat.id] = subcat.name;
  });
  return result;
}

// Obtener productos del inventario desde Firebase
export async function getInventoryProducts() {
  try {
    return await getAllProducts(); // Obtener todos incluyendo no publicados
  } catch (error) {
    console.error('Error obteniendo productos de Firebase:', error);
    return [];
  }
}

// Crear nuevo producto en Firebase
export async function createInventoryProduct(productData) {
  try {
  const newProduct = await createProduct({
      name: productData.name,
      price: parseFloat(productData.price),
      stock: parseInt(productData.stock),
      category: productData.category,
      subcategory: productData.subcategory,
      image: productData.image || 'https://via.placeholder.com/400x400?text=Producto',
      images: productData.images || [],
      description: productData.description || '',
      detail: productData.detail || '',
      characteristics: productData.characteristics || [],
      isActive: true
    });
    return newProduct;
  } catch (error) {
    console.error('Error creando producto en Firebase:', error);
    throw error;
  }
}

// Actualizar producto en Firebase
export async function updateInventoryProduct(productId, updatedData) {
  try {
    const updated = await updateProduct(productId, {
      name: updatedData.name,
      price: parseFloat(updatedData.price),
      stock: parseInt(updatedData.stock),
      category: updatedData.category,
      subcategory: updatedData.subcategory,
      image: updatedData.image,
      images: updatedData.images || [],
      description: updatedData.description || '',
      detail: updatedData.detail || '',
      characteristics: updatedData.characteristics || []
    });
    return updated;
  } catch (error) {
    console.error('Error actualizando producto en Firebase:', error);
    throw error;
  }
}

// Actualizar stock de un producto en Firebase
export async function updateProductStock(productId, newStock) {
  try {
    return await updateProduct(productId, { stock: parseInt(newStock) });
  } catch (error) {
    console.error('Error actualizando stock:', error);
    throw error;
  }
}

// Eliminar producto de Firebase
export async function deleteInventoryProduct(productId) {
  try {
    await deleteProduct(productId);
    return { success: true };
  } catch (error) {
    console.error('Error eliminando producto de Firebase:', error);
    throw error;
  }
}

// Obtener producto por ID desde Firebase
export async function getInventoryProductById(productId) {
  try {
    return await getProductById(productId);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return null;
  }
}

// Obtener productos por categoría desde Firebase
export async function getInventoryProductsByCategory(category) {
  try {
    const products = await getAllProducts();
    return products.filter(p => p.category === category);
  } catch (error) {
    console.error('Error obteniendo productos por categoría:', error);
    return [];
  }
}

// Obtener productos por subcategoría desde Firebase
export async function getInventoryProductsBySubcategory(category, subcategory) {
  try {
    const products = await getAllProducts();
    return products.filter(p => p.category === category && p.subcategory === subcategory);
  } catch (error) {
    console.error('Error obteniendo productos por subcategoría:', error);
    return [];
  }
}

// Buscar productos desde Firebase
export async function searchInventoryProducts(query) {
  try {
    const products = await getAllProducts();
    const lowerQuery = query.toLowerCase();
    
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
      (p.detail && p.detail.toLowerCase().includes(lowerQuery)) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error buscando productos:', error);
    return [];
  }
}

// Obtener estadísticas del inventario desde Firebase
export async function getInventoryStats() {
  try {
    const products = await getAllProducts();
    
    return {
      totalProducts: products.length,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
      lowStockCount: products.filter(p => p.stock < 10).length,
      outOfStock: products.filter(p => p.stock === 0).length,
      activeProducts: products.filter(p => p.isActive).length,
      byCategory: {
        perifericos: products.filter(p => p.category === 'perifericos').length,
        monitores: products.filter(p => p.category === 'monitores').length,
        hardware: products.filter(p => p.category === 'hardware').length,
        laptops: products.filter(p => p.category === 'laptops').length
      }
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return {
      totalProducts: 0,
      totalValue: 0,
      lowStockCount: 0,
      outOfStock: 0,
      activeProducts: 0,
      byCategory: {}
    };
  }
}

// Exportar inventario como JSON desde Firebase
export async function exportInventoryJSON() {
  try {
    const products = await getAllProducts();
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventario-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exportando inventario:', error);
    throw error;
  }
}

// Validar producto
export function validateProduct(productData) {
  const errors = [];
  
  if (!productData.name || productData.name.trim().length === 0) {
    errors.push('El nombre del producto es requerido');
  }
  
  if (!productData.price || isNaN(parseFloat(productData.price)) || parseFloat(productData.price) < 0) {
    errors.push('El precio debe ser un número válido y mayor a 0');
  }
  
  if (productData.stock === undefined || isNaN(parseInt(productData.stock)) || parseInt(productData.stock) < 0) {
    errors.push('El stock debe ser un número válido y no negativo');
  }
  
  if (!productData.category) {
    errors.push('La categoría es requerida');
  }
  
  if (!productData.subcategory) {
    errors.push('La subcategoría es requerida');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export const toggleProductPublish = async (productId, isActive) => {
  try {
    await toggleProductActive(productId, isActive);
    return { success: true };
  } catch (error) {
    console.error('Error cambiando estado de producto:', error);
    throw error;
  }
};

export default {
  getInventoryProducts,
  createInventoryProduct,
  updateInventoryProduct,
  updateProductStock,
  deleteInventoryProduct,
  getInventoryProductById,
  getInventoryProductsByCategory,
  getInventoryProductsBySubcategory,
  searchInventoryProducts,
  getInventoryStats,
  exportInventoryJSON,
  validateProduct,
  toggleProductPublish
};
