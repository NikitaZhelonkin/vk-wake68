import firebase from 'firebase/app';


import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCX_WneoF86e3l3waLv4jGX7np_rmTut8g",
    authDomain: "wake68-d74e5.firebaseapp.com",
    projectId: "wake68-d74e5",
    storageBucket: "wake68-d74e5.appspot.com",
    messagingSenderId: "407093646643",
    appId: "1:407093646643:web:5caed822cfe78cd271da46"
  };

firebase.initializeApp(firebaseConfig);


export default firebase