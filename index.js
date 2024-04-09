async function dovuciHotele(){
    const response = await fetch('https://joris.testmaster.fon.bg.ac.rs/api/hoteli');
    const hoteli = await response.json();
    const hoteliSelect = document.getElementById('hoteli');
    
    hoteliSelect.innerHTML += `<option value="">Izaberite hotel...</option>`;
   hoteli.forEach(hotel => {
    hoteliSelect.innerHTML += `<option value="${hotel.id}">${hotel.naziv}</option>`;
   });
   hoteliSelect.addEventListener('change', () => onHoteliChange(hoteliSelect));
   // ()=> omogucava da se onHoteliChange() izvrsi tek kad dodje do promene u hoteliSelect
}
async function onHoteliChange(hoteliSelect){
    console.log(hoteliSelect.value);
    
    const sobeSelect = document.getElementById('sobe');
    
    if(!hoteliSelect.value){
        sobeSelect.innerHTML = ``;
        return;
    }
    const response = await fetch(`https://joris.testmaster.fon.bg.ac.rs/api/hoteli/${hoteliSelect.value}`); // OBRATI PAZNJU NA TUPAVE NAVODNIKE
    const detalji = await response.json();
    console.log(detalji);
    sobeSelect.innerHTML = ``;
    detalji.sobe.forEach(soba => {
        sobeSelect.innerHTML += `<option value="${soba.id}">${soba.naziv}</option>`;
    });
}

dovuciHotele();

async function rezervisi(e){
    e.preventDefault();

    let hotel = document.getElementById("hoteli").value;
    let soba = document.getElementById("sobe").value;
    let datumod = document.getElementById("datumod").value;
    let datumdo = document.getElementById("datumdo").value;
    let tabela = document.getElementById("tabela");

    let dorucak = document.querySelector('input[value = "dorucak"]').checked;
    let rucak = document.querySelector('input[value = "rucak"]').checked;
    let vecera = document.querySelector('input[value = "vecera"]').checked;

    let napomena = document.getElementById("area").value;
    
    if(hotel && soba && datumod && datumdo && Date.parse(datumod) < Date.parse(datumdo)){
        let jsonData = {
            "hotelID": hotel,
            "sobaID": soba,
            "datumOd": datumod,
            "datumDo": datumdo,
            "dorucak": dorucak,
            "rucak": rucak,
            "vecera": vecera,
            "napomena": napomena
        };
        let rezervacijaJSON = JSON.stringify(jsonData);
        console.log(rezervacijaJSON);

        var xhr = new XMLHttpRequest(); //napravili smo request prema serveru
        var url = "https://joris.testmaster.fon.bg.ac.rs/api/hoteli/rezervisi";
        xhr.open("POST", url, true); // post je za slanje podataka na server; url je adresa na koju saljem; true je za asinhrono izvrsavanje
        xhr.setRequestHeader("Content-Type", "application/json"); // postavljam zaglavlje zahteva i ocekuje se da podaci budu json obliku
        
        xhr.onreadystatechange = async function() {
            if(xhr.readyState === 4 && xhr.status === 200){
                console.log("Response received successfully.");
                const response = await fetch(`https://joris.testmaster.fon.bg.ac.rs/api/hoteli/${hotel}`);
                const detaljiHotela = await response.json();

                let red = tabela.insertRow(1);
                let polje1 = red.insertCell();
                let polje2 = red.insertCell();
                let polje3 = red.insertCell();
                let polje4 = red.insertCell();

                polje1.innerHTML = detaljiHotela.naziv;
                detaljiHotela.sobe.forEach(sobaa => {
                    if(sobaa.id == soba){
                        polje2.innerHTML = sobaa.naziv;
                    }
                })
                polje3.innerHTML = datumod;
                polje4.innerHTML = datumdo;
            }      
        };
        xhr.send(rezervacijaJSON);
    }else {
    console.log('Obavezna polja nisu popunjena');
}
}

document.getElementById("rezervisi").addEventListener("click", rezervisi);
