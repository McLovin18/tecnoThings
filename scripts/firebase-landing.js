/**
 * 🏠 GESTOR DE LANDING PAGE (DINÁMICA)
 */

import { db, storage } from './firebase-config.js';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';

/**
 * Estructura por defecto de la landing page
 */
const DEFAULT_LANDING = {
  hero: {
    title: 'Bienvenido a TecnoThings',
    subtitle: 'Tecnología de calidad para tu negocio',
    image: null,
    buttonText: 'Explorar productos',
    buttonLink: '/tienda'
  },
  featuredProducts: [], // Array de productIds
  sections: [
    {
      id: 'section-1',
      title: 'Por qué elegir TecnoThings',
      content: 'Ofrecemos productos de la más alta calidad...',
      image: null,
      order: 1
    }
  ],
  updatedAt: Timestamp.now()
};

/**
 * Obtener configuración de landing page
 */
export const getLandingPage = async () => {
  try {
    const landingRef = doc(db, 'landingPage', 'main');
    const landingSnap = await getDoc(landingRef);

    if (landingSnap.exists()) {
      return {
        id: 'main',
        ...landingSnap.data()
      };
    }

    // Si no existe, crear con valores por defecto
    await initializeLandingPage();
    return {
      id: 'main',
      ...DEFAULT_LANDING
    };
  } catch (error) {
    console.error('Error obteniendo landing page:', error);
    return DEFAULT_LANDING;
  }
};

/**
 * Inicializar landing page (solo la primera vez)
 */
export const initializeLandingPage = async () => {
  try {
    const landingRef = doc(db, 'landingPage', 'main');
    
    await setDoc(landingRef, DEFAULT_LANDING);
    console.log('✅ Landing page inicializada');
  } catch (error) {
    console.error('Error inicializando landing page:', error);
  }
};

/**
 * Actualizar sección hero (ADMIN)
 */
export const updateHero = async (heroData) => {
  try {
    const landingRef = doc(db, 'landingPage', 'main');

    await updateDoc(landingRef, {
      'hero.title': heroData.title || '',
      'hero.subtitle': heroData.subtitle || '',
      'hero.buttonText': heroData.buttonText || 'Explorar',
      'hero.buttonLink': heroData.buttonLink || '/',
      'hero.image': heroData.image || null,
      updatedAt: Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    console.error('Error actualizando hero:', error);
    throw error;
  }
};

/**
 * Subir imagen para hero o secciones
 */
export const uploadLandingImage = async (imageFile, type = 'hero') => {
  try {
    const fileRef = ref(storage, `landing_page/${type}/${imageFile.name}`);
    
    await uploadBytes(fileRef, imageFile);
    const downloadURL = await getDownloadURL(fileRef);

    return downloadURL;
  } catch (error) {
    console.error('Error subiendo imagen de landing:', error);
    throw error;
  }
};

/**
 * Actualizar productos destacados (ADMIN)
 */
export const updateFeaturedProducts = async (productIds) => {
  try {
    const landingRef = doc(db, 'landingPage', 'main');

    await updateDoc(landingRef, {
      featuredProducts: productIds,
      updatedAt: Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    console.error('Error actualizando productos destacados:', error);
    throw error;
  }
};

/**
 * Añadir sección a landing (ADMIN)
 */
export const addSection = async (sectionData) => {
  try {
    const landingRef = doc(db, 'landingPage', 'main');
    const landing = await getLandingPage();

    const newSection = {
      id: `section-${Date.now()}`,
      title: sectionData.title,
      content: sectionData.content,
      image: sectionData.image || null,
      order: landing.sections?.length + 1 || 1
    };

    const sections = landing.sections || [];
    sections.push(newSection);

    await updateDoc(landingRef, {
      sections: sections,
      updatedAt: Timestamp.now()
    });

    return newSection;
  } catch (error) {
    console.error('Error añadiendo sección:', error);
    throw error;
  }
};

/**
 * Actualizar sección (ADMIN)
 */
export const updateSection = async (sectionId, sectionData) => {
  try {
    const landing = await getLandingPage();
    const landingRef = doc(db, 'landingPage', 'main');

    const sections = landing.sections || [];
    const sectionIndex = sections.findIndex(s => s.id === sectionId);

    if (sectionIndex !== -1) {
      sections[sectionIndex] = {
        ...sections[sectionIndex],
        ...sectionData,
        id: sectionId
      };

      await updateDoc(landingRef, {
        sections: sections,
        updatedAt: Timestamp.now()
      });

      return sections[sectionIndex];
    }

    throw new Error('Sección no encontrada');
  } catch (error) {
    console.error('Error actualizando sección:', error);
    throw error;
  }
};

/**
 * Eliminar sección (ADMIN)
 */
export const deleteSection = async (sectionId) => {
  try {
    const landing = await getLandingPage();
    const landingRef = doc(db, 'landingPage', 'main');

    const sections = landing.sections?.filter(s => s.id !== sectionId) || [];

    await updateDoc(landingRef, {
      sections: sections,
      updatedAt: Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    console.error('Error eliminando sección:', error);
    throw error;
  }
};

/**
 * Guardar todas las secciones dinámicas (ADMIN) - Para el editor
 */
export const saveLandingSections = async (sections) => {
  try {
    const landingRef = doc(db, 'landingPage', 'main');

    await updateDoc(landingRef, {
      dynamicSections: sections || [],
      updatedAt: Timestamp.now()
    });

    console.log('✅ Secciones guardadas en Firebase:', sections?.length || 0);
    return { success: true, sections };
  } catch (error) {
    console.error('Error guardando secciones:', error);
    throw error;
  }
};

/**
 * Cargar todas las secciones dinámicas
 */
export const getLandingSections = async () => {
  try {
    const landing = await getLandingPage();
    return landing.dynamicSections || [];
  } catch (error) {
    console.error('Error cargando secciones:', error);
    return [];
  }
};
