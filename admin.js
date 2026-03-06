import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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



async function createTournament(){

let game=document.getElementById("game").value;
let mode=document.getElementById("mode").value;
let entry=document.getElementById("entry").value;
let prize=document.getElementById("prize").value;
let time=document.getElementById("time").value;
let banner=document.getElementById("banner").value;

await addDoc(collection(db,"tournaments"),{

game:game,
mode:mode,
entry:entry,
prize:prize,
time:time,
banner:banner,
slots:48

});

alert("Tournament Created");

loadAdmin();

}



async function releaseRoom(){

let id=document.getElementById("matchId").value;

let room=document.getElementById("roomIdInput").value;

let pass=document.getElementById("passInput").value;

const ref=doc(db,"tournaments",id);

await updateDoc(ref,{

roomId:room,
password:pass

});

alert("Room Released");

}



async function loadAdmin(){

let box=document.getElementById("adminList");

box.innerHTML="";

const snap=await getDocs(collection(db,"tournaments"));

snap.forEach(doc=>{

let t=doc.data();

box.innerHTML+=`

<div class="card">

<h3>${t.game.toUpperCase()} - ${t.mode}</h3>

<p>Entry : ₹${t.entry}</p>

<p>Prize : ₹${t.prize}</p>

<p>Time : ${t.time}</p>

<p>ID : ${doc.id}</p>

</div>

`;

});

}

window.createTournament=createTournament;
window.releaseRoom=releaseRoom;
window.onload=loadAdmin;
