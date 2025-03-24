// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'

// ✅ Use your real Firebase config here:
const firebaseConfig = {
  apiKey: 'AIzaSyAQtHk4ypE9k4if6Q64lPx-OYMNyQVYkh8',
  authDomain: 'bat-hill.firebaseapp.com',
  projectId: 'bat-hill',
  storageBucket: 'bat-hill.firebasestorage.app',
  messagingSenderId: '621200383653',
  appId: '1:621200383653:web:97da879359c3193cfcb74c',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Services you need
const db = getFirestore(app)
const auth = getAuth(app)

// Auto sign in (anonymous)
signInAnonymously(auth)

export { db, auth }
