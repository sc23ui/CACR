$(function(){
  var userEmail = "me@delta.com"; // Update me later
  var colorCounts = {
    0: "#767676",
    1: "#87CDFF",
    3: "#0253a4",
    5: "#ea8a1a"
  }

  var spinDefaults = {
    "colorArray":[ "#0253a4", "#87cdff", "#0253a4", "#87cdff", "#ea8a1a", "#87cdff", "#16A085", "#27AE60", "#2980B9", "#8E44AD", "#2C3E50", "#F39C12", "#D35400", "#C0392B", "#BDC3C7","#ECF0F1", "#2ECC71", "#E87AC2", "#3498DB", "#9B59B6", "#7F8C8D"],

    "segmentValuesArray" : [],

    "svgWidth": 1024,
    "svgHeight": 768,
    "wheelStrokeColor": "#0b1f66",
    "wheelStrokeWidth": 10,
    "wheelSize": 700,
    "wheelTextOffsetY": 80,
    "wheelTextColor": "#ffffff",
    "wheelTextSize": "2.3em",
    "wheelImageOffsetY": 40,
    "wheelImageSize": 50,
    "centerCircleSize": 300,
    "centerCircleStrokeColor": "#0b1f66",
    "centerCircleStrokeWidth": 8,
    "centerCircleFillColor": "#02132d",
    "segmentStrokeColor": "#ffffff",
    "segmentStrokeWidth": 4,
    "centerX": 512,
    "centerY": 384,
    "hasShadows": false,
    "numSpins": -1 ,
    "spinDestinationArray":[],
    "minSpinDuration":6,
    "gameOverText":"Thank you for playing. See you tomorrow.",
    "invalidSpinText":"Oops, something went wrong. Please spin again.",
    "introText":"Click the wheel to spin.",
    "hasSound":true,
    "gameId":"9a0232ec06bc431114e2a7f3aea03bbe2164f1aa",
    "clickToSpin":true
  }


  $.getJSON("mock/can_play.json", function(data) {
    $('#loading').hide()
    if (data.canPlay) {
      createQuestions();
    } else {
      $('#try-tomorrow').show()
    }
  });

  var createQuestions = function() {
    $.getJSON("mock/questions.json", function(data) {
      console.log(data);
      $('.trivia-question').text(data.question.text);
      var $answers = $('.trivia-answers');
      for (var i = 0; i < data.question.answers.length; i++) {
        var answer = data.question.answers[i];
        var $div = $('<div class="trivia-answer" />');
        var $input = $('<input />');
        $input.attr('name', 'selector');
        $input.attr('type', 'radio');
        $input.addClass('trivia-answer-input');
        $input.attr('value', answer.text);

        var $label = $('<label />');
        $label.addClass('trivia-answer-label');
        $label.text(answer.text);

        var $pretty = $('<div class="trivia-answer-radio"/>');

        $input.appendTo($label);
        $label.appendTo($div);
        $pretty.appendTo($label);

        $div.appendTo($answers)
      }

      $('#triviaForm').show();
    });

    $('#triviaForm').submit(function(e) {
      e.preventDefault();
      var url = $(this).attr('action');
      $.ajax(url, {
        method: 'POST',
        dataType: 'json',
        success: function(data) {
          if (data.correct) {
            spinDefaults["colorArray"] = data.entries.map(function(e) {
              return colorCounts[e.userData.score];
            });
            spinDefaults["segmentValuesArray"] = data.entries;
            $('#triviaForm').hide();
            $('#spin2Win').show();
            initSpinWheel(spinDefaults);
          } else {
            // Show try again
          }
        }
      });
    });
  }

    // $('.trivia-submit').click(function(){
    //     $( ".trivia-container" ).addClass( "noDisplay" );
    //     $('#spin2Win').hide();
    //     return false;
    // });


})
