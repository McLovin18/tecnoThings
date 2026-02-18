// Ejemplo de integración de inventario en otras páginas
// Este archivo muestra cómo usar el módulo de inventario en diferentes contextos

import {
  getInventoryProducts,
  getProductById,
  getProductsByCategory,
  getProductsBySubcategory,
  searchProducts
} from '../admin_dashboard/inventory-module.js';

// ============================================
// 1. PÁGINA DE DETALLE DE PRODUCTO
// ============================================
export function loadProductDetail(productId) {
  const product = getProductById(productId);
  
  if (!product) {
    console.error('Producto no encontrado:', productId);
    return null;
  }
  
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    stock: product.stock,
    image: product.image,
    description: product.detail,
    characteristics: product.characteristics,
    category: product.category,
    subcategory: product.subcategory,
    inStock: product.stock > 0
  };
}

// ============================================
// 2. PÁGINA DE CATEGORÍA
// ============================================
export function loadProductsByCategory(category) {
  const products = getProductsByCategory(category);
  
  return products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    stock: p.stock,
    inStock: p.stock > 0,
    category: p.category
  }));
}

// ============================================
// 3. PÁGINA DE SUBCATEGORÍA
// ============================================
export function loadProductsBySubcategory(category, subcategory) {
  const products = getProductsBySubcategory(category, subcategory);
  
  return products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    stock: p.stock,
    inStock: p.stock > 0
  }));
}

// ============================================
// 4. BUSCADOR
// ============================================
export function searchAllProducts(query) {
  const results = searchProducts(query);
  
  return results.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
    subcategory: p.subcategory
  }));
}

// ============================================
// 5. CARRITO DE COMPRAS - Verificar disponibilidad
// ============================================
export function validateCartItem(productId, quantity) {
  const product = getProductById(productId);
  
  if (!product) {
    return { valid: false, message: 'Producto no encontrado' };
  }
  
  if (product.stock === 0) {
    return { valid: false, message: 'Producto agotado' };
  }
  
  if (quantity > product.stock) {
    return { 
      valid: false, 
      message: `Solo hay ${product.stock} disponibles. Solicitaste ${quantity}`
    };
  }
  
  return { valid: true, price: product.price, name: product.name };
}

// ============================================
// 6. PÁGINA DE OFERTAS/DESTACADOS
// ============================================
export function getFeaturedProducts(limit = 6) {
  const products = getInventoryProducts();
  
  // Ordenar por stock disponible y precio
  return products
    .filter(p => p.stock > 0)
    .sort((a, b) => b.stock - a.stock)
    .slice(0, limit)
    .map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category
    }));
}

// ============================================
// 7. FILTRO AVANZADO (Precio, Stock, Categoría)
// ============================================
export function filterProducts(options = {}) {
  let products = getInventoryProducts();
  
  // Filtrar por categoría
  if (options.category) {
    products = products.filter(p => p.category === options.category);
  }
  
  // Filtrar por rango de precio
  if (options.minPrice || options.maxPrice) {
    products = products.filter(p => {
      const inRange = true;
      if (options.minPrice && p.price < options.minPrice) return false;
      if (options.maxPrice && p.price > options.maxPrice) return false;
      return true;
    });
  }
  
  // Filtrar por disponibilidad
  if (options.inStockOnly) {
    products = products.filter(p => p.stock > 0);
  }
  
  // Ordenar
  if (options.sortBy) {
    switch (options.sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'stock':
        products.sort((a, b) => b.stock - a.stock);
        break;
    }
  }
  
  return products;
}

// ============================================
// 8. REPORTE DE PRODUCTOS AGOTADOS
// ============================================
export function getOutOfStockReport() {
  const products = getInventoryProducts();
  
  const outOfStock = products.filter(p => p.stock === 0);
  
  return {
    totalOutOfStock: outOfStock.length,
    products: outOfStock.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category
    })),
    lastUpdated: new Date().toISOString()
  };
}

// ============================================
// 9. REPORTE DE STOCK BAJO
// ============================================
export function getLowStockReport(threshold = 10) {
  const products = getInventoryProducts();
  
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= threshold);
  
  return {
    threshold: threshold,
    totalLowStock: lowStock.length,
    products: lowStock.map(p => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      category: p.category,
      needsReorder: p.stock <= 5
    }))
  };
}

// ============================================
// 10. ESTADÍSTICAS GLOBALES
// ============================================
export function getGlobalStats() {
  const products = getInventoryProducts();
  
  if (products.length === 0) {
    return {
      totalProducts: 0,
      totalValue: 0,
      categories: {},
      avgPrice: 0,
      totalStock: 0
    };
  }
  
  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    avgPrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
    categories: {},
    mostExpensive: null,
    cheapest: null,
    highestStock: null
  };
  
  // Contar por categoría
  products.forEach(p => {
    stats.categories[p.category] = (stats.categories[p.category] || 0) + 1;
  });
  
  // Encontrar extremos
  stats.mostExpensive = products.reduce((max, p) => 
    p.price > max.price ? p : max
  );
  
  stats.cheapest = products.reduce((min, p) => 
    p.price < min.price ? p : min
  );
  
  stats.highestStock = products.reduce((max, p) => 
    p.stock > max.stock ? p : max
  );
  
  return stats;
}

// ============================================
// EJEMPLO DE USO EN HTML
// ============================================

/*
// En product-detail.html
<script type="module">
  import { loadProductDetail } from './integration-examples.js';
  
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  const product = loadProductDetail(productId);
  
  if (product) {
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = '$' + product.price;
    document.getElementById('product-stock').textContent = 
      product.inStock ? `${product.stock} disponibles` : 'Agotado';
    // ... más detalles
  }
</script>

// En products-by-category.html
<script type="module">
  import { loadProductsByCategory } from './integration-examples.js';
  
  const category = new URLSearchParams(window.location.search).get('category');
  const products = loadProductsByCategory(category);
  
  const container = document.getElementById('products-grid');
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">$${p.price}</p>
      <p class="stock">${p.inStock ? p.stock + ' en stock' : 'Agotado'}</p>
      <button onclick="addToCart(${p.id})">Agregar</button>
    </div>
  `).join('');
</script>

// En carrito de compras
<script type="module">
  import { validateCartItem } from './integration-examples.js';
  
  function addToCart(productId, quantity = 1) {
    const validation = validateCartItem(productId, quantity);
    
    if (!validation.valid) {
      alert(validation.message);
      return;
    }
    
    // Agregar al carrito
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: productId,
        name: validation.name,
        price: validation.price,
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Producto agregado al carrito');
  }
  
  window.addToCart = addToCart;
</script>
*/

export default {
  loadProductDetail,
  loadProductsByCategory,
  loadProductsBySubcategory,
  searchAllProducts,
  validateCartItem,
  getFeaturedProducts,
  filterProducts,
  getOutOfStockReport,
  getLowStockReport,
  getGlobalStats
};
