
import { animate,images } from "./index.js";

function selectRadio(heroId) {
    const radioInput = document.getElementById(heroId);
    if (radioInput) {
      radioInput.checked = true;
    }
  }

let players = ['modric','ronaldo','benzema','busq','messi','pique'];
for(let i=0;i<players.length;i++){
    var test = document.getElementsByTagName('img')[i];
    test.onclick = function(){
        selectRadio(players[i])};
}

let _players = ['_modric','_ronaldo','_benzema','_busq','_messi','_pique'];
for(let i=0;i<players.length;i++){
    var test = document.getElementsByTagName('img')[i+6];
    test.onclick = function(){
        selectRadio(_players[i])};
}

var audio = document.getElementById('myAudio');
audio.play()


var play = document.getElementById('play')
play.onclick = function(){
    document.getElementById('player1').innerHTML = document.querySelector('input[name="selectedHero"]:checked').value;
    document.getElementById('player2').innerHTML = document.querySelector('input[name="selectedHero*"]:checked').value;
    images();
    document.getElementsByClassName('postgame')[0].style.display='none';
    document.getElementsByClassName('btncont')[0].style.display='flex';
    document.getElementsByClassName('btncont')[1].style.display='flex';
    document.getElementsByClassName('btncont')[2].style.display='flex';
    document.getElementsByClassName('btncont')[3].style.display='flex';
    animate();

}


