import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyD6YEIoJsvETSUSkmwYln4GymlJT77FufM",
  authDomain: "instagram-clone-react-1aeeb.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-1aeeb-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-react-1aeeb",
  storageBucket: "instagram-clone-react-1aeeb.appspot.com",
  messagingSenderId: "157732134951",
  appId: "1:157732134951:web:9320ed1f5c9594a935ee02",
  measurementId: "G-0DLCEM3Z4X"

});


 const db = firebaseApp.firestore();
 const auth = firebase.auth();
 const storage = firebase.storage();
 const ServerTimestamp = firebase.firestore.FieldValue.serverTimestamp();
 export { db, auth, storage, firebaseApp, ServerTimestamp };
