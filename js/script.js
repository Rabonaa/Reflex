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
