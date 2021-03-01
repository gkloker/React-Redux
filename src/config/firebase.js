import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyDan8OBISGedufjuODG7IS6sG9Q72V0Llc",
  authDomain: "curso-redux-with-hooks.firebaseapp.com",
  projectId: "curso-redux-with-hooks",
  storageBucket: "curso-redux-with-hooks.appspot.com",
  messagingSenderId: "669044233066",
  appId: "1:669044233066:web:6d9da1d4a3b672dd87cb13",
  measurementId: "G-6V4X8HG6WL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

let db = firebase.firestore().collection('favs');

export function logoutGoolge() {
  firebase.auth().signOut();
}

export function loginWithGoogle() {
  let provider = new firebase.auth.GoogleAuthProvider();

  return firebase.auth().signInWithPopup(provider)
    .then(snap => snap.user);
}

export function updateDB(array, uid) {
  db.doc(uid).set({array})
}