$(document).ready(function () {
    $('#header').load('../header-ads.html');
    $('#footer').load('../footer-ads.html');

    $('#submit-file').on("click", function (e) {
        e.preventDefault();
        $('#files').parse({
            config: {
                delimiter: "auto",
                complete: displayHTMLTable,
            }
        });
    });

    function tabToConcat(data) {

        let tab = []
        for (var x in data) {
            let string ="";
            for (j in data[x]){
                string = string + data[x][j];
                string = string.replace(";", "");
                string = string.replace(";", "");
                string = string.replace(";", "");
                string = string.replace(";", "");
                string = string.replace(";", "");
            }
            tab.push(string);
        }
        return tab;

    }

    function displayHTMLTable(results) {

        const status = document.getElementById('response');
        status.innerHTML = 
        `<div class="text-center"><div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
        </div></div>`;
        const xhr = new XMLHttpRequest();
        const data = tabToConcat(results.data);

        xhr.open("POST", "http://localhost:3000/create", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function (req) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let response = JSON.parse(req.target.response);
                console.log(response);
                if (response) {
                    status.innerHTML = `
            <div class="alert alert-success" role="alert">
                Les etudiants on bien été certifiés, nombre d'étudiants : ` + response.length + `.
            </div >`
                } else {
                    status.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Erreur lors du transfert du fichier
            </div>`
                }
            } else {
                status.innerHTML = `
            <div class="alert alert-warning" role="alert">
                Erreur de connexion au serveur, status de la requete : ` + xhr.status + `
            </div>`
            }
            
        }
        xhr.send(JSON.stringify({
            data: data
        }));

    }
});