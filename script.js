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
const database = firebase.database();

const ADMIN_PASSWORD = "troparj"; // altere para sua senha

// Adiciona jogador
function addPlayer() {
    const nome = document.getElementById("nome").value.trim();
    const classe = document.getElementById("classe").value.trim();
    const nick = document.getElementById("nick").value.trim();

    if (!nome || !classe || !nick) {
        alert("Preencha todos os campos!");
        return;
    }

    const playerRef = database.ref("players");

    // Verifica duplicidade de nick
    playerRef.orderByChild("nick").equalTo(nick).once("value", snapshot => {
        if (snapshot.exists()) {
            alert("Este nick já está cadastrado!");
        } else {
            playerRef.push({ nome, classe, nick })
                .then(() => {
                    alert("Cadastro efetuado com sucesso!");
                    document.getElementById("nome").value = "";
                    document.getElementById("classe").value = "";
                    document.getElementById("nick").value = "";
                })
                .catch(error => {
                    console.error(error);
                    alert("Erro ao cadastrar, tente novamente!");
                });
        }
    });
}

// Exibe lista em tempo real
const playersRef = database.ref("players");
playersRef.on("value", snapshot => {
    const listDiv = document.getElementById("playersList");
    listDiv.innerHTML = "";
    snapshot.forEach(child => {
        const player = child.val();
        const div = document.createElement("div");
        div.className = "player-item";
        div.textContent = `${player.nome} - ${player.classe} - ${player.nick}`;
        listDiv.appendChild(div);
    });
});

// Função de verificação de senha para ações administrativas
function checkAdmin(action) {
    const senha = prompt("Digite a senha de administrador:");
    if (senha === ADMIN_PASSWORD) {
        if (action === "limpar") clearList();
        else if (action === "exportar") exportList();
    } else {
        alert("Senha incorreta! Ação não permitida.");
    }
}

// Limpa lista
function clearList() {
    if (confirm("Tem certeza que deseja limpar a lista?")) {
        database.ref("players").remove();
    }
}

// Exporta lista para TXT
function exportList() {
    playersRef.once("value", snapshot => {
        let conteudo = "";
        snapshot.forEach(child => {
            const player = child.val();
            conteudo += `${player.nome} - ${player.classe} - ${player.nick}\n`;
        });

        const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "lista_players.txt";
        a.click();
        URL.revokeObjectURL(url);
    });
}
