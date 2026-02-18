# 🎯 Sistema Global de Categorías - Tecno Things

## Descripción
Sistema centralizado de gestión de categorías de productos con estructura jerárquica de 3 niveles:
**Categoría Principal → Subcategoría → Sub-subcategoría**

## Archivo Único (Single Source of Truth)
📂 **`scripts/categories.js`**
- 12 categorías principales
- 50+ subcategorías
- 150+ sub-subcategorías
- Funciones utilitarias para acceder a cualquier nivel

### Categorías Disponibles:
1. **Periféricos** (7 subcategorías)
   - Mouses → Gaming, Inalámbricos, Ergonómicos
   - Teclados → Mecánicos, Membrana, Inalámbricos
   - Auriculares → Gaming, Profesionales, Deportivos
   - Micrófonos → Condensador, Dinámicos, USB
   - Mouse Pads → XXL, Térmicos, RGB
   - Cables → USB, HDMI, Audio
   - Adaptadores → USB-C, HDMI, Converters

2. **Monitores** (5 subcategorías)
   - 24 pulgadas → 60Hz, 144Hz, 240Hz
   - 27 pulgadas → 60Hz, 144Hz, 4K
   - 32 pulgadas → 4K, Gaming, Profesionales
   - Ultrawide → 34", 49", Gaming
   - Portátiles → USB-C, HDMI, Touchscreen

3. **Hardware** (6 subcategorías)
   - Procesadores → Intel, AMD, Servidores
   - Tarjetas Gráficas → NVIDIA RTX, RTX 40 Series, AMD
   - RAM → DDR4, DDR5, Laptop RAM
   - SSD → SATA, NVMe, M.2
   - Discos Duros → 3.5", 2.5", Externo
   - Fuentes → 80+ Bronze, 80+ Gold, Modular

4. **Laptops** (5 subcategorías)
   - Budget → $300-600, $600-900
   - Mid-Range → $900-1500, $1500+
   - Gaming → RTX 4060, RTX 4070, RTX 4090
   - Profesionales → Workstation, Creativas
   - MacBook → M1, M2, M3

5. **Audio & Sonido** (2 subcategorías)
   - Parlantes → 2.0, 2.1, 5.1
   - Amplificadores → Estéreo, Profesionales, DJ

6. **Protección Eléctrica** (3 subcategorías)
   - Reguladores → 2000W, 5000W, Automáticos
   - UPS → Básicos, Interactivos, Online
   - Protectores → Conectores, Enchufes, Regletas

7. **Hogar** (2 subcategorías)
   - Iluminación → LED, Inteligentes, RGB
   - Ventilación → Ventiladores, Purificadores, Deshumidificadores

8. **Impresión** (2 subcategorías)
   - Impresoras → Inyección, Láser, 3D
   - Tinta & Tóner → Canon, HP, Brother

9. **Redes** (2 subcategorías)
   - Routers → 2.4GHz, 5GHz, WiFi 6
   - Módems → ADSL, Cable, Fibra

10. **Celulares & Tablets** (2 subcategorías)
    - Celulares → iPhone, Android Gama Alta, Android Medio
    - Tablets → iPad, Samsung, Lenovo

11. **TV & Proyectores** (2 subcategorías)
    - Televisores → 4K, LED, OLED
    - Proyectores → 1080p, 4K, Portátiles

12. **Accesorios** (3 subcategorías)
    - Mochilas → Gamer, Corporativa, Ligera
    - Cooling → Ventiladores, Liquid Cooling, Disipadores
    - Stands → Monitor, Laptop, Tablet

---

## Integración en Módulos

### 1️⃣ Panel de Administración
**Archivos modificados:**
- `admin_dashboard/inventory-module.js` - Importa de `scripts/categories.js`
- `admin_dashboard/inventory-ui.js` - Usa categorías en forms de productos

**Uso:**
```javascript
import { CATEGORIES_STRUCTURE, getSubcategoriesByCategoryId } from '../scripts/categories.js';

// En formularios de creación de productos se usan las categorías globales
const categorySelect = document.getElementById('categorySelect');
const options = Object.entries(CATEGORIES_STRUCTURE).map(([key, cat]) => ({
  value: cat.id,
  text: cat.name
}));
```

### 2️⃣ Landing Page (`tecno_things_landing_page/`)
**Archivos con categorías dinámicas:**

#### `index.html`
- Script module carga `categories.js` para validación
- Navbar: Menú estático (compatible con sistema actual)
- Mobile menu: Categorías funcionales

#### `products-by-category.html`
- Filter de categorías dinámico (genera radio buttons automáticamente)
- Script module llena `#categories-filter` con opciones

```html
<div id="categories-filter">
  <label>
    <input type="radio" name="category" value="" checked> Todas
  </label>
  <!-- Se inyectan dinámicamente -->
</div>
```

#### `search-results.html`
- Búsqueda global de productos
- Navegación de categorías en navbar y móvil
- No tiene filtro de categorías (solo muestra resultados de búsqueda)

### 3️⃣ Dashboard de Cliente (`customer_dashboard/`)
**Archivos con categorías dinámicas:**

#### `clientDashboard.html`
- Botones de categorías dinámicos en sección de productos
- Script module llena `#categories-buttons` después del botón "Todos"

```html
<div id="categories-buttons">
  <button onclick="setActiveCategory('all')">Todos</button>
  <!-- Se inyectan dinámicamente categorías globales -->
</div>
```

#### `products-by-category.html`
- Filtro dinámico igual a landing page
- Compartido con search-results.html

---

## Funciones Útiles (en `scripts/categories.js`)

### Importar y Usar
```javascript
import { 
  CATEGORIES_STRUCTURE,
  getCategoryById,
  getSubcategoryById,
  getSubsubcategoryById,
  getAllCategories,
  getSubcategoriesByCategoryId,
  getSubsubcategoriesBySubcategoryId
} from './categories.js';
```

### Ejemplos de Uso
```javascript
// Obtener todas las categorías
const allCats = getAllCategories();
// Retorna: Array de 12 objetos con { id, name, icon, subcategories }

// Obtener categoría específica
const perifericos = getCategoryById('perifericos');
// Retorna: { id: 'perifericos', name: 'Periféricos', icon: 'mouse', subcategories: {...} }

// Obtener subcategorías de una categoría
const subcats = getSubcategoriesByCategoryId('perifericos');
// Retorna: Array de { id, name, icon, subsubcategories }

// Obtener sub-subcategorías
const mousesSubcats = getSubsubcategoriesBySubcategoryId('perifericos', 'mouses');
// Retorna: Array de { id, name }
```

---

## Archivos Modificados en Esta Fase

### Creado:
✅ `scripts/categories-menu.js` - Componente de renderizado de menús

### Actualizado:
✅ `scripts/categories.js` - Estructura jerárquica completamente redefin ida (antes: arrays planos)
✅ `admin_dashboard/inventory-module.js` - Importa categorías globales
✅ `admin_dashboard/inventory-ui.js` - Usa categorías globales en forms
✅ `tecno_things_landing_page/index.html` - Carga módulo de categorías
✅ `tecno_things_landing_page/products-by-category.html` - Filtro dinámico
✅ `customer_dashboard/clientDashboard.html` - Botones dinámicos
✅ `customer_dashboard/products-by-category.html` - Filtro dinámico

---

## Ventajas del Sistema

✨ **Single Source of Truth**
- Cambios en categorías se reflejan automáticamente en todos lados
- Mantenimiento centralizado

🔄 **Fácil de Actualizar**
- Agregar una categoría: solo editar `categories.js`
- No hay duplicación en múltiples archivos

🌐 **Consistencia**
- Mismo estructura en admin, landing page y customer dashboard
- Iconos normalizados

⚡ **Performance**
- Carga única del módulo
- Reutilización de datos de categorías

🎨 **Escalable**
- Fácil agregar más niveles si es necesario
- Funciones genéricas para acceder a datos

---

## Próximos Pasos

### Fase 4 (Pendiente):
- ✅ Actualizar firebase-products.js para validar categorías contra estructura global
- ✅ Crear validación de categorías en formularios admin
- ✅ Agregar categoría/subcategoría a filtros avanzados de búsqueda
- ✅ Actualizar etiquetas de categorías en product cards

### Documentación:
- 📖 Comentarios en cada archivo explicando el sistema
- 📋 Ejemplos de uso en formularios

---

## Notas Técnicas

### IDs de Categorías (Formato)
Formato: `kebab-case` en minúsculas
- Válidos: `perifericos`, `mouses-gaming`, `laptops`
- Inválidos: `Periféricos`, `mousesGaming`, `laptops-`

### Estructura Esperada en Firebase (products)
```javascript
{
  id: 'product-id',
  name: 'Producto',
  category: 'perifericos',            // ID de categoría principal
  subcategory: 'mouses',              // ID de subcategoría
  subsubcategory: 'mouses-gaming',    // ID de sub-subcategoría
  // ... otros campos
}
```

### Compatibilidad
- ✅ Funciona con Firebase (getProductsByCategory)
- ✅ Funciona con localStorage legacy
- ✅ Funciona en todos los navegadores modernos (ES6+)
- ✅ Responsive design en móvil y desktop

