/**
 * 📦 GESTOR DE PRODUCTOS
 * Reemplaza products.js - Ahora lee de Firestore
 */

import { db } from './firebase-config.js';
import { CATEGORIES_STRUCTURE } from './categories.js';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

/**
 * Obtener todos los productos ACTIVOS (para clientes)
 * Soporta isActive y active (compatibilidad con datos legacy)
 */
export const getActiveProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const seen = new Set();
    const products = [];

    const q1 = query(productsRef, where('isActive', '==', true));
    const snap1 = await getDocs(q1);
    console.log('getActiveProducts: documentos con isActive=true →', snap1.size);
    snap1.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
      seen.add(doc.id);
    });

    try {
      const q2 = query(productsRef, where('active', '==', true));
      const snap2 = await getDocs(q2);
      console.log('getActiveProducts: documentos legacy active=true →', snap2.size);
      snap2.forEach(doc => {
        if (!seen.has(doc.id)) {
          products.push({ id: doc.id, ...doc.data() });
        }
      });
    } catch (legacyErr) {
      console.warn('getActiveProducts: consulta legacy "active==true" bloqueada por reglas. Continuando solo con isActive.', legacyErr?.message || legacyErr);
    }

    return products.map(p => ({
      ...p,
      createdAt: p.createdAt && typeof p.createdAt.toDate === 'function' ? p.createdAt.toDate() : p.createdAt || null,
      updatedAt: p.updatedAt && typeof p.updatedAt.toDate === 'function' ? p.updatedAt.toDate() : p.updatedAt || null,
      price: typeof p.price === 'string' ? parseFloat(p.price) : (p.price || 0),
      image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : (p.image || null)
    }));
  } catch (error) {
    console.error('Error obteniendo productos activos:', error);
    return [];
  }
};

/**
 * Obtener todos los productos (ADMIN)
 */
export const getAllProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);

    const products = [];
    querySnapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return products.map(p => ({
      ...p,
      createdAt: p.createdAt && typeof p.createdAt.toDate === 'function' ? p.createdAt.toDate() : p.createdAt || null,
      updatedAt: p.updatedAt && typeof p.updatedAt.toDate === 'function' ? p.updatedAt.toDate() : p.updatedAt || null,
      price: typeof p.price === 'string' ? parseFloat(p.price) : (p.price || 0),
      image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : (p.image || null)
    }));
  } catch (error) {
    console.error('Error obteniendo todos los productos:', error);
    return [];
  }
};

/**
 * Obtener producto por ID
 */
export const getProductById = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
    const data = productSnap.data();
    return {
      id: productSnap.id,
      ...data,
      createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : data.createdAt || null,
      updatedAt: data.updatedAt && typeof data.updatedAt.toDate === 'function' ? data.updatedAt.toDate() : data.updatedAt || null,
      price: typeof data.price === 'string' ? parseFloat(data.price) : (data.price || 0),
      image: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : (data.image || null)
    };
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return null;
  }
};

/**
 * Obtener productos por categoría
 */
export const getProductsByCategory = async (category) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('category', '==', category),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);

    const products = [];
    querySnapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return products.map(p => ({
      ...p,
      createdAt: p.createdAt && typeof p.createdAt.toDate === 'function' ? p.createdAt.toDate() : p.createdAt || null,
      updatedAt: p.updatedAt && typeof p.updatedAt.toDate === 'function' ? p.updatedAt.toDate() : p.updatedAt || null,
      price: typeof p.price === 'string' ? parseFloat(p.price) : (p.price || 0),
      image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : (p.image || null)
    }));
  } catch (error) {
    console.error('Error obteniendo productos por categoría:', error);
    return [];
  }
};

export const getProductsByCategoryFlexible = async (categoryId) => {
  try {
    const all = await getActiveProducts();
    const id = (categoryId || '').trim();
    if (!id) return all;

    const lineageFromId = new Set([id]);
    // Buscar raíz para id si corresponde a una subcategoría conocida
    for (const main of Object.values(CATEGORIES_STRUCTURE || {})) {
      const subs = main?.subcategories || {};
      for (const sub of Object.values(subs)) {
        if (sub?.id === id) lineageFromId.add(main.id);
        const third = sub?.subsubcategories || {};
        for (const ss of Object.values(third)) {
          if (ss?.id === id) {
            lineageFromId.add(sub.id);
            lineageFromId.add(main.id);
          }
        }
      }
    }

    const matches = (p) => {
      const productIds = new Set([
        p.category,
        p.subcategory,
        p.subsubcategory,
        p.categoryRoot,
        ...(Array.isArray(p.categoryPath) ? p.categoryPath : [])
      ].filter(Boolean));

      // Si no hay raíz derivada en el doc, intenta inferirla desde category/subcategory
      if (!p.categoryRoot) {
        const cat = p.category;
        const sub = p.subcategory;
        for (const main of Object.values(CATEGORIES_STRUCTURE || {})) {
          const subs = main?.subcategories || {};
          for (const s of Object.values(subs)) {
            if (s?.id === cat || s?.id === sub) productIds.add(main.id);
            const third = s?.subsubcategories || {};
            for (const ss of Object.values(third)) {
              if (ss?.id === cat || ss?.id === sub) {
                productIds.add(s.id);
                productIds.add(main.id);
              }
            }
          }
        }
      }

      for (const candidate of lineageFromId) {
        if (productIds.has(candidate)) return true;
      }
      return false;
    };

    const result = all.filter(matches);
    console.log('getProductsByCategoryFlexible:', id, '→', result.length);
    return result;
  } catch (error) {
    console.error('Error filtrando productos por categoría flexible:', error);
    return [];
  }
};

/**
 * Buscar productos por nombre, categoría o descripción (BÚSQUEDA GLOBAL)
 */
export const searchProducts = async (query) => {
  try {
    const products = await getActiveProducts();
    const searchTerm = query.toLowerCase();
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      (product.description && product.description.toLowerCase().includes(searchTerm)) ||
      product.category.toLowerCase().includes(searchTerm) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(searchTerm))
    );
  } catch (error) {
    console.error('Error buscando productos:', error);
    return [];
  }
};

/**
 * Crear producto (ADMIN)
 */
export const createProduct = async (productData) => {
  try {
    const newProductRef = doc(collection(db, 'products'));
    
    const docData = {
      ...productData,
      isActive: productData.isActive === true ? true : false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      stock: productData.stock || 0,
      images: productData.images || [],
      category: productData.category || '',
      price: productData.price || 0
    };

    await setDoc(newProductRef, docData);

    console.log('createProduct: creado', newProductRef.id, 'isActive=', docData.isActive);
    return {
      id: newProductRef.id,
      ...docData
    };
  } catch (error) {
    console.error('Error creando producto:', error);
    throw error;
  }
};

/**
 * Actualizar producto (ADMIN)
 */
export const updateProduct = async (productId, updates) => {
  try {
    const productRef = doc(db, 'products', productId);
    
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };

    await updateDoc(productRef, updateData);

    return {
      id: productId,
      ...updateData
    };
  } catch (error) {
    console.error('Error actualizando producto:', error);
    throw error;
  }
};

/**
 * Publicar/Despublicar producto (ADMIN)
 */
export const toggleProductActive = async (productId, isActive) => {
  try {
    const productRef = doc(db, 'products', productId);
    
    await updateDoc(productRef, {
      isActive: isActive,
      updatedAt: Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    console.error('Error cambiando estado del producto:', error);
    throw error;
  }
};

/**
 * Eliminar producto (ADMIN)
 */
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    return { success: true };
  } catch (error) {
    console.error('Error eliminando producto:', error);
    throw error;
  }
};

/**
 * Cargar productos de demostración (EJECUTAR UNA SOLA VEZ)
 */
export const seedDemoProducts = async () => {
  const demoProducts = [
    // PERIFÉRICOS - MOUSES
    {
      name: "Logitech MX Master 3S",
      price: 99.99,
      category: "perifericos",
      subcategory: "mouses",
      description: "Ratón inalámbrico profesional ultrapreciso",
      images: ["https://i.ebayimg.com/images/g/2jsAAeSwriBo1G7i/s-l1600.webp"],
      stock: 15,
      isActive: true
    },
    {
      name: "Razer DeathAdder V3",
      price: 69.99,
      category: "perifericos",
      subcategory: "mouses",
      description: "Ratón gaming de alto rendimiento",
      images: ["https://i.ebayimg.com/images/g/peUAAOSwMbtmWpXt/s-l1600.webp"],
      stock: 20,
      isActive: true
    },
    // MONITORES
    {
      name: "Dell S2422HZ",
      price: 299.99,
      category: "monitores",
      subcategory: "monitores-24",
      description: "Monitor 24\" Full HD profesional",
      images: ["https://www.bing.com/th?id=OPHS.FXfq4Ikz1mrzvA474C474&o=5&pid=21.1"],
      stock: 8,
      isActive: true
    },
    {
      name: "Dell U2723DE",
      price: 499.99,
      category: "monitores",
      subcategory: "monitores-27",
      description: "Monitor 27\" 4K USB-C profesional",
      images: ["https://i.ebayimg.com/images/g/SoAAAOSwi35nasxM/s-l1600.webp"],
      stock: 5,
      isActive: true
    },
    // HARDWARE - PROCESADORES
    {
      name: "Intel Core i9-13900K",
      price: 589.99,
      category: "hardware",
      subcategory: "procesadores",
      description: "Procesador de última generación de alto rendimiento",
      images: ["https://tse3.mm.bing.net/th/id/OIP.9m9MHcmAMhC-C4wHCDJIhgHaEK"],
      stock: 3,
      isActive: true
    },
    // LAPTOPS
    {
      name: "Lenovo IdeaPad 3",
      price: 449.99,
      category: "laptops",
      subcategory: "laptops-budget",
      description: "Laptop económica para estudiantes",
      images: ["https://tse4.mm.bing.net/th/id/OIP.l0Kc8u5dHaVNulyXIbFdnwHaHa"],
      stock: 12,
      isActive: true
    }
  ];

  try {
    for (const product of demoProducts) {
      await createProduct(product);
    }
    console.log('✅ Productos de demostración cargados');
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
  }
};
