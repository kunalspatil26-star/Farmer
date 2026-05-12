import { collection, doc, getDoc, getDocs, addDoc, updateDoc, setDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase.js';

// Products
export const getProducts = async () => {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addProduct = async (product) => {
  return await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: new Date()
  });
};

export const updateProduct = async (id, updates) => {
  return await updateDoc(doc(db, 'products', id), updates);
};

// Orders
export const getOrders = async (userId) => {
  const q = query(collection(db, 'orders'), where('sellerId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addOrder = async (order) => {
  return await addDoc(collection(db, 'orders'), {
    ...order,
    createdAt: new Date()
  });
};

// Users
export const getUserProfile = async (userId) => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateUserProfile = async (userId, profile) => {
  const docRef = doc(db, 'users', userId);
  return await setDoc(docRef, profile, { merge: true });
};

// Offers
export const getOffers = async (userId) => {
  const q = query(collection(db, 'offers'), where('farmerId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addOffer = async (offer) => {
  return await addDoc(collection(db, 'offers'), {
    ...offer,
    createdAt: new Date()
  });
};

// File upload
export const uploadImage = async (file, path) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// GST settings (admin)
export const getGstSettings = async () => {
  const q = query(collection(db, 'gstSettings'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateGstSettings = async (id, settings) => {
  return await updateDoc(doc(db, 'gstSettings', id), settings);
};
