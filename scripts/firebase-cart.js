/**
 * 🛒 GESTOR DE CARRITO CON FIRESTORE
 * Reemplaza cart-manager.js - Sincroniza con Firestore
 */

import { db, auth } from './firebase-config.js';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

export const CartManager = {
  /**
   * Obtener carrito del usuario actual desde Firestore
   */
  async getCart() {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn('Usuario no autenticado');
        return [];
      }

      const cartRef = doc(db, 'carts', user.uid);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        return cartSnap.data().items || [];
      }
      return [];
    } catch (error) {
      console.error('Error obteniendo carrito:', error);
      return [];
    }
  },

  /**
   * Guardar carrito en Firestore
   */
  async saveCart(items) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const cartRef = doc(db, 'carts', user.uid);
      
      await setDoc(cartRef, {
        items: items,
        userId: user.uid,
        updatedAt: Timestamp.now()
      });

      return true;
    } catch (error) {
      console.error('Error guardando carrito:', error);
      throw error;
    }
  },

  /**
   * Agregar producto al carrito
   */
  async addToCart(product) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const cart = await this.getCart();
      const existingItem = cart.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || 'https://via.placeholder.com/150',
          quantity: 1,
          category: product.category,
          description: product.description || ''
        });
      }

      await this.saveCart(cart);
      return cart;
    } catch (error) {
      console.error('Error agregando producto al carrito:', error);
      throw error;
    }
  },

  /**
   * Remover producto del carrito
   */
  async removeFromCart(productId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const cart = await this.getCart();
      const filtered = cart.filter(item => item.id !== productId);
      
      await this.saveCart(filtered);
      return filtered;
    } catch (error) {
      console.error('Error removiendo producto:', error);
      throw error;
    }
  },

  /**
   * Actualizar cantidad de producto
   */
  async updateQuantity(productId, quantity) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const cart = await this.getCart();
      const item = cart.find(item => item.id === productId);

      if (item) {
        if (quantity <= 0) {
          return this.removeFromCart(productId);
        }
        item.quantity = quantity;
        await this.saveCart(cart);
      }

      return cart;
    } catch (error) {
      console.error('Error actualizando cantidad:', error);
      throw error;
    }
  },

  /**
   * Vaciar carrito
   */
  async clearCart() {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const cartRef = doc(db, 'carts', user.uid);
      await setDoc(cartRef, {
        items: [],
        userId: user.uid,
        updatedAt: Timestamp.now()
      });

      return [];
    } catch (error) {
      console.error('Error vaciando carrito:', error);
      throw error;
    }
  },

  /**
   * Obtener total del carrito
   */
  async getCartTotal() {
    try {
      const cart = await this.getCart();
      return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    } catch (error) {
      console.error('Error calculando total:', error);
      return 0;
    }
  },

  /**
   * Obtener cantidad de items en el carrito
   */
  async getCartItemCount() {
    try {
      const cart = await this.getCart();
      return cart.reduce((count, item) => count + item.quantity, 0);
    } catch (error) {
      console.error('Error contando items:', error);
      return 0;
    }
  },

  /**
   * Sincronizar carrito en tiempo real (listener)
   */
  onCartChange(callback) {
    const user = auth.currentUser;
    if (!user) {
      console.warn('Usuario no autenticado');
      return () => {};
    }

    const cartRef = doc(db, 'carts', user.uid);
    
    // Nota: Para esto necesitas importar onSnapshot
    const unsubscribe = this._setupListener(cartRef, callback);
    return unsubscribe;
  },

  /**
   * Helper para listeners en tiempo real
   */
  _setupListener(cartRef, callback) {
    // Esto requiere onSnapshot de Firestore
    // Se implementa cuando se importe correctamente
    return () => {};
  },

  /**
   * Guardar preferencias del usuario (como localStorage)
   */
  async setPreferences(preferences) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const prefsRef = doc(db, 'user_preferences', user.uid);
      
      await setDoc(prefsRef, {
        ...preferences,
        userId: user.uid,
        updatedAt: Timestamp.now()
      });

      return true;
    } catch (error) {
      console.error('Error guardando preferencias:', error);
      throw error;
    }
  },

  /**
   * Obtener preferencias del usuario
   */
  async getPreferences() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return null;
      }

      const prefsRef = doc(db, 'user_preferences', user.uid);
      const prefsSnap = await getDoc(prefsRef);

      return prefsSnap.exists() ? prefsSnap.data() : null;
    } catch (error) {
      console.error('Error obteniendo preferencias:', error);
      return null;
    }
  }
};

export default CartManager;
