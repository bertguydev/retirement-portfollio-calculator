  $(function() {

      // Global variables we'll be using
      let userIncome_Int, userResultWithGold, userResultWithGold2, updatedPortfolio_1, updatedPortfolio_2, updatedPortfolio_3, tickRanger;
      const dowLoss = .4979;
      const goldGain = 1.8129;
      let killSwitch = false;

      // This function will allow user to reset calculator after calculation finish outputting
      function initialize() {
        userIncome_Int = 0;
        userResultWithGold = 0;
        updatedPortfolio_1 = 0;
        updatedPortfolio_2 = 0;
        updatedPortfolio_3 = 0;
        tickRanger = 0;
        $('#income').val("");
        $('.step1').html("Calculate");
        $('#r1, #r2, #r3').html("");
        $('#r1, #r2, #r3').css("color", "#000");
        $('#percentChange_1, #percentChange_2, #percentChange_3').html("0%");
        $('#percentChange_1, #percentChange_2, #percentChange_3').css("color", "#000");
        $('figure.graph img').attr('src', '../wp-content/themes/porto-child/calculator/images/graph-init.jpg');
        killSwitch = false;
      }

      // This function turns integers to a string and formats them with commas to look nice for the user
      function numberWithCommas(x) {
          let parts = x.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return parts.join(".");
      }

      // This function will output the calculations into the dom using setIntervals
      function outputCalculations(endResult1, endResult2, endResult3) {

          // The setIntervals below will run until the user's income meets the endResults we calculated.
          var firstResult = setInterval(function(){
              subtractAnimation(tickRanger.loss);
              $('#r1').html('$' + numberWithCommas(userIncome_Int));
              $('#r1, #percentChange_1').css('color', '#e80707');
              $('.result:nth-child(1) .percent_ch').html('percentage loss:');
              $('#percentChange_1').html('- 49%');
              killSwitch = 'calculating';
              if (userIncome_Int <= endResult1 ) {
                clearInterval(firstResult);
                killSwitch = true;
              }
          }, 1);
          var secondResult = setInterval(function(){
              userResultWithGold2 -= tickRanger.loss;
              $('#r2').html('$' + numberWithCommas(userResultWithGold2));
              $('#r2, #percentChange_2').css('color', '#e80707');
              $('.result:nth-child(2) .percent_ch').html('percentage loss:');
              $('#percentChange_2').html('- 11%');
              if (userResultWithGold2 <= endResult2 ) {
                clearInterval(secondResult);
              }
          }, 1);
          var thirdResult = setInterval(function(){
              addAnimation(tickRanger.gain);
              $('#r3').html('$' + numberWithCommas(userResultWithGold));
              $('#r3, #percentChange_3').css('color', '#56ab00');
              $('.result:nth-child(3) .percent_ch').html('percentage gain:');
              $('#percentChange_3').html('+ 15%');
              if (userResultWithGold >= endResult3 ) {
                clearInterval(thirdResult);
              }
          }, 1);

          $('figure.graph img').attr('src', '../wp-content/themes/porto-child/calculator/images/graph-finish.jpg');

          // These functions control how fast the numbers change
          function subtractAnimation(tickerSpeed) {
              userIncome_Int -= tickerSpeed;
          }
          function addAnimation(tickerSpeed) {
              userResultWithGold += tickerSpeed;
          }

      }

      function payOff() {
        const errorLabel = {'color': '#ff3e3e'};
        const freshLabel = {'color': '#fff'};
        if ($('#income').val() !== '' && $('#income').val() !== null && $('.selectBox').val() !== null && $('.selectBox').val() !== '') {
              if (killSwitch == false) {
                outputCalculations(updatedPortfolio_1, updatedPortfolio_2, updatedPortfolio_3);
                $('.step1').html('Reset');
                if ($(window).width() <= 600 ) {
                  location.href = '#r-c';
                }
                killSwitch = true;
              }else {
                initialize();
              }
              $("label").css(freshLabel);
          } else {
              if (killSwitch == true) {
                initialize();
              }else {
                if ($('#income').val() == '' || $('#income').val() == null) {
                    alert('please enter an estimate of your savings account(s)');
                    $("label[for='income']").css(errorLabel);
                }
                if ($('.selectBox').val() == '' || $('.selectBox').val() == null) {
                    alert('please select your account type');
                    $("label[for='accountType']").css(errorLabel);
                }
              }
          }
      }

      // Listen for changes of the income input so we can set up our the variables for our calculations
      $('#income').on('input propertychange paste', function() {
        if (killSwitch !== 'calculating') {
          userIncome_Int = parseInt(($(this).val()).replace(/,/g, ""));
          userResultWithGold = parseInt(($(this).val()).replace(/,/g, ""));
          userResultWithGold2 = parseInt(($(this).val()).replace(/,/g, ""));
          updatedPortfolio_1 = userIncome_Int - (userIncome_Int * dowLoss);
          updatedPortfolio_2 = ((userIncome_Int * .7) * dowLoss) + ((userIncome_Int *.3) * goldGain);
          updatedPortfolio_3 = ((userIncome_Int / 2) * dowLoss) +  ((userIncome_Int / 2) * goldGain);

            // change outcome gain/loss as user inputs account info
            if (userIncome_Int <= 1000) {
               tickRanger = {loss: 5, gain: 1};
            }else if(userIncome_Int > 1000 && userIncome_Int <= 10000 ) {
              tickRanger = {loss: 11, gain: 5};
            }else if(userIncome_Int > 10000 && userIncome_Int <= 100000 ) {
              tickRanger = {loss: 71, gain: 31};
            }else if(userIncome_Int > 100000 && userIncome_Int < 1000000) {
              tickRanger = {loss: 501, gain: 301};
            }else if(userIncome_Int > 1000000 && userIncome_Int < 10000000) {
              tickRanger = {loss: 1501, gain: 701};
            }else if(userIncome_Int >= 10000000 ) {
              tickRanger = {loss: 2801, gain: 1401};
            }

          // format number
          $(this).val(function(index, value) {
              return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          });
          $('.result-b-Column span').html($(this).val());
        }
      });

      // check if calculator is already running if not, do the magic
      $('.step1').on('click tap', function() {
        if (killSwitch !== 'calculating') {
          payOff();
        }
      });

      // Kind of annoying but these lines below makes the "Enter" key work since were building a SPA and not using a standard form.
      $(document).on('keypress', function(key) {
        if (killSwitch !== 'calculating') {
          if (key.which == 13) {
               payOff();
          }
        }
      });


    function updateDOM() {
        function updatePercentages(stockPercent, goldPercent) {
            var pHTML = '<div class="m-stocks-row"><p>STOCKS</p><span class="silverDot"></span><p>' + stockPercent + '</p></div>';
                  pHTML += '<div class="m-gold-row"><p>GOLD</p><span class="goldDot"></span><p>' + goldPercent + '</p></div>';
                  return pHTML;
          }
        let mobileDropDown = function(op){return '<button class="mobileDropDown">' + op + '</button>'};
        let wW = $(window).width();
        let disclaimer = $('.discl');
        const mobileStartBtn = '<a href="#l-c"><button class="mobileStartBtn">Start</button></a>';
        if (wW <= 992) {
            $('.right-col').append(disclaimer);
        }else {
            $('.formArea').append(disclaimer);
        }
        if (wW <= 600 ) {
           if ( !$('.mobileStartBtn').is(':visible') ) {
              $('.headline').append(mobileStartBtn);
            }
            if ($('.mobileDropDown').is(':visible') == false) {
              $('.percentage').after(mobileDropDown('+'));
            }
          $('.resultBox .result:nth-child(1) .percentage').html(updatePercentages('100%', '0%'));
          $('.resultBox .result:nth-child(2) .percentage').html(updatePercentages('70%', '30%'));
          $('.resultBox .result:nth-child(3) .percentage').html(updatePercentages('50%', '50%'));

        }
    }

    const loadWidth = $(window).width();
    if ( loadWidth <= 992 ) {
        updateDOM();
    }

    $( window ).on( 'resize', updateDOM );
    $('button.mobileDropDown').on('tap touchend', function(){
                      let thisIndex = $(this)[0].parentElement.children[3].innerHTML;
                      console.log(thisIndex);
                      //console.log(thisIndex);
                      switch(thisIndex) {
                        case 'A':
                        if ($('#grA').is(':visible') !== true)  {
                          $('#grA').css('display', 'block');
                          $('.result:nth-child(1) .mobileDropDown').html('-');
                        }else {
                          $('#grA').css('display', 'none');
                          $('.result:nth-child(1) .mobileDropDown').html('+');
                        }
                        break;
                        case 'B':
                        if ($('#grB').is(':visible') !== true)  {
                          $('#grB').css('display', 'block');
                          $('.result:nth-child(2) .mobileDropDown').html('-');
                        }else {
                          $('#grB').css('display', 'none');
                          $('.result:nth-child(2) .mobileDropDown').html('+');
                        }
                        break;
                        case 'C':
                        if ($('#grC').is(':visible') !== true)  {
                          $('#grC').css('display', 'block');
                          $('.result:nth-child(3) .mobileDropDown').html('-');
                        }else {
                          $('#grC').css('display', 'none');
                          $('.result:nth-child(3) .mobileDropDown').html('+');
                        }
                        break;
                      }
                  });

  });