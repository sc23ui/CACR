$(function(){
  var userEmail = "me@delta.com"; // Update me later
  var colorCounts = {
    0: "#767676",
    1: "#87CDFF",
    2: "#1c7bd9",
    3: "#0253a4",
    4: "#a9dbff",
    5: "#ea8a1a"
  }

  var spinDefaults = {
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
    "hasShadows": true,
    "numSpins": 1,
    "spinDestinationArray":[],
    "minSpinDuration":6,
    "gameOverText":"Thank you for playing. Grand prize winners will be notified by email.",
    "invalidSpinText":"Oops, something went wrong. Please spin again.",
    "introText":"Click the wheel to spin.",
    "hasSound":true,
    "gameId":"9a0232ec06bc431114e2a7f3aea03bbe2164f1aa",
    "clickToSpin":true
  }

  var checkStatusUrl = $('[data-check-status-url]').attr('data-check-status-url');

  var gameFrequency = {
    "DAILY": "tomorrow",
    "WEEKLY": "next week",
    "MONTHLY": "next month"
  }

  var gameFrequencyPossessive = {
    "DAILY": "today's",
    "WEEKLY": "this week's",
    "MONTHLY": "this month's"
  }

  var userName, gameCode;

  $.getJSON(checkStatusUrl, function(data) {
    $('.js-game-start').show()
    $('.js-game-theme').text(data.game.name);
    $('.js-game-prize').text(data.game.prize);
    $('.js-game-frequency').text(gameFrequency[data.game.frequency]);
    $('.js-game-frequency-possessive').text(gameFrequencyPossessive[data.game.frequency]);
    $('.js-game-score').text(data.participation.totalEntries);
    if (data.participation.canPlay) {
      userName = data.participation.userName;
      gameCode = data.participation.gameCode;
      $('.js-trivia-form').show();
      createQuestions(data.question);
    } else {
      $('.js-game-message').show()
    }
  });

  var createQuestions = function(question) {
    $('.js-trivia-question').text(question.text);
    var $answers = $('.js-trivia-answers');
    var $questionInput = $('<input >');
    $questionInput.attr('type', 'hidden');
    $questionInput.attr('name', 'questionId');
    $questionInput.attr('value', question.id);
    $questionInput.appendTo($answers);

    for (var i = 0; i < question.answers.length; i++) {
      var answer = question.answers[i];
      var $div = $('<div class="trivia-answer" />');
      var $input = $('<input />');
      $input.attr('name', 'answerId');
      $input.attr('type', 'radio');
      $input.val(answer.id);
      $input.addClass('trivia-answer-input');

      var $label = $('<label />');
      $label.addClass('trivia-answer-label');
      $label.text(answer.text);

      var $pretty = $('<div class="trivia-answer-radio" />');
      $pretty.attr('data-answer-id', answer.id);

      $input.appendTo($label);
      $label.appendTo($div);
      $pretty.appendTo($label);

      $div.appendTo($answers)
    }

    $('.js-trivia-submit').prop('disabled', true);
    $('.js-trivia-form').show();

    $(document).on('change', '.trivia-answer-input', function () {
      $('.js-trivia-submit').prop('disabled', false);
    });

    $('.js-trivia-form').submit(function(e) {
      e.preventDefault();
      $form = $(this);
      var url = $(this).attr('action');
      var questionId = $('input[name="questionId"]').val();
      var answerId = $('input[name="answerId"]:checked').val();

      $(this).find("input[type=radio]").prop('disabled', true);

      $.ajax(url, {
        method: 'POST',
        dataType: 'json',
        data: {
          questionId: questionId,
          answerId: answerId,
          userName: userName,
          gameCode: gameCode
        },
        success: function(data) {
          if (data.answer.correctIndicator == "Y") {
            var newTotalEntries = data.participation.totalEntries;
            spinDefaults["colorArray"] = data.entries.map(function(e) {
              return colorCounts[e.count];
            });
            spinDefaults["segmentValuesArray"] = data.entries.map(function(entry) {
              return {
                probability: entry.probability,
                type: entry.type,
                win: entry.win,
                resultText: entry.value,
                value: entry.count + "^" + (entry.count == 1 ? 'ENTRY' : 'ENTRIES'),
                userData: {
                  score: entry.count
                }
              };
            });
            $('.js-trivia-form').hide();
            $('.js-game-start').hide();
            $('.js-spin-container').show();
            initSpinWheel(spinDefaults, function() {
              $('.js-game-score').text(newTotalEntries);
            });
          } else {
            $form.find('input[value="' + data.answer.id + '"]').closest('.trivia-answer').addClass("trivia-answer-correct");
            $form.find('input:checked').closest('.trivia-answer').addClass( "trivia-answer-wrong" );
            $form.find('input').closest('.trivia-answer').addClass( "trivia-answer-disabled" );
            $('.js-trivia-wrong').show();
            // $('.js-trivia-submit').prop('disabled', true);
            $('.js-trivia-submit').hide();
          }
        }
      });
    });
  }

})
