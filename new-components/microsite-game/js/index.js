//Usage

//load your JSON (you could jQuery if you prefer)
function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  if (xobj.overrideMimeType) {
      xobj.overrideMimeType("application/json");
  }

  xobj.open('GET', 'wheel_data.json', true);
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      //Call the anonymous function (callback) passing in the response
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

//your own function to capture the spin results
function myResult(e) {
  //e is the result object
    console.log('Spin Count: ' + e.spinCount + ' - ' + 'Win: ' + e.win + ' - ' + 'Message: ' +  e.msg);

    // if you have defined a userData object...
    if(e.userData){

      console.log('User defined score: ' + e.userData.score)

    }

  //if(e.spinCount == 3){
    //show the game progress when the spinCount is 3
    //console.log(e.target.getGameProgress());
    //restart it if you like
    //e.target.restart();
  //}

}

//your own function to capture any errors
function myError(e) {
  //e is error object
  console.log('Spin Count: ' + e.spinCount + ' - ' + 'Message: ' +  e.msg);

}

function myGameEnd(e) {
  //e is gameResultsArray
  console.log(e);
  TweenMax.delayedCall(5, function(){
    /*location.reload();*/
  })


}

function initSpinWheel(config) {
  var myWheel = new Spin2WinWheel();

  //WITH your own button
  //myWheel.init({data:jsonData, onResult:myResult, onGameEnd:myGameEnd, onError:myError, spinTrigger:mySpinBtn});

  //WITHOUT your own button
  myWheel.init({data:config, onResult:myResult, onGameEnd:myGameEnd, onError:myError});
}

//And finally call it
// init();
