/* ================= FIREBASE CONFIG ================= */

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



/* ================= USER SYSTEM ================= */

function signup(){

let name=document.getElementById("name").value;
let email=document.getElementById("email").value;
let password=document.getElementById("password").value;

if(!name || !email || !password){
alert("Fill all fields");
return;
}

let user={
name:name,
email:email,
password:password,
wallet:0,
transactions:[]
};

localStorage.setItem("battlezoneUser",JSON.stringify(user));

alert("Account Created Successfully!");

window.location.href="login.html";

}



function login(){

let email=document.getElementById("loginEmail").value;
let password=document.getElementById("loginPassword").value;

let user=JSON.parse(localStorage.getItem("battlezoneUser"));

if(!user || email!==user.email || password!==user.password){
alert("Invalid Login");
return;
}

localStorage.setItem("isLoggedIn","true");

window.location.href="index.html";

}



function logout(){

localStorage.removeItem("isLoggedIn");

window.location.href="login.html";

}



function checkLogin(){

if(localStorage.getItem("isLoggedIn")!=="true"){

window.location.href="login.html";

}

}



/* ================= WALLET SYSTEM ================= */

function loadWallet(){

checkLogin();

let user=JSON.parse(localStorage.getItem("battlezoneUser"));

if(!user) return;

document.getElementById("username").innerText=user.name;

document.getElementById("balance").innerText="Rs "+user.wallet;

let history=document.getElementById("history");

history.innerHTML="";

user.transactions.forEach(function(t){

history.innerHTML+="<p>"+t+"</p>";

});

}



function addMoney(){

let amount=parseInt(document.getElementById("amount").value);

if(!amount || amount<=0){

alert("Enter valid amount");
return;

}

let user=JSON.parse(localStorage.getItem("battlezoneUser"));

user.wallet+=amount;

user.transactions.push("Added Rs "+amount);

localStorage.setItem("battlezoneUser",JSON.stringify(user));

alert("Money Added Successfully!");

loadWallet();

}



/* ================= FIREBASE TOURNAMENT LOAD ================= */

async function loadTournaments(){

checkLogin();

let user=JSON.parse(localStorage.getItem("battlezoneUser"));

if(!user) return;



let topBal=document.getElementById("topBalance");

if(topBal){

topBal.innerText="₹"+user.wallet;

}



let container=document.getElementById("tournamentList");

if(!container) return;

container.innerHTML="";



const querySnapshot=await getDocs(collection(db,"tournaments"));

querySnapshot.forEach((doc)=>{

let t=doc.data();

container.innerHTML+=`

<div class="card" onclick="openMatch('${doc.id}')">

<img src="${t.banner}" style="width:100%;border-radius:10px">

<h3>${t.mode.toUpperCase()}</h3>

<p>Entry Fee : ₹${t.entry}</p>

<p>Prize : ₹${t.prize}</p>

<p>Time : ${t.time}</p>

<p>Slots : ${t.slots}</p>

<button>JOIN</button>

</div>

`;

});

}



/* ================= OPEN MATCH PAGE ================= */

function openMatch(id){

localStorage.setItem("matchId",id);

window.location.href="match.html";

}



/* ================= SLOT SYSTEM ================= */

let selectedSlot=null;



function loadSlots(){

let grid=document.getElementById("slotGrid");

if(!grid) return;

grid.innerHTML="";

for(let i=1;i<=48;i++){

grid.innerHTML+=`
<div class="slot" onclick="selectSlot(${i})" id="slot${i}">
${i}
</div>
`;

}

}



function selectSlot(num){

selectedSlot=num;

document.querySelectorAll(".slot").forEach(s=>{
s.classList.remove("active");
});

document.getElementById("slot"+num).classList.add("active");

}



function confirmJoin(){

let name=document.getElementById("playerName").value;

if(!selectedSlot){

alert("Select Position");
return;

}

if(!name){

alert("Enter Game Name");
return;

}

alert("Joined Slot "+selectedSlot+" Successfully!");

window.location.href="index.html";

}



/* ================= GLOBAL FUNCTIONS ================= */

window.loadTournaments=loadTournaments;
window.signup=signup;
window.login=login;
window.logout=logout;
window.loadWallet=loadWallet;
window.addMoney=addMoney;
window.openMatch=openMatch;
window.loadSlots=loadSlots;
window.selectSlot=selectSlot;
window.confirmJoin=confirmJoin;
