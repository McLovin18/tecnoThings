// Productos de ejemplo para la tienda
export const PRODUCTS = [
  // PERIFÉRICOS - MOUSES (1-139)
  { id: 1, name: "Logitech MX Master 3S", price: 99.99, category: "perifericos", subcategory: "mouses", image: "https://i.ebayimg.com/images/g/2jsAAeSwriBo1G7i/s-l1600.webp" },
  { id: 2, name: "Razer DeathAdder V3", price: 69.99, category: "perifericos", subcategory: "mouses", image: "https://i.ebayimg.com/images/g/peUAAOSwMbtmWpXt/s-l1600.webp" },
  { id: 3, name: "SteelSeries Rival 600", price: 79.99, category: "perifericos", subcategory: "mouses", image: "https://www.bing.com/th?id=OPHS.PsxhW6WVgQBaRQ474C474&o=5&pid=21.1&w=140&h=182&qlt=100&dpr=1,4&o=2&c=8&pcl=f5f5f5" },

  // PERIFÉRICOS - TECLADOS (140-279)
  { id: 140, name: "Corsair K95 Platinum", price: 199.99, category: "perifericos", subcategory: "teclados", image: "https://i.ebayimg.com/images/g/7VoAAeSwcG9of8uR/s-l1600.webp" },
  { id: 141, name: "Keychron K2 Pro", price: 89.99, category: "perifericos", subcategory: "teclados", image: "https://i.ebayimg.com/images/g/OMoAAeSw1L1pgFKE/s-l1600.webp" },
  { id: 142, name: "SteelSeries Apex Pro", price: 249.99, category: "perifericos", subcategory: "teclados", image: "https://i.ebayimg.com/images/g/o7AAAeSw7hBpef9e/s-l1600.webp" },

  // PERIFÉRICOS - AURICULARES (280-419)
  { id: 280, name: "Sony WH-1000XM5", price: 349.99, category: "perifericos", subcategory: "auriculares", image: "https://th.bing.com/th/id/OPHS.4XNbhNQCwa7vDQ474C474?w=200&h=220&rs=1&o=5&dpr=1.4&pid=21.1" },
  { id: 281, name: "Bose QuietComfort 45", price: 379.99, category: "perifericos", subcategory: "auriculares", image: "https://www.bing.com/th?id=OPHS.MAvPXtWYzUMLMA474C474&o=5&pid=21.1&w=140&h=106&qlt=100&dpr=1,4&o=2&pcl=f5f5f5" },
  { id: 282, name: "Sennheiser Momentum 4", price: 299.99, category: "perifericos", subcategory: "auriculares", image: "https://i.ebayimg.com/images/g/8B8AAeSw8MBpfDVA/s-l1600.webp" },

  // MONITORES - 24 PULGADAS (2000-2169)
  { id: 2000, name: "Dell S2422HZ", price: 299.99, category: "monitores", subcategory: "monitores-24", image: "https://www.bing.com/th?id=OPHS.FXfq4Ikz1mrzvA474C474&o=5&pid=21.1&w=140&h=140&qlt=100&dpr=1,4&o=2&pcl=f5f5f5" },
  { id: 2001, name: "LG 24UP550", price: 349.99, category: "monitores", subcategory: "monitores-24", image: "https://tse1.mm.bing.net/th/id/OIP.USmABMCo9cqvSb9ain586wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 2002, name: "ASUS PA248QV", price: 329.99, category: "monitores", subcategory: "monitores-24", image: "https://th.bing.com/th/id/OIP._3YmWgfGKwvOG75to845owHaHa?w=206&h=206&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3" },

  // MONITORES - 27 PULGADAS (2170-2339)
  { id: 2170, name: "Dell U2723DE", price: 499.99, category: "monitores", subcategory: "monitores-27", image: "https://i.ebayimg.com/images/g/SoAAAOSwi35nasxM/s-l1600.webp" },
  { id: 2171, name: "LG 27UP550", price: 549.99, category: "monitores", subcategory: "monitores-27", image: "https://tse2.mm.bing.net/th/id/OIP.XhQRCuAxV0RfKRojXJANbAHaDR?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 2172, name: "BenQ PD2700U", price: 529.99, category: "monitores", subcategory: "monitores-27", image: "https://th.bing.com/th/id/OIP.Psv_AY-bfry4vialZV8muAHaEc?w=269&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3" },

  // HARDWARE - PROCESADORES (4000-4169)
  { id: 4000, name: "Intel Core i9-13900K", price: 589.99, category: "hardware", subcategory: "procesadores", image: "https://tse3.mm.bing.net/th/id/OIP.9m9MHcmAMhC-C4wHCDJIhgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 4001, name: "AMD Ryzen 9 7950X", price: 549.99, category: "hardware", subcategory: "procesadores", image: "https://img.4gamers.com.tw/ckfinder/files/Elvis/Review/AMD-Ryzen-9-7950X/05.jpg" },
  { id: 4002, name: "Intel Core i7-13700K", price: 419.99, category: "hardware", subcategory: "procesadores", image: "https://cdn.mos.cms.futurecdn.net/vbWDMDAGjUAb9Vp53QN9x8.jpg" },

  // HARDWARE - TARJETAS GRÁFICAS (4170-4339)
  { id: 4170, name: "NVIDIA RTX 4090", price: 1599.99, category: "hardware", subcategory: "tarjetas-graficas", image: "https://b2c-contenthub.com/wp-content/uploads/2022/12/3K8A1216.jpg?quality=50&strip=all&w=1200" },
  { id: 4171, name: "AMD Radeon RX 7900 XTX", price: 749.99, category: "hardware", subcategory: "tarjetas-graficas", image: "https://tse3.mm.bing.net/th/id/OIP.YI3Be5BV0EBKVFvSlwMKBwHaGb?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 4172, name: "NVIDIA RTX 4080", price: 1199.99, category: "hardware", subcategory: "tarjetas-graficas", image: "https://th.bing.com/th/id/R.67640905bfbb763e0fb418ceca07f89b?rik=HO1o1llRzzk0YQ&pid=ImgRaw&r=0" },

  // LAPTOPS - BUDGET (6000-6169)
  { id: 6000, name: "Lenovo IdeaPad 3", price: 449.99, category: "laptops", subcategory: "laptops-budget", image: "https://tse4.mm.bing.net/th/id/OIP.l0Kc8u5dHaVNulyXIbFdnwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 6001, name: "HP Pavilion 15", price: 499.99, category: "laptops", subcategory: "laptops-budget", image: "https://starcity.pk/wp-content/uploads/2023/06/HP-Pavilion-15-CS0xxx-1-768x768.jpg" },
  { id: 6002, name: "ASUS VivoBook 15", price: 529.99, category: "laptops", subcategory: "laptops-budget", image: "https://laptopmedia.com/wp-content/uploads/2024/01/81VXY3figL._AC_SL1500_-680x585.jpg" },

  // LAPTOPS - GAMING (6340-6509)
  { id: 6340, name: "ROG Zephyrus G15", price: 1999.99, category: "laptops", subcategory: "laptops-gaming", image: "https://laptopmedia.com/wp-content/uploads/2022/05/G15-white-05-copy-scaled-e1610551879364.jpg" },
  { id: 6341, name: "MSI Raider GE67 HX", price: 1799.99, category: "laptops", subcategory: "laptops-gaming", image: "https://i.ebayimg.com/images/g/KF0AAOSwJzZmB-W9/s-l1600.webp" },
  { id: 6342, name: "Alienware m17 R5", price: 2099.99, category: "laptops", subcategory: "laptops-gaming", image: "https://tse1.mm.bing.net/th/id/OIP.-OTgRMJafBfihZsLysY7bwHaEt?rs=1&pid=ImgDetMain&o=7&rm=3" },
];

// Helper para obtener productos por categoría
export const getProductsByCategory = (categoryId) => {
  return PRODUCTS.filter(p => p.category === categoryId);
};

// Helper para obtener productos por subcategoría
export const getProductsBySubcategory = (categoryId, subcategoryValue) => {
  return PRODUCTS.filter(p => p.category === categoryId && p.subcategory === subcategoryValue);
};

// Helper para obtener un producto por ID
export const getProductById = (id) => {
  return PRODUCTS.find(p => p.id === id);
};

export default PRODUCTS;
