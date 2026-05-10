function validForm(formulaire){
    let complet = true;
    let champsRequis = formulaire.querySelectorAll('[required]');

    champsRequis.forEach(champ => {
        let checkedVal = champ.value.trim();
        if(!checkedVal){
            complet = false;
            champ.style.border = '2px solid red';
        }
        else{
            champ.style.border = '';
        }
    });
    if(!complet){
        alert("Veuillez remplir tous les champs requis.");
    }
    return complet;
}

function initForms(){
    let forms = document.querySelectorAll(".formulaire");
    forms.forEach(form => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            if(validForm(form)){
                let donnees = {};
                let genre = form.querySelector('#genre');
                if(genre){ donnees.genre = genre.value;}

                let nom = form.querySelector('#nom');
                if(nom){ donnees.nom = nom.value;}

                let prenom = form.querySelector('#prenom');
                if(prenom){ donnees.prenom = prenom.value;}

                let date = form.querySelector('#date');
                if(date){ donnees.date = date.value;}

                let mail = form.querySelector('#mail');
                if(mail){ donnees.mail = mail.value;}

                let device = form.querySelector('#device');
                if(device){ donnees.device = device.value;}

                localStorage.setItem('utilisateur', JSON.stringify(donnees));

                let fieldset = document.querySelector('fieldset');
                if(fieldset){
                    fieldset.disabled = true;
                }
                let envoi = document.querySelector('button[type="submit"]');
                if(envoi){
                    envoi.disabled = true;
                    envoi.innerText = "Envoi en cours...";
                    envoi.style.background = 'none'
                    envoi.style.color = 'black';
                    envoi.style.pointerEvents = 'none';
                }
                setTimeout( () =>{
                    form.style.display = 'none';

                    let merci = document.querySelector('.post-form');
                    if(merci){
                        merci.style.display = 'flex';
                    }

                    let reactionBox = document.querySelector('#reaction-box');
                    if(reactionBox){
                        reactionBox.style.display = 'block';
                    }
                }, 2000);
            }
        });
    });
}

function fetchJSON(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (Object.keys(data).length === 0 && data.constructor === Object) {
                throw new Error('Empty JSON or malformed JSON');
            }
            console.log(data);
            sendMessage(data.intents);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

let envoiChat = document.getElementById('envoi_chat');
if(envoiChat){
    envoiChat.addEventListener('click', function(event){
        event.preventDefault();
        fetchJSON('../json/intents.json');
    });
}

let saisie = document.getElementById('saisie');
if(saisie){
    saisie.addEventListener('keydown', function(e){
        if(e.key === 'Enter'){
            e.preventDefault();
            document.getElementById('envoi_chat').click();
        }
    });
}

function processMessage(intents, message) {
    let response = "Je suis désolé, je ne suis pas sûr de comprendre.";

    intents.forEach(intent => {
        intent.patterns.forEach(pattern => {
            if (message.toLowerCase().includes(pattern.toLowerCase())) {
                response = intent.responses[Math.floor(Math.random() * intent.responses.length)];
            }
        });
    });

    return response;
}

function sendMessage(intents) {
    let champSaisie = document.getElementById('saisie');
    let message = champSaisie.value.trim();

    if (message !== "") {
        let chatBox = document.querySelector('#chat-box');
        let user_message = document.createElement('div');
        user_message.textContent = message;
        user_message.classList.add('user-mess');
        chatBox.appendChild(user_message);

        let reponseBot = processMessage(intents, message);

        let bot_message = document.createElement('div');
        bot_message.textContent = reponseBot;
        bot_message.classList.add('bot-mess');
        chatBox.appendChild(bot_message);

        champSaisie.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function showChatBot(){
    let chatButton = document.getElementById('discuter');
    if(!chatButton){
        return;
    }
    chatButton.addEventListener('click', () =>{
        let chatBot = document.getElementById('chat-section');
        chatBot.style.display = 'flex';
        chatButton.disabled = true;
        chatButton.style.display = 'none';
    });
}

showChatBot();

function ReactionTimeStart(){
    let rectangle = document.getElementById('reaction-box');
    if(!rectangle){
        return;
    }
    let checked = false;
    let dateDebut = null;
    let attempts = 0;
    let tempsTot = 0;
    let timeOut = null;

    function start(){
        checked = false;
        rectangle.style.backgroundColor = '#ff0921';
        rectangle.style.color = 'white';
        rectangle.style.fontSize = '40px';
        rectangle.innerText = "Attendez le vert...";
        let randomNum = Math.floor(Math.random() * 7001);
        timeOut = setTimeout(()=>{
            dateDebut = Date.now();
            checked = true;
            rectangle.innerText = "Cliquez !";
            rectangle.style.backgroundColor = '#01d758';
        }, randomNum);
    }

    function handleClick(){
        if(checked) {
            attempts++;
            let tempsReaction = Date.now() - dateDebut;
            tempsTot += tempsReaction;
            rectangle.innerText = "Temps de réaction :\n" + tempsReaction + " ms";


            if (attempts >= 5) {
                clearTimeout(timeOut);
                let moyenne = Math.round(tempsTot / 5);
                rectangle.removeEventListener('click', handleClick);
                rectangle.innerText = "Tentative " + attempts + "\n Temps de réaction :" + tempsReaction + "ms"
                setTimeout(()=>{
                    rectangle.style.backgroundColor = '#e7e4fa';
                    rectangle.style.color = 'black';
                    rectangle.innerText = "Temps de réaction moyen :\n" + Math.round(tempsTot/5) + "ms";
                    let replayButton = document.createElement('button');
                    let espace = document.createElement('br');
                    replayButton.classList.add('replay-button');
                    replayButton.innerText = 'Rejouer';
                    rectangle.appendChild(espace);
                    rectangle.appendChild(replayButton);
                    replayButton.addEventListener('click', () =>{setTimeout(ReactionTimeStart, 200)});
                }, 1500);
            } else {
                rectangle.innerText = "Tentative " + attempts + "\n Temps de réaction :" + tempsReaction + "ms"
                setTimeout(start, 1500);
            }
        }
        else {
            clearTimeout(timeOut);
            rectangle.innerText = "Trop tôt! Réessayez encore une fois.";
            setTimeout(start, 1000);
        }
    }
    rectangle.addEventListener('click', handleClick);
    start();
}


function chargerForm(){
    let data = localStorage.getItem('utilisateur');
    if(!data){
        return;
    }
    let user = JSON.parse(data);

    let genre = document.getElementById('genre');
    if(genre) genre.value = user.genre;

    let nom = document.getElementById('nom');
    if(nom) nom.value = user.nom;

    let prenom = document.getElementById('prenom');
    if(prenom) prenom.value = user.prenom;

    let date = document.getElementById('date');
    if(date) date.value = user.date;

    let mail = document.getElementById('mail');
    if(mail) mail.value = user.mail;

    let device = document.getElementById('device');
    if(device) device.value = user.device;

    let form = document.querySelector('.formulaire');
    let reactionBox = document.querySelector('#reaction-box');
    let aimBox = document.querySelector('#aim-box');
    if (form && (reactionBox || aimBox)) {
        form.style.display = 'none';
        if (reactionBox) reactionBox.style.display = 'flex';
        if (aimBox) aimBox.style.display = 'flex';
        let merci = document.querySelector('.post-form');
        if (merci) merci.style.display = 'flex';
    }
}

function startForm() {
    initForms();
    chargerForm();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startForm);
} else {
    startForm();
}
