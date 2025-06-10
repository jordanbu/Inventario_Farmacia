// src/firebase.js
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

try {
  initializeApp({
    credential: applicationDefault(), // Esto buscará la variable de entorno GOOGLE_APPLICATION_CREDENTIALS
  });
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

const db = getFirestore();

module.exports = { db };