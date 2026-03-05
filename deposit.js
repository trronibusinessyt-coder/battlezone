import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyBNS_qFwJxl3yD75mWguLS2zESVQ8W6Vbg",
authDomain: "battlezone-c7406.firebaseapp.com",
projectId: "battlezone-c7406",
storageBucket: "battlezone-c7406.firebasestorage.app",
messagingSenderId: "237634131988",
appId: "1:237634131988:web:5ca71576b370b49b2def01"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.deposit = async function(){

let amount = document.getElementById("amount").value;

let upi = document.getElementById("upi").value;

let username = localStorage.getItem("bz_user");

await addDoc(collection(db,"deposits"),{

username:username,
amount:Number(amount),
upi:upi,
status:"pending"

});

alert("Deposit Request Sent");

}