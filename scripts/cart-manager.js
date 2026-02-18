// Gestor de carrito con localStorage
// TODO: Para migrar a Firestore, crear colección users/{userId}/cart
// y sincronizar al autenticarse. Favoritos: users/{userId}/favorites

export const CartManager = {
  // Obtener carrito del localStorage
  getCart() {
    try {
      const cart = localStorage.getItem('tecno_things_cart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      return [];
    }
  },

  // Guardar carrito en localStorage
  saveCart(cart) {
    try {
      localStorage.setItem('tecno_things_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error al guardar carrito:', error);
    }
  },

  // Agregar producto al carrito
  addToCart(product) {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || 'https://via.placeholder.com/150',
        quantity: 1,
        category: product.category
      });
    }

    this.saveCart(cart);
    return cart;
  },

  // Eliminar producto del carrito
  removeFromCart(productId) {
    const cart = this.getCart();
    const filtered = cart.filter(item => item.id !== productId);
    this.saveCart(filtered);
    return filtered;
  },

  // Actualizar cantidad de producto
  updateQuantity(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
      item.quantity = Math.max(1, quantity);
    }

    this.saveCart(cart);
    return cart;
  },

  // Obtener cantidad total de productos
  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  // Obtener total del carrito
  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  // Limpiar carrito
  clearCart() {
    localStorage.setItem('tecno_things_cart', JSON.stringify([]));
    return [];
  }
};

// Gestor de preferencias de usuario
export const UserPreferencesManager = {
  // Obtener preferencias
  getPreferences() {
    try {
      const prefs = localStorage.getItem('tecno_things_preferences');
      return prefs ? JSON.parse(prefs) : {
        darkMode: true,
        language: 'es',
        recentlyViewed: [],
        favorites: []
      };
    } catch (error) {
      console.error('Error al obtener preferencias:', error);
      return { darkMode: true, language: 'es', recentlyViewed: [], favorites: [] };
    }
  },

  // Guardar preferencias
  savePreferences(prefs) {
    try {
      localStorage.setItem('tecno_things_preferences', JSON.stringify(prefs));
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
    }
  },

  // Agregar a favoritos
  addToFavorites(productId) {
    const prefs = this.getPreferences();
    if (!prefs.favorites.includes(productId)) {
      prefs.favorites.push(productId);
      this.savePreferences(prefs);
    }
    return prefs.favorites;
  },

  // Eliminar de favoritos
  removeFromFavorites(productId) {
    const prefs = this.getPreferences();
    prefs.favorites = prefs.favorites.filter(id => id !== productId);
    this.savePreferences(prefs);
    return prefs.favorites;
  },

  // Agregar a recientemente visto
  addToRecentlyViewed(product) {
    const prefs = this.getPreferences();
    prefs.recentlyViewed = prefs.recentlyViewed.filter(p => p.id !== product.id);
    prefs.recentlyViewed.unshift(product);
    prefs.recentlyViewed = prefs.recentlyViewed.slice(0, 10); // Mantener últimos 10
    this.savePreferences(prefs);
    return prefs.recentlyViewed;
  }
};
