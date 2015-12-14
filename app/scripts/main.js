console.log('\'Allo \'Allo!');

var ZoomGrid = (function() {
  var w = $(window);
  var grid = $('.grid');
  var item = $('.grid__item');
  var itemContent = item.find('.grid__link');
  var post = $('.post');
  var backBtn = post.find('.post__back');
  var nextBtn = post.find('.post__forw');
  var breakpoint = 700;
  var isBig = false;

  var zoom = function(event) {
    var content = $(this).find('.grid__link');
    var self = $(this);
    var index = self.index();
    var vw = w.innerWidth();
    var vh = w.innerHeight();
    var ds = $(document).scrollTop();
    var px = event.pageX;
    var py = event.pageY;

    // scale stuff
    var iw = $(this).innerWidth();
    var ih = $(this).innerHeight();
    var sx = vw / iw;
    var sy = vh / ih;

    // transform-origin stuff
    var o = $(this).offset();
    var xc = vw / 2;
    var yc = ds + vh / 2;

    var dsp = ds / (vh + ds) * 100;

    tox = px / vw * 100;
    toy = py / vh * 100;
    toy = toy - dsp;

    if (!isBig && vw >= breakpoint) {
      grid.css({
        'transform-origin': tox + '% ' + toy + '%'
      });

      setTimeout(function() {
        requestAnimationFrame(function() {
          grid.css({
            'transform-origin': tox + '% ' + toy + '%',
            'transform': 'scale(' + sx + ',' + sy + ')'
          });
          itemContent.css({
            'opacity': '0'
          });
          $('body').css('overflow', 'hidden');
          showPost(index); // show post function
          isBig = true;
        });

      }, 50);


    } else {
      // this stuff happens at the breakpoint/smaller screens

      itemContent.css({
        'opacity': '0'
      });
      showPost(index);
      isBig = true;
    }
    return false;
  };

  var zoomout = function() {
    // reset grid back to normal/hide post
    if (isBig) {
      post.addClass('post--hide');
      post.removeClass('post--active');
      post.on('transitionend', function() {
        grid.css({
          'transform': 'scale(1)'
        });
        itemContent.css({
          'opacity': '1'
        });
        $('body').removeAttr('style');
        post.off('transitionend');
      });

      isBig = false;
    }
    return false;
  };

  var showPost = function(index) {
    post.eq(index).removeClass('post--hide').addClass('post--active');
  };

  var nextPost = function() {
    var cur = $('.post--active');
    var next = cur.next('.post');
    if (!next.length) {
      next = post.first();
    }
    cur.addClass('post--hide').removeClass('post--active');
    next.removeClass('post--hide').addClass('post--active');
    return false;
  };

  var bindActions = function() {
    item.on('click', zoom);
    backBtn.on('click', zoomout);
    nextBtn.on('click', nextPost);
  };

  var init = function() {
    bindActions();
  };

  return {
    init: init
  };

}());

ZoomGrid.init();


var app = angular.module('app', []);

// convert html to trusted html.
// app.filter('to_trusted', ['$sce', function($sce){
// 	return function(text) {
// 		return $sce.trustAsHtml(text);
// 	};
// }]);
// app.controller( 'AppCtrl', ['$scope', '$http', function( $scope, $http ) {
//
// 	// Load posts from the WordPress API
// 	$http({
// 		cache: true,
// 		method: 'GET',
// 		url: 'http://wordpress-6754-14935-55771.cloudwaysapps.com/wp-json/wp/v2/posts',
// 		params: {
// 		 	'filter[posts_per_page]' : 9,
//       'filter[orderby]' : 'rand'
// 		},
// 	}).
// 	success( function( data, status, headers, config ) {
// 		$scope.posts = data;
// 	});
// }]);
//
var app = angular.module('app', []);

// convert html to trusted html.
app.filter('to_trusted', ['$sce', function($sce){
	return function(text) {
		return $sce.trustAsHtml(text);
	};
}]);

// Add a controller
app.controller( 'AppCtrl', ['$scope', '$http', function( $scope, $http ) {

	// Load posts from the WordPress API
	$http({
		cache: true,
		method: 'GET',
		//url: 'http://placeofchange.dev/wp-json/wp/v2/posts',
    url: 'http://wordpress-6754-14935-55771.cloudwaysapps.com/wp-json/wp/v2/posts',
		params: {
			'filter[posts_per_page]' : 10
		},
	}).
	success( function( data, status, headers, config ) {
		$scope.posts = data;
	});
}]);


//
// var app = angular.module('app', []);
//
// // convert html to trusted html.
// app.filter('to_trusted', ['$sce', function($sce){
// 	return function(text) {
// 		return $sce.trustAsHtml(text);
// 	};
// }]);
//
// // Add a controller
// app.controller( 'AppCtrl', ['$scope', '$http', function( $scope, $http ) {
//
// 	// Load posts from the WordPress API
// 	$http({
// 		cache: true,
// 		method: 'GET',
// 		url: 'http://wordpress-6754-14935-55771.cloudwaysapps.com/wp-json/wp/v2/posts',
// 		params: {
// 			'filter[posts_per_page]' : 21
// 		},
// 	}).
// 	success( function( data, status, headers, config ) {
// 		$scope.posts = data;
// 	});
// }]);


//
// var app = angular.module('app', []);
//
// // convert html to trusted html.
// app.filter('to_trusted', ['$sce', function($sce) {
//   return function(text) {
//     return $sce.trustAsHtml(text);
//   };
// }]);
//
// // Add a controller
// app.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
//
//   // Load posts from the WordPress API
//   $http({
//     cache: true,
//     method: 'GET',
//     url: 'http://wordpress-6754-14935-55771.cloudwaysapps.com/wp-json/wp/v2/posts',
//     params: {
//       'filter[posts_per_page]': 9
//     },
//   }).
//   success(function(data, status, headers, config) {
//     $scope.posts = data;
//   });
// }]);

$(function() {
  $("body").on('click', '.selector', function() {
    $(this).zoomTarget();
  });
});



/** ********************************************
 +
 +  LET'S GET THIS FUCKING SCROLL ON, BITCHES!
 +
** *********************************************/

if ($('#scene').length > 0) {
  kickoff_zoom();
}

if ($('#tilt').length > 0) {
  kickoff_tilt();
}


function kickoff_zoom() {
/**
 |
 |  BIG ASS CIRCLE ZOOM AND SPIN
**/
  var scrollMagicController = new ScrollMagic.Controller();
  var tween = new TimelineMax();

  var object1 = '#animation';
    tween.set(object1, {autoAlpha: 0})
    .to(object1, 1, {rotation: "360", scale: 5, autoAlpha: 1})
    .to(object1, 2, {rotation: "720", scale: 3, autoAlpha: 0})
    .set(object1, {autoAlpha: 0})

  // Create the Scene and trigger when visible
  var scene = new ScrollMagic.Scene({
      offset: $('#scene').offset().top +320,
      duration: 900
    })
    .setPin('#scene')
    .setTween(tween)
    .addTo(scrollMagicController);

  // Add debug indicators fixed on right side
  scene.addIndicators();
}




function kickoff_tilt() {
/**
 |
 |  CARD STACK EXPANDING
**/
  var controllerTwo = new ScrollMagic.Controller();

  //tilt
  scene  = new ScrollMagic.Scene({
      offset: $('#tilt').offset().top - 320,
      duration: 320
    })
    .setPin('#tilt')
    .addTo(controllerTwo);

  //1
  blockTween = new TweenMax.to('#tilt1', 1.5, {
    css: {
      transform: 'rotateY(45deg) translateZ(-100px) perspective(600px)',
      boxShadow: '1px 0 5px rgba(100, 100, 100, 0.6)'
    }
  });

  scene = new ScrollMagic.Scene({
      offset: $('#tilt').offset().top - 320,
      duration: 320
    })
    .setTween(blockTween)
    .addTo(controllerTwo);

  //2
  blockTween = new TweenMax.to('#tilt2', 1.5, {
    css: {
      transform: 'rotateY(45deg) perspective(600px)',
      boxShadow: '1px 0 5px rgba(100, 100, 100, 0.6)'
    }
  });

  scene = new ScrollMagic.Scene({
      offset: $('#tilt').offset().top - 320,
      duration: 320
    })
    .setTween(blockTween)
    .addTo(controllerTwo);

  //3
  blockTween = new TweenMax.to('#tilt3', 1.5, {
    css: {
      transform: 'rotateY(45deg) translateZ(100px) perspective(600px)',
      boxShadow: '1px 0 5px rgba(100, 100, 100, 0.6)'
    }
  });

  scene = new ScrollMagic.Scene({
      offset: $('#tilt').offset().top - 320,
      duration: 320
    })
    .setTween(blockTween)
    .addTo(controllerTwo);
}
