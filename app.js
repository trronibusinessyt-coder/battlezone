// ================= FIREBASE CONFIG =================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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


// ================= USER SYSTEM =================

function signup() {

let name = document.getElementById("name").value;
let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

if (!name || !email || !password) {
alert("Fill all fields");
return;
}

let user = {
name: name,
email: email,
password: password,
wallet: 0,
transactions: []
};

localStorage.setItem("battlezoneUser", JSON.stringify(user));

alert("Account Created Successfully!");

window.location.href = "login.html";

}



function login() {

let email = document.getElementById("loginEmail").value;
let password = document.getElementById("loginPassword").value;

let user = JSON.parse(localStorage.getItem("battlezoneUser"));

if (!user || email !== user.email || password !== user.password) {
alert("Invalid Login");
return;
}

localStorage.setItem("isLoggedIn","true");

window.location.href = "index.html";

}



function logout() {

localStorage.removeItem("isLoggedIn");

window.location.href="login.html";

}



function checkLogin(){

if(localStorage.getItem("isLoggedIn") !== "true"){

window.location.href="login.html";

}

}



// ================= WALLET SYSTEM =================

function loadWallet(){

checkLogin();

let user = JSON.parse(localStorage.getItem("battlezoneUser"));

if(!user) return;

document.getElementById("username").innerText = user.name;

document.getElementById("balance").innerText = "Rs "+user.wallet;

let history = document.getElementById("history");

history.innerHTML="";

user.transactions.forEach(function(t){

history.innerHTML += "<p>"+t+"</p>";

});

}



function addMoney(){

let amount = parseInt(document.getElementById("amount").value);

if(!amount || amount<=0){

alert("Enter valid amount");

return;

}

let user = JSON.parse(localStorage.getItem("battlezoneUser"));

user.wallet += amount;

user.transactions.push("Added Rs "+amount);

localStorage.setItem("battlezoneUser",JSON.stringify(user));

alert("Money Added Successfully!");

loadWallet();

}



// ================= FIREBASE TOURNAMENT LOAD =================

async function loadTournaments(){

checkLogin();

let user = JSON.parse(localStorage.getItem("battlezoneUser"));

if(!user) return;



// top wallet

let topBal = document.getElementById("topBalance");

if(topBal){

topBal.innerText = user.wallet;

}



// tournament list

let container = document.getElementById("tournamentList");

if(!container) return;

container.innerHTML="";



const querySnapshot = await getDocs(collection(db,"tournaments"));

querySnapshot.forEach((doc)=>{

let t = doc.data();

container.innerHTML += `

<div class="card">

<img src="${t.banner}" style="width:100%;border-radius:10px">

<h3>${t.mode.toUpperCase()}</h3>

<p>Entry Fee : Rs ${t.entry}</p>

<p>Prize : Rs ${t.prize}</p>

<p>Time : ${t.time}</p>

<p>Slots : ${t.slots}</p>

<button>Join</button>

</div>

`;

});

}



window.loadTournaments = loadTournaments;
window.signup = signup;
window.login = login;
window.logout = logout;
window.loadWallet = loadWallet;
window.addMoney = addMoney;
