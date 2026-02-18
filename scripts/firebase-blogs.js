/**
 * 📝 GESTOR DE BLOGS
 */

import { db, storage, auth } from './firebase-config.js';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';

/**
 * Crear blog (ADMIN)
 */
export const createBlog = async (blogData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const newBlogRef = doc(collection(db, 'blogs'));

    const docData = {
      title: blogData.title,
      content: blogData.content, // HTML o Markdown
      coverImage: blogData.coverImage || null,
      authorId: user.uid,
      isPublished: false, // Por defecto guardado como borrador
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      views: 0
    };

    await setDoc(newBlogRef, docData);

    return {
      id: newBlogRef.id,
      ...docData
    };
  } catch (error) {
    console.error('Error creando blog:', error);
    throw error;
  }
};

/**
 * Obtener blog por ID
 */
export const getBlogById = async (blogId) => {
  try {
    const blogRef = doc(db, 'blogs', blogId);
    const blogSnap = await getDoc(blogRef);

    if (blogSnap.exists()) {
      return {
        id: blogSnap.id,
        ...blogSnap.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo blog:', error);
    return null;
  }
};

/**
 * Obtener blogs publicados (para clientes)
 */
export const getPublishedBlogs = async () => {
  try {
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, where('isPublished', '==', true));
    const querySnapshot = await getDocs(q);

    const blogs = [];
    querySnapshot.forEach(doc => {
      blogs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Ordenar por fecha más reciente
    return blogs.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error obteniendo blogs publicados:', error);
    return [];
  }
};

/**
 * Obtener todos los blogs (ADMIN)
 */
export const getAllBlogs = async () => {
  try {
    const blogsRef = collection(db, 'blogs');
    const querySnapshot = await getDocs(blogsRef);

    const blogs = [];
    querySnapshot.forEach(doc => {
      blogs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return blogs.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error obteniendo todos los blogs:', error);
    return [];
  }
};

/**
 * Actualizar blog (ADMIN)
 */
export const updateBlog = async (blogId, updates) => {
  try {
    const blogRef = doc(db, 'blogs', blogId);

    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };

    await updateDoc(blogRef, updateData);

    return {
      id: blogId,
      ...updateData
    };
  } catch (error) {
    console.error('Error actualizando blog:', error);
    throw error;
  }
};

/**
 * Publicar/Despublicar blog (ADMIN)
 */
export const toggleBlogPublish = async (blogId, isPublished) => {
  try {
    const blogRef = doc(db, 'blogs', blogId);

    await updateDoc(blogRef, {
      isPublished: isPublished,
      updatedAt: Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    console.error('Error publicando blog:', error);
    throw error;
  }
};

/**
 * Eliminar blog (ADMIN)
 */
export const deleteBlog = async (blogId) => {
  try {
    const blogRef = doc(db, 'blogs', blogId);
    await deleteDoc(blogRef);
    return { success: true };
  } catch (error) {
    console.error('Error eliminando blog:', error);
    throw error;
  }
};

/**
 * Subir imagen de portada
 */
export const uploadBlogCoverImage = async (blogId, imageFile) => {
  try {
    const fileRef = ref(storage, `blog_covers/${blogId}/${imageFile.name}`);
    
    await uploadBytes(fileRef, imageFile);
    const downloadURL = await getDownloadURL(fileRef);

    return downloadURL;
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    throw error;
  }
};

/**
 * Incrementar vistas de blog
 */
export const incrementBlogViews = async (blogId) => {
  try {
    const blogRef = doc(db, 'blogs', blogId);
    const blogSnap = await getDoc(blogRef);

    if (blogSnap.exists()) {
      const currentViews = blogSnap.data().views || 0;
      
      await updateDoc(blogRef, {
        views: currentViews + 1
      });
    }
  } catch (error) {
    console.error('Error incrementando vistas:', error);
  }
};
