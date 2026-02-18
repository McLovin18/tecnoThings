// Estructura de datos para las secciones de la landing page
const DEFAULT_SECTIONS = [
  {
    id: "hero-section",
    type: "hero",
    order: 1,
    title: "Potencia sin límites.",
    subtitle: "Descubre la nueva generación de portátiles para profesionales.",
    badge: "New Arrival",
    buttonText: "Comprar Ahora",
    buttonLink: "../login_and_registration/login.html",
    images: [
      {
        id: 1,
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwKVIvCiZDlVX6BG4OB6RClXZy2TRd1vhZXWmJ8GQWkdA7i-eOfBxUfZAqhTHODtoQXyMETUPBrgOmazSUOZR-8FU6KywRsf6LLM1u9esA4gx4rp59COjKeu1ON768JwjEy7kCRVfsmTalD1o59dpeBgICKFgkfkPLn0rNgwRD5a0ajQkzTeswTcWfX7sDnm5gjj4KLtaMpAwBR0nhgW2eFJ6z3u_kTi2LAQdkReh3aVhMIi8ototRAzl38a19zriuoW2m79xwI1s",
        title: "Laptops Pro",
        description: "Última generación en tecnología",
        badge: "New Arrival",
        buttonText: "Comprar Ahora",
        buttonLink: "../login_and_registration/login.html"
      }
    ]
  },
  {
    id: "categories-section",
    type: "categories",
    order: 2,
    title: "Categorías",
    viewAllLink: "#",
    categories: [
      { id: 1, name: "Laptops", icon: "laptop", link: "./products-by-category.html?category=laptops&subcategory=laptops-budget" },
      { id: 2, name: "Monitores", icon: "desktop_mac", link: "./products-by-category.html?category=monitores&subcategory=monitores-24" },
      { id: 3, name: "Hardware", icon: "build", link: "./products-by-category.html?category=hardware&subcategory=procesadores" },
      { id: 4, name: "Periféricos", icon: "mouse", link: "./products-by-category.html?category=perifericos&subcategory=mouses" }
    ]
  },
  {
    id: "featured-products",
    type: "featured-products",
    order: 3,
    title: "Productos Destacados",
    products: [
      { id: 1, name: "MacBook Pro M2", category: "Tecnología de punta", price: "$1,299.00" },
      { id: 2, name: "Smartphone Ultra", category: "Cámara 108MP", price: "$899.00" },
      { id: 3, name: "Studio Headphones", category: "Cancelación activa", price: "$249.00" },
      { id: 4, name: "Smartwatch Pro", category: "Salud y Deporte", price: "$399.00" }
    ]
  },
  {
    id: "newsletter-section",
    type: "newsletter",
    order: 4,
    title: "Únete al club",
    subtitle: "Recibe ofertas exclusivas y lanzamientos de nuevos gadgets antes que nadie.",
    placeholderEmail: "Tu email",
    buttonText: "Enviar"
  },
  {
    id: "gallery-section",
    type: "gallery",
    order: 5,
    title: "Nuestros Distribuidores",
    images: [
      { id: 1, url: "https://via.placeholder.com/300x200?text=Imagen+1", caption: "NVIDIA" },
      { id: 2, url: "https://via.placeholder.com/300x200?text=Imagen+2", caption: "Cougar" },
      { id: 3, url: "https://via.placeholder.com/300x200?text=Imagen+3", caption: "Intel" },
      { id: 4, url: "https://via.placeholder.com/300x200?text=Imagen+4", caption: "MSI" }
    ]
  }
];

// Gestor de secciones con localStorage
const SectionsManager = {
  // Obtener todas las secciones
  getSections() {
    try {
      const stored = localStorage.getItem('tecno_landing_sections');
      return stored ? JSON.parse(stored) : DEFAULT_SECTIONS;
    } catch (error) {
      console.error('Error al obtener secciones:', error);
      return DEFAULT_SECTIONS;
    }
  },

  // Guardar secciones
  saveSections(sections) {
    try {
      // Ordenar por orden antes de guardar
      const sorted = sections.sort((a, b) => a.order - b.order);
      localStorage.setItem('tecno_landing_sections', JSON.stringify(sorted));
      return true;
    } catch (error) {
      console.error('Error al guardar secciones:', error);
      return false;
    }
  },

  // Obtener una sección por ID
  getSection(id) {
    const sections = this.getSections();
    return sections.find(s => s.id === id);
  },

  // Actualizar una sección
  updateSection(id, updates) {
    const sections = this.getSections();
    const index = sections.findIndex(s => s.id === id);
    if (index !== -1) {
      sections[index] = { ...sections[index], ...updates };
      this.saveSections(sections);
      return sections[index];
    }
    return null;
  },

  // Agregar nueva sección
  addSection(section) {
    const sections = this.getSections();
    const newSection = {
      ...section,
      id: `section-${Date.now()}`,
      order: Math.max(...sections.map(s => s.order), 0) + 1
    };
    sections.push(newSection);
    this.saveSections(sections);
    return newSection;
  },

  // Eliminar sección
  deleteSection(id) {
    const sections = this.getSections();
    const filtered = sections.filter(s => s.id !== id);
    this.saveSections(filtered);
    return true;
  },

  // Reordenar secciones
  reorderSections(sections) {
    return this.saveSections(sections);
  },

  // Resetear a valores por defecto
  resetToDefault() {
    localStorage.removeItem('tecno_landing_sections');
    return this.getSections();
  }
};
