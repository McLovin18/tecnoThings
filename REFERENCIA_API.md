📚 REFERENCIA RÁPIDA DE API

═══════════════════════════════════════════════════════════════════════════════

🔐 FIREBASE AUTH (firebase-auth.js)

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  onAuthChanged,
  createUserDocument,
  getUserDocument,
  createInitialAdmin
} from './scripts/firebase-auth.js';

FUNCIÓN                      PARÁMETROS                  RETORNA
─────────────────────────────────────────────────────────────────────
registerUser()              email, password,            {success, userId,
                           userData                     email, message}

loginUser()                 email, password             {success, user}

logoutUser()                (ninguno)                   {success, message}

getCurrentUser()            (ninguno)                   user Object | null

onAuthChanged()             callback(user)              unsubscribe()

createUserDocument()        userId, userData            userData

getUserDocument()           userId                      user Object | null

createInitialAdmin()        email, password, name       userId


📦 FIREBASE PRODUCTS (firebase-products.js)

import {
  getActiveProducts,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  toggleProductActive,
  deleteProduct,
  seedDemoProducts
} from './scripts/firebase-products.js';

FUNCIÓN                      PARÁMETROS                  RETORNA
─────────────────────────────────────────────────────────────────────
getActiveProducts()         (ninguno)                   [products]

getAllProducts()            (ninguno)                   [products]
                           (ADMIN ONLY)

getProductById()            productId                   product | null

getProductsByCategory()     category                    [products]

createProduct()             productData                 {id, ...data}
                           (ADMIN ONLY)

updateProduct()             productId, updates          {id, ...updates}
                           (ADMIN ONLY)

toggleProductActive()       productId, isActive         {success}
                           (ADMIN ONLY)

deleteProduct()             productId                   (ninguno)
                           (ADMIN ONLY)

seedDemoProducts()          (ninguno)                   (ninguno)
                           (carga datos de demo)


🛒 FIREBASE CART (firebase-cart.js)

import { CartManager } from './scripts/firebase-cart.js';

FUNCIÓN                      PARÁMETROS                  RETORNA
─────────────────────────────────────────────────────────────────────
getCart()                   (ninguno)                   [items]

addToCart()                 product                     [cart]

removeFromCart()            productId                   [cart]

updateQuantity()            productId, quantity         [cart]

clearCart()                 (ninguno)                   []

getCartTotal()              (ninguno)                   number

getCartItemCount()          (ninguno)                   number

saveCart()                  items                       true


📋 FIREBASE ORDERS (firebase-orders.js)

import {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  getOrdersByStatus,
  updateOrderStatus,
  uploadPaymentProof,
  getOrdersSummary
} from './scripts/firebase-orders.js';

FUNCIÓN                      PARÁMETROS                  RETORNA
─────────────────────────────────────────────────────────────────────
createOrder()               orderData                   {id, ...data}

getOrderById()              orderId                     order | null

getUserOrders()             (ninguno)                   [orders]
                           (del usuario actual)

getAllOrders()              (ninguno)                   [orders]
                           (ADMIN ONLY)

getOrdersByStatus()         status                      [orders]
                           (ADMIN ONLY)

updateOrderStatus()         orderId, newStatus          {success}
                           (ADMIN ONLY)
                           status: "pendiente"|
                           "validando"|"en_transito"|
                           "entregado"|"cancelado"

uploadPaymentProof()        orderId, imageFile          {success, proofUrl}

getOrdersSummary()          (ninguno)                   {totalOrders,
                           (ADMIN ONLY)                 totalRevenue, ...}


📝 FIREBASE BLOGS (firebase-blogs.js)

import {
  createBlog,
  getBlogById,
  getPublishedBlogs,
  getAllBlogs,
  updateBlog,
  toggleBlogPublish,
  deleteBlog,
  uploadBlogCoverImage,
  incrementBlogViews
} from './scripts/firebase-blogs.js';

FUNCIÓN                      PARÁMETROS                  RETORNA
─────────────────────────────────────────────────────────────────────
createBlog()                blogData                    {id, ...data}
                           (ADMIN ONLY)

getBlogById()               blogId                      blog | null

getPublishedBlogs()         (ninguno)                   [blogs]

getAllBlogs()               (ninguno)                   [blogs]
                           (ADMIN ONLY)

updateBlog()                blogId, updates             {id, ...updates}
                           (ADMIN ONLY)

toggleBlogPublish()         blogId, isPublished         {success}
                           (ADMIN ONLY)

deleteBlog()                blogId                      (ninguno)
                           (ADMIN ONLY)

uploadBlogCoverImage()      blogId, imageFile           downloadURL

incrementBlogViews()        blogId                      (ninguno)


🏠 FIREBASE LANDING (firebase-landing.js)

import {
  getLandingPage,
  initializeLandingPage,
  updateHero,
  uploadLandingImage,
  updateFeaturedProducts,
  addSection,
  updateSection,
  deleteSection
} from './scripts/firebase-landing.js';

FUNCIÓN                      PARÁMETROS                  RETORNA
─────────────────────────────────────────────────────────────────────
getLandingPage()            (ninguno)                   {id, hero, ...}

initializeLandingPage()     (ninguno)                   (inicializa)
                           (ejecutar 1 sola vez)

updateHero()                heroData                    {success}
                           (ADMIN ONLY)

uploadLandingImage()        imageFile, type             downloadURL
                           (ADMIN ONLY)

updateFeaturedProducts()    productIds[]                {success}
                           (ADMIN ONLY)

addSection()                sectionData                 {id, ...data}
                           (ADMIN ONLY)

updateSection()             sectionId, sectionData      {id, ...updated}
                           (ADMIN ONLY)

deleteSection()             sectionId                   {success}
                           (ADMIN ONLY)


═══════════════════════════════════════════════════════════════════════════════

📊 TIPOS DE DATOS

PRODUCT OBJECT:
{
  id: string,
  name: string,
  description: string,
  price: number,
  stock: number,
  images: [string urls],
  category: string,
  subcategory: string,
  isActive: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

ORDER OBJECT:
{
  id: string,
  userId: string,
  products: [
    {
      productId: string,
      name: string,
      price: number,
      quantity: number
    }
  ],
  totalAmount: number,
  status: "pendiente"|"validando"|"en_transito"|"entregado"|"cancelado",
  paymentProofUrl: string | null,
  shippingAddress: {
    street: string,
    city: string,
    postalCode: string,
    country: string
  },
  notes: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

BLOG OBJECT:
{
  id: string,
  title: string,
  content: string,
  coverImage: string | null,
  authorId: string,
  isPublished: boolean,
  views: number,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

USER OBJECT:
{
  id: string,
  name: string,
  email: string,
  role: "admin" | "cliente",
  createdAt: Timestamp,
  address: {
    street: string,
    city: string,
    postalCode: string,
    country: string
  },
  phone: string,
  avatar: string | null
}

CART ITEM OBJECT:
{
  id: string,
  name: string,
  price: number,
  image: string,
  quantity: number,
  category: string,
  description: string
}

═══════════════════════════════════════════════════════════════════════════════

🔍 EJEMPLOS DE USO

OBTENER PRODUCTOS ACTIVOS:
```javascript
import { getActiveProducts } from './scripts/firebase-products.js';

async function showProducts() {
  const products = await getActiveProducts();
  console.log(products); // Array de productos
  products.forEach(product => {
    console.log(`${product.name}: $${product.price}`);
  });
}
```

AGREGAR AL CARRITO:
```javascript
import { CartManager } from './scripts/firebase-cart.js';

async function addItem(product) {
  try {
    const cart = await CartManager.addToCart(product);
    console.log('Carrito actualizado:', cart);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

CREAR ORDEN:
```javascript
import { createOrder } from './scripts/firebase-orders.js';
import { CartManager } from './scripts/firebase-cart.js';

async function checkout() {
  const cart = await CartManager.getCart();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const order = await createOrder({
    products: cart,
    totalAmount: total,
    shippingAddress: {
      street: 'Calle 123',
      city: 'Madrid',
      postalCode: '28001',
      country: 'España'
    }
  });
  
  console.log('Orden creada:', order.id);
}
```

OBTENER ÓRDENES DEL USUARIO:
```javascript
import { getUserOrders } from './scripts/firebase-orders.js';

async function showMyOrders() {
  const orders = await getUserOrders();
  orders.forEach(order => {
    console.log(`Orden ${order.id}: $${order.totalAmount} - ${order.status}`);
  });
}
```

ADMIN: CAMBIAR ESTADO DE ORDEN:
```javascript
import { updateOrderStatus } from './scripts/firebase-orders.js';

async function validateOrder(orderId) {
  await updateOrderStatus(orderId, 'validando');
  console.log('Orden validada');
}

async function shippingOrder(orderId) {
  await updateOrderStatus(orderId, 'en_transito');
  console.log('Orden enviada');
}

async function deliverOrder(orderId) {
  await updateOrderStatus(orderId, 'entregado');
  console.log('Orden entregada');
}
```

ADMIN: CREAR PRODUCTO:
```javascript
import { createProduct } from './scripts/firebase-products.js';

async function addProduct() {
  const product = await createProduct({
    name: 'Mi Producto',
    description: 'Descripción detallada',
    price: 99.99,
    stock: 50,
    category: 'perifericos',
    images: ['https://url.com/image.jpg'],
    isActive: false // Borrador
  });
  
  console.log('Producto creado:', product.id);
}
```

ADMIN: PUBLICAR PRODUCTO:
```javascript
import { toggleProductActive } from './scripts/firebase-products.js';

async function publishProduct(productId) {
  await toggleProductActive(productId, true);
  console.log('Producto publicado');
}
```

ADMIN: CREAR BLOG:
```javascript
import { createBlog, uploadBlogCoverImage } from './scripts/firebase-blogs.js';

async function createNewBlog() {
  const blog = await createBlog({
    title: 'Mi Artículo',
    content: '<h1>Contenido HTML</h1><p>Texto...</p>',
    coverImage: null,
    isPublished: false
  });
  
  console.log('Blog creado:', blog.id);
}
```

CLIENTE: REGISTRARSE:
```javascript
import { registerUser } from './scripts/firebase-auth.js';

async function signup() {
  try {
    const result = await registerUser('usuario@email.com', 'Contraseña123!', {
      name: 'Juan Pérez',
      phone: '+34 123 456 789'
    });
    console.log('Registrado exitosamente:', result.userId);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

CLIENTE: INICIAR SESIÓN:
```javascript
import { loginUser, getCurrentUser } from './scripts/firebase-auth.js';

async function login() {
  try {
    const result = await loginUser('usuario@email.com', 'Contraseña123!');
    console.log('Bienvenido:', result.user.name);
    console.log('Es admin?', result.user.role === 'admin');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function showUser() {
  const user = await getCurrentUser();
  if (user) {
    console.log(`Usuario: ${user.name} (${user.role})`);
  }
}
```

═══════════════════════════════════════════════════════════════════════════════

🚨 MANEJO DE ERRORES

Try-Catch:
```javascript
try {
  await loginUser(email, password);
} catch (error) {
  if (error.code === 'auth/user-not-found') {
    console.log('Usuario no existe');
  } else if (error.code === 'auth/wrong-password') {
    console.log('Contraseña incorrecta');
  } else {
    console.log('Error:', error.message);
  }
}
```

Promesas con .catch():
```javascript
getActiveProducts()
  .then(products => console.log(products))
  .catch(error => console.error('Error:', error));
```

═══════════════════════════════════════════════════════════════════════════════

⚡ ASYNC/AWAIT (Recomendado)

```javascript
async function myFunction() {
  const user = await getCurrentUser();
  if (!user) {
    console.log('No estás autenticado');
    return;
  }
  
  const products = await getActiveProducts();
  const cart = await CartManager.getCart();
  
  // Hacer algo con los datos
}
```

═══════════════════════════════════════════════════════════════════════════════
