/* ================= FIREBASE CONFIG ================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
doc,
getDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

import {
getAuth,
GoogleAuthProvider,
signInWithRedirect,
getRedirectResult
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
apiKey: "AIzaSyBNS_qFwJxl3yD75mWguLS2zESVQ8W6Vbg",
authDomain: "battlezone-c7406.firebaseapp.com",
projectId: "battlezone-c7406",
storageBucket: "battlezone-c7406.appspot.com",
messagingSenderId: "237634131988",
appId: "1:237634131988:web:5ca71576b370b49b2def01"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= GOOGLE AUTH ================= */

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* ================= USER SYSTEM ================= */

function signup(){

let first=document.getElementById("firstName").value;
let last=document.getElementById("lastName").value;
let username=document.getElementById("username").value;
let phone=document.getElementById("phone").value;
let email=document.getElementById("email").value;
let password=document.getElementById("password").value;
let confirm=document.getElementById("confirmPassword").value;
let agree=document.getElementById("agree").checked;

if(!first || !last || !username || !phone || !email || !password){
alert("Please fill all fields");
return;
}

if(password !== confirm){
alert("Passwords do not match");
return;
}

if(!agree){
alert("Please accept Terms & Privacy Policy");
return;
}

let user={
name:first+" "+last,
username:username,
phone:phone,
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

let email=document.getElementById("loginEmail").value.trim();
let password=document.getElementById("loginPassword").value.trim();

let user=JSON.parse(localStorage.getItem("battlezoneUser"));

if(!user){
alert("Account not found. Please signup first.");
return;
}

if(email===user.email && password===user.password){

localStorage.setItem("isLoggedIn","true");

window.location.href="index.html";

}else{

alert("Invalid Email or Password");

}

}


function googleLogin(){

signInWithRedirect(auth, provider);

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

document.getElementById("topBalance").innerText = "🪙 " + balance;

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

user.transactions.push("Added ₹"+amount);

localStorage.setItem("battlezoneUser",JSON.stringify(user));

alert("Money Added Successfully!");

loadWallet();

}



/* ================= TOURNAMENT LOAD ================= */

async function loadTournaments(){

checkLogin();

let user=JSON.parse(localStorage.getItem("battlezoneUser"));

if(!user) return;

let selectedMode=localStorage.getItem("gameMode");

let topBal=document.getElementById("topBalance");

if(topBal){

topBal.innerText="₹"+user.wallet;

}

let container=document.getElementById("tournamentList");

if(!container) return;

container.innerHTML="";

const querySnapshot=await getDocs(collection(db,"tournaments"));

querySnapshot.forEach((docSnap)=>{

let t=docSnap.data();

if(selectedMode && t.mode!==selectedMode) return;

container.innerHTML+=`

<div class="card" onclick="openMatch('${docSnap.id}')">

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



/* ================= OPEN MATCH ================= */

function openMatch(id){

localStorage.setItem("matchId",id);

window.location.href="match.html";

}



/* ================= SLOT SYSTEM ================= */

let selectedSlot=null;

async function loadSlots(){

let grid=document.getElementById("slotGrid");

if(!grid) return;

grid.innerHTML="";

let matchId=localStorage.getItem("matchId");

const ref=doc(db,"joins",matchId);

const snap=await getDoc(ref);

let taken={};

if(snap.exists()){
taken=snap.data();
}

for(let i=1;i<=48;i++){

let takenClass=taken[i] ? "taken" : "";

grid.innerHTML+=`
<div class="slot ${takenClass}" onclick="selectSlot(${i})" id="slot${i}">
${i}
</div>
`;

}

}



function selectSlot(num){

let slot=document.getElementById("slot"+num);

if(slot.classList.contains("taken")){
alert("Slot Already Taken");
return;
}

selectedSlot=num;

document.querySelectorAll(".slot").forEach(s=>{
s.classList.remove("active");
});

slot.classList.add("active");

}



async function confirmJoin(){

let name=document.getElementById("playerName").value;

if(!selectedSlot){
alert("Select Position");
return;
}

if(!name){
alert("Enter Game Name");
return;
}

let user=JSON.parse(localStorage.getItem("battlezoneUser"));

let matchId=localStorage.getItem("matchId");

const tRef=doc(db,"tournaments",matchId);
const tSnap=await getDoc(tRef);

if(!tSnap.exists()){
alert("Tournament not found");
return;
}

let tournament=tSnap.data();

let entry=tournament.entry;

if(user.wallet < entry){
alert("Not enough balance");
return;
}

/* deduct wallet */

user.wallet-=entry;

user.transactions.push("Joined Tournament ₹"+entry);

localStorage.setItem("battlezoneUser",JSON.stringify(user));

/* slot booking */

const ref=doc(db,"joins",matchId);

await setDoc(ref,{
[selectedSlot]:name
},{merge:true});

alert("Joined Successfully!");

window.location.href="index.html";

}



/* ================= MEMBERS ================= */

async function loadMembers(){

let list=document.getElementById("memberList");

if(!list) return;

list.innerHTML="";

let matchId=localStorage.getItem("matchId");

const ref=doc(db,"joins",matchId);

const snap=await getDoc(ref);

if(!snap.exists()) return;

let data=snap.data();

Object.keys(data).forEach(slot=>{

list.innerHTML+=`

<div class="member">
<span>Slot ${slot}</span>
<span>${data[slot]}</span>
</div>

`;

});

}



/* ================= GAME CATEGORY ================= */

function openGame(game){

localStorage.setItem("gameType",game);

window.location.href="game.html";

}

function loadModes(){

let game=localStorage.getItem("gameType");

let box=document.getElementById("modeList");

if(!box) return;

box.innerHTML="";

if(game==="ff"){

box.innerHTML+=`
<div class="card" onclick="openMode('fullmap')">Full Map</div>
<div class="card" onclick="openMode('cs')">Clash Squad</div>
<div class="card" onclick="openMode('lonewolf')">Lone Wolf</div>
`;

}

if(game==="scar"){

box.innerHTML+=`
<div class="card" onclick="openMode('survival')">Survival</div>
<div class="card" onclick="openMode('solo')">Solo</div>
<div class="card" onclick="openMode('squad')">Squad</div>
`;

}

}

function openMode(mode){

localStorage.setItem("gameMode",mode);

window.location.href="index.html";

}



/* ================= GLOBAL ================= */

window.signup=signup;
window.login=login;
window.logout=logout;
window.loadWallet=loadWallet;
window.addMoney=addMoney;
window.loadTournaments=loadTournaments;
window.openMatch=openMatch;
window.loadSlots=loadSlots;
window.selectSlot=selectSlot;
window.confirmJoin=confirmJoin;
window.loadMembers=loadMembers;
window.openGame=openGame;
window.loadModes=loadModes;
window.openMode=openMode;
window.googleLogin=googleLogin;

/* ================= GOOGLE REDIRECT RESULT ================= */

getRedirectResult(auth)
.then((result)=>{

if(result){

let user=result.user;

let data={
name:user.displayName,
email:user.email,
wallet:0,
transactions:[]
};

localStorage.setItem("battlezoneUser",JSON.stringify(data));
localStorage.setItem("isLoggedIn","true");

window.location.href="index.html";

}

})
.catch((error)=>{
console.log(error);
});


function updateLiveCounter(){

let tournaments = document.querySelectorAll(".card");

document.getElementById("liveCount").innerText = tournaments.length;

}

setTimeout(updateLiveCounter,1000);

/* WALLET BALANCE ANIMATION */

function animateBalance(){

let el = document.getElementById("topBalance");

if(!el) return;

let value = parseFloat(el.innerText.replace("₹",""));

let count = 0;

let interval = setInterval(()=>{

count += value/20;

if(count >= value){
count = value;
clearInterval(interval);
}

el.innerText = "₹"+count.toFixed(2);

},50);

}

setTimeout(animateBalance,500);
