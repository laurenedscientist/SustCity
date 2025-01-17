let csmd = new Consumidor("csmd");
let gb1 = new GeradorBiogas("gb1");
let gb2 = new GeradorBiogas("gb2");
let ag1 = new AeroGerador("ag1");
let ag2 = new AeroGerador("ag2");
let mfv = new ModuloFotovoltaico("mfv");
let smlc = new Simulacao();
let displayName, email, emailbase64, emailVerified, photoURL, isAnonymous, uid, providerData;

// Firebase
firebase.auth().onAuthStateChanged(function (user) {
    if (user) { // Se estiver logado.

        //Pega informações
        displayName = user.displayName;
        email = user.email;
        emailVerified = user.emailVerified;
        photoURL = user.photoURL;
        isAnonymous = user.isAnonymous;
        uid = user.uid;
        providerData = user.providerData;

        // Exibe e-mail
        document.getElementById("emaillogado").innerHTML = email;

        // Verifica se o E-mail foi confirmado
        if (emailVerified) {
            document.getElementById('ValidarEmail').value = "E-mail Validado";
            document.getElementById('ValidarEmail').disabled = true;
        } else {
            document.getElementById('ValidarEmail').disabled = false;
        }

        // Converte o E-mail em base64
        emailbase64 = btoa(email);

        // Verifica o cargo
        firebase.database().ref("Cargos/" + emailbase64 + "/cargo").on('value', function (snapshot) { // ouvinte no campo cargo usuário
            if (snapshot.val() == 1) { // se for operador
                // Exibe cargo
                document.getElementById("cargomenu").innerHTML = 'Operador';

                // Remove o botão de relatório
                let btnrelatorio = document.getElementById('btnrelatorio')
                btnrelatorio.parentNode.removeChild(btnrelatorio)

                // Remove o botão de cadastro
                let btncadastrar = document.getElementById('btncadastrar')
                btncadastrar.parentNode.removeChild(btncadastrar)
            } else if (snapshot.val() == 2) { // Se for Coordenador
                // Exibe cargo
                document.getElementById("cargomenu").innerHTML = 'Coordenador';

                // Remove o botão de cadastro
                let btncadastrar = document.getElementById('btncadastrar')
                btncadastrar.parentNode.removeChild(btncadastrar)
            } else if (snapshot.val() == 3) { // Se for Gerente
                // Exibe cargo
                document.getElementById("cargomenu").innerHTML = 'Gerente';
            } else {
                alert("Valor:" + snapshot.val() + " | sem cargo")
            }
        })

    } else {
        alert("Usuário deslogado!")
        window.open('index.html', '_self');
    }
})

function logout() {
    firebase.auth().signOut();
}

function updateUser() {
    // Cria referência raiz no storage
    let storageRef = firebase.storage().ref();

    // Cria referência para o ID do usuário
    let userRef = storageRef.child(uid);

    // Cria referência para o caminho da imagem
    let userImageRef = userRef.child('images/' + uid);

    let file = document.getElementById('updateimg').files[0];// use the Blob or File API
    userImageRef.put(file).then(function (snapshot) {
        console.log('Uploaded a blob or file!');
    });
    alert('100% atualizado, é ruim de aturar, bomba patch virou moda todo mundo quer jogar!')
}

function validarEmail() {
    firebase.auth().currentUser.sendEmailVerification().then(function () {
        document.getElementById('ValidarEmail').disabled = true;
        alert('E-mail de verificação enviado!');
    });
}
