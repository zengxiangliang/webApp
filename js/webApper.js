/*
timWang@qqdyw.net
Github:https://github.com/powy1993/
*/


(function(window) {


	"use strict";


	window.browser = {

		addEventListener : window.addEventListener,
		touch : ('ontouchstart' in window) || 
				window.DocumentTouch && document instanceof DocumentTouch,

		versionAndroid: function() {

			var u = navigator.userAgent,
				matchVersion = u.indexOf('Android'),
				num;

			if (matchVersion !== -1) {
				num = u.substring(matchVersion + 7, matchVersion + 11).replace(' ', '');
			}
			return num || 0;     //0: not Android device
		}(),

		screen: function(e) {

			return {
				width : e.clientWidth,
				height : e.clientHeight
			}
		}(document.documentElement),

		cssCore: function(testCss) {
			
			testCss.cssText = '-webkit-transition:all .1s; -moz-transition:all .1s; -o-transition:all .1s; -ms-transition:all .1s; transition:all .1s;';

			switch (true) {
				case !!testCss.webkitTransition:
				return '-webkit-'; break;
				case !!testCss.mozTransition:
				return '-moz-'; break;
				case !!testCss.msTransition:
				return '-ms-'; break;
				case !!testCss.oTransition:
				return '-o-'; break;
				default:
				return '';
			}
		}(document.createElement('webApper').style)
	};

}(window));

function webApper(options) {

	if (!browser.addEventListener ||
		!browser.touch  || 
		!options.contentId ) return;

	var noop = function() {}; 
	var offloadFn = function(fn) { setTimeout(fn || noop, 0) }; 

	var scroll = document.getElementById(options.contentId);


	var setup = function(){

	scroll.style.height = browser.screen.height - 
						  scroll.nextSibling.nextSibling.offsetHeight -
						  scroll.previousSibling.previousSibling.offsetHeight +
						  'px';
	}

	var events = {

		handleEvent: function(event) {

     		switch (event.type) {
       		case 'touchstart': this.start(event); break;
        	case 'touchmove': this.move(event); break;
        	case 'touchend': offloadFn(this.end(event)); break;
        	case 'webkitTransitionEnd':
        	case 'msTransitionEnd':
        	case 'oTransitionEnd':
        	case 'otransitionend':
        	case 'transitionend': offloadFn(this.transitionEnd(event)); break;
        	case 'resize': offloadFn(setup); break;
      		}
    	},

    	start: function(event) {
    		alert(1);
    	}

	}

	setup();

	window.addEventListener('resize', setup, false);
	scroll.children[0].addEventListener('touchstart', events, false);
}