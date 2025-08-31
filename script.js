// 🔥 Config do Firebase
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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const form = document.getElementById("formPlayer");
const lista = document.getElementById("listaPlayers");
const msgSuccess = document.getElementById("msgSuccess");
const btnExport = document.getElementById("btnExport");
const btnClear = document.getElementById("btnClear");

// Atualiza lista em tempo real
db.ref("players").on("value", (snapshot) => {
    const players = snapshot.val();
    lista.innerHTML = "";
    if(players){
        Object.keys(players).forEach(key => {
            const p = players[key];
            lista.innerHTML += `
                <div class="card">
                    <strong>${p.nome}</strong><br>
                    Classe: ${p.classe}<br>
                    Nick: ${p.nick}
                </div>
            `;
        });
    }
});

// Cadastro
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const classe = document.getElementById("classe").value;
    const nick = document.getElementById("nick").value;

    const newPlayerRef = db.ref("players").push();
    newPlayerRef.set({ nome, classe, nick })
        .then(() => {
            msgSuccess.textContent = "Cadastro efetuado com sucesso!";
            setTimeout(() => { msgSuccess.textContent = ""; }, 3000);
            form.reset();
        })
        .catch(err => console.error(err));
});

// Exportar lista
btnExport.addEventListener("click", () => {
    db.ref("players").once("value", snapshot => {
        const data = snapshot.val();
        if(!data) { alert("Lista vazia"); return; }
        let csv = "Nome,Classe,Nick\n";
        Object.keys(data).forEach(key => {
            const p = data[key];
            csv += `${p.nome},${p.classe},${p.nick}\n`;
        });
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "players.csv";
        a.click();
    });
});

// Zerar lista (apenas admin)
btnClear.addEventListener("click", () => {
    const adminEmail = prompt("Digite seu email de admin para confirmar:");
    const allowed = ["seuemail@gmail.com"]; // Substitua pelo seu email
    if(allowed.includes(adminEmail)){
        if(confirm("Tem certeza que deseja zerar a lista?")){
            db.ref("players").remove();
        }
    } else {
        alert("Acesso negado!");
    }
});
