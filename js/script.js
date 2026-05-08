function checkForm(){
    let form = document.querySelectorAll(".formulaire");
    form.forEach(element => {
        element.addEventListener("submit", (e) => {
            let complet = true;
            let champRequis = element.querySelectorAll("[required]")

            champRequis.forEach(elementChamp => {
                let champ = elementChamp.value.trim();
                if(!champ){
                    elementChamp.style.border = "2px solid red";
                    complet = false;
                }
                else{
                    elementChamp.style.border = "";
                }
            });
            if(!complet){
                e.preventDefault();
                alert("Veuillez remplir tous les champs requis. ");
            }
        });
    });
}

function aimTestGame(){
    checkForm();
    
}



