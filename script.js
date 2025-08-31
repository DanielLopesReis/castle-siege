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

// Função de cadastro
document.getElementById("formCadastro").addEventListener("submit", function(e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const classe = document.getElementById("classe").value;
    const nick = document.getElementById("nick").value;

    db.ref("players").push({ nome, classe, nick })
        .then(() => {
            document.getElementById("msgCadastro").innerText = "Cadastro efetuado com sucesso!";
            document.getElementById("formCadastro").reset();
        })
        .catch(err => console.error(err));
});

// Função de atualizar lista em tempo real
firebase.database().ref("players").on("value", snapshot => {
    const players = snapshot.val();
    const lista = document.getElementById("listaPlayers");
    lista.innerHTML = "";

    for (let key in players) {
        const p = players[key];
        lista.innerHTML += `
            <div class="card">
                <strong>${p.nome}</strong><br>
                Classe: ${p.classe}<br>
                Nick: ${p.nick}
            </div>
        `;
    }
});

// Admin: Limpar lista
document.getElementById("btnLimparLista").addEventListener("click", function() {
    const email = document.getElementById("emailAdmin").value;
    if (email === "daniel.consultor01@gmail.com") {
        if (confirm("Tem certeza que deseja limpar toda a lista?")) {
            db.ref("players").remove();
        }
    } else {
        alert("Permissão negada: e-mail não autorizado.");
    }
});

// Admin: Exportar TXT
document.getElementById("btnExportar").addEventListener("click", function() {
    const email = document.getElementById("emailAdmin").value;
    if (email === "daniel.consultor01@gmail.com") {
        db.ref("players").once("value").then(snapshot => {
            const players = snapshot.val();
            let conteudo = "";
            for (let key in players) {
                const p = players[key];
                conteudo += `${p.nome} - ${p.classe} - ${p.nick}\n`;
            }
            const blob = new Blob([conteudo], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "players.txt";
            link.click();
        });
    } else {
        alert("Permissão negada: e-mail não autorizado.");
    }
});
