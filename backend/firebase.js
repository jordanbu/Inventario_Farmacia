// backend/firebase.js
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

try {
  const serviceAccount = require(path.join(__dirname, 'inventario-farmacia-dac7d-firebase-adminsdk-fbsvc-81d8c2136b.json'));
  
  initializeApp({
    credential: cert(serviceAccount)
  });
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

const db = getFirestore();

module.exports = { db };
