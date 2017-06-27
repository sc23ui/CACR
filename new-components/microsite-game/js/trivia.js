$(function(){
  var userEmail = "me@delta.com"; // Update me later
  var colorCounts = {
    0: "#767676",
    1: "#87CDFF",
    2: "#a9dbff",
    3: "#0253a4",
    4: "#1c7bd9",
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
    "numSpins": -1 ,
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

  $.getJSON(checkStatusUrl, function(data) {
    $('.js-game-start').show()
    $('.js-game-theme').text(data.game.name);
    $('.js-game-prize').text(data.game.prize);
    $('.js-game-frequency').text(data.game.frequency);
    if (data.canPlay) {
      $('.js-game-start-action').show()
    } else {
      $('.js-game-message').show()
    }
  });

  $('.js-game-start-btn').click(function(e) {
    $('.js-game-start').hide()
    $('.js-trivia-form').show()
    var url = $(this).attr('data-get-questions-url');
    createQuestions(url);
  });

  var createQuestions = function(url) {
    $.getJSON(url, function(data) {
      $('.js-trivia-question').text(data.question.text);
      var $answers = $('.js-trivia-answers');
      var $questionInput = $('<input >');
      $questionInput.attr('type', 'hidden');
      $questionInput.attr('name', 'questionId');
      $questionInput.attr('value', data.question.questionId);
      $questionInput.appendTo($answers);

      for (var i = 0; i < data.question.answers.length; i++) {
        var answer = data.question.answers[i];
        var $div = $('<div class="trivia-answer" />');
        var $input = $('<input />');
        $input.attr('name', 'answerId');
        $input.attr('type', 'radio');
        $input.val(answer.answerId);
        $input.addClass('trivia-answer-input');

        var $label = $('<label />');
        $label.addClass('trivia-answer-label');
        $label.text(answer.text);

        var $pretty = $('<div class="trivia-answer-radio" />');
        $pretty.attr('data-answer-id', answer.answerId);

        $input.appendTo($label);
        $label.appendTo($div);
        $pretty.appendTo($label);

        $div.appendTo($answers)
      }

      $('.js-trivia-start-btn').prop('disabled', true);
      $('.js-trivia-form').show();
    });

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
          answerId: answerId
        },
        success: function(data) {
          if (data.correct) {
            spinDefaults["colorArray"] = data.entries.map(function(e) {
              return colorCounts[e.userData.score];
            });
            spinDefaults["segmentValuesArray"] = data.entries;
            $('.js-trivia-form').hide();
            $('.js-spin-container').show();
            initSpinWheel(spinDefaults);
          } else {
            $form.find('input[value="' + data.correctAnswerId + '"]').closest('.trivia-answer').addClass("trivia-answer-correct");
            $form.find('input:checked').closest('.trivia-answer').addClass( "trivia-answer-wrong" );
            $form.find('input').closest('.trivia-answer').addClass( "trivia-answer-disabled" );
            $('.js-trivia-submit').prop('disabled', true);
          }
        }
      });
    });
  }

})
