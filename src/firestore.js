

// initialize firebase
var config = {
    apiKey: "AIzaSyACuA8CM5fKm59JMMeE72gNadh6yVCdyvc",
    authDomain: "cards-5c8be.firebaseapp.com",
    databaseURL: "https://cards-5c8be.firebaseio.com",
    projectId: "cards-5c8be",
    storageBucket: "cards-5c8be.appspot.com",
    messagingSenderId: "222433486904"
  };
const firebase = require("firebase")
require("firebase/firestore")
firebase.initializeApp(config)
let db = firebase.firestore()

export default db
