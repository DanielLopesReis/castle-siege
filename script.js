// 🔥 Config do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "registro-players.firebaseapp.com",
  databaseURL: "https://registro-players-default-rtdb.firebaseio.com",
  projectId: "registro-players",
  storageBucket: "registro-players.appspot.com",
  messagingSenderId: "156344963881",
  appId: "SUA_APP_ID",
  measurementId: "SUA_MEASUREMENT_ID"
};

// Inicializa Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// Referência pro Castle Siege
const ref = db.ref("castle_siege/players");

// Formulário de cadastro
document.getElementById("cadastroForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const classe = document.getElementById("classe").value;
  const nick = document.getElementById("nick").value;

  ref.push({ nome, classe, nick });

  e.target.reset();
});

// Atualiza lista em tempo real
ref.on("value", (snapshot) => {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  snapshot.forEach((child) => {
    const li = document.createElement("li");
    const dados = child.val();
    li.textContent = `${dados.nome} - ${dados.classe} - ${dados.nick}`;
    lista.appendChild(li);
  });
});

// --- LOGIN ADMIN ---
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const resetBtn = document.getElementById("resetBtn");

// login
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("adminEmail").value;
  const senha = document.getElementById("adminSenha").value;
  try {
    await auth.signInWithEmailAndPassword(email, senha);
    alert("Login realizado!");
  } catch (err) {
    alert("Erro: " + err.message);
  }
});

// logout
logoutBtn.addEventListener("click", async () => {
  await auth.signOut();
});

// observa autenticação
auth.onAuthStateChanged((user) => {
  if (user) {
    // email autorizado → mostra reset/logout
    const admins = ["seuemail@gmail.com", "outro@gmail.com"];
    if (admins.includes(user.email)) {
      resetBtn.style.display = "inline";
    }
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";
  } else {
    resetBtn.style.display = "none";
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
  }
});

// reset lista
resetBtn.addEventListener("click", () => {
  if (confirm("Tem certeza que deseja apagar toda a lista?")) {
    ref.remove();
  }
});
