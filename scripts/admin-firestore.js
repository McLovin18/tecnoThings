/**
 * 🔥 ADMIN FIREBASE MODULE
 * Maneja todas las operaciones CRUD para:
 * - Productos
 * - Pedidos (Orders)
 * - Clientes (Customers)
 * 
 * Usa Firestore como base de datos
 */

import { db, auth, storage } from './firebase-config.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';
import { CATEGORIES_STRUCTURE } from './categories.js';

// ============================================
// 📦 PRODUCTOS
// ============================================

export const productsManager = {
  /**
   * Traer todos los productos
   */
  async getAll() {
    try {
      const productsCol = collection(db, 'products');
      const q = query(productsCol, orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ Error al traer productos:', error);
      return [];
    }
  },

  /**
   * Traer productos por categoría
   */
  async getByCategory(category) {
    try {
      const productsCol = collection(db, 'products');
      const q = query(productsCol, where('category', '==', category));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ Error al traer productos por categoría:', error);
      return [];
    }
  },

  /**
   * Crear un nuevo producto
   */
  async create(productData) {
    try {
      const productsCol = collection(db, 'products');
      const prepared = {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
        stock: productData.stock || 0,
        price: parseFloat(productData.price) || 0,
        images: Array.isArray(productData.images) ? productData.images : [],
        description: productData.description || '',
        brand: productData.brand || null,
        model: productData.model || null,
        details: typeof productData.details === 'object' && productData.details !== null ? productData.details : {},
        isActive: true
      };
      const docRef = await addDoc(productsCol, prepared);
      console.log('✅ Producto creado:', docRef.id);
      return { id: docRef.id, ...prepared };
    } catch (error) {
      console.error('❌ Error al crear producto:', error);
      throw error;
    }
  },

  /**
   * Actualizar un producto
   */
  async update(productId, updateData) {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        ...updateData,
        updatedAt: new Date()
      });
      console.log('✅ Producto actualizado:', productId);
      return true;
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error);
      throw error;
    }
  },

  /**
   * Eliminar un producto
   */
  async delete(productId) {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
      console.log('✅ Producto eliminado:', productId);
      return true;
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error);
      throw error;
    }
  },

  /**
   * Escuchar cambios en tiempo real
   */
  onProductsChange(callback) {
    const productsCol = collection(db, 'products');
    const q = query(productsCol, orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(products);
    });
  }
};

// ============================================
// 📋 ÓRDENES (PEDIDOS)
// ============================================

export const ordersManager = {
  /**
   * Traer todos los pedidos
   */
  async getAll() {
    try {
      const ordersCol = collection(db, 'orders');
      const q = query(ordersCol, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
    } catch (error) {
      console.error('❌ Error al traer pedidos:', error);
      return [];
    }
  },

  /**
   * Traer pedidos de un cliente
   */
  async getByCustomer(customerId) {
    try {
      const ordersCol = collection(db, 'orders');
      const q = query(ordersCol, where('customerId', '==', customerId), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
    } catch (error) {
      console.error('❌ Error al traer pedidos del cliente:', error);
      return [];
    }
  },

  /**
   * Crear un nuevo pedido
   */
  async create(orderData) {
    try {
      const ordersCol = collection(db, 'orders');
      const docRef = await addDoc(ordersCol, {
        ...orderData,
        createdAt: new Date(),
        status: orderData.status || 'pending',
        total: parseFloat(orderData.total) || 0
      });
      console.log('✅ Pedido creado:', docRef.id);
      return { id: docRef.id, ...orderData };
    } catch (error) {
      console.error('❌ Error al crear pedido:', error);
      throw error;
    }
  },

  /**
   * Actualizar estado de un pedido
   */
  async updateStatus(orderId, status) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: status,
        updatedAt: new Date()
      });
      console.log('✅ Estado del pedido actualizado:', status);
      return true;
    } catch (error) {
      console.error('❌ Error al actualizar pedido:', error);
      throw error;
    }
  },

  /**
   * Escuchar cambios en tiempo real
   */
  onOrdersChange(callback) {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      callback(orders);
    });
  }
};

// ============================================
// 👥 CLIENTES
// ============================================

export const customersManager = {
  /**
   * Traer todos los clientes
   */
  async getAll() {
    try {
      const customersCol = collection(db, 'users');
      const q = query(customersCol, where('role', '==', 'cliente'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ Error al traer clientes:', error);
      return [];
    }
  },

  /**
   * Traer un cliente por ID
   */
  async getById(customerId) {
    try {
      const customerRef = doc(db, 'users', customerId);
      const snapshot = await getDocs(customerRef);
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    } catch (error) {
      console.error('❌ Error al traer cliente:', error);
      return null;
    }
  },

  /**
   * Escuchar cambios en tiempo real
   */
  onCustomersChange(callback) {
    const customersCol = collection(db, 'users');
    const q = query(customersCol, where('role', '==', 'cliente'));
    return onSnapshot(q, (snapshot) => {
      const customers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(customers);
    });
  }
};

// ============================================
// 🎯 FUNCIONES AUXILIARES
// ============================================

/**
 * Obtener estructura de categorías para selects
 * Aplanar toda la jerarquía de categorías en un array simple
 */
export function getCategoriesForSelect() {
  // Aplana la estructura de categorías (soporta cualquier profundidad)
  // y devuelve un array listo para usar en <select>.
  const options = [];

  const pushOption = ({ id, name, icon }, breadcrumbNames, parentId) => {
    if (!id || !name) return;
    const label = breadcrumbNames.filter(Boolean).join(' > ').trim();
    if (!label) return;
    options.push({
      value: id,
      label,
      parent: parentId || null,
      icon: icon || null
    });
  };

  const traverseNode = (node, breadcrumbNames, parentId) => {
    // Agrega el nodo actual (excepto cuando sea el nodo raíz principal)
    pushOption(node, breadcrumbNames, parentId);

    const containers = ['subcategories', 'subsubcategories'];
    for (const key of containers) {
      const children = node?.[key];
      if (!children || typeof children !== 'object') continue;
      for (const child of Object.values(children)) {
        if (!child || typeof child !== 'object') continue;
        traverseNode(child, [...breadcrumbNames, child.name], node.id);
      }
    }
  };

  // Recorre cada categoría principal y agrega SOLO sus descendientes
  // (mantiene el comportamiento esperado: no usar la categoría raíz como opción).
  for (const mainCategory of Object.values(CATEGORIES_STRUCTURE || {})) {
    if (!mainCategory || typeof mainCategory !== 'object') continue;
    const rootName = mainCategory.name;
    const rootId = mainCategory.id;
    const children = mainCategory.subcategories;
    if (!children || typeof children !== 'object') continue;
    for (const child of Object.values(children)) {
      if (!child || typeof child !== 'object') continue;
      traverseNode(child, [rootName, child.name], rootId);
    }
  }

  // Quitar duplicados por id (manteniendo el primer label)
  const seen = new Set();
  const unique = [];
  for (const opt of options) {
    if (!opt?.value || seen.has(opt.value)) continue;
    seen.add(opt.value);
    unique.push(opt);
  }

  console.log('✅ Categorías cargadas:', unique.length);
  return unique;
}

/**
 * Validar datos de producto
 */
export function validateProduct(productData) {
  const errors = [];

  if (!productData.name || productData.name.trim() === '') {
    errors.push('El nombre del producto es requerido');
  }

  if (!productData.category || productData.category.trim() === '') {
    errors.push('La categoría es requerida');
  }

  if (!productData.price || parseFloat(productData.price) <= 0) {
    errors.push('El precio debe ser mayor a 0');
  }

  if (!productData.stock || parseInt(productData.stock) < 0) {
    errors.push('El stock no puede ser negativo');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Formatear dinero
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Formatear fecha
 */
export function formatDate(date) {
  if (!date) return 'N/A';
  
  if (typeof date === 'object' && date.toDate) {
    date = date.toDate();
  }

  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

/**
 * Estadísticas rápidas de inventario
 */
export async function getInventoryStats() {
  try {
    const products = await productsManager.getAll();
    
    const stats = {
      total: products.length,
      value: products.reduce((sum, p) => sum + (p.price * p.stock || 0), 0),
      lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
      outOfStock: products.filter(p => p.stock === 0).length
    };

    return stats;
  } catch (error) {
    console.error('❌ Error al calcular estadísticas:', error);
    return { total: 0, value: 0, lowStock: 0, outOfStock: 0 };
  }
}

/**
 * Subir imágenes de producto a Firebase Storage y devolver URLs
 */
export async function uploadProductImages(productId, files) {
  try {
    const urls = [];
    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const fileRef = ref(storage, `product_images/${productId}/${Date.now()}_${safeName}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      urls.push(url);
    }
    return urls;
  } catch (error) {
    console.error('❌ Error subiendo imágenes de producto:', error);
    throw error;
  }
}

console.log('✅ Admin Firestore Module loaded');
