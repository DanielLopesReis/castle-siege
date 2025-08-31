// 🔥 Config do Firebase (substitua pelos seus dados)
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

// Variável para controle de admin
let isAdmin = false;

// Cadastro de jogador
document.getElementById("formCadastro").addEventListener("submit", function(e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const classe = document.getElementById("classe").value.trim();
    const nick = document.getElementById("nick").value.trim();

    if (!nome || !classe || !nick) {
        document.getElementById("msgCadastro").textContent = "Preencha todos os campos!";
        document.getElementById("msgCadastro").style.color = "red";
        return;
    }

    db.ref("players/" + nick).set({ nome, classe, nick }, function(error) {
        if (error) {
            document.getElementById("msgCadastro").textContent = "Erro ao cadastrar. Tente novamente.";
            document.getElementById("msgCadastro").style.color = "red";
        } else {
            document.getElementById("msgCadastro").textContent = "Cadastro efetuado com sucesso!";
            document.getElementById("msgCadastro").style.color = "green";
            document.getElementById("formCadastro").reset();
        }
    });
});

// Login Admin
document.getElementById("loginBtn").addEventListener("click", function() {
    const email = document.getElementById("adminEmail").value.trim();
    const adminEmails = [
        "seuemail@gmail.com",
        //"outro@gmail.com",
        //"terceiro@gmail.com"
    ];

    if (adminEmails.includes(email)) {
        isAdmin = true;
        alert("Acesso de administrador concedido!");
    } else {
        isAdmin = false;
        alert("Acesso negado! Você não é administrador.");
    }
});

// Exportar lista de jogadores
document.getElementById("exportBtn").addEventListener("click", function() {
    if (!isAdmin) {
        alert("Apenas administradores podem exportar a lista.");
        return;
    }

    const exportData = [];
    db.ref("players").once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            exportData.push(childSnapshot.val());
        });

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "players_list.json";
        link.click();
    });
});
