$(document).ready(async function () {
    var div = document.getElementById("text_animation");
    var spans = div.getElementsByTagName("span");
    var newElem = document.createElement("BR");
  
    await typeSentence("Budi izvrstan u onome što vidiš!", "#sentence");
    await waitForMs(100);
    await deleteSentence("#sentence");
    await waitForMs(100);
    await typeSentence("voliš.", "#sentence");
    div.insertBefore(newElem, spans[1]);
    await typeSentence("ZAISKRI.", "#zaiskri");
  });
  
  async function typeSentence(sentence, eleRef, delay = 100) {
    const letters = sentence.split("");
    let i = 0;
    while (i < letters.length) {
      await waitForMs(delay);
      $(eleRef).append(letters[i]);
      i++;
    }
    return;
  }
  
  function waitForMs(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  async function deleteSentence(eleRef) {
    const sentence = $(eleRef).html();
    const letters = sentence.split("");
    let i = 0;
    while (letters.length > 26) {
      await waitForMs(100);
      letters.pop();
      $(eleRef).html(letters.join(""));
    }
  }
  