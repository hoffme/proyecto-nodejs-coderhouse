import firebase from "firebase/app";
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAPDsPG03ZQgU8CeEZ8ONpb5z9X19lJAX8",
    authDomain: "trank-nodejs.firebaseapp.com",
    projectId: "trank-nodejs",
    storageBucket: "trank-nodejs.appspot.com",
    messagingSenderId: "679653211544",
    appId: "1:679653211544:web:5c78c743b079cc5ee03fed",
    measurementId: "G-9B7PFF07PK"
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

export {
    firestore
}