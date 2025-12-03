const token = localStorage.getItem("token");

if (token === null) {
  window.location.href = "../html/login.html";
}

let kolegijiLista = [];
let allSubjects = [];

$(document).ready(() => {
  let urlGetAllCurriculums = "https://www.fulek.com/data/api/supit/curriculum-list/hr";
  
  let xmlhttpGetAllSubjects = new XMLHttpRequest();

  xmlhttpGetAllSubjects.open("GET", urlGetAllCurriculums, true);
  xmlhttpGetAllSubjects.setRequestHeader("Authorization", "Bearer " + token);
  xmlhttpGetAllSubjects.send();

  xmlhttpGetAllSubjects.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      allSubjects = JSON.parse(this.responseText);
      kolegijiLista = createArrayFromResponse(allSubjects.data);

      $("#kolegiji").autocomplete({
        delay: 300,
        source: kolegijiLista,
        minLength: 1,
        focus: function (event, ui) {
          event.preventDefault();
          $("#kolegiji").val(ui.item.kolegij);
        },
        select: function (event, ui) {
          event.preventDefault();
          $("#kolegiji").val(ui.item.kolegij);
        },
      });
    }
  };
})

$("#kolegiji").on("autocompleteselect", function (e, ui) {
  let id = findID(allSubjects.data, ui.item.value);
  let urlGetCurriculum = `https://www.fulek.com/data/api/supit/get-curriculum/${id}`;
  let xmlhttpGetSubject = new XMLHttpRequest();
  xmlhttpGetSubject.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let subject = JSON.parse(this.responseText);
      dodajRedak(subject);
      sumEctsAndHours();
    }
  };

  xmlhttpGetSubject.open("GET", urlGetCurriculum, true);
  xmlhttpGetSubject.setRequestHeader("Authorization", "Bearer " + token);
  xmlhttpGetSubject.send();
});

function createArrayFromResponse(response) {
  let arr = [];
  for (let i = 0; i < response.length; i++) {
    arr.push(response[i].kolegij);
  }
  return arr;
}

function findID(arr, nameOfKolegij) {
  for (let i = 0; i < arr.length; i++) {
    if (nameOfKolegij === arr[i].kolegij) {
      return arr[i].id;
    }
  }
}

function dodajRedak(subject) {
  $("#tablebody").append(
    `<tr>
      <td>${subject.data.kolegij}</td>
      <td>${subject.data.ects}</td>
      <td>${subject.data.sati}</td>
      <td>${subject.data.predavanja}</td>
      <td>${subject.data.vjezbe}</td>
      <td>${subject.data.tip}</td>
      <td class="delete-cell">
          <button class="delete-row">✕</button>
      </td>
    </tr>`
  );
}



function showSum(ukupniECTS, ukupniSati, ukupniPredavanja, ukupniVjezbe) {
  $("#ectsUkupno").text(ukupniECTS);
  $("#satiUkupno").text(ukupniSati);
  $("#predavanjaUkupno").text(ukupniPredavanja);
  $("#vjezbeUkupno").text(ukupniVjezbe);
}

function sumEctsAndHours() {
  let ukupniECTS = 0;
  let ukupniSati = 0;
  let ukupniPredavanja = 0;
  let ukupniVjezbe = 0;

  $("#kolegijiTable tbody tr").each(function () {
    const ectsText = $(this).find("td:eq(1)").text().trim();
    console.log("ECTS Text:", typeof(ectsText)); // ispisuje dobro
    const satiText = $(this).find("td:eq(2)").text().trim();
    const predavanjaText = $(this).find("td:eq(3)").text().trim();
    const vjezbeText = $(this).find("td:eq(4)").text().trim();

    const ects = parseFloat(ectsText);
    console.log("ECTS Value:", ects); // debagiranje kaze NaN
    const sati = parseFloat(satiText);
    const predavanja = parseFloat(predavanjaText);
    const vjezbe = parseFloat(vjezbeText);

    if (!isNaN(ects)) ukupniECTS += ects;
    if (!isNaN(sati)) ukupniSati += sati;
    if (!isNaN(predavanja)) ukupniPredavanja += predavanja;
    if (!isNaN(vjezbe)) ukupniVjezbe += vjezbe;
  });

  showSum(ukupniECTS, ukupniSati, ukupniPredavanja, ukupniVjezbe);
}

$(document).on("click", ".delete-row", function () {
  $(this).closest("tr").remove();
  sumEctsAndHours(); 
});




