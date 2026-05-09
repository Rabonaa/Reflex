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
                        merci.style.display = 'block';
                    }

                    let score = document.querySelector('.score');
                    if(score){
                        score.style.display = 'block';
                    }
                }, 2000);
            }
        });
    });
}
initForms();

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

document.getElementById('envoi_chat').addEventListener('click', function(event){
    event.preventDefault();
    fetchJSON('../json/intents.json');
});

document.getElementById('saisie').addEventListener('keydown', function (e){
    if(e.key === 'Enter'){
        e.preventDefault();
        document.getElementById('envoi_chat').click();
    }
});

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
