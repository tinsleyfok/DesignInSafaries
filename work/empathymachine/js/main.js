      document.addEventListener("DOMContentLoaded", function () {
          console.log("DOM fully loaded and parsed");

          $('.menu').on('mouseover', function (event) {
              event.preventDefault();
              //$(this).toggleClass('active');
              //$('.menu-pages').slideToggle("fast");
              //$('.menu').hide();
              $('.menu').hide();
              $('.menu-pages').show();
          });

          $('.menu-pages').on('mouseout', function (event) {
              $('.menu').show();
              $('.menu-pages').hide();
          });
      });