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

  localStorage.setItem("isLoggedIn", "true");
  window.location.href = "index.html";
}

function checkLogin() {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}


// ================= WALLET SYSTEM =================

function loadWallet() {
  checkLogin();

  let user = JSON.parse(localStorage.getItem("battlezoneUser"));
  if (!user) return;

  document.getElementById("username").innerText = user.name;
  document.getElementById("balance").innerText = "Rs " + user.wallet;

  let history = document.getElementById("history");
  history.innerHTML = "";

  user.transactions.forEach(function(t) {
    history.innerHTML += "<p>" + t + "</p>";
  });
}

function addMoney() {
  let amount = parseInt(document.getElementById("amount").value);

  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  let user = JSON.parse(localStorage.getItem("battlezoneUser"));

  user.wallet += amount;
  user.transactions.push("Added Rs " + amount);

  localStorage.setItem("battlezoneUser", JSON.stringify(user));

  alert("Money Added Successfully!");
  loadWallet();
}


// ================= TOURNAMENT SYSTEM =================

// Tournament Data
let tournaments = [
  { id: 1, name: "Solo Classic", fee: 20, prize: 200, totalSlots: 50, joined: 0 },
  { id: 2, name: "Duo Battle", fee: 40, prize: 400, totalSlots: 30, joined: 0 },
  { id: 3, name: "Squad War", fee: 80, prize: 800, totalSlots: 25, joined: 0 }
];

function loadTournaments() {
  checkLogin();

  let user = JSON.parse(localStorage.getItem("battlezoneUser"));
  if (!user) return;

  // Top Wallet Update
  let topBal = document.getElementById("topBalance");
  if (topBal) {
    topBal.innerText = user.wallet;
  }

  let container = document.getElementById("tournamentList");
  if (!container) return;

  container.innerHTML = "";

  tournaments.forEach(function(t) {

    let slotsLeft = t.totalSlots - t.joined;

    container.innerHTML += `
      <div class="card">
        <h3>${t.name}</h3>
        <p>Entry Fee: Rs ${t.fee}</p>
        <p>Prize: Rs ${t.prize}</p>
        <p>Joined: ${t.joined} / ${t.totalSlots}</p>
        <p>Slots Left: ${slotsLeft}</p>
        <button onclick="joinTournament(${t.id})"
        ${slotsLeft === 0 ? "disabled" : ""}>
        ${slotsLeft === 0 ? "Full" : "Join Now"}
        </button>
      </div>
    `;
  });
}

function joinTournament(id) {

  let user = JSON.parse(localStorage.getItem("battlezoneUser"));
  if (!user) return;

  let tournament = tournaments.find(t => t.id === id);
  if (!tournament) return;

  if (user.wallet < tournament.fee) {
    alert("Insufficient Balance!");
    return;
  }

  if (tournament.joined >= tournament.totalSlots) {
    alert("Tournament Full!");
    return;
  }

  user.wallet -= tournament.fee;
  user.transactions.push("Joined " + tournament.name + " - Rs " + tournament.fee);

  tournament.joined++;

  localStorage.setItem("battlezoneUser", JSON.stringify(user));

  alert("Joined " + tournament.name + " Successfully!");
  loadTournaments();
}