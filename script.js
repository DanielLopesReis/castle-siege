// 🔥 Configuração Firebase
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

// ===== Cadastro de jogador =====
document.getElementById("formCadastro").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const nome = document.getElementById("nome").value.trim();
    const classe = document.getElementById("classe").value.trim();
    const nick = document.getElementById("nick").value.trim();

    if (!nome || !classe || !nick) {
        document.getElementById("msgCadastro").textContent = "Preencha todos os campos!";
        return;
    }

    db.ref("players/" + nick).set({
        nome: nome,
        classe: classe,
        nick: nick
    }, function(error) {
        if (error) {
            document.getElementById("msgCadastro").textContent = "Erro ao cadastrar. Tente novamente.";
        } else {
            document.getElementById("msgCadastro").textContent = "Cadastro efetuado com sucesso!";
            document.getElementById("formCadastro").reset();
            atualizarLista(); // Atualiza a lista em tempo real
        }
    });
});

// ===== Login Admin =====
document.getElementById("btnLoginAdmin").addEventListener("click", function() {
    const email = document.getElementById("adminEmail").value.trim();
    if (!email) {
        document.getElementById("msgAdmin").textContent = "Digite um email para login.";
        return;
    }

    firebase.auth().signInAnonymously().then(() => {
        // Simulando login admin pelo email digitado
        firebase.auth().currentUser.email = email; // Apenas para lógica interna
        document.getElementById("msgAdmin").textContent = "Admin logado: " + email;
    }).catch(error => {
        document.getElementById("msgAdmin").textContent = "Erro no login admin: " + error;
    });
});

// ===== Exportar Lista =====
document.getElementById("btnExportarLista").addEventListener("click", function() {
    db.ref("players").once("value").then(snapshot => {
        document.getElementById("listaJogadores").textContent = JSON.stringify(snapshot.val(), null, 2);
    });
});

// ===== Zerar Lista =====
document.getElementById("btnZerarLista").addEventListener("click", function() {
    const userEmail = firebase.auth().currentUser ? firebase.auth().currentUser.email : null;
    const admins = ["seuemail@gmail.com", "outro@gmail.com"]; // Coloque seus emails autorizados

    if (!userEmail || !admins.includes(userEmail)) {
        document.getElementById("msgAdmin").textContent = "Você não tem permissão para zerar a lista!";
        return;
    }

    if (confirm("Tem certeza que deseja apagar toda a lista?")) {
        db.ref("players").remove()
        .then(() => {
            document.getElementById("msgAdmin").textContent = "Lista apagada com sucesso!";
            atualizarLista();
        })
        .catch(error => {
            document.getElementById("msgAdmin").textContent = "Erro ao apagar a lista: " + error;
        });
    }
});

// ===== Atualização em tempo real =====
function atualizarLista() {
    db.ref("players").on("value", snapshot => {
        document.getElementById("listaJogadores").textContent = JSON.stringify(snapshot.val(), null, 2);
    });
}

// Inicializa atualização ao carregar
atualizarLista();
