import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { mockProducts } from '../data/mockProducts.js';
import { mockOrders } from '../data/mockOrders.js';
import { mockOffers } from '../data/mockOffers.js';
import { mockUser } from '../data/mockUsers.js';

// Seed function to populate Firebase with mock data
export const seedFirebase = async () => {
  try {
    console.log('Seeding Firebase with mock data...');

    // Seed products
    for (const product of mockProducts) {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date()
      });
    }
    console.log('Products seeded');

    // Seed user profile
    await addDoc(collection(db, 'users'), {
      ...mockUser,
      id: 'user-1',
      createdAt: new Date()
    });
    console.log('User profile seeded');

    // Seed orders
    for (const order of mockOrders) {
      await addDoc(collection(db, 'orders'), {
        ...order,
        sellerId: 'user-1',
        createdAt: new Date()
      });
    }
    console.log('Orders seeded');

    // Seed offers
    for (const offer of mockOffers) {
      await addDoc(collection(db, 'offers'), {
        ...offer,
        farmerId: 'user-1',
        createdAt: new Date()
      });
    }
    console.log('Offers seeded');

    console.log('Firebase seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding Firebase:', error);
  }
};

// Call this function once after setting up Firebase
// seedFirebase();