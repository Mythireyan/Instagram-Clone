import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
	  apiKey: "AIzaSyDLVtpju6SSfVqDzD6tLVmPcqcr4guW1iQ",
	  authDomain: "instagram-clone-a3bf5.firebaseapp.com",
	  databaseURL: "https://instagram-clone-a3bf5.firebaseio.com",
	  projectId: "instagram-clone-a3bf5",
	  storageBucket: "instagram-clone-a3bf5.appspot.com",
	  messagingSenderId: "760756228723",
	  appId: "1:760756228723:web:f6bf9bbd6362a115149006",
	  measurementId: "G-M9MK2V69PK"
});
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage};