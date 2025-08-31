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

// Emails autorizados para limpar/exportar
const ADMIN_EMAILS = ["daniel.consultor01@gmail.com"];

// Registra novo jogador
function addPlayer() {
    const name = document.getElementById("name").value.trim();
    const playerClass = document.getElementById("class").value.trim();
    const nick = document.getElementById("nick").value.trim();

    if (!name || !playerClass || !nick) {
        alert("Preencha todos os campos!");
        return;
    }

    // Evita duplicatas pelo nick
    db.ref("players/" + nick).get().then(snapshot => {
        if (snapshot.exists()) {
            alert("Este nick já foi registrado!");
        } else {
            db.ref("players/" + nick).set({ name, playerClass, nick });
            alert("Cadastro realizado com sucesso!");
            loadPlayers();
        }
    });
}

// Carrega lista em tempo real
function loadPlayers() {
    db.ref("players").on("value", snapshot => {
        const listDiv = document.getElementById("playerList");
        listDiv.innerHTML = "";
        snapshot.forEach(child => {
            const p = document.createElement("div");
            p.className = "playerItem";
            p.textContent = `${child.val().name} - ${child.val().playerClass} - ${child.val().nick}`;
            listDiv.appendChild(p);
        });
    });
}
loadPlayers();

// Exportar lista para txt
function exportList() {
    firebase.auth().onAuthStateChanged(user => {
        if (!user || !ADMIN_EMAILS.includes(user.email)) {
            alert("Ação restrita! Apenas emails autorizados.");
            return;
        }
        db.ref("players").get().then(snapshot => {
            let txt = "";
            snapshot.forEach(child => {
                txt += `${child.val().name} - ${child.val().playerClass} - ${child.val().nick}\n`;
            });
            const blob = new Blob([txt], { type: "text/plain" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "players.txt";
            a.click();
        });
    });
}

// Limpar lista
function clearList() {
    firebase.auth().onAuthStateChanged(user => {
        if (!user || !ADMIN_EMAILS.includes(user.email)) {
            alert("Ação restrita! Apenas emails autorizados.");
            return;
        }
        if (confirm("Deseja realmente limpar toda a lista?")) {
            db.ref("players").remove();
        }
    });
}

// Autenticação temporária via email (prompt)
firebase.auth().signInWithEmailAndPassword(prompt("Digite seu email autorizado:"), "dummyPass").catch(err => {
    // Não precisa de senha real, só valida email
});
