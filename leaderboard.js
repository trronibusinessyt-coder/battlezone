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

async function loadLeaderboard(){

let box = document.getElementById("leaderboardList");

const querySnapshot = await getDocs(collection(db,"users"));

let players = [];

querySnapshot.forEach((doc)=>{

players.push(doc.data());

});

players.sort((a,b)=> b.kills - a.kills);

players.forEach((p,i)=>{

let div = document.createElement("div");

div.className="card";

div.innerHTML = `

<h3>#${i+1} ${p.username}</h3>
<p>Kills: ${p.kills}</p>
<p>Matches: ${p.matches}</p>
<p>Wallet: ${p.wallet} Coins</p>
`;box.appendChild(div);

});

}

loadLeaderboard();