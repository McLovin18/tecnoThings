/**
 * 📧 GESTOR DE NEWSLETTER
 * Guarda suscriptores en Firestore
 */

import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const SUBSCRIBERS_COLLECTION = 'newsletter_subscribers';

/**
 * Suscribir email al newsletter
 */
export const subscribeNewsletter = async (email) => {
  try {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail) throw new Error('Email requerido');

    const subscribersRef = collection(db, SUBSCRIBERS_COLLECTION);
    const q = query(subscribersRef, where('email', '==', normalizedEmail));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return { success: true, alreadySubscribed: true };
    }

    await addDoc(subscribersRef, {
      email: normalizedEmail,
      subscribedAt: Timestamp.now(),
      source: 'landing'
    });

    return { success: true, alreadySubscribed: false };
  } catch (error) {
    console.error('Error suscribiendo al newsletter:', error);
    throw error;
  }
};
