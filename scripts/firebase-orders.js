/**
 * 📋 GESTOR DE ÓRDENES/PEDIDOS
 * Maneja la creación y seguimiento de pedidos
 */

import { db, auth, storage } from './firebase-config.js';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';

/**
 * Crear nueva orden
 */
export const createOrder = async (orderData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const newOrderRef = doc(collection(db, 'orders'));

    const total = orderData.totalAmount ?? orderData.total ?? 0;
    const docData = {
      userId: user.uid,
      products: orderData.products, // Array de {productId, name, price, quantity}
      totalAmount: total,
      total, // alias para compatibilidad con admin-firestore
      status: 'pendiente', // Estados: pendiente, validando, en_transito, entregado, cancelado
      paymentProofUrl: orderData.paymentProofUrl || null,
      shippingAddress: {
        street: orderData.shippingAddress?.street || '',
        city: orderData.shippingAddress?.city || '',
        postalCode: orderData.shippingAddress?.postalCode || '',
        country: orderData.shippingAddress?.country || ''
      },
      notes: orderData.notes || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    await setDoc(newOrderRef, docData);

    return {
      id: newOrderRef.id,
      ...docData
    };
  } catch (error) {
    console.error('Error creando orden:', error);
    throw error;
  }
};

/**
 * Obtener orden por ID
 */
export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);

    if (orderSnap.exists()) {
      return {
        id: orderSnap.id,
        ...orderSnap.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo orden:', error);
    return null;
  }
};

/**
 * Obtener órdenes del usuario actual
 */
export const getUserOrders = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);

    const orders = [];
    querySnapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return orders;
  } catch (error) {
    console.error('Error obteniendo órdenes del usuario:', error);
    return [];
  }
};

/**
 * Obtener todas las órdenes (ADMIN)
 */
export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersRef);

    const orders = [];
    querySnapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return orders;
  } catch (error) {
    console.error('Error obteniendo todas las órdenes:', error);
    return [];
  }
};

/**
 * Obtener órdenes por estado (ADMIN)
 */
export const getOrdersByStatus = async (status) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('status', '==', status));
    const querySnapshot = await getDocs(q);

    const orders = [];
    querySnapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return orders;
  } catch (error) {
    console.error('Error obteniendo órdenes por estado:', error);
    return [];
  }
};

/**
 * Actualizar estado de la orden (ADMIN)
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const validStatuses = ['pendiente', 'validando', 'en_transito', 'entregado', 'cancelado'];
    
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Estado inválido');
    }

    const orderRef = doc(db, 'orders', orderId);
    
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: Timestamp.now()
    });

    return { success: true, newStatus };
  } catch (error) {
    console.error('Error actualizando estado de orden:', error);
    throw error;
  }
};

/**
 * Subir comprobante de pago y actualizar orden
 */
export const uploadPaymentProof = async (orderId, imageFile) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Crear referencia en Storage
    const fileRef = ref(storage, `payment_proofs/${orderId}/${imageFile.name}`);

    // Subir archivo
    await uploadBytes(fileRef, imageFile);

    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(fileRef);

    // Actualizar orden con URL
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      paymentProofUrl: downloadURL,
      status: 'validando', // Cambiar a validando cuando se sube comprobante
      updatedAt: Timestamp.now()
    });

    return {
      success: true,
      proofUrl: downloadURL
    };
  } catch (error) {
    console.error('Error subiendo comprobante:', error);
    throw error;
  }
};

/**
 * Obtener resumen de órdenes (ADMIN)
 */
export const getOrdersSummary = async () => {
  try {
    const allOrders = await getAllOrders();

    const summary = {
      totalOrders: allOrders.length,
      totalRevenue: allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
      byStatus: {
        pendiente: allOrders.filter(o => o.status === 'pendiente').length,
        validando: allOrders.filter(o => o.status === 'validando').length,
        en_transito: allOrders.filter(o => o.status === 'en_transito').length,
        entregado: allOrders.filter(o => o.status === 'entregado').length,
        cancelado: allOrders.filter(o => o.status === 'cancelado').length
      }
    };

    return summary;
  } catch (error) {
    console.error('Error obteniendo resumen:', error);
    return null;
  }
};
