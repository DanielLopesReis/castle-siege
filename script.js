// 🔥 Config do Firebase (troque para o seu projeto)
const firebaseConfig = {
  apiKey: "AIzaSyAH86f5LoSBj63MIR7SzVDGkrLP90Zy6jY",
  authDomain: "registro-players.firebaseapp.com",
  databaseURL: "https://registro-players-default-rtdb.firebaseio.com",
  projectId: "registro-players",
  storageBucket: "registro-players.firebasestorage.app",
  messagingSenderId: "156344963881",
  appId: "1:156344963881:web:79efd9aeade8454d8b5d38",
  measurementId: "G-7HKNWBDJYT"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Referência à lista de players
const playersRef = db.ref('players');

// Elementos do DOM
const form = document.getElementById('player-form');
const nameInput = document.getElementById('name');
const classeInput = document.getElementById('classe');
const nickInput = document.getElementById('nick');
const playerList = document.getElementById('player-list');
const successMsg = document.getElementById('success-msg');
const exportBtn = document.getElementById('export-btn');
const clearBtn = document.getElementById('clear-btn');

// E-mail autorizado para limpar lista
const authorizedEmail = "daniel.consultor01@gmail.com";

// Cadastrar player
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const player = {
    name: nameInput.value,
    classe: classeInput.value,
    nick: nickInput.value
  };
  playersRef.push(player);
  successMsg.textContent = "Cadastro efetuado com sucesso!";
  form.reset();
  setTimeout(() => successMsg.textContent = "", 3000);
});

// Atualizar lista em tempo real
playersRef.on('value', (snapshot) => {
  playerList.innerHTML = '';
  snapshot.forEach((childSnapshot) => {
    const player = childSnapshot.val();
    const card = document.createElement('div');
    card.className = 'player-card';
    card.textContent = `${player.name} - ${player.classe} - ${player.nick}`;
    playerList.appendChild(card);
  });
});

// Exportar lista para TXT
exportBtn.addEventListener('click', () => {
  playersRef.once('value', (snapshot) => {
    let txt = '';
    snapshot.forEach((child) => {
      const player = child.val();
      txt += `${player.name} - ${player.classe} - ${player.nick}\n`;
    });
    const blob = new Blob([txt], {type: 'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'players.txt';
    link.click();
  });
});

// Limpar lista (apenas autorizado)
clearBtn.addEventListener('click', () => {
  const email = prompt("Informe seu e-mail autorizado:");
  if(email === authorizedEmail){
    if(confirm("Tem certeza que deseja limpar a lista?")){
      playersRef.remove();
    }
  } else {
    alert("Você não tem permissão para limpar a lista.");
  }
});
