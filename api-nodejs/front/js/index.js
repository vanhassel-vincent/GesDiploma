const xhr = new XMLHttpRequest();

function checkPerson() {
    const status = document.getElementById('response');

    const api = 'http://localhost:3000/verify';
    const name = document.getElementById('name');
    const firstName = document.getElementById('firstName');
    const filiaire = document.getElementById('filiaire');
    const diplome = document.getElementById('diplome');
    const promotion = document.getElementById('promotion');

    if(name.value && firstName.value != '') {

        let person = name.value + firstName.value + filiaire.value + diplome.value + promotion.value;

        person = person.toLowerCase();
        xhr.open('POST', api, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onreadystatechange = function (req) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let response = JSON.parse(req.target.response);
                response = Object.values(response)[0];
                if (response == true) {
                    status.innerHTML = `
            <div class="alert alert-success" role="alert">
                Le diplôme de niveau ` + diplome.value + ` de ` + firstName.value + ` ` + name.value + ` est bien certifié sur Bitcoin.
            </div >`
                } else {
                    status.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Le diplôme de niveau ` + diplome.value + ` de ` + firstName.value + ` ` + name.value + ` n'est pas certifié sur Bitcoin.
            </div>`
                }
            } else {
                status.innerHTML = `
            <div class="alert alert-warning" role="alert">
                Erreur de connexion au serveur, status de la requete : ` + xhr.status + `
            </div>`
            }
        }

        xhr.send(JSON.stringify({ person: person }));
    } else {

        status.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Le nom et le prenom ne peuvent pas être laissé vide.
            </div >`
            
    }
    
}
