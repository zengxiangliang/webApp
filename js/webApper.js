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
				return 'webkit'; break;
				case !!testCss.MozTransition:
				return 'Moz'; break;
				case !!testCss.msTransition:
				return 'ms'; break;
				case !!testCss.OTransition:
				return 'O'; break;
				default:
				return '';
			}
		}(document.createElement('webApper').style)
	};

}(window));

function webApper(options) {

	if (!browser.addEventListener ||
		!options.contentId ) return;

	var noop = function() {}; 
	var offloadFn = function(fn) { setTimeout(fn || noop, 0) }; 

	var content = document.getElementById(options.contentId),
		navContral = document.getElementById(options.navContralId),
		screen = document.getElementById(options.screenId),
		sliderBar = document.getElementById(options.sliderBarId),
		scroll = content.children[0],
		navWidth;


	var setup = function(){

	if (!browser.screen) _setup();
	var tmpWidth = options.sliderBarWidth.indexOf('x') === -1 ? 
				   browser.screen.width * parseInt(options.sliderBarWidth) / 100 :
				   parseInt(options.sliderBarWidth);
	content.style.height = browser.screen.height - 
						  content.nextSibling.nextSibling.offsetHeight -
						  content.previousSibling.previousSibling.offsetHeight +
						  'px';

	if (sliderBar && tmpWidth) {
		sliderBar.style.width = tmpWidth + 'px';
		navWidth = ~~tmpWidth;
	}
	max = content.offsetHeight - scroll.offsetHeight;
	}

	function _setup() {

		browser.screen.width = document.documentElement.clientWidth;
		browser.screen.height = document.documentElement.clientHeight;
		setup();

	}

	var Core = browser.cssCore;

	function setDuration(obj, speed) {

		var style = obj && obj.style;
		if (!style) return;

		if (Core === 'webkit') {
			style.webkitTransitionDuration = speed + 'ms';
			return;
		}

		style.transitionDuration=
    	style.MozTransitionDuration =
    	style.msTransitionDuration =
    	style.OTransitionDuration = speed + 'ms';

	}

	function translate(obj, distx, disty) {

		var style = obj && obj.style;
		if (!style) return;

		switch (Core) {
			case 'webkit':
			style.webkitTransform = 'translate(' + distx + 'px,' + disty + 'px)' +
									'translateZ(0)';
			break;
			case 'Moz':
			style.MozTransform = 'translate(' + distx +'px,' + disty + 'px)';
			break;
			case 'ms':
			style.msTransform = 'translate(' + distx +'px,' + disty + 'px)';
			break;
			case 'O':
			style.OTransform = 'translate(' + distx +'px,' + disty + 'px)';
			break;
			default:
			style.trannform = 'translate(' + distx +'px,' + disty + 'px)';
			break;
		}
		
	}

	var start = {},
		delta = {},
		position = 0,
		tmp = 0,
		max,
		navVisiable = 0;
		events = {

		handleEvent: function(event) {
			
			if (event.type ==='resize') {
				offloadFn(_setup);
				return;} 
			if (event.target.id === options.navContralId) {
				this.nav(event);
				return;
			}

			if (event.target.tagName.toLowerCase() ==='body') {
				// do something
				event.preventDefault();

				return;
			}
     		switch (event.type) {
       		case 'touchstart': this.start(event); break;
        	case 'touchmove': this.move(event); break;
        	case 'touchend': offloadFn(this.end(event)); break;
        	case 'webkitTransitionEnd':
        	case 'msTransitionEnd':
        	case 'oTransitionEnd':
        	case 'otransitionend':
        	case 'transitionend': offloadFn(this.transitionEnd(event)); break;
      		}

    	},

    	start: function(event) {
            
    		event.preventDefault();
    		var touches = event.touches[0],
    			t;
    		start = {
    			x : touches.pageX,
    			y : touches.pageY,
    			time : +new Date
    		}
    		if (navVisiable = 1) {
    			translate(screen , 0, 0)
    			navVisiable = 0
    		};
    		setDuration(scroll,0);
    		delta = {};

    		t = scroll.style.webkitTransform
    			|| scroll.style.MozTransform
    			|| scroll.style.msTransform
    			|| scroll.style.OTransform
    			|| scroll.style.transform
            	|| '0,0';    // 啊~我卖了个萌

    		//not Very good solution
    		position = parseInt(t.substring(t.indexOf(',') + 1)) || 0; 


    		scroll.addEventListener('touchmove', events, false);
    		scroll.addEventListener('touchend', events, false);

    	},

    	move: function(event) {

			
    		if( event.touches.length > 1 ||
    			event.scale & event.scale !== 1) return;

    		  //stop scroll
    		var touches = event.touches[0];
    		delta = {
    			x : touches.pageX - start.x,
    			y : touches.pageY - start.y
    		}

    		tmp = position + delta.y;

    		tmp = tmp > 0 || tmp < max ? tmp > 0 ? tmp / 3 
    			: max + (tmp - max) / 3 : tmp;   //fix tmp if outof bounding

    		tmp = tmp >> 0;
    		translate(scroll, 0, tmp);
    	},

    	end: function(event){

    		if(!delta.y) return;

    		var duration =  +new Date - start.time;

    		position = tmp > 0 || tmp < max ? tmp > 0 ? 0
            : max : Math.abs(delta.y / duration) < 0.75 ? tmp : tmp + delta.y / duration * 280 ;  // 220滚动系数

    		position = position >> 0;
    		setDuration(scroll,300);
    		translate(scroll, 0, position);

    		if (position > 0 || position < max){
    			if (position > 0) {
    				position = 0;
    			} else {
    				position = max;
    			}
    			translate(scroll, 0, position);
    		}
    	},
    	nav: function(event) {
            
    		event.stopPropagation();
    		if (navVisiable) {
    			translate(screen, 0, 0);
    			navVisiable = 0;
    		} else {
    			translate(screen, navWidth, 0);
    			navVisiable = 1;
    		}
            
    	}

	}

	setup();
	setDuration(screen, 500);

	window.addEventListener('resize', events, false);
	document.body.addEventListener('touchstart', events, false);

	if (navContral) {
		if(browser.touch) {
			navContral.addEventListener('touchstart', events, false);
		}else{
			navContral.addEventListener('click', events, false);
		}
	}
}