/*! jQuery UI - v1.9.2 - 2014-09-13
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.sortable.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.menu.js, jquery.ui.progressbar.js, jquery.ui.slider.js, jquery.ui.spinner.js, jquery.ui.tabs.js, jquery.ui.tooltip.js, jquery.ui.effect.js, jquery.ui.effect-blind.js, jquery.ui.effect-bounce.js, jquery.ui.effect-clip.js, jquery.ui.effect-drop.js, jquery.ui.effect-explode.js, jquery.ui.effect-fade.js, jquery.ui.effect-fold.js, jquery.ui.effect-highlight.js, jquery.ui.effect-pulsate.js, jquery.ui.effect-scale.js, jquery.ui.effect-shake.js, jquery.ui.effect-slide.js, jquery.ui.effect-transfer.js
* Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */

(function( $, undefined ) {

var uuid = 0,
	runiqueId = /^ui-id-\d+$/;

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.ui = $.ui || {};
if ( $.ui.version ) {
	return;
}

$.extend( $.ui, {
	version: "1.9.2",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	_focus: $.fn.focus,
	focus: function( delay, fn ) {
		return typeof delay === "number" ?
			this.each(function() {
				var elem = this;
				setTimeout(function() {
					$( elem ).focus();
					if ( fn ) {
						fn.call( elem );
					}
				}, delay );
			}) :
			this._focus.apply( this, arguments );
	},

	scrollParent: function() {
		var scrollParent;
		if (($.ui.ie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.css(this,'position')) && (/(auto|scroll)/).test($.css(this,'overflow')+$.css(this,'overflow-y')+$.css(this,'overflow-x'));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,'overflow')+$.css(this,'overflow-y')+$.css(this,'overflow-x'));
			}).eq(0);
		}

		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	uniqueId: function() {
		return this.each(function() {
			if ( !this.id ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().andSelf().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support
$(function() {
	var body = document.body,
		div = body.appendChild( div = document.createElement( "div" ) );

	// access offsetHeight before setting the style to prevent a layout bug
	// in IE 9 which causes the element to continue to take up space even
	// after it is removed from the DOM (#8026)
	div.offsetHeight;

	$.extend( div.style, {
		minHeight: "100px",
		height: "auto",
		padding: 0,
		borderWidth: 0
	});

	$.support.minHeight = div.offsetHeight === 100;
	$.support.selectstart = "onselectstart" in div;

	// set display to none to avoid a layout bug in IE
	// http://dev.jquery.com/ticket/4014
	body.removeChild( div ).style.display = "none";
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}





// deprecated

(function() {
	var uaMatch = /msie ([\w.]+)/.exec( navigator.userAgent.toLowerCase() ) || [];
	$.ui.ie = uaMatch.length ? true : false;
	$.ui.ie6 = parseFloat( uaMatch[ 1 ], 10 ) === 6;
})();

$.fn.extend({
	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.extend( $.ui, {
	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
	plugin: {
		add: function( module, option, set ) {
			var i,
				proto = $.ui[ module ].prototype;
			for ( i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var i,
				set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},

	contains: $.contains,

	// only used by resizable
	hasScroll: function( el, a ) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	},

	// these are odd functions, fix the API or move into individual plugins
	isOverAxis: function( x, reference, size ) {
		//Determines when x coordinate is over "b" element axis
		return ( x > reference ) && ( x < ( reference + size ) );
	},
	isOver: function( y, x, top, left, height, width ) {
		//Determines when x, y coordinates is over "b" element
		return $.ui.isOverAxis( y, top, height ) && $.ui.isOverAxis( x, left, width );
	}
});

})( jQuery );
(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( $.isFunction( value ) ) {
			prototype[ prop ] = (function() {
				var _super = function() {
						return base.prototype[ prop ].apply( this, arguments );
					},
					_superApply = function( args ) {
						return base.prototype[ prop ].apply( this, args );
					};
				return function() {
					var __super = this._super,
						__superApply = this._superApply,
						returnValue;

					this._super = _super;
					this._superApply = _superApply;

					returnValue = value.apply( this, arguments );

					this._super = __super;
					this._superApply = __superApply;

					return returnValue;
				};
			})();
		}
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
	}, prototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		// TODO remove widgetBaseClass, see #8155
		widgetBaseClass: fullName,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			// 1.9 BC for #7810
			// TODO remove dual storage
			$.data( element, this.widgetName, this );
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData( this.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( value === undefined ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( value === undefined ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && ( $.effects.effect[ effectName ] || $.uiBackCompat !== false && $.effects[ effectName ] ) ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

// DEPRECATED
if ( $.uiBackCompat !== false ) {
	$.Widget.prototype._getCreateOptions = function() {
		return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
	};
}

})( jQuery );
(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function( e ) {
	mouseHandled = false;
});

$.widget("ui.mouse", {
	version: "1.9.2",
	options: {
		cancel: 'input,textarea,button,select,option',
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind('mousedown.'+this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind('click.'+this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + '.preventClickEvent')) {
					$.removeData(event.target, that.widgetName + '.preventClickEvent');
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind('.'+this.widgetName);
		if ( this._mouseMoveDelegate ) {
			$(document)
				.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
				.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if( mouseHandled ) { return; }

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
			$.removeData(event.target, this.widgetName + '.preventClickEvent');
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};
		$(document)
			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.ui.ie && !(document.documentMode >= 9) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + '.preventClickEvent', true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(event) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(event) {},
	_mouseDrag: function(event) {},
	_mouseStop: function(event) {},
	_mouseCapture: function(event) { return true; }
});

})(jQuery);
(function( $, undefined ) {

$.ui = $.ui || {};

var cachedScrollbarWidth,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseInt( offsets[ 0 ], 10 ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseInt( offsets[ 1 ], 10 ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}
function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow ? "" : within.element.css( "overflow-x" ),
			overflowY = within.isWindow ? "" : within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowX ? $.position.scrollbarWidth() : 0,
			height: hasOverflowY ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] );
		return {
			element: withinElement,
			isWindow: isWindow,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),
			width: isWindow ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		targetElem = target[0],
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	if ( targetElem.nodeType === 9 ) {
		targetWidth = target.width();
		targetHeight = target.height();
		targetOffset = { top: 0, left: 0 };
	} else if ( $.isWindow( targetElem ) ) {
		targetWidth = target.width();
		targetHeight = target.height();
		targetOffset = { top: target.scrollTop(), left: target.scrollLeft() };
	} else if ( targetElem.preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
		targetWidth = targetHeight = 0;
		targetOffset = { top: targetElem.pageY, left: targetElem.pageX };
	} else {
		targetWidth = target.outerWidth();
		targetHeight = target.outerHeight();
		targetOffset = target.offset();
	}
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !$.support.offsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem : elem
				});
			}
		});

		if ( $.fn.bgiframe ) {
			elem.bgiframe();
		}

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			}
			else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
			else if ( overBottom > 0 ) {
				newOverTop = position.top -  data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function () {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	$.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

// DEPRECATED
if ( $.uiBackCompat !== false ) {
	// offset option
	(function( $ ) {
		var _position = $.fn.position;
		$.fn.position = function( options ) {
			if ( !options || !options.offset ) {
				return _position.call( this, options );
			}
			var offset = options.offset.split( " " ),
				at = options.at.split( " " );
			if ( offset.length === 1 ) {
				offset[ 1 ] = offset[ 0 ];
			}
			if ( /^\d/.test( offset[ 0 ] ) ) {
				offset[ 0 ] = "+" + offset[ 0 ];
			}
			if ( /^\d/.test( offset[ 1 ] ) ) {
				offset[ 1 ] = "+" + offset[ 1 ];
			}
			if ( at.length === 1 ) {
				if ( /left|center|right/.test( at[ 0 ] ) ) {
					at[ 1 ] = "center";
				} else {
					at[ 1 ] = at[ 0 ];
					at[ 0 ] = "center";
				}
			}
			return _position.call( this, $.extend( options, {
				at: at[ 0 ] + offset[ 0 ] + " " + at[ 1 ] + offset[ 1 ],
				offset: undefined
			} ) );
		};
	}( jQuery ) );
}

}( jQuery ) );
(function( $, undefined ) {

$.widget("ui.draggable", $.ui.mouse, {
	version: "1.9.2",
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false
	},
	_create: function() {

		if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
			this.element[0].style.position = 'relative';

		(this.options.addClasses && this.element.addClass("ui-draggable"));
		(this.options.disabled && this.element.addClass("ui-draggable-disabled"));

		this._mouseInit();

	},

	_destroy: function() {
		this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
		this._mouseDestroy();
	},

	_mouseCapture: function(event) {

		var o = this.options;

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
			return false;

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle)
			return false;

		$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
			$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
			.css({
				width: this.offsetWidth+"px", height: this.offsetHeight+"px",
				position: "absolute", opacity: "0.001", zIndex: 1000
			})
			.css($(this).offset())
			.appendTo("body");
		});

		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		this.helper.addClass("ui-draggable-dragging");

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css("position");
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.positionAbs = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Set a containment if given in the options
		if(o.containment)
			this._setContainment();

		//Trigger event + callbacks
		if(this._trigger("start", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);


		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

		//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
		if ( $.ui.ddmanager ) $.ui.ddmanager.dragStart(this, event);

		return true;
	},

	_mouseDrag: function(event, noPropagation) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if(this._trigger('drag', event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			dropped = $.ui.ddmanager.drop(this, event);

		//if a drop comes from outside (a sortable)
		if(this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}

		//if the original element is no longer in the DOM don't bother to continue (see #8269)
		var element = this.element[0], elementInDom = false;
		while ( element && (element = element.parentNode) ) {
			if (element == document ) {
				elementInDom = true;
			}
		}
		if ( !elementInDom && this.options.helper === "original" )
			return false;

		if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			var that = this;
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				if(that._trigger("stop", event) !== false) {
					that._clear();
				}
			});
		} else {
			if(this._trigger("stop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},

	_mouseUp: function(event) {
		//Remove frame helpers
		$("div.ui-draggable-iframeFix").each(function() {
			this.parentNode.removeChild(this);
		});

		//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
		if( $.ui.ddmanager ) $.ui.ddmanager.dragStop(this, event);

		return $.ui.mouse.prototype._mouseUp.call(this, event);
	},

	cancel: function() {

		if(this.helper.is(".ui-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}

		return this;

	},

	_getHandle: function(event) {

		var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
		$(this.options.handle, this.element)
			.find("*")
			.andSelf()
			.each(function() {
				if(this == event.target) handle = true;
			});

		return handle;

	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone().removeAttr('id') : this.element);

		if(!helper.parents('body').length)
			helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));

		if(helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
			helper.css("position", "absolute");

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj == 'string') {
			obj = obj.split(' ');
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ('left' in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ('right' in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ('top' in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ('bottom' in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.ui.ie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.element.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"),10) || 0),
			top: (parseInt(this.element.css("marginTop"),10) || 0),
			right: (parseInt(this.element.css("marginRight"),10) || 0),
			bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			o.containment == 'document' ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
			o.containment == 'document' ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top,
			(o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			(o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
			var c = $(o.containment);
			var ce = c[0]; if(!ce) return;
			var co = c.offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				(parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0),
				(parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0),
				(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right,
				(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top  - this.margins.bottom
			];
			this.relative_container = c;

		} else if(o.containment.constructor == Array) {
			this.containment = o.containment;
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options
			var containment;
			if(this.containment) {
			if (this.relative_container){
				var co = this.relative_container.offset();
				containment = [ this.containment[0] + co.left,
					this.containment[1] + co.top,
					this.containment[2] + co.left,
					this.containment[3] + co.top ];
			}
			else {
				containment = this.containment;
			}

				if(event.pageX - this.offset.click.left < containment[0]) pageX = containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < containment[1]) pageY = containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > containment[2]) pageX = containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > containment[3]) pageY = containment[3] + this.offset.click.top;
			}

			if(o.grid) {
				//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
				var top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
				pageY = containment ? (!(top - this.offset.click.top < containment[1] || top - this.offset.click.top > containment[3]) ? top : (!(top - this.offset.click.top < containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
				pageX = containment ? (!(left - this.offset.click.left < containment[0] || left - this.offset.click.left > containment[2]) ? left : (!(left - this.offset.click.left < containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("ui-draggable-dragging");
		if(this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
		//if($.ui.ddmanager) $.ui.ddmanager.current = null;
		this.helper = null;
		this.cancelHelperRemoval = false;
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function(type, event, ui) {
		ui = ui || this._uiHash();
		$.ui.plugin.call(this, type, [event, ui]);
		if(type == "drag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
		return $.Widget.prototype._trigger.call(this, type, event, ui);
	},

	plugins: {},

	_uiHash: function(event) {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.ui.plugin.add("draggable", "connectToSortable", {
	start: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options,
			uiSortable = $.extend({}, ui, { item: inst.element });
		inst.sortables = [];
		$(o.connectToSortable).each(function() {
			var sortable = $.data(this, 'sortable');
			if (sortable && !sortable.options.disabled) {
				inst.sortables.push({
					instance: sortable,
					shouldRevert: sortable.options.revert
				});
				sortable.refreshPositions();	// Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
				sortable._trigger("activate", event, uiSortable);
			}
		});

	},
	stop: function(event, ui) {

		//If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
		var inst = $(this).data("draggable"),
			uiSortable = $.extend({}, ui, { item: inst.element });

		$.each(inst.sortables, function() {
			if(this.instance.isOver) {

				this.instance.isOver = 0;

				inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
				this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

				//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
				if(this.shouldRevert) this.instance.options.revert = true;

				//Trigger the stop of the sortable
				this.instance._mouseStop(event);

				this.instance.options.helper = this.instance.options._helper;

				//If the helper has been the original item, restore properties in the sortable
				if(inst.options.helper == 'original')
					this.instance.currentItem.css({ top: 'auto', left: 'auto' });

			} else {
				this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
				this.instance._trigger("deactivate", event, uiSortable);
			}

		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), that = this;

		var checkPos = function(o) {
			var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
			var helperTop = this.positionAbs.top, helperLeft = this.positionAbs.left;
			var itemHeight = o.height, itemWidth = o.width;
			var itemTop = o.top, itemLeft = o.left;

			return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
		};

		$.each(inst.sortables, function(i) {

			var innermostIntersecting = false;
			var thisSortable = this;
			//Copy over some variables to allow calling the sortable's native _intersectsWith
			this.instance.positionAbs = inst.positionAbs;
			this.instance.helperProportions = inst.helperProportions;
			this.instance.offset.click = inst.offset.click;

			if(this.instance._intersectsWith(this.instance.containerCache)) {
				innermostIntersecting = true;
				$.each(inst.sortables, function () {
					this.instance.positionAbs = inst.positionAbs;
					this.instance.helperProportions = inst.helperProportions;
					this.instance.offset.click = inst.offset.click;
					if  (this != thisSortable
						&& this.instance._intersectsWith(this.instance.containerCache)
						&& $.ui.contains(thisSortable.instance.element[0], this.instance.element[0]))
						innermostIntersecting = false;
						return innermostIntersecting;
				});
			}


			if(innermostIntersecting) {
				//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
				if(!this.instance.isOver) {

					this.instance.isOver = 1;
					//Now we fake the start of dragging for the sortable instance,
					//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
					//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
					this.instance.currentItem = $(that).clone().removeAttr('id').appendTo(this.instance.element).data("sortable-item", true);
					this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
					this.instance.options.helper = function() { return ui.helper[0]; };

					event.target = this.instance.currentItem[0];
					this.instance._mouseCapture(event, true);
					this.instance._mouseStart(event, true, true);

					//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
					this.instance.offset.click.top = inst.offset.click.top;
					this.instance.offset.click.left = inst.offset.click.left;
					this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
					this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

					inst._trigger("toSortable", event);
					inst.dropped = this.instance.element; //draggable revert needs that
					//hack so receive/update callbacks work (mostly)
					inst.currentItem = inst.element;
					this.instance.fromOutside = inst;

				}

				//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
				if(this.instance.currentItem) this.instance._mouseDrag(event);

			} else {

				//If it doesn't intersect with the sortable, and it intersected before,
				//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
				if(this.instance.isOver) {

					this.instance.isOver = 0;
					this.instance.cancelHelperRemoval = true;

					//Prevent reverting on this forced stop
					this.instance.options.revert = false;

					// The out event needs to be triggered independently
					this.instance._trigger('out', event, this.instance._uiHash(this.instance));

					this.instance._mouseStop(event, true);
					this.instance.options.helper = this.instance.options._helper;

					//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
					this.instance.currentItem.remove();
					if(this.instance.placeholder) this.instance.placeholder.remove();

					inst._trigger("fromSortable", event);
					inst.dropped = false; //draggable revert needs that
				}

			};

		});

	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function(event, ui) {
		var t = $('body'), o = $(this).data('draggable').options;
		if (t.css("cursor")) o._cursor = t.css("cursor");
		t.css("cursor", o.cursor);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if (o._cursor) $('body').css("cursor", o._cursor);
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data('draggable').options;
		if(t.css("opacity")) o._opacity = t.css("opacity");
		t.css('opacity', o.opacity);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if(o._opacity) $(ui.helper).css('opacity', o._opacity);
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function(event, ui) {
		var i = $(this).data("draggable");
		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
	},
	drag: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options, scrolled = false;

		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

			if(!o.axis || o.axis != 'x') {
				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
				else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
			}

			if(!o.axis || o.axis != 'y') {
				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
				else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
			}

		} else {

			if(!o.axis || o.axis != 'x') {
				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
			}

			if(!o.axis || o.axis != 'y') {
				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
			}

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(i, event);

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options;
		i.snapElements = [];

		$(o.snap.constructor != String ? ( o.snap.items || ':data(draggable)' ) : o.snap).each(function() {
			var $t = $(this); var $o = $t.offset();
			if(this != i.element[0]) i.snapElements.push({
				item: this,
				width: $t.outerWidth(), height: $t.outerHeight(),
				top: $o.top, left: $o.left
			});
		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options;
		var d = o.snapTolerance;

		var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (var i = inst.snapElements.length - 1; i >= 0; i--){

			var l = inst.snapElements[i].left, r = l + inst.snapElements[i].width,
				t = inst.snapElements[i].top, b = t + inst.snapElements[i].height;

			//Yes, I know, this is insane ;)
			if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
				if(inst.snapElements[i].snapping) (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				inst.snapElements[i].snapping = false;
				continue;
			}

			if(o.snapMode != 'inner') {
				var ts = Math.abs(t - y2) <= d;
				var bs = Math.abs(b - y1) <= d;
				var ls = Math.abs(l - x2) <= d;
				var rs = Math.abs(r - x1) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
			}

			var first = (ts || bs || ls || rs);

			if(o.snapMode != 'outer') {
				var ts = Math.abs(t - y1) <= d;
				var bs = Math.abs(b - y2) <= d;
				var ls = Math.abs(l - x1) <= d;
				var rs = Math.abs(r - x2) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
			}

			if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		};

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function(event, ui) {

		var o = $(this).data("draggable").options;

		var group = $.makeArray($(o.stack)).sort(function(a,b) {
			return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
		});
		if (!group.length) { return; }

		var min = parseInt(group[0].style.zIndex) || 0;
		$(group).each(function(i) {
			this.style.zIndex = min + i;
		});

		this[0].style.zIndex = min + group.length;

	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("draggable").options;
		if(t.css("zIndex")) o._zIndex = t.css("zIndex");
		t.css('zIndex', o.zIndex);
	},
	stop: function(event, ui) {
		var o = $(this).data("draggable").options;
		if(o._zIndex) $(ui.helper).css('zIndex', o._zIndex);
	}
});

})(jQuery);
(function( $, undefined ) {

$.widget("ui.droppable", {
	version: "1.9.2",
	widgetEventPrefix: "drop",
	options: {
		accept: '*',
		activeClass: false,
		addClasses: true,
		greedy: false,
		hoverClass: false,
		scope: 'default',
		tolerance: 'intersect'
	},
	_create: function() {

		var o = this.options, accept = o.accept;
		this.isover = 0; this.isout = 1;

		this.accept = $.isFunction(accept) ? accept : function(d) {
			return d.is(accept);
		};

		//Store the droppable's proportions
		this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };

		// Add the reference and positions to the manager
		$.ui.ddmanager.droppables[o.scope] = $.ui.ddmanager.droppables[o.scope] || [];
		$.ui.ddmanager.droppables[o.scope].push(this);

		(o.addClasses && this.element.addClass("ui-droppable"));

	},

	_destroy: function() {
		var drop = $.ui.ddmanager.droppables[this.options.scope];
		for ( var i = 0; i < drop.length; i++ )
			if ( drop[i] == this )
				drop.splice(i, 1);

		this.element.removeClass("ui-droppable ui-droppable-disabled");
	},

	_setOption: function(key, value) {

		if(key == 'accept') {
			this.accept = $.isFunction(value) ? value : function(d) {
				return d.is(value);
			};
		}
		$.Widget.prototype._setOption.apply(this, arguments);
	},

	_activate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) this.element.addClass(this.options.activeClass);
		(draggable && this._trigger('activate', event, this.ui(draggable)));
	},

	_deactivate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
		(draggable && this._trigger('deactivate', event, this.ui(draggable)));
	},

	_over: function(event) {

		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) this.element.addClass(this.options.hoverClass);
			this._trigger('over', event, this.ui(draggable));
		}

	},

	_out: function(event) {

		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
			this._trigger('out', event, this.ui(draggable));
		}

	},

	_drop: function(event,custom) {

		var draggable = custom || $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return false; // Bail if draggable and droppable are same element

		var childrenIntersection = false;
		this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function() {
			var inst = $.data(this, 'droppable');
			if(
				inst.options.greedy
				&& !inst.options.disabled
				&& inst.options.scope == draggable.options.scope
				&& inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element))
				&& $.ui.intersect(draggable, $.extend(inst, { offset: inst.element.offset() }), inst.options.tolerance)
			) { childrenIntersection = true; return false; }
		});
		if(childrenIntersection) return false;

		if(this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
			this._trigger('drop', event, this.ui(draggable));
			return this.element;
		}

		return false;

	},

	ui: function(c) {
		return {
			draggable: (c.currentItem || c.element),
			helper: c.helper,
			position: c.position,
			offset: c.positionAbs
		};
	}

});

$.ui.intersect = function(draggable, droppable, toleranceMode) {

	if (!droppable.offset) return false;

	var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width,
		y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height;
	var l = droppable.offset.left, r = l + droppable.proportions.width,
		t = droppable.offset.top, b = t + droppable.proportions.height;

	switch (toleranceMode) {
		case 'fit':
			return (l <= x1 && x2 <= r
				&& t <= y1 && y2 <= b);
			break;
		case 'intersect':
			return (l < x1 + (draggable.helperProportions.width / 2) // Right Half
				&& x2 - (draggable.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (draggable.helperProportions.height / 2) // Bottom Half
				&& y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
			break;
		case 'pointer':
			var draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left),
				draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top),
				isOver = $.ui.isOver(draggableTop, draggableLeft, t, l, droppable.proportions.height, droppable.proportions.width);
			return isOver;
			break;
		case 'touch':
			return (
					(y1 >= t && y1 <= b) ||	// Top edge touching
					(y2 >= t && y2 <= b) ||	// Bottom edge touching
					(y1 < t && y2 > b)		// Surrounded vertically
				) && (
					(x1 >= l && x1 <= r) ||	// Left edge touching
					(x2 >= l && x2 <= r) ||	// Right edge touching
					(x1 < l && x2 > r)		// Surrounded horizontally
				);
			break;
		default:
			return false;
			break;
		}

};

/*
	This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: { 'default': [] },
	prepareOffsets: function(t, event) {

		var m = $.ui.ddmanager.droppables[t.options.scope] || [];
		var type = event ? event.type : null; // workaround for #2317
		var list = (t.currentItem || t.element).find(":data(droppable)").andSelf();

		droppablesLoop: for (var i = 0; i < m.length; i++) {

			if(m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0],(t.currentItem || t.element)))) continue;	//No disabled and non-accepted
			for (var j=0; j < list.length; j++) { if(list[j] == m[i].element[0]) { m[i].proportions.height = 0; continue droppablesLoop; } }; //Filter out elements in the current dragged item
			m[i].visible = m[i].element.css("display") != "none"; if(!m[i].visible) continue; 									//If the element is not visible, continue

			if(type == "mousedown") m[i]._activate.call(m[i], event); //Activate the droppable if used directly from draggables

			m[i].offset = m[i].element.offset();
			m[i].proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };

		}

	},
	drop: function(draggable, event) {

		var dropped = false;
		$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

			if(!this.options) return;
			if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance))
				dropped = this._drop.call(this, event) || dropped;

			if (!this.options.disabled && this.visible && this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
				this.isout = 1; this.isover = 0;
				this._deactivate.call(this, event);
			}

		});
		return dropped;

	},
	dragStart: function( draggable, event ) {
		//Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
		draggable.element.parentsUntil( "body" ).bind( "scroll.droppable", function() {
			if( !draggable.options.refreshPositions ) $.ui.ddmanager.prepareOffsets( draggable, event );
		});
	},
	drag: function(draggable, event) {

		//If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
		if(draggable.options.refreshPositions) $.ui.ddmanager.prepareOffsets(draggable, event);

		//Run through all droppables and check their positions based on specific tolerance options
		$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

			if(this.options.disabled || this.greedyChild || !this.visible) return;
			var intersects = $.ui.intersect(draggable, this, this.options.tolerance);

			var c = !intersects && this.isover == 1 ? 'isout' : (intersects && this.isover == 0 ? 'isover' : null);
			if(!c) return;

			var parentInstance;
			if (this.options.greedy) {
				// find droppable parents with same scope
				var scope = this.options.scope;
				var parent = this.element.parents(':data(droppable)').filter(function () {
					return $.data(this, 'droppable').options.scope === scope;
				});

				if (parent.length) {
					parentInstance = $.data(parent[0], 'droppable');
					parentInstance.greedyChild = (c == 'isover' ? 1 : 0);
				}
			}

			// we just moved into a greedy child
			if (parentInstance && c == 'isover') {
				parentInstance['isover'] = 0;
				parentInstance['isout'] = 1;
				parentInstance._out.call(parentInstance, event);
			}

			this[c] = 1; this[c == 'isout' ? 'isover' : 'isout'] = 0;
			this[c == "isover" ? "_over" : "_out"].call(this, event);

			// we just moved out of a greedy child
			if (parentInstance && c == 'isout') {
				parentInstance['isout'] = 0;
				parentInstance['isover'] = 1;
				parentInstance._over.call(parentInstance, event);
			}
		});

	},
	dragStop: function( draggable, event ) {
		draggable.element.parentsUntil( "body" ).unbind( "scroll.droppable" );
		//Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
		if( !draggable.options.refreshPositions ) $.ui.ddmanager.prepareOffsets( draggable, event );
	}
};

})(jQuery);
(function( $, undefined ) {

$.widget("ui.resizable", $.ui.mouse, {
	version: "1.9.2",
	widgetEventPrefix: "resize",
	options: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		zIndex: 1000
	},
	_create: function() {

		var that = this, o = this.options;
		this.element.addClass("ui-resizable");

		$.extend(this, {
			_aspectRatio: !!(o.aspectRatio),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || 'ui-resizable-helper' : null
		});

		//Wrap the element if it cannot hold child nodes
		if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {

			//Create a wrapper element and set the wrapper to the new current internal element
			this.element.wrap(
				$('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({
					position: this.element.css('position'),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css('top'),
					left: this.element.css('left')
				})
			);

			//Overwrite the original this.element
			this.element = this.element.parent().data(
				"resizable", this.element.data('resizable')
			);

			this.elementIsWrapper = true;

			//Move margins to the wrapper
			this.element.css({ marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom") });
			this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});

			//Prevent Safari textarea resize
			this.originalResizeStyle = this.originalElement.css('resize');
			this.originalElement.css('resize', 'none');

			//Push the actual element to our proportionallyResize internal array
			this._proportionallyResizeElements.push(this.originalElement.css({ position: 'static', zoom: 1, display: 'block' }));

			// avoid IE jump (hard set the margin)
			this.originalElement.css({ margin: this.originalElement.css('margin') });

			// fix handlers offset
			this._proportionallyResize();

		}

		this.handles = o.handles || (!$('.ui-resizable-handle', this.element).length ? "e,s,se" : { n: '.ui-resizable-n', e: '.ui-resizable-e', s: '.ui-resizable-s', w: '.ui-resizable-w', se: '.ui-resizable-se', sw: '.ui-resizable-sw', ne: '.ui-resizable-ne', nw: '.ui-resizable-nw' });
		if(this.handles.constructor == String) {

			if(this.handles == 'all') this.handles = 'n,e,s,w,se,sw,ne,nw';
			var n = this.handles.split(","); this.handles = {};

			for(var i = 0; i < n.length; i++) {

				var handle = $.trim(n[i]), hname = 'ui-resizable-'+handle;
				var axis = $('<div class="ui-resizable-handle ' + hname + '"></div>');

				// Apply zIndex to all handles - see #7960
				axis.css({ zIndex: o.zIndex });

				//TODO : What's going on here?
				if ('se' == handle) {
					axis.addClass('ui-icon ui-icon-gripsmall-diagonal-se');
				};

				//Insert into internal handles object and append to element
				this.handles[handle] = '.ui-resizable-'+handle;
				this.element.append(axis);
			}

		}

		this._renderAxis = function(target) {

			target = target || this.element;

			for(var i in this.handles) {

				if(this.handles[i].constructor == String)
					this.handles[i] = $(this.handles[i], this.element).show();

				//Apply pad to wrapper element, needed to fix axis position (textarea, inputs, scrolls)
				if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {

					var axis = $(this.handles[i], this.element), padWrapper = 0;

					//Checking the correct pad and border
					padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

					//The padding type i have to apply...
					var padPos = [ 'padding',
						/ne|nw|n/.test(i) ? 'Top' :
						/se|sw|s/.test(i) ? 'Bottom' :
						/^e$/.test(i) ? 'Right' : 'Left' ].join("");

					target.css(padPos, padWrapper);

					this._proportionallyResize();

				}

				//TODO: What's that good for? There's not anything to be executed left
				if(!$(this.handles[i]).length)
					continue;

			}
		};

		//TODO: make renderAxis a prototype function
		this._renderAxis(this.element);

		this._handles = $('.ui-resizable-handle', this.element)
			.disableSelection();

		//Matching axis name
		this._handles.mouseover(function() {
			if (!that.resizing) {
				if (this.className)
					var axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
				//Axis, default = se
				that.axis = axis && axis[1] ? axis[1] : 'se';
			}
		});

		//If we want to auto hide the elements
		if (o.autoHide) {
			this._handles.hide();
			$(this.element)
				.addClass("ui-resizable-autohide")
				.mouseenter(function() {
					if (o.disabled) return;
					$(this).removeClass("ui-resizable-autohide");
					that._handles.show();
				})
				.mouseleave(function(){
					if (o.disabled) return;
					if (!that.resizing) {
						$(this).addClass("ui-resizable-autohide");
						that._handles.hide();
					}
				});
		}

		//Initialize the mouse interaction
		this._mouseInit();

	},

	_destroy: function() {

		this._mouseDestroy();

		var _destroy = function(exp) {
			$(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
				.removeData("resizable").removeData("ui-resizable").unbind(".resizable").find('.ui-resizable-handle').remove();
		};

		//TODO: Unwrap at same DOM position
		if (this.elementIsWrapper) {
			_destroy(this.element);
			var wrapper = this.element;
			this.originalElement.css({
				position: wrapper.css('position'),
				width: wrapper.outerWidth(),
				height: wrapper.outerHeight(),
				top: wrapper.css('top'),
				left: wrapper.css('left')
			}).insertAfter( wrapper );
			wrapper.remove();
		}

		this.originalElement.css('resize', this.originalResizeStyle);
		_destroy(this.originalElement);

		return this;
	},

	_mouseCapture: function(event) {
		var handle = false;
		for (var i in this.handles) {
			if ($(this.handles[i])[0] == event.target) {
				handle = true;
			}
		}

		return !this.options.disabled && handle;
	},

	_mouseStart: function(event) {

		var o = this.options, iniPos = this.element.position(), el = this.element;

		this.resizing = true;
		this.documentScroll = { top: $(document).scrollTop(), left: $(document).scrollLeft() };

		// bugfix for http://dev.jquery.com/ticket/1749
		if (el.is('.ui-draggable') || (/absolute/).test(el.css('position'))) {
			el.css({ position: 'absolute', top: iniPos.top, left: iniPos.left });
		}

		this._renderProxy();

		var curleft = num(this.helper.css('left')), curtop = num(this.helper.css('top'));

		if (o.containment) {
			curleft += $(o.containment).scrollLeft() || 0;
			curtop += $(o.containment).scrollTop() || 0;
		}

		//Store needed variables
		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };
		this.size = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalSize = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalPosition = { left: curleft, top: curtop };
		this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		//Aspect Ratio
		this.aspectRatio = (typeof o.aspectRatio == 'number') ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);

		var cursor = $('.ui-resizable-' + this.axis).css('cursor');
		$('body').css('cursor', cursor == 'auto' ? this.axis + '-resize' : cursor);

		el.addClass("ui-resizable-resizing");
		this._propagate("start", event);
		return true;
	},

	_mouseDrag: function(event) {

		//Increase performance, avoid regex
		var el = this.helper, o = this.options, props = {},
			that = this, smp = this.originalMousePosition, a = this.axis;

		var dx = (event.pageX-smp.left)||0, dy = (event.pageY-smp.top)||0;
		var trigger = this._change[a];
		if (!trigger) return false;

		// Calculate the attrs that will be change
		var data = trigger.apply(this, [event, dx, dy]);

		// Put this in the mouseDrag handler since the user can start pressing shift while resizing
		this._updateVirtualBoundaries(event.shiftKey);
		if (this._aspectRatio || event.shiftKey)
			data = this._updateRatio(data, event);

		data = this._respectSize(data, event);

		// plugins callbacks need to be called first
		this._propagate("resize", event);

		el.css({
			top: this.position.top + "px", left: this.position.left + "px",
			width: this.size.width + "px", height: this.size.height + "px"
		});

		if (!this._helper && this._proportionallyResizeElements.length)
			this._proportionallyResize();

		this._updateCache(data);

		// calling the user callback at the end
		this._trigger('resize', event, this.ui());

		return false;
	},

	_mouseStop: function(event) {

		this.resizing = false;
		var o = this.options, that = this;

		if(this._helper) {
			var pr = this._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
				soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : that.sizeDiff.height,
				soffsetw = ista ? 0 : that.sizeDiff.width;

			var s = { width: (that.helper.width()  - soffsetw), height: (that.helper.height() - soffseth) },
				left = (parseInt(that.element.css('left'), 10) + (that.position.left - that.originalPosition.left)) || null,
				top = (parseInt(that.element.css('top'), 10) + (that.position.top - that.originalPosition.top)) || null;

			if (!o.animate)
				this.element.css($.extend(s, { top: top, left: left }));

			that.helper.height(that.size.height);
			that.helper.width(that.size.width);

			if (this._helper && !o.animate) this._proportionallyResize();
		}

		$('body').css('cursor', 'auto');

		this.element.removeClass("ui-resizable-resizing");

		this._propagate("stop", event);

		if (this._helper) this.helper.remove();
		return false;

	},

	_updateVirtualBoundaries: function(forceAspectRatio) {
		var o = this.options, pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b;

		b = {
			minWidth: isNumber(o.minWidth) ? o.minWidth : 0,
			maxWidth: isNumber(o.maxWidth) ? o.maxWidth : Infinity,
			minHeight: isNumber(o.minHeight) ? o.minHeight : 0,
			maxHeight: isNumber(o.maxHeight) ? o.maxHeight : Infinity
		};

		if(this._aspectRatio || forceAspectRatio) {
			// We want to create an enclosing box whose aspect ration is the requested one
			// First, compute the "projected" size for each dimension based on the aspect ratio and other dimension
			pMinWidth = b.minHeight * this.aspectRatio;
			pMinHeight = b.minWidth / this.aspectRatio;
			pMaxWidth = b.maxHeight * this.aspectRatio;
			pMaxHeight = b.maxWidth / this.aspectRatio;

			if(pMinWidth > b.minWidth) b.minWidth = pMinWidth;
			if(pMinHeight > b.minHeight) b.minHeight = pMinHeight;
			if(pMaxWidth < b.maxWidth) b.maxWidth = pMaxWidth;
			if(pMaxHeight < b.maxHeight) b.maxHeight = pMaxHeight;
		}
		this._vBoundaries = b;
	},

	_updateCache: function(data) {
		var o = this.options;
		this.offset = this.helper.offset();
		if (isNumber(data.left)) this.position.left = data.left;
		if (isNumber(data.top)) this.position.top = data.top;
		if (isNumber(data.height)) this.size.height = data.height;
		if (isNumber(data.width)) this.size.width = data.width;
	},

	_updateRatio: function(data, event) {

		var o = this.options, cpos = this.position, csize = this.size, a = this.axis;

		if (isNumber(data.height)) data.width = (data.height * this.aspectRatio);
		else if (isNumber(data.width)) data.height = (data.width / this.aspectRatio);

		if (a == 'sw') {
			data.left = cpos.left + (csize.width - data.width);
			data.top = null;
		}
		if (a == 'nw') {
			data.top = cpos.top + (csize.height - data.height);
			data.left = cpos.left + (csize.width - data.width);
		}

		return data;
	},

	_respectSize: function(data, event) {

		var el = this.helper, o = this._vBoundaries, pRatio = this._aspectRatio || event.shiftKey, a = this.axis,
				ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
					isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height);

		if (isminw) data.width = o.minWidth;
		if (isminh) data.height = o.minHeight;
		if (ismaxw) data.width = o.maxWidth;
		if (ismaxh) data.height = o.maxHeight;

		var dw = this.originalPosition.left + this.originalSize.width, dh = this.position.top + this.size.height;
		var cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);

		if (isminw && cw) data.left = dw - o.minWidth;
		if (ismaxw && cw) data.left = dw - o.maxWidth;
		if (isminh && ch)	data.top = dh - o.minHeight;
		if (ismaxh && ch)	data.top = dh - o.maxHeight;

		// fixing jump error on top/left - bug #2330
		var isNotwh = !data.width && !data.height;
		if (isNotwh && !data.left && data.top) data.top = null;
		else if (isNotwh && !data.top && data.left) data.left = null;

		return data;
	},

	_proportionallyResize: function() {

		var o = this.options;
		if (!this._proportionallyResizeElements.length) return;
		var element = this.helper || this.element;

		for (var i=0; i < this._proportionallyResizeElements.length; i++) {

			var prel = this._proportionallyResizeElements[i];

			if (!this.borderDif) {
				var b = [prel.css('borderTopWidth'), prel.css('borderRightWidth'), prel.css('borderBottomWidth'), prel.css('borderLeftWidth')],
					p = [prel.css('paddingTop'), prel.css('paddingRight'), prel.css('paddingBottom'), prel.css('paddingLeft')];

				this.borderDif = $.map(b, function(v, i) {
					var border = parseInt(v,10)||0, padding = parseInt(p[i],10)||0;
					return border + padding;
				});
			}

			prel.css({
				height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
				width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
			});

		};

	},

	_renderProxy: function() {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if(this._helper) {

			this.helper = this.helper || $('<div style="overflow:hidden;"></div>');

			// fix ie6 offset TODO: This seems broken
			var ie6offset = ($.ui.ie6 ? 1 : 0),
			pxyoffset = ( $.ui.ie6 ? 2 : -1 );

			this.helper.addClass(this._helper).css({
				width: this.element.outerWidth() + pxyoffset,
				height: this.element.outerHeight() + pxyoffset,
				position: 'absolute',
				left: this.elementOffset.left - ie6offset +'px',
				top: this.elementOffset.top - ie6offset +'px',
				zIndex: ++o.zIndex //TODO: Don't modify option
			});

			this.helper
				.appendTo("body")
				.disableSelection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function(event, dx, dy) {
			return { width: this.originalSize.width + dx };
		},
		w: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function(event, dx, dy) {
			return { height: this.originalSize.height + dy };
		},
		se: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		sw: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		},
		ne: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		nw: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		}
	},

	_propagate: function(n, event) {
		$.ui.plugin.call(this, n, [event, this.ui()]);
		(n != "resize" && this._trigger(n, event, this.ui()));
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

});

/*
 * Resizable Extensions
 */

$.ui.plugin.add("resizable", "alsoResize", {

	start: function (event, ui) {
		var that = $(this).data("resizable"), o = that.options;

		var _store = function (exp) {
			$(exp).each(function() {
				var el = $(this);
				el.data("resizable-alsoresize", {
					width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
					left: parseInt(el.css('left'), 10), top: parseInt(el.css('top'), 10)
				});
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.parentNode) {
			if (o.alsoResize.length) { o.alsoResize = o.alsoResize[0]; _store(o.alsoResize); }
			else { $.each(o.alsoResize, function (exp) { _store(exp); }); }
		}else{
			_store(o.alsoResize);
		}
	},

	resize: function (event, ui) {
		var that = $(this).data("resizable"), o = that.options, os = that.originalSize, op = that.originalPosition;

		var delta = {
			height: (that.size.height - os.height) || 0, width: (that.size.width - os.width) || 0,
			top: (that.position.top - op.top) || 0, left: (that.position.left - op.left) || 0
		},

		_alsoResize = function (exp, c) {
			$(exp).each(function() {
				var el = $(this), start = $(this).data("resizable-alsoresize"), style = {},
					css = c && c.length ? c : el.parents(ui.originalElement[0]).length ? ['width', 'height'] : ['width', 'height', 'top', 'left'];

				$.each(css, function (i, prop) {
					var sum = (start[prop]||0) + (delta[prop]||0);
					if (sum && sum >= 0)
						style[prop] = sum || null;
				});

				el.css(style);
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
			$.each(o.alsoResize, function (exp, c) { _alsoResize(exp, c); });
		}else{
			_alsoResize(o.alsoResize);
		}
	},

	stop: function (event, ui) {
		$(this).removeData("resizable-alsoresize");
	}
});

$.ui.plugin.add("resizable", "animate", {

	stop: function(event, ui) {
		var that = $(this).data("resizable"), o = that.options;

		var pr = that._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
					soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : that.sizeDiff.height,
						soffsetw = ista ? 0 : that.sizeDiff.width;

		var style = { width: (that.size.width - soffsetw), height: (that.size.height - soffseth) },
					left = (parseInt(that.element.css('left'), 10) + (that.position.left - that.originalPosition.left)) || null,
						top = (parseInt(that.element.css('top'), 10) + (that.position.top - that.originalPosition.top)) || null;

		that.element.animate(
			$.extend(style, top && left ? { top: top, left: left } : {}), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {

					var data = {
						width: parseInt(that.element.css('width'), 10),
						height: parseInt(that.element.css('height'), 10),
						top: parseInt(that.element.css('top'), 10),
						left: parseInt(that.element.css('left'), 10)
					};

					if (pr && pr.length) $(pr[0]).css({ width: data.width, height: data.height });

					// propagating resize, and updating values for each animation step
					that._updateCache(data);
					that._propagate("resize", event);

				}
			}
		);
	}

});

$.ui.plugin.add("resizable", "containment", {

	start: function(event, ui) {
		var that = $(this).data("resizable"), o = that.options, el = that.element;
		var oc = o.containment,	ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;
		if (!ce) return;

		that.containerElement = $(ce);

		if (/document/.test(oc) || oc == document) {
			that.containerOffset = { left: 0, top: 0 };
			that.containerPosition = { left: 0, top: 0 };

			that.parentData = {
				element: $(document), left: 0, top: 0,
				width: $(document).width(), height: $(document).height() || document.body.parentNode.scrollHeight
			};
		}

		// i'm a node, so compute top, left, right, bottom
		else {
			var element = $(ce), p = [];
			$([ "Top", "Right", "Left", "Bottom" ]).each(function(i, name) { p[i] = num(element.css("padding" + name)); });

			that.containerOffset = element.offset();
			that.containerPosition = element.position();
			that.containerSize = { height: (element.innerHeight() - p[3]), width: (element.innerWidth() - p[1]) };

			var co = that.containerOffset, ch = that.containerSize.height,	cw = that.containerSize.width,
						width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw ), height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);

			that.parentData = {
				element: ce, left: co.left, top: co.top, width: width, height: height
			};
		}
	},

	resize: function(event, ui) {
		var that = $(this).data("resizable"), o = that.options,
				ps = that.containerSize, co = that.containerOffset, cs = that.size, cp = that.position,
				pRatio = that._aspectRatio || event.shiftKey, cop = { top:0, left:0 }, ce = that.containerElement;

		if (ce[0] != document && (/static/).test(ce.css('position'))) cop = co;

		if (cp.left < (that._helper ? co.left : 0)) {
			that.size.width = that.size.width + (that._helper ? (that.position.left - co.left) : (that.position.left - cop.left));
			if (pRatio) that.size.height = that.size.width / that.aspectRatio;
			that.position.left = o.helper ? co.left : 0;
		}

		if (cp.top < (that._helper ? co.top : 0)) {
			that.size.height = that.size.height + (that._helper ? (that.position.top - co.top) : that.position.top);
			if (pRatio) that.size.width = that.size.height * that.aspectRatio;
			that.position.top = that._helper ? co.top : 0;
		}

		that.offset.left = that.parentData.left+that.position.left;
		that.offset.top = that.parentData.top+that.position.top;

		var woset = Math.abs( (that._helper ? that.offset.left - cop.left : (that.offset.left - cop.left)) + that.sizeDiff.width ),
					hoset = Math.abs( (that._helper ? that.offset.top - cop.top : (that.offset.top - co.top)) + that.sizeDiff.height );

		var isParent = that.containerElement.get(0) == that.element.parent().get(0),
			isOffsetRelative = /relative|absolute/.test(that.containerElement.css('position'));

		if(isParent && isOffsetRelative) woset -= that.parentData.left;

		if (woset + that.size.width >= that.parentData.width) {
			that.size.width = that.parentData.width - woset;
			if (pRatio) that.size.height = that.size.width / that.aspectRatio;
		}

		if (hoset + that.size.height >= that.parentData.height) {
			that.size.height = that.parentData.height - hoset;
			if (pRatio) that.size.width = that.size.height * that.aspectRatio;
		}
	},

	stop: function(event, ui){
		var that = $(this).data("resizable"), o = that.options, cp = that.position,
				co = that.containerOffset, cop = that.containerPosition, ce = that.containerElement;

		var helper = $(that.helper), ho = helper.offset(), w = helper.outerWidth() - that.sizeDiff.width, h = helper.outerHeight() - that.sizeDiff.height;

		if (that._helper && !o.animate && (/relative/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

		if (that._helper && !o.animate && (/static/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

	}
});

$.ui.plugin.add("resizable", "ghost", {

	start: function(event, ui) {

		var that = $(this).data("resizable"), o = that.options, cs = that.size;

		that.ghost = that.originalElement.clone();
		that.ghost
			.css({ opacity: .25, display: 'block', position: 'relative', height: cs.height, width: cs.width, margin: 0, left: 0, top: 0 })
			.addClass('ui-resizable-ghost')
			.addClass(typeof o.ghost == 'string' ? o.ghost : '');

		that.ghost.appendTo(that.helper);

	},

	resize: function(event, ui){
		var that = $(this).data("resizable"), o = that.options;
		if (that.ghost) that.ghost.css({ position: 'relative', height: that.size.height, width: that.size.width });
	},

	stop: function(event, ui){
		var that = $(this).data("resizable"), o = that.options;
		if (that.ghost && that.helper) that.helper.get(0).removeChild(that.ghost.get(0));
	}

});

$.ui.plugin.add("resizable", "grid", {

	resize: function(event, ui) {
		var that = $(this).data("resizable"), o = that.options, cs = that.size, os = that.originalSize, op = that.originalPosition, a = that.axis, ratio = o._aspectRatio || event.shiftKey;
		o.grid = typeof o.grid == "number" ? [o.grid, o.grid] : o.grid;
		var ox = Math.round((cs.width - os.width) / (o.grid[0]||1)) * (o.grid[0]||1), oy = Math.round((cs.height - os.height) / (o.grid[1]||1)) * (o.grid[1]||1);

		if (/^(se|s|e)$/.test(a)) {
			that.size.width = os.width + ox;
			that.size.height = os.height + oy;
		}
		else if (/^(ne)$/.test(a)) {
			that.size.width = os.width + ox;
			that.size.height = os.height + oy;
			that.position.top = op.top - oy;
		}
		else if (/^(sw)$/.test(a)) {
			that.size.width = os.width + ox;
			that.size.height = os.height + oy;
			that.position.left = op.left - ox;
		}
		else {
			that.size.width = os.width + ox;
			that.size.height = os.height + oy;
			that.position.top = op.top - oy;
			that.position.left = op.left - ox;
		}
	}

});

var num = function(v) {
	return parseInt(v, 10) || 0;
};

var isNumber = function(value) {
	return !isNaN(parseInt(value, 10));
};

})(jQuery);
(function( $, undefined ) {

$.widget("ui.selectable", $.ui.mouse, {
	version: "1.9.2",
	options: {
		appendTo: 'body',
		autoRefresh: true,
		distance: 0,
		filter: '*',
		tolerance: 'touch'
	},
	_create: function() {
		var that = this;

		this.element.addClass("ui-selectable");

		this.dragged = false;

		// cache selectee children based on filter
		var selectees;
		this.refresh = function() {
			selectees = $(that.options.filter, that.element[0]);
			selectees.addClass("ui-selectee");
			selectees.each(function() {
				var $this = $(this);
				var pos = $this.offset();
				$.data(this, "selectable-item", {
					element: this,
					$element: $this,
					left: pos.left,
					top: pos.top,
					right: pos.left + $this.outerWidth(),
					bottom: pos.top + $this.outerHeight(),
					startselected: false,
					selected: $this.hasClass('ui-selected'),
					selecting: $this.hasClass('ui-selecting'),
					unselecting: $this.hasClass('ui-unselecting')
				});
			});
		};
		this.refresh();

		this.selectees = selectees.addClass("ui-selectee");

		this._mouseInit();

		this.helper = $("<div class='ui-selectable-helper'></div>");
	},

	_destroy: function() {
		this.selectees
			.removeClass("ui-selectee")
			.removeData("selectable-item");
		this.element
			.removeClass("ui-selectable ui-selectable-disabled");
		this._mouseDestroy();
	},

	_mouseStart: function(event) {
		var that = this;

		this.opos = [event.pageX, event.pageY];

		if (this.options.disabled)
			return;

		var options = this.options;

		this.selectees = $(options.filter, this.element[0]);

		this._trigger("start", event);

		$(options.appendTo).append(this.helper);
		// position helper (lasso)
		this.helper.css({
			"left": event.clientX,
			"top": event.clientY,
			"width": 0,
			"height": 0
		});

		if (options.autoRefresh) {
			this.refresh();
		}

		this.selectees.filter('.ui-selected').each(function() {
			var selectee = $.data(this, "selectable-item");
			selectee.startselected = true;
			if (!event.metaKey && !event.ctrlKey) {
				selectee.$element.removeClass('ui-selected');
				selectee.selected = false;
				selectee.$element.addClass('ui-unselecting');
				selectee.unselecting = true;
				// selectable UNSELECTING callback
				that._trigger("unselecting", event, {
					unselecting: selectee.element
				});
			}
		});

		$(event.target).parents().andSelf().each(function() {
			var selectee = $.data(this, "selectable-item");
			if (selectee) {
				var doSelect = (!event.metaKey && !event.ctrlKey) || !selectee.$element.hasClass('ui-selected');
				selectee.$element
					.removeClass(doSelect ? "ui-unselecting" : "ui-selected")
					.addClass(doSelect ? "ui-selecting" : "ui-unselecting");
				selectee.unselecting = !doSelect;
				selectee.selecting = doSelect;
				selectee.selected = doSelect;
				// selectable (UN)SELECTING callback
				if (doSelect) {
					that._trigger("selecting", event, {
						selecting: selectee.element
					});
				} else {
					that._trigger("unselecting", event, {
						unselecting: selectee.element
					});
				}
				return false;
			}
		});

	},

	_mouseDrag: function(event) {
		var that = this;
		this.dragged = true;

		if (this.options.disabled)
			return;

		var options = this.options;

		var x1 = this.opos[0], y1 = this.opos[1], x2 = event.pageX, y2 = event.pageY;
		if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
		if (y1 > y2) { var tmp = y2; y2 = y1; y1 = tmp; }
		this.helper.css({left: x1, top: y1, width: x2-x1, height: y2-y1});

		this.selectees.each(function() {
			var selectee = $.data(this, "selectable-item");
			//prevent helper from being selected if appendTo: selectable
			if (!selectee || selectee.element == that.element[0])
				return;
			var hit = false;
			if (options.tolerance == 'touch') {
				hit = ( !(selectee.left > x2 || selectee.right < x1 || selectee.top > y2 || selectee.bottom < y1) );
			} else if (options.tolerance == 'fit') {
				hit = (selectee.left > x1 && selectee.right < x2 && selectee.top > y1 && selectee.bottom < y2);
			}

			if (hit) {
				// SELECT
				if (selectee.selected) {
					selectee.$element.removeClass('ui-selected');
					selectee.selected = false;
				}
				if (selectee.unselecting) {
					selectee.$element.removeClass('ui-unselecting');
					selectee.unselecting = false;
				}
				if (!selectee.selecting) {
					selectee.$element.addClass('ui-selecting');
					selectee.selecting = true;
					// selectable SELECTING callback
					that._trigger("selecting", event, {
						selecting: selectee.element
					});
				}
			} else {
				// UNSELECT
				if (selectee.selecting) {
					if ((event.metaKey || event.ctrlKey) && selectee.startselected) {
						selectee.$element.removeClass('ui-selecting');
						selectee.selecting = false;
						selectee.$element.addClass('ui-selected');
						selectee.selected = true;
					} else {
						selectee.$element.removeClass('ui-selecting');
						selectee.selecting = false;
						if (selectee.startselected) {
							selectee.$element.addClass('ui-unselecting');
							selectee.unselecting = true;
						}
						// selectable UNSELECTING callback
						that._trigger("unselecting", event, {
							unselecting: selectee.element
						});
					}
				}
				if (selectee.selected) {
					if (!event.metaKey && !event.ctrlKey && !selectee.startselected) {
						selectee.$element.removeClass('ui-selected');
						selectee.selected = false;

						selectee.$element.addClass('ui-unselecting');
						selectee.unselecting = true;
						// selectable UNSELECTING callback
						that._trigger("unselecting", event, {
							unselecting: selectee.element
						});
					}
				}
			}
		});

		return false;
	},

	_mouseStop: function(event) {
		var that = this;

		this.dragged = false;

		var options = this.options;

		$('.ui-unselecting', this.element[0]).each(function() {
			var selectee = $.data(this, "selectable-item");
			selectee.$element.removeClass('ui-unselecting');
			selectee.unselecting = false;
			selectee.startselected = false;
			that._trigger("unselected", event, {
				unselected: selectee.element
			});
		});
		$('.ui-selecting', this.element[0]).each(function() {
			var selectee = $.data(this, "selectable-item");
			selectee.$element.removeClass('ui-selecting').addClass('ui-selected');
			selectee.selecting = false;
			selectee.selected = true;
			selectee.startselected = true;
			that._trigger("selected", event, {
				selected: selectee.element
			});
		});
		this._trigger("stop", event);

		this.helper.remove();

		return false;
	}

});

})(jQuery);
(function( $, undefined ) {

$.widget("ui.sortable", $.ui.mouse, {
	version: "1.9.2",
	widgetEventPrefix: "sort",
	ready: false,
	options: {
		appendTo: "parent",
		axis: false,
		connectWith: false,
		containment: false,
		cursor: 'auto',
		cursorAt: false,
		dropOnEmpty: true,
		forcePlaceholderSize: false,
		forceHelperSize: false,
		grid: false,
		handle: false,
		helper: "original",
		items: '> *',
		opacity: false,
		placeholder: false,
		revert: false,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		scope: "default",
		tolerance: "intersect",
		zIndex: 1000
	},
	_create: function() {

		var o = this.options;
		this.containerCache = {};
		this.element.addClass("ui-sortable");

		//Get the items
		this.refresh();

		//Let's determine if the items are being displayed horizontally
		this.floating = this.items.length ? o.axis === 'x' || (/left|right/).test(this.items[0].item.css('float')) || (/inline|table-cell/).test(this.items[0].item.css('display')) : false;

		//Let's determine the parent's offset
		this.offset = this.element.offset();

		//Initialize mouse events for interaction
		this._mouseInit();

		//We're ready to go
		this.ready = true

	},

	_destroy: function() {
		this.element
			.removeClass("ui-sortable ui-sortable-disabled");
		this._mouseDestroy();

		for ( var i = this.items.length - 1; i >= 0; i-- )
			this.items[i].item.removeData(this.widgetName + "-item");

		return this;
	},

	_setOption: function(key, value){
		if ( key === "disabled" ) {
			this.options[ key ] = value;

			this.widget().toggleClass( "ui-sortable-disabled", !!value );
		} else {
			// Don't call widget base _setOption for disable as it adds ui-state-disabled class
			$.Widget.prototype._setOption.apply(this, arguments);
		}
	},

	_mouseCapture: function(event, overrideHandle) {
		var that = this;

		if (this.reverting) {
			return false;
		}

		if(this.options.disabled || this.options.type == 'static') return false;

		//We have to refresh the items data once first
		this._refreshItems(event);

		//Find out if the clicked node (or one of its parents) is a actual item in this.items
		var currentItem = null, nodes = $(event.target).parents().each(function() {
			if($.data(this, that.widgetName + '-item') == that) {
				currentItem = $(this);
				return false;
			}
		});
		if($.data(event.target, that.widgetName + '-item') == that) currentItem = $(event.target);

		if(!currentItem) return false;
		if(this.options.handle && !overrideHandle) {
			var validHandle = false;

			$(this.options.handle, currentItem).find("*").andSelf().each(function() { if(this == event.target) validHandle = true; });
			if(!validHandle) return false;
		}

		this.currentItem = currentItem;
		this._removeCurrentsFromItems();
		return true;

	},

	_mouseStart: function(event, overrideHandle, noActivation) {

		var o = this.options;
		this.currentContainer = this;

		//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
		this.refreshPositions();

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Get the next scrolling parent
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.currentItem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		// Only after we got the offset, we can change the helper's position to absolute
		// TODO: Still need to figure out a way to make relative sorting possible
		this.helper.css("position", "absolute");
		this.cssPosition = this.helper.css("position");

		//Generate the original position
		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Cache the former DOM position
		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

		//If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
		if(this.helper[0] != this.currentItem[0]) {
			this.currentItem.hide();
		}

		//Create the placeholder
		this._createPlaceholder();

		//Set a containment if given in the options
		if(o.containment)
			this._setContainment();

		if(o.cursor) { // cursor option
			if ($('body').css("cursor")) this._storedCursor = $('body').css("cursor");
			$('body').css("cursor", o.cursor);
		}

		if(o.opacity) { // opacity option
			if (this.helper.css("opacity")) this._storedOpacity = this.helper.css("opacity");
			this.helper.css("opacity", o.opacity);
		}

		if(o.zIndex) { // zIndex option
			if (this.helper.css("zIndex")) this._storedZIndex = this.helper.css("zIndex");
			this.helper.css("zIndex", o.zIndex);
		}

		//Prepare scrolling
		if(this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML')
			this.overflowOffset = this.scrollParent.offset();

		//Call callbacks
		this._trigger("start", event, this._uiHash());

		//Recache the helper size
		if(!this._preserveHelperProportions)
			this._cacheHelperProportions();


		//Post 'activate' events to possible containers
		if(!noActivation) {
			 for (var i = this.containers.length - 1; i >= 0; i--) { this.containers[i]._trigger("activate", event, this._uiHash(this)); }
		}

		//Prepare possible droppables
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);

		this.dragging = true;

		this.helper.addClass("ui-sortable-helper");
		this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;

	},

	_mouseDrag: function(event) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		if (!this.lastPositionAbs) {
			this.lastPositionAbs = this.positionAbs;
		}

		//Do scrolling
		if(this.options.scroll) {
			var o = this.options, scrolled = false;
			if(this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML') {

				if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
				else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity)
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;

				if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
				else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity)
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;

			} else {

				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);

				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);

			}

			if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
				$.ui.ddmanager.prepareOffsets(this, event);
		}

		//Regenerate the absolute position used for position checks
		this.positionAbs = this._convertPositionTo("absolute");

		//Set the helper position
		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';

		//Rearrange
		for (var i = this.items.length - 1; i >= 0; i--) {

			//Cache variables and intersection, continue if no intersection
			var item = this.items[i], itemElement = item.item[0], intersection = this._intersectsWithPointer(item);
			if (!intersection) continue;

			// Only put the placeholder inside the current Container, skip all
			// items form other containers. This works because when moving
			// an item from one container to another the
			// currentContainer is switched before the placeholder is moved.
			//
			// Without this moving items in "sub-sortables" can cause the placeholder to jitter
			// beetween the outer and inner container.
			if (item.instance !== this.currentContainer) continue;

			if (itemElement != this.currentItem[0] //cannot intersect with itself
				&&	this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement //no useless actions that have been done before
				&&	!$.contains(this.placeholder[0], itemElement) //no action if the item moved is the parent of the item checked
				&& (this.options.type == 'semi-dynamic' ? !$.contains(this.element[0], itemElement) : true)
				//&& itemElement.parentNode == this.placeholder[0].parentNode // only rearrange items within the same container
			) {

				this.direction = intersection == 1 ? "down" : "up";

				if (this.options.tolerance == "pointer" || this._intersectsWithSides(item)) {
					this._rearrange(event, item);
				} else {
					break;
				}

				this._trigger("change", event, this._uiHash());
				break;
			}
		}

		//Post events to containers
		this._contactContainers(event);

		//Interconnect with droppables
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		//Call callbacks
		this._trigger('sort', event, this._uiHash());

		this.lastPositionAbs = this.positionAbs;
		return false;

	},

	_mouseStop: function(event, noPropagation) {

		if(!event) return;

		//If we are using droppables, inform the manager about the drop
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			$.ui.ddmanager.drop(this, event);

		if(this.options.revert) {
			var that = this;
			var cur = this.placeholder.offset();

			this.reverting = true;

			$(this.helper).animate({
				left: cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
				top: cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
			}, parseInt(this.options.revert, 10) || 500, function() {
				that._clear(event);
			});
		} else {
			this._clear(event, noPropagation);
		}

		return false;

	},

	cancel: function() {

		if(this.dragging) {

			this._mouseUp({ target: null });

			if(this.options.helper == "original")
				this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
			else
				this.currentItem.show();

			//Post deactivating events to containers
			for (var i = this.containers.length - 1; i >= 0; i--){
				this.containers[i]._trigger("deactivate", null, this._uiHash(this));
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", null, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		if (this.placeholder) {
			//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
			if(this.placeholder[0].parentNode) this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
			if(this.options.helper != "original" && this.helper && this.helper[0].parentNode) this.helper.remove();

			$.extend(this, {
				helper: null,
				dragging: false,
				reverting: false,
				_noFinalSort: null
			});

			if(this.domPosition.prev) {
				$(this.domPosition.prev).after(this.currentItem);
			} else {
				$(this.domPosition.parent).prepend(this.currentItem);
			}
		}

		return this;

	},

	serialize: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected);
		var str = []; o = o || {};

		$(items).each(function() {
			var res = ($(o.item || this).attr(o.attribute || 'id') || '').match(o.expression || (/(.+)[-=_](.+)/));
			if(res) str.push((o.key || res[1]+'[]')+'='+(o.key && o.expression ? res[1] : res[2]));
		});

		if(!str.length && o.key) {
			str.push(o.key + '=');
		}

		return str.join('&');

	},

	toArray: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected);
		var ret = []; o = o || {};

		items.each(function() { ret.push($(o.item || this).attr(o.attribute || 'id') || ''); });
		return ret;

	},

	/* Be careful with the following core functions */
	_intersectsWith: function(item) {

		var x1 = this.positionAbs.left,
			x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top,
			y2 = y1 + this.helperProportions.height;

		var l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height;

		var dyClick = this.offset.click.top,
			dxClick = this.offset.click.left;

		var isOverElement = (y1 + dyClick) > t && (y1 + dyClick) < b && (x1 + dxClick) > l && (x1 + dxClick) < r;

		if(	   this.options.tolerance == "pointer"
			|| this.options.forcePointerForContainers
			|| (this.options.tolerance != "pointer" && this.helperProportions[this.floating ? 'width' : 'height'] > item[this.floating ? 'width' : 'height'])
		) {
			return isOverElement;
		} else {

			return (l < x1 + (this.helperProportions.width / 2) // Right Half
				&& x2 - (this.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (this.helperProportions.height / 2) // Bottom Half
				&& y2 - (this.helperProportions.height / 2) < b ); // Top Half

		}
	},

	_intersectsWithPointer: function(item) {

		var isOverElementHeight = (this.options.axis === 'x') || $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
			isOverElementWidth = (this.options.axis === 'y') || $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
			isOverElement = isOverElementHeight && isOverElementWidth,
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (!isOverElement)
			return false;

		return this.floating ?
			( ((horizontalDirection && horizontalDirection == "right") || verticalDirection == "down") ? 2 : 1 )
			: ( verticalDirection && (verticalDirection == "down" ? 2 : 1) );

	},

	_intersectsWithSides: function(item) {

		var isOverBottomHalf = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
			isOverRightHalf = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (this.floating && horizontalDirection) {
			return ((horizontalDirection == "right" && isOverRightHalf) || (horizontalDirection == "left" && !isOverRightHalf));
		} else {
			return verticalDirection && ((verticalDirection == "down" && isOverBottomHalf) || (verticalDirection == "up" && !isOverBottomHalf));
		}

	},

	_getDragVerticalDirection: function() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta != 0 && (delta > 0 ? "down" : "up");
	},

	_getDragHorizontalDirection: function() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta != 0 && (delta > 0 ? "right" : "left");
	},

	refresh: function(event) {
		this._refreshItems(event);
		this.refreshPositions();
		return this;
	},

	_connectWith: function() {
		var options = this.options;
		return options.connectWith.constructor == String
			? [options.connectWith]
			: options.connectWith;
	},

	_getItemsAsjQuery: function(connected) {

		var items = [];
		var queries = [];
		var connectWith = this._connectWith();

		if(connectWith && connected) {
			for (var i = connectWith.length - 1; i >= 0; i--){
				var cur = $(connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--){
					var inst = $.data(cur[j], this.widgetName);
					if(inst && inst != this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), inst]);
					}
				};
			};
		}

		queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), this]);

		for (var i = queries.length - 1; i >= 0; i--){
			queries[i][0].each(function() {
				items.push(this);
			});
		};

		return $(items);

	},

	_removeCurrentsFromItems: function() {

		var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

		this.items = $.grep(this.items, function (item) {
			for (var j=0; j < list.length; j++) {
				if(list[j] == item.item[0])
					return false;
			};
			return true;
		});

	},

	_refreshItems: function(event) {

		this.items = [];
		this.containers = [this];
		var items = this.items;
		var queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]];
		var connectWith = this._connectWith();

		if(connectWith && this.ready) { //Shouldn't be run the first time through due to massive slow-down
			for (var i = connectWith.length - 1; i >= 0; i--){
				var cur = $(connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--){
					var inst = $.data(cur[j], this.widgetName);
					if(inst && inst != this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				};
			};
		}

		for (var i = queries.length - 1; i >= 0; i--) {
			var targetData = queries[i][1];
			var _queries = queries[i][0];

			for (var j=0, queriesLength = _queries.length; j < queriesLength; j++) {
				var item = $(_queries[j]);

				item.data(this.widgetName + '-item', targetData); // Data for target checking (mouse manager)

				items.push({
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				});
			};
		};

	},

	refreshPositions: function(fast) {

		//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
		if(this.offsetParent && this.helper) {
			this.offset.parent = this._getParentOffset();
		}

		for (var i = this.items.length - 1; i >= 0; i--){
			var item = this.items[i];

			//We ignore calculating positions of all connected containers when we're not over them
			if(item.instance != this.currentContainer && this.currentContainer && item.item[0] != this.currentItem[0])
				continue;

			var t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

			if (!fast) {
				item.width = t.outerWidth();
				item.height = t.outerHeight();
			}

			var p = t.offset();
			item.left = p.left;
			item.top = p.top;
		};

		if(this.options.custom && this.options.custom.refreshContainers) {
			this.options.custom.refreshContainers.call(this);
		} else {
			for (var i = this.containers.length - 1; i >= 0; i--){
				var p = this.containers[i].element.offset();
				this.containers[i].containerCache.left = p.left;
				this.containers[i].containerCache.top = p.top;
				this.containers[i].containerCache.width	= this.containers[i].element.outerWidth();
				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			};
		}

		return this;
	},

	_createPlaceholder: function(that) {
		that = that || this;
		var o = that.options;

		if(!o.placeholder || o.placeholder.constructor == String) {
			var className = o.placeholder;
			o.placeholder = {
				element: function() {

					var el = $(document.createElement(that.currentItem[0].nodeName))
						.addClass(className || that.currentItem[0].className+" ui-sortable-placeholder")
						.removeClass("ui-sortable-helper")[0];

					if(!className)
						el.style.visibility = "hidden";

					return el;
				},
				update: function(container, p) {

					// 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
					// 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
					if(className && !o.forcePlaceholderSize) return;

					//If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
					if(!p.height()) { p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css('paddingTop')||0, 10) - parseInt(that.currentItem.css('paddingBottom')||0, 10)); };
					if(!p.width()) { p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css('paddingLeft')||0, 10) - parseInt(that.currentItem.css('paddingRight')||0, 10)); };
				}
			};
		}

		//Create the placeholder
		that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));

		//Append it after the actual current item
		that.currentItem.after(that.placeholder);

		//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
		o.placeholder.update(that, that.placeholder);

	},

	_contactContainers: function(event) {

		// get innermost container that intersects with item
		var innermostContainer = null, innermostIndex = null;


		for (var i = this.containers.length - 1; i >= 0; i--){

			// never consider a container that's located within the item itself
			if($.contains(this.currentItem[0], this.containers[i].element[0]))
				continue;

			if(this._intersectsWith(this.containers[i].containerCache)) {

				// if we've already found a container and it's more "inner" than this, then continue
				if(innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0]))
					continue;

				innermostContainer = this.containers[i];
				innermostIndex = i;

			} else {
				// container doesn't intersect. trigger "out" event if necessary
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", event, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		// if no intersecting containers found, return
		if(!innermostContainer) return;

		// move the item into the container if it's not there already
		if(this.containers.length === 1) {
			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
			this.containers[innermostIndex].containerCache.over = 1;
		} else {

			//When entering a new container, we will find the item with the least distance and append our item near it
			var dist = 10000; var itemWithLeastDistance = null;
			var posProperty = this.containers[innermostIndex].floating ? 'left' : 'top';
			var sizeProperty = this.containers[innermostIndex].floating ? 'width' : 'height';
			var base = this.positionAbs[posProperty] + this.offset.click[posProperty];
			for (var j = this.items.length - 1; j >= 0; j--) {
				if(!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) continue;
				if(this.items[j].item[0] == this.currentItem[0]) continue;
				var cur = this.items[j].item.offset()[posProperty];
				var nearBottom = false;
				if(Math.abs(cur - base) > Math.abs(cur + this.items[j][sizeProperty] - base)){
					nearBottom = true;
					cur += this.items[j][sizeProperty];
				}

				if(Math.abs(cur - base) < dist) {
					dist = Math.abs(cur - base); itemWithLeastDistance = this.items[j];
					this.direction = nearBottom ? "up": "down";
				}
			}

			if(!itemWithLeastDistance && !this.options.dropOnEmpty) //Check if dropOnEmpty is enabled
				return;

			this.currentContainer = this.containers[innermostIndex];
			itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
			this._trigger("change", event, this._uiHash());
			this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));

			//Update the placeholder
			this.options.placeholder.update(this.currentContainer, this.placeholder);

			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
			this.containers[innermostIndex].containerCache.over = 1;
		}


	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper == 'clone' ? this.currentItem.clone() : this.currentItem);

		if(!helper.parents('body').length) //Add the helper to the DOM if that didn't happen already
			$(o.appendTo != 'parent' ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);

		if(helper[0] == this.currentItem[0])
			this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };

		if(helper[0].style.width == '' || o.forceHelperSize) helper.width(this.currentItem.width());
		if(helper[0].style.height == '' || o.forceHelperSize) helper.height(this.currentItem.height());

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj == 'string') {
			obj = obj.split(' ');
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ('left' in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ('right' in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ('top' in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ('bottom' in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {


		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.ui.ie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.currentItem.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			0 - this.offset.relative.left - this.offset.parent.left,
			0 - this.offset.relative.top - this.offset.parent.top,
			$(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment)) {
			var ce = $(o.containment)[0];
			var co = $(o.containment).offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if(this.cssPosition == 'relative' && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}

		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
			}

			if(o.grid) {
				var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ( ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_rearrange: function(event, i, a, hardRefresh) {

		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction == 'down' ? i.item[0] : i.item[0].nextSibling));

		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var counter = this.counter;

		this._delay(function() {
			if(counter == this.counter) this.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
		});

	},

	_clear: function(event, noPropagation) {

		this.reverting = false;
		// We delay all events that have to be triggered to after the point where the placeholder has been removed and
		// everything else normalized again
		var delayedTriggers = [];

		// We first have to update the dom position of the actual currentItem
		// Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
		if(!this._noFinalSort && this.currentItem.parent().length) this.placeholder.before(this.currentItem);
		this._noFinalSort = null;

		if(this.helper[0] == this.currentItem[0]) {
			for(var i in this._storedCSS) {
				if(this._storedCSS[i] == 'auto' || this._storedCSS[i] == 'static') this._storedCSS[i] = '';
			}
			this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
		} else {
			this.currentItem.show();
		}

		if(this.fromOutside && !noPropagation) delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
		if((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !noPropagation) delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed

		// Check if the items Container has Changed and trigger appropriate
		// events.
		if (this !== this.currentContainer) {
			if(!noPropagation) {
				delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
				delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.currentContainer));
				delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.currentContainer));
			}
		}


		//Post events to containers
		for (var i = this.containers.length - 1; i >= 0; i--){
			if(!noPropagation) delayedTriggers.push((function(c) { return function(event) { c._trigger("deactivate", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
			if(this.containers[i].containerCache.over) {
				delayedTriggers.push((function(c) { return function(event) { c._trigger("out", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
				this.containers[i].containerCache.over = 0;
			}
		}

		//Do what was originally in plugins
		if(this._storedCursor) $('body').css("cursor", this._storedCursor); //Reset cursor
		if(this._storedOpacity) this.helper.css("opacity", this._storedOpacity); //Reset opacity
		if(this._storedZIndex) this.helper.css("zIndex", this._storedZIndex == 'auto' ? '' : this._storedZIndex); //Reset z-index

		this.dragging = false;
		if(this.cancelHelperRemoval) {
			if(!noPropagation) {
				this._trigger("beforeStop", event, this._uiHash());
				for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
				this._trigger("stop", event, this._uiHash());
			}

			this.fromOutside = false;
			return false;
		}

		if(!noPropagation) this._trigger("beforeStop", event, this._uiHash());

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

		if(this.helper[0] != this.currentItem[0]) this.helper.remove(); this.helper = null;

		if(!noPropagation) {
			for (var i=0; i < delayedTriggers.length; i++) { delayedTriggers[i].call(this, event); }; //Trigger all delayed events
			this._trigger("stop", event, this._uiHash());
		}

		this.fromOutside = false;
		return true;

	},

	_trigger: function() {
		if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
			this.cancel();
		}
	},

	_uiHash: function(_inst) {
		var inst = _inst || this;
		return {
			helper: inst.helper,
			placeholder: inst.placeholder || $([]),
			position: inst.position,
			originalPosition: inst.originalPosition,
			offset: inst.positionAbs,
			item: inst.currentItem,
			sender: _inst ? _inst.element : null
		};
	}

});

})(jQuery);
(function( $, undefined ) {

var uid = 0,
	hideProps = {},
	showProps = {};

hideProps.height = hideProps.paddingTop = hideProps.paddingBottom =
	hideProps.borderTopWidth = hideProps.borderBottomWidth = "hide";
showProps.height = showProps.paddingTop = showProps.paddingBottom =
	showProps.borderTopWidth = showProps.borderBottomWidth = "show";

$.widget( "ui.accordion", {
	version: "1.9.2",
	options: {
		active: 0,
		animate: {},
		collapsible: false,
		event: "click",
		header: "> li > :first-child,> :not(li):even",
		heightStyle: "auto",
		icons: {
			activeHeader: "ui-icon-triangle-1-s",
			header: "ui-icon-triangle-1-e"
		},

		// callbacks
		activate: null,
		beforeActivate: null
	},

	_create: function() {
		var accordionId = this.accordionId = "ui-accordion-" +
				(this.element.attr( "id" ) || ++uid),
			options = this.options;

		this.prevShow = this.prevHide = $();
		this.element.addClass( "ui-accordion ui-widget ui-helper-reset" );

		this.headers = this.element.find( options.header )
			.addClass( "ui-accordion-header ui-helper-reset ui-state-default ui-corner-all" );
		this._hoverable( this.headers );
		this._focusable( this.headers );

		this.headers.next()
			.addClass( "ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom" )
			.hide();

		// don't allow collapsible: false and active: false / null
		if ( !options.collapsible && (options.active === false || options.active == null) ) {
			options.active = 0;
		}
		// handle negative values
		if ( options.active < 0 ) {
			options.active += this.headers.length;
		}
		this.active = this._findActive( options.active )
			.addClass( "ui-accordion-header-active ui-state-active" )
			.toggleClass( "ui-corner-all ui-corner-top" );
		this.active.next()
			.addClass( "ui-accordion-content-active" )
			.show();

		this._createIcons();
		this.refresh();

		// ARIA
		this.element.attr( "role", "tablist" );

		this.headers
			.attr( "role", "tab" )
			.each(function( i ) {
				var header = $( this ),
					headerId = header.attr( "id" ),
					panel = header.next(),
					panelId = panel.attr( "id" );
				if ( !headerId ) {
					headerId = accordionId + "-header-" + i;
					header.attr( "id", headerId );
				}
				if ( !panelId ) {
					panelId = accordionId + "-panel-" + i;
					panel.attr( "id", panelId );
				}
				header.attr( "aria-controls", panelId );
				panel.attr( "aria-labelledby", headerId );
			})
			.next()
				.attr( "role", "tabpanel" );

		this.headers
			.not( this.active )
			.attr({
				"aria-selected": "false",
				tabIndex: -1
			})
			.next()
				.attr({
					"aria-expanded": "false",
					"aria-hidden": "true"
				})
				.hide();

		// make sure at least one header is in the tab order
		if ( !this.active.length ) {
			this.headers.eq( 0 ).attr( "tabIndex", 0 );
		} else {
			this.active.attr({
				"aria-selected": "true",
				tabIndex: 0
			})
			.next()
				.attr({
					"aria-expanded": "true",
					"aria-hidden": "false"
				});
		}

		this._on( this.headers, { keydown: "_keydown" });
		this._on( this.headers.next(), { keydown: "_panelKeyDown" });
		this._setupEvents( options.event );
	},

	_getCreateEventData: function() {
		return {
			header: this.active,
			content: !this.active.length ? $() : this.active.next()
		};
	},

	_createIcons: function() {
		var icons = this.options.icons;
		if ( icons ) {
			$( "<span>" )
				.addClass( "ui-accordion-header-icon ui-icon " + icons.header )
				.prependTo( this.headers );
			this.active.children( ".ui-accordion-header-icon" )
				.removeClass( icons.header )
				.addClass( icons.activeHeader );
			this.headers.addClass( "ui-accordion-icons" );
		}
	},

	_destroyIcons: function() {
		this.headers
			.removeClass( "ui-accordion-icons" )
			.children( ".ui-accordion-header-icon" )
				.remove();
	},

	_destroy: function() {
		var contents;

		// clean up main element
		this.element
			.removeClass( "ui-accordion ui-widget ui-helper-reset" )
			.removeAttr( "role" );

		// clean up headers
		this.headers
			.removeClass( "ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top" )
			.removeAttr( "role" )
			.removeAttr( "aria-selected" )
			.removeAttr( "aria-controls" )
			.removeAttr( "tabIndex" )
			.each(function() {
				if ( /^ui-accordion/.test( this.id ) ) {
					this.removeAttribute( "id" );
				}
			});
		this._destroyIcons();

		// clean up content panels
		contents = this.headers.next()
			.css( "display", "" )
			.removeAttr( "role" )
			.removeAttr( "aria-expanded" )
			.removeAttr( "aria-hidden" )
			.removeAttr( "aria-labelledby" )
			.removeClass( "ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled" )
			.each(function() {
				if ( /^ui-accordion/.test( this.id ) ) {
					this.removeAttribute( "id" );
				}
			});
		if ( this.options.heightStyle !== "content" ) {
			contents.css( "height", "" );
		}
	},

	_setOption: function( key, value ) {
		if ( key === "active" ) {
			// _activate() will handle invalid values and update this.options
			this._activate( value );
			return;
		}

		if ( key === "event" ) {
			if ( this.options.event ) {
				this._off( this.headers, this.options.event );
			}
			this._setupEvents( value );
		}

		this._super( key, value );

		// setting collapsible: false while collapsed; open first panel
		if ( key === "collapsible" && !value && this.options.active === false ) {
			this._activate( 0 );
		}

		if ( key === "icons" ) {
			this._destroyIcons();
			if ( value ) {
				this._createIcons();
			}
		}

		// #5332 - opacity doesn't cascade to positioned elements in IE
		// so we need to add the disabled class to the headers and panels
		if ( key === "disabled" ) {
			this.headers.add( this.headers.next() )
				.toggleClass( "ui-state-disabled", !!value );
		}
	},

	_keydown: function( event ) {
		if ( event.altKey || event.ctrlKey ) {
			return;
		}

		var keyCode = $.ui.keyCode,
			length = this.headers.length,
			currentIndex = this.headers.index( event.target ),
			toFocus = false;

		switch ( event.keyCode ) {
			case keyCode.RIGHT:
			case keyCode.DOWN:
				toFocus = this.headers[ ( currentIndex + 1 ) % length ];
				break;
			case keyCode.LEFT:
			case keyCode.UP:
				toFocus = this.headers[ ( currentIndex - 1 + length ) % length ];
				break;
			case keyCode.SPACE:
			case keyCode.ENTER:
				this._eventHandler( event );
				break;
			case keyCode.HOME:
				toFocus = this.headers[ 0 ];
				break;
			case keyCode.END:
				toFocus = this.headers[ length - 1 ];
				break;
		}

		if ( toFocus ) {
			$( event.target ).attr( "tabIndex", -1 );
			$( toFocus ).attr( "tabIndex", 0 );
			toFocus.focus();
			event.preventDefault();
		}
	},

	_panelKeyDown : function( event ) {
		if ( event.keyCode === $.ui.keyCode.UP && event.ctrlKey ) {
			$( event.currentTarget ).prev().focus();
		}
	},

	refresh: function() {
		var maxHeight, overflow,
			heightStyle = this.options.heightStyle,
			parent = this.element.parent();


		if ( heightStyle === "fill" ) {
			// IE 6 treats height like minHeight, so we need to turn off overflow
			// in order to get a reliable height
			// we use the minHeight support test because we assume that only
			// browsers that don't support minHeight will treat height as minHeight
			if ( !$.support.minHeight ) {
				overflow = parent.css( "overflow" );
				parent.css( "overflow", "hidden");
			}
			maxHeight = parent.height();
			this.element.siblings( ":visible" ).each(function() {
				var elem = $( this ),
					position = elem.css( "position" );

				if ( position === "absolute" || position === "fixed" ) {
					return;
				}
				maxHeight -= elem.outerHeight( true );
			});
			if ( overflow ) {
				parent.css( "overflow", overflow );
			}

			this.headers.each(function() {
				maxHeight -= $( this ).outerHeight( true );
			});

			this.headers.next()
				.each(function() {
					$( this ).height( Math.max( 0, maxHeight -
						$( this ).innerHeight() + $( this ).height() ) );
				})
				.css( "overflow", "auto" );
		} else if ( heightStyle === "auto" ) {
			maxHeight = 0;
			this.headers.next()
				.each(function() {
					maxHeight = Math.max( maxHeight, $( this ).css( "height", "" ).height() );
				})
				.height( maxHeight );
		}
	},

	_activate: function( index ) {
		var active = this._findActive( index )[ 0 ];

		// trying to activate the already active panel
		if ( active === this.active[ 0 ] ) {
			return;
		}

		// trying to collapse, simulate a click on the currently active header
		active = active || this.active[ 0 ];

		this._eventHandler({
			target: active,
			currentTarget: active,
			preventDefault: $.noop
		});
	},

	_findActive: function( selector ) {
		return typeof selector === "number" ? this.headers.eq( selector ) : $();
	},

	_setupEvents: function( event ) {
		var events = {};
		if ( !event ) {
			return;
		}
		$.each( event.split(" "), function( index, eventName ) {
			events[ eventName ] = "_eventHandler";
		});
		this._on( this.headers, events );
	},

	_eventHandler: function( event ) {
		var options = this.options,
			active = this.active,
			clicked = $( event.currentTarget ),
			clickedIsActive = clicked[ 0 ] === active[ 0 ],
			collapsing = clickedIsActive && options.collapsible,
			toShow = collapsing ? $() : clicked.next(),
			toHide = active.next(),
			eventData = {
				oldHeader: active,
				oldPanel: toHide,
				newHeader: collapsing ? $() : clicked,
				newPanel: toShow
			};

		event.preventDefault();

		if (
				// click on active header, but not collapsible
				( clickedIsActive && !options.collapsible ) ||
				// allow canceling activation
				( this._trigger( "beforeActivate", event, eventData ) === false ) ) {
			return;
		}

		options.active = collapsing ? false : this.headers.index( clicked );

		// when the call to ._toggle() comes after the class changes
		// it causes a very odd bug in IE 8 (see #6720)
		this.active = clickedIsActive ? $() : clicked;
		this._toggle( eventData );

		// switch classes
		// corner classes on the previously active header stay after the animation
		active.removeClass( "ui-accordion-header-active ui-state-active" );
		if ( options.icons ) {
			active.children( ".ui-accordion-header-icon" )
				.removeClass( options.icons.activeHeader )
				.addClass( options.icons.header );
		}

		if ( !clickedIsActive ) {
			clicked
				.removeClass( "ui-corner-all" )
				.addClass( "ui-accordion-header-active ui-state-active ui-corner-top" );
			if ( options.icons ) {
				clicked.children( ".ui-accordion-header-icon" )
					.removeClass( options.icons.header )
					.addClass( options.icons.activeHeader );
			}

			clicked
				.next()
				.addClass( "ui-accordion-content-active" );
		}
	},

	_toggle: function( data ) {
		var toShow = data.newPanel,
			toHide = this.prevShow.length ? this.prevShow : data.oldPanel;

		// handle activating a panel during the animation for another activation
		this.prevShow.add( this.prevHide ).stop( true, true );
		this.prevShow = toShow;
		this.prevHide = toHide;

		if ( this.options.animate ) {
			this._animate( toShow, toHide, data );
		} else {
			toHide.hide();
			toShow.show();
			this._toggleComplete( data );
		}

		toHide.attr({
			"aria-expanded": "false",
			"aria-hidden": "true"
		});
		toHide.prev().attr( "aria-selected", "false" );
		// if we're switching panels, remove the old header from the tab order
		// if we're opening from collapsed state, remove the previous header from the tab order
		// if we're collapsing, then keep the collapsing header in the tab order
		if ( toShow.length && toHide.length ) {
			toHide.prev().attr( "tabIndex", -1 );
		} else if ( toShow.length ) {
			this.headers.filter(function() {
				return $( this ).attr( "tabIndex" ) === 0;
			})
			.attr( "tabIndex", -1 );
		}

		toShow
			.attr({
				"aria-expanded": "true",
				"aria-hidden": "false"
			})
			.prev()
				.attr({
					"aria-selected": "true",
					tabIndex: 0
				});
	},

	_animate: function( toShow, toHide, data ) {
		var total, easing, duration,
			that = this,
			adjust = 0,
			down = toShow.length &&
				( !toHide.length || ( toShow.index() < toHide.index() ) ),
			animate = this.options.animate || {},
			options = down && animate.down || animate,
			complete = function() {
				that._toggleComplete( data );
			};

		if ( typeof options === "number" ) {
			duration = options;
		}
		if ( typeof options === "string" ) {
			easing = options;
		}
		// fall back from options to animation in case of partial down settings
		easing = easing || options.easing || animate.easing;
		duration = duration || options.duration || animate.duration;

		if ( !toHide.length ) {
			return toShow.animate( showProps, duration, easing, complete );
		}
		if ( !toShow.length ) {
			return toHide.animate( hideProps, duration, easing, complete );
		}

		total = toShow.show().outerHeight();
		toHide.animate( hideProps, {
			duration: duration,
			easing: easing,
			step: function( now, fx ) {
				fx.now = Math.round( now );
			}
		});
		toShow
			.hide()
			.animate( showProps, {
				duration: duration,
				easing: easing,
				complete: complete,
				step: function( now, fx ) {
					fx.now = Math.round( now );
					if ( fx.prop !== "height" ) {
						adjust += fx.now;
					} else if ( that.options.heightStyle !== "content" ) {
						fx.now = Math.round( total - toHide.outerHeight() - adjust );
						adjust = 0;
					}
				}
			});
	},

	_toggleComplete: function( data ) {
		var toHide = data.oldPanel;

		toHide
			.removeClass( "ui-accordion-content-active" )
			.prev()
				.removeClass( "ui-corner-top" )
				.addClass( "ui-corner-all" );

		// Work around for rendering bug in IE (#5421)
		if ( toHide.length ) {
			toHide.parent()[0].className = toHide.parent()[0].className;
		}

		this._trigger( "activate", null, data );
	}
});



// DEPRECATED
if ( $.uiBackCompat !== false ) {
	// navigation options
	(function( $, prototype ) {
		$.extend( prototype.options, {
			navigation: false,
			navigationFilter: function() {
				return this.href.toLowerCase() === location.href.toLowerCase();
			}
		});

		var _create = prototype._create;
		prototype._create = function() {
			if ( this.options.navigation ) {
				var that = this,
					headers = this.element.find( this.options.header ),
					content = headers.next(),
					current = headers.add( content )
						.find( "a" )
						.filter( this.options.navigationFilter )
						[ 0 ];
				if ( current ) {
					headers.add( content ).each( function( index ) {
						if ( $.contains( this, current ) ) {
							that.options.active = Math.floor( index / 2 );
							return false;
						}
					});
				}
			}
			_create.call( this );
		};
	}( jQuery, jQuery.ui.accordion.prototype ) );

	// height options
	(function( $, prototype ) {
		$.extend( prototype.options, {
			heightStyle: null, // remove default so we fall back to old values
			autoHeight: true, // use heightStyle: "auto"
			clearStyle: false, // use heightStyle: "content"
			fillSpace: false // use heightStyle: "fill"
		});

		var _create = prototype._create,
			_setOption = prototype._setOption;

		$.extend( prototype, {
			_create: function() {
				this.options.heightStyle = this.options.heightStyle ||
					this._mergeHeightStyle();

				_create.call( this );
			},

			_setOption: function( key ) {
				if ( key === "autoHeight" || key === "clearStyle" || key === "fillSpace" ) {
					this.options.heightStyle = this._mergeHeightStyle();
				}
				_setOption.apply( this, arguments );
			},

			_mergeHeightStyle: function() {
				var options = this.options;

				if ( options.fillSpace ) {
					return "fill";
				}

				if ( options.clearStyle ) {
					return "content";
				}

				if ( options.autoHeight ) {
					return "auto";
				}
			}
		});
	}( jQuery, jQuery.ui.accordion.prototype ) );

	// icon options
	(function( $, prototype ) {
		$.extend( prototype.options.icons, {
			activeHeader: null, // remove default so we fall back to old values
			headerSelected: "ui-icon-triangle-1-s"
		});

		var _createIcons = prototype._createIcons;
		prototype._createIcons = function() {
			if ( this.options.icons ) {
				this.options.icons.activeHeader = this.options.icons.activeHeader ||
					this.options.icons.headerSelected;
			}
			_createIcons.call( this );
		};
	}( jQuery, jQuery.ui.accordion.prototype ) );

	// expanded active option, activate method
	(function( $, prototype ) {
		prototype.activate = prototype._activate;

		var _findActive = prototype._findActive;
		prototype._findActive = function( index ) {
			if ( index === -1 ) {
				index = false;
			}
			if ( index && typeof index !== "number" ) {
				index = this.headers.index( this.headers.filter( index ) );
				if ( index === -1 ) {
					index = false;
				}
			}
			return _findActive.call( this, index );
		};
	}( jQuery, jQuery.ui.accordion.prototype ) );

	// resize method
	jQuery.ui.accordion.prototype.resize = jQuery.ui.accordion.prototype.refresh;

	// change events
	(function( $, prototype ) {
		$.extend( prototype.options, {
			change: null,
			changestart: null
		});

		var _trigger = prototype._trigger;
		prototype._trigger = function( type, event, data ) {
			var ret = _trigger.apply( this, arguments );
			if ( !ret ) {
				return false;
			}

			if ( type === "beforeActivate" ) {
				ret = _trigger.call( this, "changestart", event, {
					oldHeader: data.oldHeader,
					oldContent: data.oldPanel,
					newHeader: data.newHeader,
					newContent: data.newPanel
				});
			} else if ( type === "activate" ) {
				ret = _trigger.call( this, "change", event, {
					oldHeader: data.oldHeader,
					oldContent: data.oldPanel,
					newHeader: data.newHeader,
					newContent: data.newPanel
				});
			}
			return ret;
		};
	}( jQuery, jQuery.ui.accordion.prototype ) );

	// animated option
	// NOTE: this only provides support for "slide", "bounceslide", and easings
	// not the full $.ui.accordion.animations API
	(function( $, prototype ) {
		$.extend( prototype.options, {
			animate: null,
			animated: "slide"
		});

		var _create = prototype._create;
		prototype._create = function() {
			var options = this.options;
			if ( options.animate === null ) {
				if ( !options.animated ) {
					options.animate = false;
				} else if ( options.animated === "slide" ) {
					options.animate = 300;
				} else if ( options.animated === "bounceslide" ) {
					options.animate = {
						duration: 200,
						down: {
							easing: "easeOutBounce",
							duration: 1000
						}
					};
				} else {
					options.animate = options.animated;
				}
			}

			_create.call( this );
		};
	}( jQuery, jQuery.ui.accordion.prototype ) );
}

})( jQuery );
(function( $, undefined ) {

// used to prevent race conditions with remote data sources
var requestIndex = 0;

$.widget( "ui.autocomplete", {
	version: "1.9.2",
	defaultElement: "<input>",
	options: {
		appendTo: "body",
		autoFocus: false,
		delay: 300,
		minLength: 1,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		source: null,

		// callbacks
		change: null,
		close: null,
		focus: null,
		open: null,
		response: null,
		search: null,
		select: null
	},

	pending: 0,

	_create: function() {
		// Some browsers only repeat keydown events, not keypress events,
		// so we use the suppressKeyPress flag to determine if we've already
		// handled the keydown event. #7269
		// Unfortunately the code for & in keypress is the same as the up arrow,
		// so we use the suppressKeyPressRepeat flag to avoid handling keypress
		// events when we know the keydown event was used to modify the
		// search term. #7799
		var suppressKeyPress, suppressKeyPressRepeat, suppressInput;

		this.isMultiLine = this._isMultiLine();
		this.valueMethod = this.element[ this.element.is( "input,textarea" ) ? "val" : "text" ];
		this.isNewMenu = true;

		this.element
			.addClass( "ui-autocomplete-input" )
			.attr( "autocomplete", "off" );

		this._on( this.element, {
			keydown: function( event ) {
				if ( this.element.prop( "readOnly" ) ) {
					suppressKeyPress = true;
					suppressInput = true;
					suppressKeyPressRepeat = true;
					return;
				}

				suppressKeyPress = false;
				suppressInput = false;
				suppressKeyPressRepeat = false;
				var keyCode = $.ui.keyCode;
				switch( event.keyCode ) {
				case keyCode.PAGE_UP:
					suppressKeyPress = true;
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					suppressKeyPress = true;
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					suppressKeyPress = true;
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					suppressKeyPress = true;
					this._keyEvent( "next", event );
					break;
				case keyCode.ENTER:
				case keyCode.NUMPAD_ENTER:
					// when menu is open and has focus
					if ( this.menu.active ) {
						// #6055 - Opera still allows the keypress to occur
						// which causes forms to submit
						suppressKeyPress = true;
						event.preventDefault();
						this.menu.select( event );
					}
					break;
				case keyCode.TAB:
					if ( this.menu.active ) {
						this.menu.select( event );
					}
					break;
				case keyCode.ESCAPE:
					if ( this.menu.element.is( ":visible" ) ) {
						this._value( this.term );
						this.close( event );
						// Different browsers have different default behavior for escape
						// Single press can mean undo or clear
						// Double press in IE means clear the whole form
						event.preventDefault();
					}
					break;
				default:
					suppressKeyPressRepeat = true;
					// search timeout should be triggered before the input value is changed
					this._searchTimeout( event );
					break;
				}
			},
			keypress: function( event ) {
				if ( suppressKeyPress ) {
					suppressKeyPress = false;
					event.preventDefault();
					return;
				}
				if ( suppressKeyPressRepeat ) {
					return;
				}

				// replicate some key handlers to allow them to repeat in Firefox and Opera
				var keyCode = $.ui.keyCode;
				switch( event.keyCode ) {
				case keyCode.PAGE_UP:
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					this._keyEvent( "next", event );
					break;
				}
			},
			input: function( event ) {
				if ( suppressInput ) {
					suppressInput = false;
					event.preventDefault();
					return;
				}
				this._searchTimeout( event );
			},
			focus: function() {
				this.selectedItem = null;
				this.previous = this._value();
			},
			blur: function( event ) {
				if ( this.cancelBlur ) {
					delete this.cancelBlur;
					return;
				}

				clearTimeout( this.searching );
				this.close( event );
				this._change( event );
			}
		});

		this._initSource();
		this.menu = $( "<ul>" )
			.addClass( "ui-autocomplete" )
			.appendTo( this.document.find( this.options.appendTo || "body" )[ 0 ] )
			.menu({
				// custom key handling for now
				input: $(),
				// disable ARIA support, the live region takes care of that
				role: null
			})
			.zIndex( this.element.zIndex() + 1 )
			.hide()
			.data( "menu" );

		this._on( this.menu.element, {
			mousedown: function( event ) {
				// prevent moving focus out of the text field
				event.preventDefault();

				// IE doesn't prevent moving focus even with event.preventDefault()
				// so we set a flag to know when we should ignore the blur event
				this.cancelBlur = true;
				this._delay(function() {
					delete this.cancelBlur;
				});

				// clicking on the scrollbar causes focus to shift to the body
				// but we can't detect a mouseup or a click immediately afterward
				// so we have to track the next mousedown and close the menu if
				// the user clicks somewhere outside of the autocomplete
				var menuElement = this.menu.element[ 0 ];
				if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
					this._delay(function() {
						var that = this;
						this.document.one( "mousedown", function( event ) {
							if ( event.target !== that.element[ 0 ] &&
									event.target !== menuElement &&
									!$.contains( menuElement, event.target ) ) {
								that.close();
							}
						});
					});
				}
			},
			menufocus: function( event, ui ) {
				// #7024 - Prevent accidental activation of menu items in Firefox
				if ( this.isNewMenu ) {
					this.isNewMenu = false;
					if ( event.originalEvent && /^mouse/.test( event.originalEvent.type ) ) {
						this.menu.blur();

						this.document.one( "mousemove", function() {
							$( event.target ).trigger( event.originalEvent );
						});

						return;
					}
				}

				// back compat for _renderItem using item.autocomplete, via #7810
				// TODO remove the fallback, see #8156
				var item = ui.item.data( "ui-autocomplete-item" ) || ui.item.data( "item.autocomplete" );
				if ( false !== this._trigger( "focus", event, { item: item } ) ) {
					// use value to match what will end up in the input, if it was a key event
					if ( event.originalEvent && /^key/.test( event.originalEvent.type ) ) {
						this._value( item.value );
					}
				} else {
					// Normally the input is populated with the item's value as the
					// menu is navigated, causing screen readers to notice a change and
					// announce the item. Since the focus event was canceled, this doesn't
					// happen, so we update the live region so that screen readers can
					// still notice the change and announce it.
					this.liveRegion.text( item.value );
				}
			},
			menuselect: function( event, ui ) {
				// back compat for _renderItem using item.autocomplete, via #7810
				// TODO remove the fallback, see #8156
				var item = ui.item.data( "ui-autocomplete-item" ) || ui.item.data( "item.autocomplete" ),
					previous = this.previous;

				// only trigger when focus was lost (click on menu)
				if ( this.element[0] !== this.document[0].activeElement ) {
					this.element.focus();
					this.previous = previous;
					// #6109 - IE triggers two focus events and the second
					// is asynchronous, so we need to reset the previous
					// term synchronously and asynchronously :-(
					this._delay(function() {
						this.previous = previous;
						this.selectedItem = item;
					});
				}

				if ( false !== this._trigger( "select", event, { item: item } ) ) {
					this._value( item.value );
				}
				// reset the term after the select event
				// this allows custom select handling to work properly
				this.term = this._value();

				this.close( event );
				this.selectedItem = item;
			}
		});

		this.liveRegion = $( "<span>", {
				role: "status",
				"aria-live": "polite"
			})
			.addClass( "ui-helper-hidden-accessible" )
			.insertAfter( this.element );

		if ( $.fn.bgiframe ) {
			this.menu.element.bgiframe();
		}

		// turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeAttr( "autocomplete" );
			}
		});
	},

	_destroy: function() {
		clearTimeout( this.searching );
		this.element
			.removeClass( "ui-autocomplete-input" )
			.removeAttr( "autocomplete" );
		this.menu.element.remove();
		this.liveRegion.remove();
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "source" ) {
			this._initSource();
		}
		if ( key === "appendTo" ) {
			this.menu.element.appendTo( this.document.find( value || "body" )[0] );
		}
		if ( key === "disabled" && value && this.xhr ) {
			this.xhr.abort();
		}
	},

	_isMultiLine: function() {
		// Textareas are always multi-line
		if ( this.element.is( "textarea" ) ) {
			return true;
		}
		// Inputs are always single-line, even if inside a contentEditable element
		// IE also treats inputs as contentEditable
		if ( this.element.is( "input" ) ) {
			return false;
		}
		// All other element types are determined by whether or not they're contentEditable
		return this.element.prop( "isContentEditable" );
	},

	_initSource: function() {
		var array, url,
			that = this;
		if ( $.isArray(this.options.source) ) {
			array = this.options.source;
			this.source = function( request, response ) {
				response( $.ui.autocomplete.filter( array, request.term ) );
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if ( that.xhr ) {
					that.xhr.abort();
				}
				that.xhr = $.ajax({
					url: url,
					data: request,
					dataType: "json",
					success: function( data ) {
						response( data );
					},
					error: function() {
						response( [] );
					}
				});
			};
		} else {
			this.source = this.options.source;
		}
	},

	_searchTimeout: function( event ) {
		clearTimeout( this.searching );
		this.searching = this._delay(function() {
			// only search if the value has changed
			if ( this.term !== this._value() ) {
				this.selectedItem = null;
				this.search( null, event );
			}
		}, this.options.delay );
	},

	search: function( value, event ) {
		value = value != null ? value : this._value();

		// always save the actual value, not the one passed as an argument
		this.term = this._value();

		if ( value.length < this.options.minLength ) {
			return this.close( event );
		}

		if ( this._trigger( "search", event ) === false ) {
			return;
		}

		return this._search( value );
	},

	_search: function( value ) {
		this.pending++;
		this.element.addClass( "ui-autocomplete-loading" );
		this.cancelSearch = false;

		this.source( { term: value }, this._response() );
	},

	_response: function() {
		var that = this,
			index = ++requestIndex;

		return function( content ) {
			if ( index === requestIndex ) {
				that.__response( content );
			}

			that.pending--;
			if ( !that.pending ) {
				that.element.removeClass( "ui-autocomplete-loading" );
			}
		};
	},

	__response: function( content ) {
		if ( content ) {
			content = this._normalize( content );
		}
		this._trigger( "response", null, { content: content } );
		if ( !this.options.disabled && content && content.length && !this.cancelSearch ) {
			this._suggest( content );
			this._trigger( "open" );
		} else {
			// use ._close() instead of .close() so we don't cancel future searches
			this._close();
		}
	},

	close: function( event ) {
		this.cancelSearch = true;
		this._close( event );
	},

	_close: function( event ) {
		if ( this.menu.element.is( ":visible" ) ) {
			this.menu.element.hide();
			this.menu.blur();
			this.isNewMenu = true;
			this._trigger( "close", event );
		}
	},

	_change: function( event ) {
		if ( this.previous !== this._value() ) {
			this._trigger( "change", event, { item: this.selectedItem } );
		}
	},

	_normalize: function( items ) {
		// assume all items have the right format when the first item is complete
		if ( items.length && items[0].label && items[0].value ) {
			return items;
		}
		return $.map( items, function( item ) {
			if ( typeof item === "string" ) {
				return {
					label: item,
					value: item
				};
			}
			return $.extend({
				label: item.label || item.value,
				value: item.value || item.label
			}, item );
		});
	},

	_suggest: function( items ) {
		var ul = this.menu.element
			.empty()
			.zIndex( this.element.zIndex() + 1 );
		this._renderMenu( ul, items );
		this.menu.refresh();

		// size and position menu
		ul.show();
		this._resizeMenu();
		ul.position( $.extend({
			of: this.element
		}, this.options.position ));

		if ( this.options.autoFocus ) {
			this.menu.next();
		}
	},

	_resizeMenu: function() {
		var ul = this.menu.element;
		ul.outerWidth( Math.max(
			// Firefox wraps long text (possibly a rounding bug)
			// so we add 1px to avoid the wrapping (#7513)
			ul.width( "" ).outerWidth() + 1,
			this.element.outerWidth()
		) );
	},

	_renderMenu: function( ul, items ) {
		var that = this;
		$.each( items, function( index, item ) {
			that._renderItemData( ul, item );
		});
	},

	_renderItemData: function( ul, item ) {
		return this._renderItem( ul, item ).data( "ui-autocomplete-item", item );
	},

	_renderItem: function( ul, item ) {
		return $( "<li>" )
			.append( $( "<a>" ).text( item.label ) )
			.appendTo( ul );
	},

	_move: function( direction, event ) {
		if ( !this.menu.element.is( ":visible" ) ) {
			this.search( null, event );
			return;
		}
		if ( this.menu.isFirstItem() && /^previous/.test( direction ) ||
				this.menu.isLastItem() && /^next/.test( direction ) ) {
			this._value( this.term );
			this.menu.blur();
			return;
		}
		this.menu[ direction ]( event );
	},

	widget: function() {
		return this.menu.element;
	},

	_value: function() {
		return this.valueMethod.apply( this.element, arguments );
	},

	_keyEvent: function( keyEvent, event ) {
		if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
			this._move( keyEvent, event );

			// prevents moving cursor to beginning/end of the text field in some browsers
			event.preventDefault();
		}
	}
});

$.extend( $.ui.autocomplete, {
	escapeRegex: function( value ) {
		return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
	},
	filter: function(array, term) {
		var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
		return $.grep( array, function(value) {
			return matcher.test( value.label || value.value || value );
		});
	}
});


// live region extension, adding a `messages` option
// NOTE: This is an experimental API. We are still investigating
// a full solution for string manipulation and internationalization.
$.widget( "ui.autocomplete", $.ui.autocomplete, {
	options: {
		messages: {
			noResults: "No search results.",
			results: function( amount ) {
				return amount + ( amount > 1 ? " results are" : " result is" ) +
					" available, use up and down arrow keys to navigate.";
			}
		}
	},

	__response: function( content ) {
		var message;
		this._superApply( arguments );
		if ( this.options.disabled || this.cancelSearch ) {
			return;
		}
		if ( content && content.length ) {
			message = this.options.messages.results( content.length );
		} else {
			message = this.options.messages.noResults;
		}
		this.liveRegion.text( message );
	}
});


}( jQuery ));
(function( $, undefined ) {

var lastActive, startXPos, startYPos, clickDragged,
	baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
	stateClasses = "ui-state-hover ui-state-active ",
	typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
	formResetHandler = function() {
		var buttons = $( this ).find( ":ui-button" );
		setTimeout(function() {
			buttons.button( "refresh" );
		}, 1 );
	},
	radioGroup = function( radio ) {
		var name = radio.name,
			form = radio.form,
			radios = $( [] );
		if ( name ) {
			if ( form ) {
				radios = $( form ).find( "[name='" + name + "']" );
			} else {
				radios = $( "[name='" + name + "']", radio.ownerDocument )
					.filter(function() {
						return !this.form;
					});
			}
		}
		return radios;
	};

$.widget( "ui.button", {
	version: "1.9.2",
	defaultElement: "<button>",
	options: {
		disabled: null,
		text: true,
		label: null,
		icons: {
			primary: null,
			secondary: null
		}
	},
	_create: function() {
		this.element.closest( "form" )
			.unbind( "reset" + this.eventNamespace )
			.bind( "reset" + this.eventNamespace, formResetHandler );

		if ( typeof this.options.disabled !== "boolean" ) {
			this.options.disabled = !!this.element.prop( "disabled" );
		} else {
			this.element.prop( "disabled", this.options.disabled );
		}

		this._determineButtonType();
		this.hasTitle = !!this.buttonElement.attr( "title" );

		var that = this,
			options = this.options,
			toggleButton = this.type === "checkbox" || this.type === "radio",
			activeClass = !toggleButton ? "ui-state-active" : "",
			focusClass = "ui-state-focus";

		if ( options.label === null ) {
			options.label = (this.type === "input" ? this.buttonElement.val() : this.buttonElement.html());
		}

		this._hoverable( this.buttonElement );

		this.buttonElement
			.addClass( baseClasses )
			.attr( "role", "button" )
			.bind( "mouseenter" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return;
				}
				if ( this === lastActive ) {
					$( this ).addClass( "ui-state-active" );
				}
			})
			.bind( "mouseleave" + this.eventNamespace, function() {
				if ( options.disabled ) {
					return;
				}
				$( this ).removeClass( activeClass );
			})
			.bind( "click" + this.eventNamespace, function( event ) {
				if ( options.disabled ) {
					event.preventDefault();
					event.stopImmediatePropagation();
				}
			});

		this.element
			.bind( "focus" + this.eventNamespace, function() {
				// no need to check disabled, focus won't be triggered anyway
				that.buttonElement.addClass( focusClass );
			})
			.bind( "blur" + this.eventNamespace, function() {
				that.buttonElement.removeClass( focusClass );
			});

		if ( toggleButton ) {
			this.element.bind( "change" + this.eventNamespace, function() {
				if ( clickDragged ) {
					return;
				}
				that.refresh();
			});
			// if mouse moves between mousedown and mouseup (drag) set clickDragged flag
			// prevents issue where button state changes but checkbox/radio checked state
			// does not in Firefox (see ticket #6970)
			this.buttonElement
				.bind( "mousedown" + this.eventNamespace, function( event ) {
					if ( options.disabled ) {
						return;
					}
					clickDragged = false;
					startXPos = event.pageX;
					startYPos = event.pageY;
				})
				.bind( "mouseup" + this.eventNamespace, function( event ) {
					if ( options.disabled ) {
						return;
					}
					if ( startXPos !== event.pageX || startYPos !== event.pageY ) {
						clickDragged = true;
					}
			});
		}

		if ( this.type === "checkbox" ) {
			this.buttonElement.bind( "click" + this.eventNamespace, function() {
				if ( options.disabled || clickDragged ) {
					return false;
				}
				$( this ).toggleClass( "ui-state-active" );
				that.buttonElement.attr( "aria-pressed", that.element[0].checked );
			});
		} else if ( this.type === "radio" ) {
			this.buttonElement.bind( "click" + this.eventNamespace, function() {
				if ( options.disabled || clickDragged ) {
					return false;
				}
				$( this ).addClass( "ui-state-active" );
				that.buttonElement.attr( "aria-pressed", "true" );

				var radio = that.element[ 0 ];
				radioGroup( radio )
					.not( radio )
					.map(function() {
						return $( this ).button( "widget" )[ 0 ];
					})
					.removeClass( "ui-state-active" )
					.attr( "aria-pressed", "false" );
			});
		} else {
			this.buttonElement
				.bind( "mousedown" + this.eventNamespace, function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).addClass( "ui-state-active" );
					lastActive = this;
					that.document.one( "mouseup", function() {
						lastActive = null;
					});
				})
				.bind( "mouseup" + this.eventNamespace, function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).removeClass( "ui-state-active" );
				})
				.bind( "keydown" + this.eventNamespace, function(event) {
					if ( options.disabled ) {
						return false;
					}
					if ( event.keyCode === $.ui.keyCode.SPACE || event.keyCode === $.ui.keyCode.ENTER ) {
						$( this ).addClass( "ui-state-active" );
					}
				})
				.bind( "keyup" + this.eventNamespace, function() {
					$( this ).removeClass( "ui-state-active" );
				});

			if ( this.buttonElement.is("a") ) {
				this.buttonElement.keyup(function(event) {
					if ( event.keyCode === $.ui.keyCode.SPACE ) {
						// TODO pass through original event correctly (just as 2nd argument doesn't work)
						$( this ).click();
					}
				});
			}
		}

		// TODO: pull out $.Widget's handling for the disabled option into
		// $.Widget.prototype._setOptionDisabled so it's easy to proxy and can
		// be overridden by individual plugins
		this._setOption( "disabled", options.disabled );
		this._resetButton();
	},

	_determineButtonType: function() {
		var ancestor, labelSelector, checked;

		if ( this.element.is("[type=checkbox]") ) {
			this.type = "checkbox";
		} else if ( this.element.is("[type=radio]") ) {
			this.type = "radio";
		} else if ( this.element.is("input") ) {
			this.type = "input";
		} else {
			this.type = "button";
		}

		if ( this.type === "checkbox" || this.type === "radio" ) {
			// we don't search against the document in case the element
			// is disconnected from the DOM
			ancestor = this.element.parents().last();
			labelSelector = "label[for='" + this.element.attr("id") + "']";
			this.buttonElement = ancestor.find( labelSelector );
			if ( !this.buttonElement.length ) {
				ancestor = ancestor.length ? ancestor.siblings() : this.element.siblings();
				this.buttonElement = ancestor.filter( labelSelector );
				if ( !this.buttonElement.length ) {
					this.buttonElement = ancestor.find( labelSelector );
				}
			}
			this.element.addClass( "ui-helper-hidden-accessible" );

			checked = this.element.is( ":checked" );
			if ( checked ) {
				this.buttonElement.addClass( "ui-state-active" );
			}
			this.buttonElement.prop( "aria-pressed", checked );
		} else {
			this.buttonElement = this.element;
		}
	},

	widget: function() {
		return this.buttonElement;
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-helper-hidden-accessible" );
		this.buttonElement
			.removeClass( baseClasses + " " + stateClasses + " " + typeClasses )
			.removeAttr( "role" )
			.removeAttr( "aria-pressed" )
			.html( this.buttonElement.find(".ui-button-text").html() );

		if ( !this.hasTitle ) {
			this.buttonElement.removeAttr( "title" );
		}
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "disabled" ) {
			if ( value ) {
				this.element.prop( "disabled", true );
			} else {
				this.element.prop( "disabled", false );
			}
			return;
		}
		this._resetButton();
	},

	refresh: function() {
		//See #8237 & #8828
		var isDisabled = this.element.is( "input, button" ) ? this.element.is( ":disabled" ) : this.element.hasClass( "ui-button-disabled" );

		if ( isDisabled !== this.options.disabled ) {
			this._setOption( "disabled", isDisabled );
		}
		if ( this.type === "radio" ) {
			radioGroup( this.element[0] ).each(function() {
				if ( $( this ).is( ":checked" ) ) {
					$( this ).button( "widget" )
						.addClass( "ui-state-active" )
						.attr( "aria-pressed", "true" );
				} else {
					$( this ).button( "widget" )
						.removeClass( "ui-state-active" )
						.attr( "aria-pressed", "false" );
				}
			});
		} else if ( this.type === "checkbox" ) {
			if ( this.element.is( ":checked" ) ) {
				this.buttonElement
					.addClass( "ui-state-active" )
					.attr( "aria-pressed", "true" );
			} else {
				this.buttonElement
					.removeClass( "ui-state-active" )
					.attr( "aria-pressed", "false" );
			}
		}
	},

	_resetButton: function() {
		if ( this.type === "input" ) {
			if ( this.options.label ) {
				this.element.val( this.options.label );
			}
			return;
		}
		var buttonElement = this.buttonElement.removeClass( typeClasses ),
			buttonText = $( "<span></span>", this.document[0] )
				.addClass( "ui-button-text" )
				.html( this.options.label )
				.appendTo( buttonElement.empty() )
				.text(),
			icons = this.options.icons,
			multipleIcons = icons.primary && icons.secondary,
			buttonClasses = [];

		if ( icons.primary || icons.secondary ) {
			if ( this.options.text ) {
				buttonClasses.push( "ui-button-text-icon" + ( multipleIcons ? "s" : ( icons.primary ? "-primary" : "-secondary" ) ) );
			}

			if ( icons.primary ) {
				buttonElement.prepend( "<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>" );
			}

			if ( icons.secondary ) {
				buttonElement.append( "<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>" );
			}

			if ( !this.options.text ) {
				buttonClasses.push( multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only" );

				if ( !this.hasTitle ) {
					buttonElement.attr( "title", $.trim( buttonText ) );
				}
			}
		} else {
			buttonClasses.push( "ui-button-text-only" );
		}
		buttonElement.addClass( buttonClasses.join( " " ) );
	}
});

$.widget( "ui.buttonset", {
	version: "1.9.2",
	options: {
		items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(button)"
	},

	_create: function() {
		this.element.addClass( "ui-buttonset" );
	},

	_init: function() {
		this.refresh();
	},

	_setOption: function( key, value ) {
		if ( key === "disabled" ) {
			this.buttons.button( "option", key, value );
		}

		this._super( key, value );
	},

	refresh: function() {
		var rtl = this.element.css( "direction" ) === "rtl";

		this.buttons = this.element.find( this.options.items )
			.filter( ":ui-button" )
				.button( "refresh" )
			.end()
			.not( ":ui-button" )
				.button()
			.end()
			.map(function() {
				return $( this ).button( "widget" )[ 0 ];
			})
				.removeClass( "ui-corner-all ui-corner-left ui-corner-right" )
				.filter( ":first" )
					.addClass( rtl ? "ui-corner-right" : "ui-corner-left" )
				.end()
				.filter( ":last" )
					.addClass( rtl ? "ui-corner-left" : "ui-corner-right" )
				.end()
			.end();
	},

	_destroy: function() {
		this.element.removeClass( "ui-buttonset" );
		this.buttons
			.map(function() {
				return $( this ).button( "widget" )[ 0 ];
			})
				.removeClass( "ui-corner-left ui-corner-right" )
			.end()
			.button( "destroy" );
	}
});

}( jQuery ) );
(function( $, undefined ) {

$.extend($.ui, { datepicker: { version: "1.9.2" } });

var PROP_NAME = 'datepicker';
var dpuuid = new Date().getTime();
var instActive;

/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
	this.debug = false; // Change this to true to start debugging
	this._curInst = null; // The current instance in use
	this._keyEvent = false; // If the last event was a key event
	this._disabledInputs = []; // List of date picker inputs that have been disabled
	this._datepickerShowing = false; // True if the popup picker is showing , false if not
	this._inDialog = false; // True if showing within a "dialog", false if not
	this._mainDivId = 'ui-datepicker-div'; // The ID of the main datepicker division
	this._inlineClass = 'ui-datepicker-inline'; // The name of the inline marker class
	this._appendClass = 'ui-datepicker-append'; // The name of the append marker class
	this._triggerClass = 'ui-datepicker-trigger'; // The name of the trigger marker class
	this._dialogClass = 'ui-datepicker-dialog'; // The name of the dialog marker class
	this._disableClass = 'ui-datepicker-disabled'; // The name of the disabled covering marker class
	this._unselectableClass = 'ui-datepicker-unselectable'; // The name of the unselectable cell marker class
	this._currentClass = 'ui-datepicker-current-day'; // The name of the current day marker class
	this._dayOverClass = 'ui-datepicker-days-cell-over'; // The name of the day hover marker class
	this.regional = []; // Available regional settings, indexed by language code
	this.regional[''] = { // Default regional settings
		closeText: 'Done', // Display text for close link
		prevText: 'Prev', // Display text for previous month link
		nextText: 'Next', // Display text for next month link
		currentText: 'Today', // Display text for current month link
		monthNames: ['January','February','March','April','May','June',
			'July','August','September','October','November','December'], // Names of months for drop-down and formatting
		monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // For formatting
		dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], // For formatting
		dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // For formatting
		dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'], // Column headings for days starting at Sunday
		weekHeader: 'Wk', // Column header for week of the year
		dateFormat: 'mm/dd/yy', // See format options on parseDate
		firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
		isRTL: false, // True if right-to-left language, false if left-to-right
		showMonthAfterYear: false, // True if the year select precedes month, false for month then year
		yearSuffix: '' // Additional text to append to the year in the month headers
	};
	this._defaults = { // Global defaults for all the date picker instances
		showOn: 'focus', // 'focus' for popup on focus,
			// 'button' for trigger button, or 'both' for either
		showAnim: 'fadeIn', // Name of jQuery animation for popup
		showOptions: {}, // Options for enhanced animations
		defaultDate: null, // Used when field is blank: actual date,
			// +/-number for offset from today, null for today
		appendText: '', // Display text following the input box, e.g. showing the format
		buttonText: '...', // Text for trigger button
		buttonImage: '', // URL for trigger button image
		buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
		hideIfNoPrevNext: false, // True to hide next/previous month links
			// if not applicable, false to just disable them
		navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
		gotoCurrent: false, // True if today link goes back to current selection instead
		changeMonth: false, // True if month can be selected directly, false if only prev/next
		changeYear: false, // True if year can be selected directly, false if only prev/next
		yearRange: 'c-10:c+10', // Range of years to display in drop-down,
			// either relative to today's year (-nn:+nn), relative to currently displayed year
			// (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
		showOtherMonths: false, // True to show dates in other months, false to leave blank
		selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
		showWeek: false, // True to show week of the year, false to not show it
		calculateWeek: this.iso8601Week, // How to calculate the week of the year,
			// takes a Date and returns the number of the week for it
		shortYearCutoff: '+10', // Short year values < this are in the current century,
			// > this are in the previous century,
			// string value starting with '+' for current year + value
		minDate: null, // The earliest selectable date, or null for no limit
		maxDate: null, // The latest selectable date, or null for no limit
		duration: 'fast', // Duration of display/closure
		beforeShowDay: null, // Function that takes a date and returns an array with
			// [0] = true if selectable, false if not, [1] = custom CSS class name(s) or '',
			// [2] = cell title (optional), e.g. $.datepicker.noWeekends
		beforeShow: null, // Function that takes an input field and
			// returns a set of custom settings for the date picker
		onSelect: null, // Define a callback function when a date is selected
		onChangeMonthYear: null, // Define a callback function when the month or year is changed
		onClose: null, // Define a callback function when the datepicker is closed
		numberOfMonths: 1, // Number of months to show at a time
		showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
		stepMonths: 1, // Number of months to step back/forward
		stepBigMonths: 12, // Number of months to step back/forward for the big links
		altField: '', // Selector for an alternate field to store selected dates into
		altFormat: '', // The date format to use for the alternate field
		constrainInput: true, // The input is constrained by the current date format
		showButtonPanel: false, // True to show button panel, false to not show it
		autoSize: false, // True to size the input for the date format, false to leave as is
		disabled: false // The initial disabled state
	};
	$.extend(this._defaults, this.regional['']);
	this.dpDiv = bindHover($('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'));
}

$.extend(Datepicker.prototype, {
	/* Class name added to elements to indicate already configured with a date picker. */
	markerClassName: 'hasDatepicker',

	//Keep track of the maximum number of rows displayed (see #7043)
	maxRows: 4,

	/* Debug logging (if enabled). */
	log: function () {
		if (this.debug)
			console.log.apply('', arguments);
	},

	// TODO rename to "widget" when switching to widget factory
	_widgetDatepicker: function() {
		return this.dpDiv;
	},

	/* Override the default settings for all instances of the date picker.
	   @param  settings  object - the new settings to use as defaults (anonymous object)
	   @return the manager object */
	setDefaults: function(settings) {
		extendRemove(this._defaults, settings || {});
		return this;
	},

	/* Attach the date picker to a jQuery selection.
	   @param  target    element - the target input field or division or span
	   @param  settings  object - the new settings to use for this date picker instance (anonymous) */
	_attachDatepicker: function(target, settings) {
		// check for settings on the control itself - in namespace 'date:'
		var inlineSettings = null;
		for (var attrName in this._defaults) {
			var attrValue = target.getAttribute('date:' + attrName);
			if (attrValue) {
				inlineSettings = inlineSettings || {};
				try {
					inlineSettings[attrName] = eval(attrValue);
				} catch (err) {
					inlineSettings[attrName] = attrValue;
				}
			}
		}
		var nodeName = target.nodeName.toLowerCase();
		var inline = (nodeName == 'div' || nodeName == 'span');
		if (!target.id) {
			this.uuid += 1;
			target.id = 'dp' + this.uuid;
		}
		var inst = this._newInst($(target), inline);
		inst.settings = $.extend({}, settings || {}, inlineSettings || {});
		if (nodeName == 'input') {
			this._connectDatepicker(target, inst);
		} else if (inline) {
			this._inlineDatepicker(target, inst);
		}
	},

	/* Create a new instance object. */
	_newInst: function(target, inline) {
		var id = target[0].id.replace(/([^A-Za-z0-9_-])/g, '\\\\$1'); // escape jQuery meta chars
		return {id: id, input: target, // associated target
			selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
			drawMonth: 0, drawYear: 0, // month being drawn
			inline: inline, // is datepicker inline or not
			dpDiv: (!inline ? this.dpDiv : // presentation div
			bindHover($('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')))};
	},

	/* Attach the date picker to an input field. */
	_connectDatepicker: function(target, inst) {
		var input = $(target);
		inst.append = $([]);
		inst.trigger = $([]);
		if (input.hasClass(this.markerClassName))
			return;
		this._attachments(input, inst);
		input.addClass(this.markerClassName).keydown(this._doKeyDown).
			keypress(this._doKeyPress).keyup(this._doKeyUp).
			bind("setData.datepicker", function(event, key, value) {
				inst.settings[key] = value;
			}).bind("getData.datepicker", function(event, key) {
				return this._get(inst, key);
			});
		this._autoSize(inst);
		$.data(target, PROP_NAME, inst);
		//If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
	},

	/* Make attachments based on settings. */
	_attachments: function(input, inst) {
		var appendText = this._get(inst, 'appendText');
		var isRTL = this._get(inst, 'isRTL');
		if (inst.append)
			inst.append.remove();
		if (appendText) {
			inst.append = $('<span class="' + this._appendClass + '">' + appendText + '</span>');
			input[isRTL ? 'before' : 'after'](inst.append);
		}
		input.unbind('focus', this._showDatepicker);
		if (inst.trigger)
			inst.trigger.remove();
		var showOn = this._get(inst, 'showOn');
		if (showOn == 'focus' || showOn == 'both') // pop-up date picker when in the marked field
			input.focus(this._showDatepicker);
		if (showOn == 'button' || showOn == 'both') { // pop-up date picker when button clicked
			var buttonText = this._get(inst, 'buttonText');
			var buttonImage = this._get(inst, 'buttonImage');
			inst.trigger = $(this._get(inst, 'buttonImageOnly') ?
				$('<img/>').addClass(this._triggerClass).
					attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
				$('<button type="button"></button>').addClass(this._triggerClass).
					html(buttonImage == '' ? buttonText : $('<img/>').attr(
					{ src:buttonImage, alt:buttonText, title:buttonText })));
			input[isRTL ? 'before' : 'after'](inst.trigger);
			inst.trigger.click(function() {
				if ($.datepicker._datepickerShowing && $.datepicker._lastInput == input[0])
					$.datepicker._hideDatepicker();
				else if ($.datepicker._datepickerShowing && $.datepicker._lastInput != input[0]) {
					$.datepicker._hideDatepicker();
					$.datepicker._showDatepicker(input[0]);
				} else
					$.datepicker._showDatepicker(input[0]);
				return false;
			});
		}
	},

	/* Apply the maximum length for the date format. */
	_autoSize: function(inst) {
		if (this._get(inst, 'autoSize') && !inst.inline) {
			var date = new Date(2009, 12 - 1, 20); // Ensure double digits
			var dateFormat = this._get(inst, 'dateFormat');
			if (dateFormat.match(/[DM]/)) {
				var findMax = function(names) {
					var max = 0;
					var maxI = 0;
					for (var i = 0; i < names.length; i++) {
						if (names[i].length > max) {
							max = names[i].length;
							maxI = i;
						}
					}
					return maxI;
				};
				date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
					'monthNames' : 'monthNamesShort'))));
				date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
					'dayNames' : 'dayNamesShort'))) + 20 - date.getDay());
			}
			inst.input.attr('size', this._formatDate(inst, date).length);
		}
	},

	/* Attach an inline date picker to a div. */
	_inlineDatepicker: function(target, inst) {
		var divSpan = $(target);
		if (divSpan.hasClass(this.markerClassName))
			return;
		divSpan.addClass(this.markerClassName).append(inst.dpDiv).
			bind("setData.datepicker", function(event, key, value){
				inst.settings[key] = value;
			}).bind("getData.datepicker", function(event, key){
				return this._get(inst, key);
			});
		$.data(target, PROP_NAME, inst);
		this._setDate(inst, this._getDefaultDate(inst), true);
		this._updateDatepicker(inst);
		this._updateAlternate(inst);
		//If disabled option is true, disable the datepicker before showing it (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
		// Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
		// http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
		inst.dpDiv.css( "display", "block" );
	},

	/* Pop-up the date picker in a "dialog" box.
	   @param  input     element - ignored
	   @param  date      string or Date - the initial date to display
	   @param  onSelect  function - the function to call when a date is selected
	   @param  settings  object - update the dialog date picker instance's settings (anonymous object)
	   @param  pos       int[2] - coordinates for the dialog's position within the screen or
	                     event - with x/y coordinates or
	                     leave empty for default (screen centre)
	   @return the manager object */
	_dialogDatepicker: function(input, date, onSelect, settings, pos) {
		var inst = this._dialogInst; // internal instance
		if (!inst) {
			this.uuid += 1;
			var id = 'dp' + this.uuid;
			this._dialogInput = $('<input type="text" id="' + id +
				'" style="position: absolute; top: -100px; width: 0px;"/>');
			this._dialogInput.keydown(this._doKeyDown);
			$('body').append(this._dialogInput);
			inst = this._dialogInst = this._newInst(this._dialogInput, false);
			inst.settings = {};
			$.data(this._dialogInput[0], PROP_NAME, inst);
		}
		extendRemove(inst.settings, settings || {});
		date = (date && date.constructor == Date ? this._formatDate(inst, date) : date);
		this._dialogInput.val(date);

		this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
		if (!this._pos) {
			var browserWidth = document.documentElement.clientWidth;
			var browserHeight = document.documentElement.clientHeight;
			var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			this._pos = // should use actual width/height below
				[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
		}

		// move input on screen for focus, but hidden behind dialog
		this._dialogInput.css('left', (this._pos[0] + 20) + 'px').css('top', this._pos[1] + 'px');
		inst.settings.onSelect = onSelect;
		this._inDialog = true;
		this.dpDiv.addClass(this._dialogClass);
		this._showDatepicker(this._dialogInput[0]);
		if ($.blockUI)
			$.blockUI(this.dpDiv);
		$.data(this._dialogInput[0], PROP_NAME, inst);
		return this;
	},

	/* Detach a datepicker from its control.
	   @param  target    element - the target input field or division or span */
	_destroyDatepicker: function(target) {
		var $target = $(target);
		var inst = $.data(target, PROP_NAME);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		var nodeName = target.nodeName.toLowerCase();
		$.removeData(target, PROP_NAME);
		if (nodeName == 'input') {
			inst.append.remove();
			inst.trigger.remove();
			$target.removeClass(this.markerClassName).
				unbind('focus', this._showDatepicker).
				unbind('keydown', this._doKeyDown).
				unbind('keypress', this._doKeyPress).
				unbind('keyup', this._doKeyUp);
		} else if (nodeName == 'div' || nodeName == 'span')
			$target.removeClass(this.markerClassName).empty();
	},

	/* Enable the date picker to a jQuery selection.
	   @param  target    element - the target input field or division or span */
	_enableDatepicker: function(target) {
		var $target = $(target);
		var inst = $.data(target, PROP_NAME);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		var nodeName = target.nodeName.toLowerCase();
		if (nodeName == 'input') {
			target.disabled = false;
			inst.trigger.filter('button').
				each(function() { this.disabled = false; }).end().
				filter('img').css({opacity: '1.0', cursor: ''});
		}
		else if (nodeName == 'div' || nodeName == 'span') {
			var inline = $target.children('.' + this._inlineClass);
			inline.children().removeClass('ui-state-disabled');
			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				prop("disabled", false);
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value == target ? null : value); }); // delete entry
	},

	/* Disable the date picker to a jQuery selection.
	   @param  target    element - the target input field or division or span */
	_disableDatepicker: function(target) {
		var $target = $(target);
		var inst = $.data(target, PROP_NAME);
		if (!$target.hasClass(this.markerClassName)) {
			return;
		}
		var nodeName = target.nodeName.toLowerCase();
		if (nodeName == 'input') {
			target.disabled = true;
			inst.trigger.filter('button').
				each(function() { this.disabled = true; }).end().
				filter('img').css({opacity: '0.5', cursor: 'default'});
		}
		else if (nodeName == 'div' || nodeName == 'span') {
			var inline = $target.children('.' + this._inlineClass);
			inline.children().addClass('ui-state-disabled');
			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				prop("disabled", true);
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value == target ? null : value); }); // delete entry
		this._disabledInputs[this._disabledInputs.length] = target;
	},

	/* Is the first field in a jQuery collection disabled as a datepicker?
	   @param  target    element - the target input field or division or span
	   @return boolean - true if disabled, false if enabled */
	_isDisabledDatepicker: function(target) {
		if (!target) {
			return false;
		}
		for (var i = 0; i < this._disabledInputs.length; i++) {
			if (this._disabledInputs[i] == target)
				return true;
		}
		return false;
	},

	/* Retrieve the instance data for the target control.
	   @param  target  element - the target input field or division or span
	   @return  object - the associated instance data
	   @throws  error if a jQuery problem getting data */
	_getInst: function(target) {
		try {
			return $.data(target, PROP_NAME);
		}
		catch (err) {
			throw 'Missing instance data for this datepicker';
		}
	},

	/* Update or retrieve the settings for a date picker attached to an input field or division.
	   @param  target  element - the target input field or division or span
	   @param  name    object - the new settings to update or
	                   string - the name of the setting to change or retrieve,
	                   when retrieving also 'all' for all instance settings or
	                   'defaults' for all global defaults
	   @param  value   any - the new value for the setting
	                   (omit if above is an object or to retrieve a value) */
	_optionDatepicker: function(target, name, value) {
		var inst = this._getInst(target);
		if (arguments.length == 2 && typeof name == 'string') {
			return (name == 'defaults' ? $.extend({}, $.datepicker._defaults) :
				(inst ? (name == 'all' ? $.extend({}, inst.settings) :
				this._get(inst, name)) : null));
		}
		var settings = name || {};
		if (typeof name == 'string') {
			settings = {};
			settings[name] = value;
		}
		if (inst) {
			if (this._curInst == inst) {
				this._hideDatepicker();
			}
			var date = this._getDateDatepicker(target, true);
			var minDate = this._getMinMaxDate(inst, 'min');
			var maxDate = this._getMinMaxDate(inst, 'max');
			extendRemove(inst.settings, settings);
			// reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
			if (minDate !== null && settings['dateFormat'] !== undefined && settings['minDate'] === undefined)
				inst.settings.minDate = this._formatDate(inst, minDate);
			if (maxDate !== null && settings['dateFormat'] !== undefined && settings['maxDate'] === undefined)
				inst.settings.maxDate = this._formatDate(inst, maxDate);
			this._attachments($(target), inst);
			this._autoSize(inst);
			this._setDate(inst, date);
			this._updateAlternate(inst);
			this._updateDatepicker(inst);
		}
	},

	// change method deprecated
	_changeDatepicker: function(target, name, value) {
		this._optionDatepicker(target, name, value);
	},

	/* Redraw the date picker attached to an input field or division.
	   @param  target  element - the target input field or division or span */
	_refreshDatepicker: function(target) {
		var inst = this._getInst(target);
		if (inst) {
			this._updateDatepicker(inst);
		}
	},

	/* Set the dates for a jQuery selection.
	   @param  target   element - the target input field or division or span
	   @param  date     Date - the new date */
	_setDateDatepicker: function(target, date) {
		var inst = this._getInst(target);
		if (inst) {
			this._setDate(inst, date);
			this._updateDatepicker(inst);
			this._updateAlternate(inst);
		}
	},

	/* Get the date(s) for the first entry in a jQuery selection.
	   @param  target     element - the target input field or division or span
	   @param  noDefault  boolean - true if no default date is to be used
	   @return Date - the current date */
	_getDateDatepicker: function(target, noDefault) {
		var inst = this._getInst(target);
		if (inst && !inst.inline)
			this._setDateFromField(inst, noDefault);
		return (inst ? this._getDate(inst) : null);
	},

	/* Handle keystrokes. */
	_doKeyDown: function(event) {
		var inst = $.datepicker._getInst(event.target);
		var handled = true;
		var isRTL = inst.dpDiv.is('.ui-datepicker-rtl');
		inst._keyEvent = true;
		if ($.datepicker._datepickerShowing)
			switch (event.keyCode) {
				case 9: $.datepicker._hideDatepicker();
						handled = false;
						break; // hide on tab out
				case 13: var sel = $('td.' + $.datepicker._dayOverClass + ':not(.' +
									$.datepicker._currentClass + ')', inst.dpDiv);
						if (sel[0])
							$.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
							var onSelect = $.datepicker._get(inst, 'onSelect');
							if (onSelect) {
								var dateStr = $.datepicker._formatDate(inst);

								// trigger custom callback
								onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
							}
						else
							$.datepicker._hideDatepicker();
						return false; // don't submit the form
						break; // select the value on enter
				case 27: $.datepicker._hideDatepicker();
						break; // hide on escape
				case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							-$.datepicker._get(inst, 'stepBigMonths') :
							-$.datepicker._get(inst, 'stepMonths')), 'M');
						break; // previous month/year on page up/+ ctrl
				case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							+$.datepicker._get(inst, 'stepBigMonths') :
							+$.datepicker._get(inst, 'stepMonths')), 'M');
						break; // next month/year on page down/+ ctrl
				case 35: if (event.ctrlKey || event.metaKey) $.datepicker._clearDate(event.target);
						handled = event.ctrlKey || event.metaKey;
						break; // clear on ctrl or command +end
				case 36: if (event.ctrlKey || event.metaKey) $.datepicker._gotoToday(event.target);
						handled = event.ctrlKey || event.metaKey;
						break; // current on ctrl or command +home
				case 37: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), 'D');
						handled = event.ctrlKey || event.metaKey;
						// -1 day on ctrl or command +left
						if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
									-$.datepicker._get(inst, 'stepBigMonths') :
									-$.datepicker._get(inst, 'stepMonths')), 'M');
						// next month/year on alt +left on Mac
						break;
				case 38: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, -7, 'D');
						handled = event.ctrlKey || event.metaKey;
						break; // -1 week on ctrl or command +up
				case 39: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), 'D');
						handled = event.ctrlKey || event.metaKey;
						// +1 day on ctrl or command +right
						if (event.originalEvent.altKey) $.datepicker._adjustDate(event.target, (event.ctrlKey ?
									+$.datepicker._get(inst, 'stepBigMonths') :
									+$.datepicker._get(inst, 'stepMonths')), 'M');
						// next month/year on alt +right
						break;
				case 40: if (event.ctrlKey || event.metaKey) $.datepicker._adjustDate(event.target, +7, 'D');
						handled = event.ctrlKey || event.metaKey;
						break; // +1 week on ctrl or command +down
				default: handled = false;
			}
		else if (event.keyCode == 36 && event.ctrlKey) // display the date picker on ctrl+home
			$.datepicker._showDatepicker(this);
		else {
			handled = false;
		}
		if (handled) {
			event.preventDefault();
			event.stopPropagation();
		}
	},

	/* Filter entered characters - based on date format. */
	_doKeyPress: function(event) {
		var inst = $.datepicker._getInst(event.target);
		if ($.datepicker._get(inst, 'constrainInput')) {
			var chars = $.datepicker._possibleChars($.datepicker._get(inst, 'dateFormat'));
			var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);
			return event.ctrlKey || event.metaKey || (chr < ' ' || !chars || chars.indexOf(chr) > -1);
		}
	},

	/* Synchronise manual entry and field/alternate field. */
	_doKeyUp: function(event) {
		var inst = $.datepicker._getInst(event.target);
		if (inst.input.val() != inst.lastVal) {
			try {
				var date = $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'),
					(inst.input ? inst.input.val() : null),
					$.datepicker._getFormatConfig(inst));
				if (date) { // only if valid
					$.datepicker._setDateFromField(inst);
					$.datepicker._updateAlternate(inst);
					$.datepicker._updateDatepicker(inst);
				}
			}
			catch (err) {
				$.datepicker.log(err);
			}
		}
		return true;
	},

	/* Pop-up the date picker for a given input field.
	   If false returned from beforeShow event handler do not show.
	   @param  input  element - the input field attached to the date picker or
	                  event - if triggered by focus */
	_showDatepicker: function(input) {
		input = input.target || input;
		if (input.nodeName.toLowerCase() != 'input') // find from button/image trigger
			input = $('input', input.parentNode)[0];
		if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput == input) // already here
			return;
		var inst = $.datepicker._getInst(input);
		if ($.datepicker._curInst && $.datepicker._curInst != inst) {
			$.datepicker._curInst.dpDiv.stop(true, true);
			if ( inst && $.datepicker._datepickerShowing ) {
				$.datepicker._hideDatepicker( $.datepicker._curInst.input[0] );
			}
		}
		var beforeShow = $.datepicker._get(inst, 'beforeShow');
		var beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
		if(beforeShowSettings === false){
			//false
			return;
		}
		extendRemove(inst.settings, beforeShowSettings);
		inst.lastVal = null;
		$.datepicker._lastInput = input;
		$.datepicker._setDateFromField(inst);
		if ($.datepicker._inDialog) // hide cursor
			input.value = '';
		if (!$.datepicker._pos) { // position below input
			$.datepicker._pos = $.datepicker._findPos(input);
			$.datepicker._pos[1] += input.offsetHeight; // add the height
		}
		var isFixed = false;
		$(input).parents().each(function() {
			isFixed |= $(this).css('position') == 'fixed';
			return !isFixed;
		});
		var offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
		$.datepicker._pos = null;
		//to avoid flashes on Firefox
		inst.dpDiv.empty();
		// determine sizing offscreen
		inst.dpDiv.css({position: 'absolute', display: 'block', top: '-1000px'});
		$.datepicker._updateDatepicker(inst);
		// fix width for dynamic number of date pickers
		// and adjust position before showing
		offset = $.datepicker._checkOffset(inst, offset, isFixed);
		inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
			'static' : (isFixed ? 'fixed' : 'absolute')), display: 'none',
			left: offset.left + 'px', top: offset.top + 'px'});
		if (!inst.inline) {
			var showAnim = $.datepicker._get(inst, 'showAnim');
			var duration = $.datepicker._get(inst, 'duration');
			var postProcess = function() {
				var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
				if( !! cover.length ){
					var borders = $.datepicker._getBorders(inst.dpDiv);
					cover.css({left: -borders[0], top: -borders[1],
						width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight()});
				}
			};
			inst.dpDiv.zIndex($(input).zIndex()+1);
			$.datepicker._datepickerShowing = true;

			// DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
			if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) )
				inst.dpDiv.show(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
			else
				inst.dpDiv[showAnim || 'show']((showAnim ? duration : null), postProcess);
			if (!showAnim || !duration)
				postProcess();
			if (inst.input.is(':visible') && !inst.input.is(':disabled'))
				inst.input.focus();
			$.datepicker._curInst = inst;
		}
	},

	/* Generate the date picker content. */
	_updateDatepicker: function(inst) {
		this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
		var borders = $.datepicker._getBorders(inst.dpDiv);
		instActive = inst; // for delegate hover events
		inst.dpDiv.empty().append(this._generateHTML(inst));
		this._attachHandlers(inst);
		var cover = inst.dpDiv.find('iframe.ui-datepicker-cover'); // IE6- only
		if( !!cover.length ){ //avoid call to outerXXXX() when not in IE6
			cover.css({left: -borders[0], top: -borders[1], width: inst.dpDiv.outerWidth(), height: inst.dpDiv.outerHeight()})
		}
		inst.dpDiv.find('.' + this._dayOverClass + ' a').mouseover();
		var numMonths = this._getNumberOfMonths(inst);
		var cols = numMonths[1];
		var width = 17;
		inst.dpDiv.removeClass('ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4').width('');
		if (cols > 1)
			inst.dpDiv.addClass('ui-datepicker-multi-' + cols).css('width', (width * cols) + 'em');
		inst.dpDiv[(numMonths[0] != 1 || numMonths[1] != 1 ? 'add' : 'remove') +
			'Class']('ui-datepicker-multi');
		inst.dpDiv[(this._get(inst, 'isRTL') ? 'add' : 'remove') +
			'Class']('ui-datepicker-rtl');
		if (inst == $.datepicker._curInst && $.datepicker._datepickerShowing && inst.input &&
				// #6694 - don't focus the input if it's already focused
				// this breaks the change event in IE
				inst.input.is(':visible') && !inst.input.is(':disabled') && inst.input[0] != document.activeElement)
			inst.input.focus();
		// deffered render of the years select (to avoid flashes on Firefox)
		if( inst.yearshtml ){
			var origyearshtml = inst.yearshtml;
			setTimeout(function(){
				//assure that inst.yearshtml didn't change.
				if( origyearshtml === inst.yearshtml && inst.yearshtml ){
					inst.dpDiv.find('select.ui-datepicker-year:first').replaceWith(inst.yearshtml);
				}
				origyearshtml = inst.yearshtml = null;
			}, 0);
		}
	},

	/* Retrieve the size of left and top borders for an element.
	   @param  elem  (jQuery object) the element of interest
	   @return  (number[2]) the left and top borders */
	_getBorders: function(elem) {
		var convert = function(value) {
			return {thin: 1, medium: 2, thick: 3}[value] || value;
		};
		return [parseFloat(convert(elem.css('border-left-width'))),
			parseFloat(convert(elem.css('border-top-width')))];
	},

	/* Check positioning to remain on screen. */
	_checkOffset: function(inst, offset, isFixed) {
		var dpWidth = inst.dpDiv.outerWidth();
		var dpHeight = inst.dpDiv.outerHeight();
		var inputWidth = inst.input ? inst.input.outerWidth() : 0;
		var inputHeight = inst.input ? inst.input.outerHeight() : 0;
		var viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft());
		var viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

		offset.left -= (this._get(inst, 'isRTL') ? (dpWidth - inputWidth) : 0);
		offset.left -= (isFixed && offset.left == inst.input.offset().left) ? $(document).scrollLeft() : 0;
		offset.top -= (isFixed && offset.top == (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

		// now check if datepicker is showing outside window viewport - move to a better place if so.
		offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
			Math.abs(offset.left + dpWidth - viewWidth) : 0);
		offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
			Math.abs(dpHeight + inputHeight) : 0);

		return offset;
	},

	/* Find an object's position on the screen. */
	_findPos: function(obj) {
		var inst = this._getInst(obj);
		var isRTL = this._get(inst, 'isRTL');
		while (obj && (obj.type == 'hidden' || obj.nodeType != 1 || $.expr.filters.hidden(obj))) {
			obj = obj[isRTL ? 'previousSibling' : 'nextSibling'];
		}
		var position = $(obj).offset();
		return [position.left, position.top];
	},

	/* Hide the date picker from view.
	   @param  input  element - the input field attached to the date picker */
	_hideDatepicker: function(input) {
		var inst = this._curInst;
		if (!inst || (input && inst != $.data(input, PROP_NAME)))
			return;
		if (this._datepickerShowing) {
			var showAnim = this._get(inst, 'showAnim');
			var duration = this._get(inst, 'duration');
			var postProcess = function() {
				$.datepicker._tidyDialog(inst);
			};

			// DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
			if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) )
				inst.dpDiv.hide(showAnim, $.datepicker._get(inst, 'showOptions'), duration, postProcess);
			else
				inst.dpDiv[(showAnim == 'slideDown' ? 'slideUp' :
					(showAnim == 'fadeIn' ? 'fadeOut' : 'hide'))]((showAnim ? duration : null), postProcess);
			if (!showAnim)
				postProcess();
			this._datepickerShowing = false;
			var onClose = this._get(inst, 'onClose');
			if (onClose)
				onClose.apply((inst.input ? inst.input[0] : null),
					[(inst.input ? inst.input.val() : ''), inst]);
			this._lastInput = null;
			if (this._inDialog) {
				this._dialogInput.css({ position: 'absolute', left: '0', top: '-100px' });
				if ($.blockUI) {
					$.unblockUI();
					$('body').append(this.dpDiv);
				}
			}
			this._inDialog = false;
		}
	},

	/* Tidy up after a dialog display. */
	_tidyDialog: function(inst) {
		inst.dpDiv.removeClass(this._dialogClass).unbind('.ui-datepicker-calendar');
	},

	/* Close date picker if clicked elsewhere. */
	_checkExternalClick: function(event) {
		if (!$.datepicker._curInst)
			return;

		var $target = $(event.target),
			inst = $.datepicker._getInst($target[0]);

		if ( ( ( $target[0].id != $.datepicker._mainDivId &&
				$target.parents('#' + $.datepicker._mainDivId).length == 0 &&
				!$target.hasClass($.datepicker.markerClassName) &&
				!$target.closest("." + $.datepicker._triggerClass).length &&
				$.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI) ) ) ||
			( $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst != inst ) )
			$.datepicker._hideDatepicker();
	},

	/* Adjust one of the date sub-fields. */
	_adjustDate: function(id, offset, period) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		if (this._isDisabledDatepicker(target[0])) {
			return;
		}
		this._adjustInstDate(inst, offset +
			(period == 'M' ? this._get(inst, 'showCurrentAtPos') : 0), // undo positioning
			period);
		this._updateDatepicker(inst);
	},

	/* Action for current link. */
	_gotoToday: function(id) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
			inst.selectedDay = inst.currentDay;
			inst.drawMonth = inst.selectedMonth = inst.currentMonth;
			inst.drawYear = inst.selectedYear = inst.currentYear;
		}
		else {
			var date = new Date();
			inst.selectedDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = date.getFullYear();
		}
		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a new month/year. */
	_selectMonthYear: function(id, select, period) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		inst['selected' + (period == 'M' ? 'Month' : 'Year')] =
		inst['draw' + (period == 'M' ? 'Month' : 'Year')] =
			parseInt(select.options[select.selectedIndex].value,10);
		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a day. */
	_selectDay: function(id, month, year, td) {
		var target = $(id);
		if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
			return;
		}
		var inst = this._getInst(target[0]);
		inst.selectedDay = inst.currentDay = $('a', td).html();
		inst.selectedMonth = inst.currentMonth = month;
		inst.selectedYear = inst.currentYear = year;
		this._selectDate(id, this._formatDate(inst,
			inst.currentDay, inst.currentMonth, inst.currentYear));
	},

	/* Erase the input field and hide the date picker. */
	_clearDate: function(id) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		this._selectDate(target, '');
	},

	/* Update the input field with the selected date. */
	_selectDate: function(id, dateStr) {
		var target = $(id);
		var inst = this._getInst(target[0]);
		dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
		if (inst.input)
			inst.input.val(dateStr);
		this._updateAlternate(inst);
		var onSelect = this._get(inst, 'onSelect');
		if (onSelect)
			onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
		else if (inst.input)
			inst.input.trigger('change'); // fire the change event
		if (inst.inline)
			this._updateDatepicker(inst);
		else {
			this._hideDatepicker();
			this._lastInput = inst.input[0];
			if (typeof(inst.input[0]) != 'object')
				inst.input.focus(); // restore focus
			this._lastInput = null;
		}
	},

	/* Update any alternate field to synchronise with the main field. */
	_updateAlternate: function(inst) {
		var altField = this._get(inst, 'altField');
		if (altField) { // update alternate field too
			var altFormat = this._get(inst, 'altFormat') || this._get(inst, 'dateFormat');
			var date = this._getDate(inst);
			var dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
			$(altField).each(function() { $(this).val(dateStr); });
		}
	},

	/* Set as beforeShowDay function to prevent selection of weekends.
	   @param  date  Date - the date to customise
	   @return [boolean, string] - is this date selectable?, what is its CSS class? */
	noWeekends: function(date) {
		var day = date.getDay();
		return [(day > 0 && day < 6), ''];
	},

	/* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
	   @param  date  Date - the date to get the week for
	   @return  number - the number of the week within the year that contains this date */
	iso8601Week: function(date) {
		var checkDate = new Date(date.getTime());
		// Find Thursday of this week starting on Monday
		checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
		var time = checkDate.getTime();
		checkDate.setMonth(0); // Compare with Jan 1
		checkDate.setDate(1);
		return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
	},

	/* Parse a string value into a date object.
	   See formatDate below for the possible formats.

	   @param  format    string - the expected format of the date
	   @param  value     string - the date in the above format
	   @param  settings  Object - attributes include:
	                     shortYearCutoff  number - the cutoff year for determining the century (optional)
	                     dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
	                     dayNames         string[7] - names of the days from Sunday (optional)
	                     monthNamesShort  string[12] - abbreviated names of the months (optional)
	                     monthNames       string[12] - names of the months (optional)
	   @return  Date - the extracted date value or null if value is blank */
	parseDate: function (format, value, settings) {
		if (format == null || value == null)
			throw 'Invalid arguments';
		value = (typeof value == 'object' ? value.toString() : value + '');
		if (value == '')
			return null;
		var shortYearCutoff = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff;
		shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
				new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
		var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
		var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
		var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
		var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
		var year = -1;
		var month = -1;
		var day = -1;
		var doy = -1;
		var literal = false;
		// Check whether a format character is doubled
		var lookAhead = function(match) {
			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
			if (matches)
				iFormat++;
			return matches;
		};
		// Extract a number from the string value
		var getNumber = function(match) {
			var isDoubled = lookAhead(match);
			var size = (match == '@' ? 14 : (match == '!' ? 20 :
				(match == 'y' && isDoubled ? 4 : (match == 'o' ? 3 : 2))));
			var digits = new RegExp('^\\d{1,' + size + '}');
			var num = value.substring(iValue).match(digits);
			if (!num)
				throw 'Missing number at position ' + iValue;
			iValue += num[0].length;
			return parseInt(num[0], 10);
		};
		// Extract a name from the string value and convert to an index
		var getName = function(match, shortNames, longNames) {
			var names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
				return [ [k, v] ];
			}).sort(function (a, b) {
				return -(a[1].length - b[1].length);
			});
			var index = -1;
			$.each(names, function (i, pair) {
				var name = pair[1];
				if (value.substr(iValue, name.length).toLowerCase() == name.toLowerCase()) {
					index = pair[0];
					iValue += name.length;
					return false;
				}
			});
			if (index != -1)
				return index + 1;
			else
				throw 'Unknown name at position ' + iValue;
		};
		// Confirm that a literal character matches the string value
		var checkLiteral = function() {
			if (value.charAt(iValue) != format.charAt(iFormat))
				throw 'Unexpected literal at position ' + iValue;
			iValue++;
		};
		var iValue = 0;
		for (var iFormat = 0; iFormat < format.length; iFormat++) {
			if (literal)
				if (format.charAt(iFormat) == "'" && !lookAhead("'"))
					literal = false;
				else
					checkLiteral();
			else
				switch (format.charAt(iFormat)) {
					case 'd':
						day = getNumber('d');
						break;
					case 'D':
						getName('D', dayNamesShort, dayNames);
						break;
					case 'o':
						doy = getNumber('o');
						break;
					case 'm':
						month = getNumber('m');
						break;
					case 'M':
						month = getName('M', monthNamesShort, monthNames);
						break;
					case 'y':
						year = getNumber('y');
						break;
					case '@':
						var date = new Date(getNumber('@'));
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case '!':
						var date = new Date((getNumber('!') - this._ticksTo1970) / 10000);
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "'":
						if (lookAhead("'"))
							checkLiteral();
						else
							literal = true;
						break;
					default:
						checkLiteral();
				}
		}
		if (iValue < value.length){
			var extra = value.substr(iValue);
			if (!/^\s+/.test(extra)) {
				throw "Extra/unparsed characters found in date: " + extra;
			}
		}
		if (year == -1)
			year = new Date().getFullYear();
		else if (year < 100)
			year += new Date().getFullYear() - new Date().getFullYear() % 100 +
				(year <= shortYearCutoff ? 0 : -100);
		if (doy > -1) {
			month = 1;
			day = doy;
			do {
				var dim = this._getDaysInMonth(year, month - 1);
				if (day <= dim)
					break;
				month++;
				day -= dim;
			} while (true);
		}
		var date = this._daylightSavingAdjust(new Date(year, month - 1, day));
		if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day)
			throw 'Invalid date'; // E.g. 31/02/00
		return date;
	},

	/* Standard date formats. */
	ATOM: 'yy-mm-dd', // RFC 3339 (ISO 8601)
	COOKIE: 'D, dd M yy',
	ISO_8601: 'yy-mm-dd',
	RFC_822: 'D, d M y',
	RFC_850: 'DD, dd-M-y',
	RFC_1036: 'D, d M y',
	RFC_1123: 'D, d M yy',
	RFC_2822: 'D, d M yy',
	RSS: 'D, d M y', // RFC 822
	TICKS: '!',
	TIMESTAMP: '@',
	W3C: 'yy-mm-dd', // ISO 8601

	_ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
		Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

	/* Format a date object into a string value.
	   The format can be combinations of the following:
	   d  - day of month (no leading zero)
	   dd - day of month (two digit)
	   o  - day of year (no leading zeros)
	   oo - day of year (three digit)
	   D  - day name short
	   DD - day name long
	   m  - month of year (no leading zero)
	   mm - month of year (two digit)
	   M  - month name short
	   MM - month name long
	   y  - year (two digit)
	   yy - year (four digit)
	   @ - Unix timestamp (ms since 01/01/1970)
	   ! - Windows ticks (100ns since 01/01/0001)
	   '...' - literal text
	   '' - single quote

	   @param  format    string - the desired format of the date
	   @param  date      Date - the date value to format
	   @param  settings  Object - attributes include:
	                     dayNamesShort    string[7] - abbreviated names of the days from Sunday (optional)
	                     dayNames         string[7] - names of the days from Sunday (optional)
	                     monthNamesShort  string[12] - abbreviated names of the months (optional)
	                     monthNames       string[12] - names of the months (optional)
	   @return  string - the date in the above format */
	formatDate: function (format, date, settings) {
		if (!date)
			return '';
		var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
		var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
		var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
		var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
		// Check whether a format character is doubled
		var lookAhead = function(match) {
			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
			if (matches)
				iFormat++;
			return matches;
		};
		// Format a number, with leading zero if necessary
		var formatNumber = function(match, value, len) {
			var num = '' + value;
			if (lookAhead(match))
				while (num.length < len)
					num = '0' + num;
			return num;
		};
		// Format a name, short or long as requested
		var formatName = function(match, value, shortNames, longNames) {
			return (lookAhead(match) ? longNames[value] : shortNames[value]);
		};
		var output = '';
		var literal = false;
		if (date)
			for (var iFormat = 0; iFormat < format.length; iFormat++) {
				if (literal)
					if (format.charAt(iFormat) == "'" && !lookAhead("'"))
						literal = false;
					else
						output += format.charAt(iFormat);
				else
					switch (format.charAt(iFormat)) {
						case 'd':
							output += formatNumber('d', date.getDate(), 2);
							break;
						case 'D':
							output += formatName('D', date.getDay(), dayNamesShort, dayNames);
							break;
						case 'o':
							output += formatNumber('o',
								Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
							break;
						case 'm':
							output += formatNumber('m', date.getMonth() + 1, 2);
							break;
						case 'M':
							output += formatName('M', date.getMonth(), monthNamesShort, monthNames);
							break;
						case 'y':
							output += (lookAhead('y') ? date.getFullYear() :
								(date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
							break;
						case '@':
							output += date.getTime();
							break;
						case '!':
							output += date.getTime() * 10000 + this._ticksTo1970;
							break;
						case "'":
							if (lookAhead("'"))
								output += "'";
							else
								literal = true;
							break;
						default:
							output += format.charAt(iFormat);
					}
			}
		return output;
	},

	/* Extract all possible characters from the date format. */
	_possibleChars: function (format) {
		var chars = '';
		var literal = false;
		// Check whether a format character is doubled
		var lookAhead = function(match) {
			var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
			if (matches)
				iFormat++;
			return matches;
		};
		for (var iFormat = 0; iFormat < format.length; iFormat++)
			if (literal)
				if (format.charAt(iFormat) == "'" && !lookAhead("'"))
					literal = false;
				else
					chars += format.charAt(iFormat);
			else
				switch (format.charAt(iFormat)) {
					case 'd': case 'm': case 'y': case '@':
						chars += '0123456789';
						break;
					case 'D': case 'M':
						return null; // Accept anything
					case "'":
						if (lookAhead("'"))
							chars += "'";
						else
							literal = true;
						break;
					default:
						chars += format.charAt(iFormat);
				}
		return chars;
	},

	/* Get a setting value, defaulting if necessary. */
	_get: function(inst, name) {
		return inst.settings[name] !== undefined ?
			inst.settings[name] : this._defaults[name];
	},

	/* Parse existing date and initialise date picker. */
	_setDateFromField: function(inst, noDefault) {
		if (inst.input.val() == inst.lastVal) {
			return;
		}
		var dateFormat = this._get(inst, 'dateFormat');
		var dates = inst.lastVal = inst.input ? inst.input.val() : null;
		var date, defaultDate;
		date = defaultDate = this._getDefaultDate(inst);
		var settings = this._getFormatConfig(inst);
		try {
			date = this.parseDate(dateFormat, dates, settings) || defaultDate;
		} catch (event) {
			this.log(event);
			dates = (noDefault ? '' : dates);
		}
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		inst.currentDay = (dates ? date.getDate() : 0);
		inst.currentMonth = (dates ? date.getMonth() : 0);
		inst.currentYear = (dates ? date.getFullYear() : 0);
		this._adjustInstDate(inst);
	},

	/* Retrieve the default date shown on opening. */
	_getDefaultDate: function(inst) {
		return this._restrictMinMax(inst,
			this._determineDate(inst, this._get(inst, 'defaultDate'), new Date()));
	},

	/* A date may be specified as an exact value or a relative one. */
	_determineDate: function(inst, date, defaultDate) {
		var offsetNumeric = function(offset) {
			var date = new Date();
			date.setDate(date.getDate() + offset);
			return date;
		};
		var offsetString = function(offset) {
			try {
				return $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'),
					offset, $.datepicker._getFormatConfig(inst));
			}
			catch (e) {
				// Ignore
			}
			var date = (offset.toLowerCase().match(/^c/) ?
				$.datepicker._getDate(inst) : null) || new Date();
			var year = date.getFullYear();
			var month = date.getMonth();
			var day = date.getDate();
			var pattern = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;
			var matches = pattern.exec(offset);
			while (matches) {
				switch (matches[2] || 'd') {
					case 'd' : case 'D' :
						day += parseInt(matches[1],10); break;
					case 'w' : case 'W' :
						day += parseInt(matches[1],10) * 7; break;
					case 'm' : case 'M' :
						month += parseInt(matches[1],10);
						day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
						break;
					case 'y': case 'Y' :
						year += parseInt(matches[1],10);
						day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
						break;
				}
				matches = pattern.exec(offset);
			}
			return new Date(year, month, day);
		};
		var newDate = (date == null || date === '' ? defaultDate : (typeof date == 'string' ? offsetString(date) :
			(typeof date == 'number' ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));
		newDate = (newDate && newDate.toString() == 'Invalid Date' ? defaultDate : newDate);
		if (newDate) {
			newDate.setHours(0);
			newDate.setMinutes(0);
			newDate.setSeconds(0);
			newDate.setMilliseconds(0);
		}
		return this._daylightSavingAdjust(newDate);
	},

	/* Handle switch to/from daylight saving.
	   Hours may be non-zero on daylight saving cut-over:
	   > 12 when midnight changeover, but then cannot generate
	   midnight datetime, so jump to 1AM, otherwise reset.
	   @param  date  (Date) the date to check
	   @return  (Date) the corrected date */
	_daylightSavingAdjust: function(date) {
		if (!date) return null;
		date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
		return date;
	},

	/* Set the date(s) directly. */
	_setDate: function(inst, date, noChange) {
		var clear = !date;
		var origMonth = inst.selectedMonth;
		var origYear = inst.selectedYear;
		var newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));
		inst.selectedDay = inst.currentDay = newDate.getDate();
		inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
		inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
		if ((origMonth != inst.selectedMonth || origYear != inst.selectedYear) && !noChange)
			this._notifyChange(inst);
		this._adjustInstDate(inst);
		if (inst.input) {
			inst.input.val(clear ? '' : this._formatDate(inst));
		}
	},

	/* Retrieve the date(s) directly. */
	_getDate: function(inst) {
		var startDate = (!inst.currentYear || (inst.input && inst.input.val() == '') ? null :
			this._daylightSavingAdjust(new Date(
			inst.currentYear, inst.currentMonth, inst.currentDay)));
			return startDate;
	},

	/* Attach the onxxx handlers.  These are declared statically so
	 * they work with static code transformers like Caja.
	 */
	_attachHandlers: function(inst) {
		var stepMonths = this._get(inst, 'stepMonths');
		var id = '#' + inst.id.replace( /\\\\/g, "\\" );
		inst.dpDiv.find('[data-handler]').map(function () {
			var handler = {
				prev: function () {
					window['DP_jQuery_' + dpuuid].datepicker._adjustDate(id, -stepMonths, 'M');
				},
				next: function () {
					window['DP_jQuery_' + dpuuid].datepicker._adjustDate(id, +stepMonths, 'M');
				},
				hide: function () {
					window['DP_jQuery_' + dpuuid].datepicker._hideDatepicker();
				},
				today: function () {
					window['DP_jQuery_' + dpuuid].datepicker._gotoToday(id);
				},
				selectDay: function () {
					window['DP_jQuery_' + dpuuid].datepicker._selectDay(id, +this.getAttribute('data-month'), +this.getAttribute('data-year'), this);
					return false;
				},
				selectMonth: function () {
					window['DP_jQuery_' + dpuuid].datepicker._selectMonthYear(id, this, 'M');
					return false;
				},
				selectYear: function () {
					window['DP_jQuery_' + dpuuid].datepicker._selectMonthYear(id, this, 'Y');
					return false;
				}
			};
			$(this).bind(this.getAttribute('data-event'), handler[this.getAttribute('data-handler')]);
		});
	},

	/* Generate the HTML for the current state of the date picker. */
	_generateHTML: function(inst) {
		var today = new Date();
		today = this._daylightSavingAdjust(
			new Date(today.getFullYear(), today.getMonth(), today.getDate())); // clear time
		var isRTL = this._get(inst, 'isRTL');
		var showButtonPanel = this._get(inst, 'showButtonPanel');
		var hideIfNoPrevNext = this._get(inst, 'hideIfNoPrevNext');
		var navigationAsDateFormat = this._get(inst, 'navigationAsDateFormat');
		var numMonths = this._getNumberOfMonths(inst);
		var showCurrentAtPos = this._get(inst, 'showCurrentAtPos');
		var stepMonths = this._get(inst, 'stepMonths');
		var isMultiMonth = (numMonths[0] != 1 || numMonths[1] != 1);
		var currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
			new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
		var minDate = this._getMinMaxDate(inst, 'min');
		var maxDate = this._getMinMaxDate(inst, 'max');
		var drawMonth = inst.drawMonth - showCurrentAtPos;
		var drawYear = inst.drawYear;
		if (drawMonth < 0) {
			drawMonth += 12;
			drawYear--;
		}
		if (maxDate) {
			var maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
				maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
			maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
			while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
				drawMonth--;
				if (drawMonth < 0) {
					drawMonth = 11;
					drawYear--;
				}
			}
		}
		inst.drawMonth = drawMonth;
		inst.drawYear = drawYear;
		var prevText = this._get(inst, 'prevText');
		prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
			this._getFormatConfig(inst)));
		var prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
			'<a class="ui-datepicker-prev ui-corner-all" data-handler="prev" data-event="click"' +
			' title="' + prevText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>' :
			(hideIfNoPrevNext ? '' : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+ prevText +'"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'e' : 'w') + '">' + prevText + '</span></a>'));
		var nextText = this._get(inst, 'nextText');
		nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
			this._getFormatConfig(inst)));
		var next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
			'<a class="ui-datepicker-next ui-corner-all" data-handler="next" data-event="click"' +
			' title="' + nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>' :
			(hideIfNoPrevNext ? '' : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+ nextText + '"><span class="ui-icon ui-icon-circle-triangle-' + ( isRTL ? 'w' : 'e') + '">' + nextText + '</span></a>'));
		var currentText = this._get(inst, 'currentText');
		var gotoDate = (this._get(inst, 'gotoCurrent') && inst.currentDay ? currentDate : today);
		currentText = (!navigationAsDateFormat ? currentText :
			this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));
		var controls = (!inst.inline ? '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" data-handler="hide" data-event="click">' +
			this._get(inst, 'closeText') + '</button>' : '');
		var buttonPanel = (showButtonPanel) ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (isRTL ? controls : '') +
			(this._isInRange(inst, gotoDate) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" data-handler="today" data-event="click"' +
			'>' + currentText + '</button>' : '') + (isRTL ? '' : controls) + '</div>' : '';
		var firstDay = parseInt(this._get(inst, 'firstDay'),10);
		firstDay = (isNaN(firstDay) ? 0 : firstDay);
		var showWeek = this._get(inst, 'showWeek');
		var dayNames = this._get(inst, 'dayNames');
		var dayNamesShort = this._get(inst, 'dayNamesShort');
		var dayNamesMin = this._get(inst, 'dayNamesMin');
		var monthNames = this._get(inst, 'monthNames');
		var monthNamesShort = this._get(inst, 'monthNamesShort');
		var beforeShowDay = this._get(inst, 'beforeShowDay');
		var showOtherMonths = this._get(inst, 'showOtherMonths');
		var selectOtherMonths = this._get(inst, 'selectOtherMonths');
		var calculateWeek = this._get(inst, 'calculateWeek') || this.iso8601Week;
		var defaultDate = this._getDefaultDate(inst);
		var html = '';
		for (var row = 0; row < numMonths[0]; row++) {
			var group = '';
			this.maxRows = 4;
			for (var col = 0; col < numMonths[1]; col++) {
				var selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
				var cornerClass = ' ui-corner-all';
				var calender = '';
				if (isMultiMonth) {
					calender += '<div class="ui-datepicker-group';
					if (numMonths[1] > 1)
						switch (col) {
							case 0: calender += ' ui-datepicker-group-first';
								cornerClass = ' ui-corner-' + (isRTL ? 'right' : 'left'); break;
							case numMonths[1]-1: calender += ' ui-datepicker-group-last';
								cornerClass = ' ui-corner-' + (isRTL ? 'left' : 'right'); break;
							default: calender += ' ui-datepicker-group-middle'; cornerClass = ''; break;
						}
					calender += '">';
				}
				calender += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + cornerClass + '">' +
					(/all|left/.test(cornerClass) && row == 0 ? (isRTL ? next : prev) : '') +
					(/all|right/.test(cornerClass) && row == 0 ? (isRTL ? prev : next) : '') +
					this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
					row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
					'</div><table class="ui-datepicker-calendar"><thead>' +
					'<tr>';
				var thead = (showWeek ? '<th class="ui-datepicker-week-col">' + this._get(inst, 'weekHeader') + '</th>' : '');
				for (var dow = 0; dow < 7; dow++) { // days of the week
					var day = (dow + firstDay) % 7;
					thead += '<th' + ((dow + firstDay + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : '') + '>' +
						'<span title="' + dayNames[day] + '">' + dayNamesMin[day] + '</span></th>';
				}
				calender += thead + '</tr></thead><tbody>';
				var daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
				if (drawYear == inst.selectedYear && drawMonth == inst.selectedMonth)
					inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
				var leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
				var curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
				var numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
				this.maxRows = numRows;
				var printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
				for (var dRow = 0; dRow < numRows; dRow++) { // create date picker rows
					calender += '<tr>';
					var tbody = (!showWeek ? '' : '<td class="ui-datepicker-week-col">' +
						this._get(inst, 'calculateWeek')(printDate) + '</td>');
					for (var dow = 0; dow < 7; dow++) { // create date picker days
						var daySettings = (beforeShowDay ?
							beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, '']);
						var otherMonth = (printDate.getMonth() != drawMonth);
						var unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
							(minDate && printDate < minDate) || (maxDate && printDate > maxDate);
						tbody += '<td class="' +
							((dow + firstDay + 6) % 7 >= 5 ? ' ui-datepicker-week-end' : '') + // highlight weekends
							(otherMonth ? ' ui-datepicker-other-month' : '') + // highlight days from other months
							((printDate.getTime() == selectedDate.getTime() && drawMonth == inst.selectedMonth && inst._keyEvent) || // user pressed key
							(defaultDate.getTime() == printDate.getTime() && defaultDate.getTime() == selectedDate.getTime()) ?
							// or defaultDate is current printedDate and defaultDate is selectedDate
							' ' + this._dayOverClass : '') + // highlight selected day
							(unselectable ? ' ' + this._unselectableClass + ' ui-state-disabled': '') +  // highlight unselectable days
							(otherMonth && !showOtherMonths ? '' : ' ' + daySettings[1] + // highlight custom dates
							(printDate.getTime() == currentDate.getTime() ? ' ' + this._currentClass : '') + // highlight selected day
							(printDate.getTime() == today.getTime() ? ' ui-datepicker-today' : '')) + '"' + // highlight today (if different)
							((!otherMonth || showOtherMonths) && daySettings[2] ? ' title="' + daySettings[2] + '"' : '') + // cell title
							(unselectable ? '' : ' data-handler="selectDay" data-event="click" data-month="' + printDate.getMonth() + '" data-year="' + printDate.getFullYear() + '"') + '>' + // actions
							(otherMonth && !showOtherMonths ? '&#xa0;' : // display for other months
							(unselectable ? '<span class="ui-state-default">' + printDate.getDate() + '</span>' : '<a class="ui-state-default' +
							(printDate.getTime() == today.getTime() ? ' ui-state-highlight' : '') +
							(printDate.getTime() == currentDate.getTime() ? ' ui-state-active' : '') + // highlight selected day
							(otherMonth ? ' ui-priority-secondary' : '') + // distinguish dates from other months
							'" href="#">' + printDate.getDate() + '</a>')) + '</td>'; // display selectable date
						printDate.setDate(printDate.getDate() + 1);
						printDate = this._daylightSavingAdjust(printDate);
					}
					calender += tbody + '</tr>';
				}
				drawMonth++;
				if (drawMonth > 11) {
					drawMonth = 0;
					drawYear++;
				}
				calender += '</tbody></table>' + (isMultiMonth ? '</div>' +
							((numMonths[0] > 0 && col == numMonths[1]-1) ? '<div class="ui-datepicker-row-break"></div>' : '') : '');
				group += calender;
			}
			html += group;
		}
		html += buttonPanel + ($.ui.ie6 && !inst.inline ?
			'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : '');
		inst._keyEvent = false;
		return html;
	},

	/* Generate the month and year header. */
	_generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
			secondary, monthNames, monthNamesShort) {
		var changeMonth = this._get(inst, 'changeMonth');
		var changeYear = this._get(inst, 'changeYear');
		var showMonthAfterYear = this._get(inst, 'showMonthAfterYear');
		var html = '<div class="ui-datepicker-title">';
		var monthHtml = '';
		// month selection
		if (secondary || !changeMonth)
			monthHtml += '<span class="ui-datepicker-month">' + monthNames[drawMonth] + '</span>';
		else {
			var inMinYear = (minDate && minDate.getFullYear() == drawYear);
			var inMaxYear = (maxDate && maxDate.getFullYear() == drawYear);
			monthHtml += '<select class="ui-datepicker-month" data-handler="selectMonth" data-event="change">';
			for (var month = 0; month < 12; month++) {
				if ((!inMinYear || month >= minDate.getMonth()) &&
						(!inMaxYear || month <= maxDate.getMonth()))
					monthHtml += '<option value="' + month + '"' +
						(month == drawMonth ? ' selected="selected"' : '') +
						'>' + monthNamesShort[month] + '</option>';
			}
			monthHtml += '</select>';
		}
		if (!showMonthAfterYear)
			html += monthHtml + (secondary || !(changeMonth && changeYear) ? '&#xa0;' : '');
		// year selection
		if ( !inst.yearshtml ) {
			inst.yearshtml = '';
			if (secondary || !changeYear)
				html += '<span class="ui-datepicker-year">' + drawYear + '</span>';
			else {
				// determine range of years to display
				var years = this._get(inst, 'yearRange').split(':');
				var thisYear = new Date().getFullYear();
				var determineYear = function(value) {
					var year = (value.match(/c[+-].*/) ? drawYear + parseInt(value.substring(1), 10) :
						(value.match(/[+-].*/) ? thisYear + parseInt(value, 10) :
						parseInt(value, 10)));
					return (isNaN(year) ? thisYear : year);
				};
				var year = determineYear(years[0]);
				var endYear = Math.max(year, determineYear(years[1] || ''));
				year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
				endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
				inst.yearshtml += '<select class="ui-datepicker-year" data-handler="selectYear" data-event="change">';
				for (; year <= endYear; year++) {
					inst.yearshtml += '<option value="' + year + '"' +
						(year == drawYear ? ' selected="selected"' : '') +
						'>' + year + '</option>';
				}
				inst.yearshtml += '</select>';

				html += inst.yearshtml;
				inst.yearshtml = null;
			}
		}
		html += this._get(inst, 'yearSuffix');
		if (showMonthAfterYear)
			html += (secondary || !(changeMonth && changeYear) ? '&#xa0;' : '') + monthHtml;
		html += '</div>'; // Close datepicker_header
		return html;
	},

	/* Adjust one of the date sub-fields. */
	_adjustInstDate: function(inst, offset, period) {
		var year = inst.drawYear + (period == 'Y' ? offset : 0);
		var month = inst.drawMonth + (period == 'M' ? offset : 0);
		var day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) +
			(period == 'D' ? offset : 0);
		var date = this._restrictMinMax(inst,
			this._daylightSavingAdjust(new Date(year, month, day)));
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		if (period == 'M' || period == 'Y')
			this._notifyChange(inst);
	},

	/* Ensure a date is within any min/max bounds. */
	_restrictMinMax: function(inst, date) {
		var minDate = this._getMinMaxDate(inst, 'min');
		var maxDate = this._getMinMaxDate(inst, 'max');
		var newDate = (minDate && date < minDate ? minDate : date);
		newDate = (maxDate && newDate > maxDate ? maxDate : newDate);
		return newDate;
	},

	/* Notify change of month/year. */
	_notifyChange: function(inst) {
		var onChange = this._get(inst, 'onChangeMonthYear');
		if (onChange)
			onChange.apply((inst.input ? inst.input[0] : null),
				[inst.selectedYear, inst.selectedMonth + 1, inst]);
	},

	/* Determine the number of months to show. */
	_getNumberOfMonths: function(inst) {
		var numMonths = this._get(inst, 'numberOfMonths');
		return (numMonths == null ? [1, 1] : (typeof numMonths == 'number' ? [1, numMonths] : numMonths));
	},

	/* Determine the current maximum date - ensure no time components are set. */
	_getMinMaxDate: function(inst, minMax) {
		return this._determineDate(inst, this._get(inst, minMax + 'Date'), null);
	},

	/* Find the number of days in a given month. */
	_getDaysInMonth: function(year, month) {
		return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
	},

	/* Find the day of the week of the first of a month. */
	_getFirstDayOfMonth: function(year, month) {
		return new Date(year, month, 1).getDay();
	},

	/* Determines if we should allow a "next/prev" month display change. */
	_canAdjustMonth: function(inst, offset, curYear, curMonth) {
		var numMonths = this._getNumberOfMonths(inst);
		var date = this._daylightSavingAdjust(new Date(curYear,
			curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));
		if (offset < 0)
			date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
		return this._isInRange(inst, date);
	},

	/* Is the given date in the accepted range? */
	_isInRange: function(inst, date) {
		var minDate = this._getMinMaxDate(inst, 'min');
		var maxDate = this._getMinMaxDate(inst, 'max');
		return ((!minDate || date.getTime() >= minDate.getTime()) &&
			(!maxDate || date.getTime() <= maxDate.getTime()));
	},

	/* Provide the configuration settings for formatting/parsing. */
	_getFormatConfig: function(inst) {
		var shortYearCutoff = this._get(inst, 'shortYearCutoff');
		shortYearCutoff = (typeof shortYearCutoff != 'string' ? shortYearCutoff :
			new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
		return {shortYearCutoff: shortYearCutoff,
			dayNamesShort: this._get(inst, 'dayNamesShort'), dayNames: this._get(inst, 'dayNames'),
			monthNamesShort: this._get(inst, 'monthNamesShort'), monthNames: this._get(inst, 'monthNames')};
	},

	/* Format the given date for display. */
	_formatDate: function(inst, day, month, year) {
		if (!day) {
			inst.currentDay = inst.selectedDay;
			inst.currentMonth = inst.selectedMonth;
			inst.currentYear = inst.selectedYear;
		}
		var date = (day ? (typeof day == 'object' ? day :
			this._daylightSavingAdjust(new Date(year, month, day))) :
			this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
		return this.formatDate(this._get(inst, 'dateFormat'), date, this._getFormatConfig(inst));
	}
});

/*
 * Bind hover events for datepicker elements.
 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
 * Global instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
 */
function bindHover(dpDiv) {
	var selector = 'button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a';
	return dpDiv.delegate(selector, 'mouseout', function() {
			$(this).removeClass('ui-state-hover');
			if (this.className.indexOf('ui-datepicker-prev') != -1) $(this).removeClass('ui-datepicker-prev-hover');
			if (this.className.indexOf('ui-datepicker-next') != -1) $(this).removeClass('ui-datepicker-next-hover');
		})
		.delegate(selector, 'mouseover', function(){
			if (!$.datepicker._isDisabledDatepicker( instActive.inline ? dpDiv.parent()[0] : instActive.input[0])) {
				$(this).parents('.ui-datepicker-calendar').find('a').removeClass('ui-state-hover');
				$(this).addClass('ui-state-hover');
				if (this.className.indexOf('ui-datepicker-prev') != -1) $(this).addClass('ui-datepicker-prev-hover');
				if (this.className.indexOf('ui-datepicker-next') != -1) $(this).addClass('ui-datepicker-next-hover');
			}
		});
}

/* jQuery extend now ignores nulls! */
function extendRemove(target, props) {
	$.extend(target, props);
	for (var name in props)
		if (props[name] == null || props[name] == undefined)
			target[name] = props[name];
	return target;
};

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
	                Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function(options){

	/* Verify an empty collection wasn't passed - Fixes #6976 */
	if ( !this.length ) {
		return this;
	}

	/* Initialise the date picker. */
	if (!$.datepicker.initialized) {
		$(document).mousedown($.datepicker._checkExternalClick).
			find(document.body).append($.datepicker.dpDiv);
		$.datepicker.initialized = true;
	}

	var otherArgs = Array.prototype.slice.call(arguments, 1);
	if (typeof options == 'string' && (options == 'isDisabled' || options == 'getDate' || options == 'widget'))
		return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
	if (options == 'option' && arguments.length == 2 && typeof arguments[1] == 'string')
		return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
	return this.each(function() {
		typeof options == 'string' ?
			$.datepicker['_' + options + 'Datepicker'].
				apply($.datepicker, [this].concat(otherArgs)) :
			$.datepicker._attachDatepicker(this, options);
	});
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.9.2";

// Workaround for #4055
// Add another global to avoid noConflict issues with inline event handlers
window['DP_jQuery_' + dpuuid] = $;

})(jQuery);
(function( $, undefined ) {

var uiDialogClasses = "ui-dialog ui-widget ui-widget-content ui-corner-all ",
	sizeRelatedOptions = {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},
	resizableRelatedOptions = {
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	};

$.widget("ui.dialog", {
	version: "1.9.2",
	options: {
		autoOpen: true,
		buttons: {},
		closeOnEscape: true,
		closeText: "close",
		dialogClass: "",
		draggable: true,
		hide: null,
		height: "auto",
		maxHeight: false,
		maxWidth: false,
		minHeight: 150,
		minWidth: 150,
		modal: false,
		position: {
			my: "center",
			at: "center",
			of: window,
			collision: "fit",
			// ensure that the titlebar is never outside the document
			using: function( pos ) {
				var topOffset = $( this ).css( pos ).offset().top;
				if ( topOffset < 0 ) {
					$( this ).css( "top", pos.top - topOffset );
				}
			}
		},
		resizable: true,
		show: null,
		stack: true,
		title: "",
		width: 300,
		zIndex: 1000
	},

	_create: function() {
		this.originalTitle = this.element.attr( "title" );
		// #5742 - .attr() might return a DOMElement
		if ( typeof this.originalTitle !== "string" ) {
			this.originalTitle = "";
		}
		this.oldPosition = {
			parent: this.element.parent(),
			index: this.element.parent().children().index( this.element )
		};
		this.options.title = this.options.title || this.originalTitle;
		var that = this,
			options = this.options,

			title = options.title || "&#160;",
			uiDialog,
			uiDialogTitlebar,
			uiDialogTitlebarClose,
			uiDialogTitle,
			uiDialogButtonPane;

			uiDialog = ( this.uiDialog = $( "<div>" ) )
				.addClass( uiDialogClasses + options.dialogClass )
				.css({
					display: "none",
					outline: 0, // TODO: move to stylesheet
					zIndex: options.zIndex
				})
				// setting tabIndex makes the div focusable
				.attr( "tabIndex", -1)
				.keydown(function( event ) {
					if ( options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
							event.keyCode === $.ui.keyCode.ESCAPE ) {
						that.close( event );
						event.preventDefault();
					}
				})
				.mousedown(function( event ) {
					that.moveToTop( false, event );
				})
				.appendTo( "body" );

			this.element
				.show()
				.removeAttr( "title" )
				.addClass( "ui-dialog-content ui-widget-content" )
				.appendTo( uiDialog );

			uiDialogTitlebar = ( this.uiDialogTitlebar = $( "<div>" ) )
				.addClass( "ui-dialog-titlebar  ui-widget-header  " +
					"ui-corner-all  ui-helper-clearfix" )
				.bind( "mousedown", function() {
					// Dialog isn't getting focus when dragging (#8063)
					uiDialog.focus();
				})
				.prependTo( uiDialog );

			uiDialogTitlebarClose = $( "<a href='#'></a>" )
				.addClass( "ui-dialog-titlebar-close  ui-corner-all" )
				.attr( "role", "button" )
				.click(function( event ) {
					event.preventDefault();
					that.close( event );
				})
				.appendTo( uiDialogTitlebar );

			( this.uiDialogTitlebarCloseText = $( "<span>" ) )
				.addClass( "ui-icon ui-icon-closethick" )
				.text( options.closeText )
				.appendTo( uiDialogTitlebarClose );

			uiDialogTitle = $( "<span>" )
				.uniqueId()
				.addClass( "ui-dialog-title" )
				.html( title )
				.prependTo( uiDialogTitlebar );

			uiDialogButtonPane = ( this.uiDialogButtonPane = $( "<div>" ) )
				.addClass( "ui-dialog-buttonpane ui-widget-content ui-helper-clearfix" );

			( this.uiButtonSet = $( "<div>" ) )
				.addClass( "ui-dialog-buttonset" )
				.appendTo( uiDialogButtonPane );

		uiDialog.attr({
			role: "dialog",
			"aria-labelledby": uiDialogTitle.attr( "id" )
		});

		uiDialogTitlebar.find( "*" ).add( uiDialogTitlebar ).disableSelection();
		this._hoverable( uiDialogTitlebarClose );
		this._focusable( uiDialogTitlebarClose );

		if ( options.draggable && $.fn.draggable ) {
			this._makeDraggable();
		}
		if ( options.resizable && $.fn.resizable ) {
			this._makeResizable();
		}

		this._createButtons( options.buttons );
		this._isOpen = false;

		if ( $.fn.bgiframe ) {
			uiDialog.bgiframe();
		}

		// prevent tabbing out of modal dialogs
		this._on( uiDialog, { keydown: function( event ) {
			if ( !options.modal || event.keyCode !== $.ui.keyCode.TAB ) {
				return;
			}

			var tabbables = $( ":tabbable", uiDialog ),
				first = tabbables.filter( ":first" ),
				last  = tabbables.filter( ":last" );

			if ( event.target === last[0] && !event.shiftKey ) {
				first.focus( 1 );
				return false;
			} else if ( event.target === first[0] && event.shiftKey ) {
				last.focus( 1 );
				return false;
			}
		}});
	},

	_init: function() {
		if ( this.options.autoOpen ) {
			this.open();
		}
	},

	_destroy: function() {
		var next,
			oldPosition = this.oldPosition;

		if ( this.overlay ) {
			this.overlay.destroy();
		}
		this.uiDialog.hide();
		this.element
			.removeClass( "ui-dialog-content ui-widget-content" )
			.hide()
			.appendTo( "body" );
		this.uiDialog.remove();

		if ( this.originalTitle ) {
			this.element.attr( "title", this.originalTitle );
		}

		next = oldPosition.parent.children().eq( oldPosition.index );
		// Don't try to place the dialog next to itself (#8613)
		if ( next.length && next[ 0 ] !== this.element[ 0 ] ) {
			next.before( this.element );
		} else {
			oldPosition.parent.append( this.element );
		}
	},

	widget: function() {
		return this.uiDialog;
	},

	close: function( event ) {
		var that = this,
			maxZ, thisZ;

		if ( !this._isOpen ) {
			return;
		}

		if ( false === this._trigger( "beforeClose", event ) ) {
			return;
		}

		this._isOpen = false;

		if ( this.overlay ) {
			this.overlay.destroy();
		}

		if ( this.options.hide ) {
			this._hide( this.uiDialog, this.options.hide, function() {
				that._trigger( "close", event );
			});
		} else {
			this.uiDialog.hide();
			this._trigger( "close", event );
		}

		$.ui.dialog.overlay.resize();

		// adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
		if ( this.options.modal ) {
			maxZ = 0;
			$( ".ui-dialog" ).each(function() {
				if ( this !== that.uiDialog[0] ) {
					thisZ = $( this ).css( "z-index" );
					if ( !isNaN( thisZ ) ) {
						maxZ = Math.max( maxZ, thisZ );
					}
				}
			});
			$.ui.dialog.maxZ = maxZ;
		}

		return this;
	},

	isOpen: function() {
		return this._isOpen;
	},

	// the force parameter allows us to move modal dialogs to their correct
	// position on open
	moveToTop: function( force, event ) {
		var options = this.options,
			saveScroll;

		if ( ( options.modal && !force ) ||
				( !options.stack && !options.modal ) ) {
			return this._trigger( "focus", event );
		}

		if ( options.zIndex > $.ui.dialog.maxZ ) {
			$.ui.dialog.maxZ = options.zIndex;
		}
		if ( this.overlay ) {
			$.ui.dialog.maxZ += 1;
			$.ui.dialog.overlay.maxZ = $.ui.dialog.maxZ;
			this.overlay.$el.css( "z-index", $.ui.dialog.overlay.maxZ );
		}

		// Save and then restore scroll
		// Opera 9.5+ resets when parent z-index is changed.
		// http://bugs.jqueryui.com/ticket/3193
		saveScroll = {
			scrollTop: this.element.scrollTop(),
			scrollLeft: this.element.scrollLeft()
		};
		$.ui.dialog.maxZ += 1;
		this.uiDialog.css( "z-index", $.ui.dialog.maxZ );
		this.element.attr( saveScroll );
		this._trigger( "focus", event );

		return this;
	},

	open: function() {
		if ( this._isOpen ) {
			return;
		}

		var hasFocus,
			options = this.options,
			uiDialog = this.uiDialog;

		this._size();
		this._position( options.position );
		uiDialog.show( options.show );
		this.overlay = options.modal ? new $.ui.dialog.overlay( this ) : null;
		this.moveToTop( true );

		// set focus to the first tabbable element in the content area or the first button
		// if there are no tabbable elements, set focus on the dialog itself
		hasFocus = this.element.find( ":tabbable" );
		if ( !hasFocus.length ) {
			hasFocus = this.uiDialogButtonPane.find( ":tabbable" );
			if ( !hasFocus.length ) {
				hasFocus = uiDialog;
			}
		}
		hasFocus.eq( 0 ).focus();

		this._isOpen = true;
		this._trigger( "open" );

		return this;
	},

	_createButtons: function( buttons ) {
		var that = this,
			hasButtons = false;

		// if we already have a button pane, remove it
		this.uiDialogButtonPane.remove();
		this.uiButtonSet.empty();

		if ( typeof buttons === "object" && buttons !== null ) {
			$.each( buttons, function() {
				return !(hasButtons = true);
			});
		}
		if ( hasButtons ) {
			$.each( buttons, function( name, props ) {
				var button, click;
				props = $.isFunction( props ) ?
					{ click: props, text: name } :
					props;
				// Default to a non-submitting button
				props = $.extend( { type: "button" }, props );
				// Change the context for the click callback to be the main element
				click = props.click;
				props.click = function() {
					click.apply( that.element[0], arguments );
				};
				button = $( "<button></button>", props )
					.appendTo( that.uiButtonSet );
				if ( $.fn.button ) {
					button.button();
				}
			});
			this.uiDialog.addClass( "ui-dialog-buttons" );
			this.uiDialogButtonPane.appendTo( this.uiDialog );
		} else {
			this.uiDialog.removeClass( "ui-dialog-buttons" );
		}
	},

	_makeDraggable: function() {
		var that = this,
			options = this.options;

		function filteredUi( ui ) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}

		this.uiDialog.draggable({
			cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
			handle: ".ui-dialog-titlebar",
			containment: "document",
			start: function( event, ui ) {
				$( this )
					.addClass( "ui-dialog-dragging" );
				that._trigger( "dragStart", event, filteredUi( ui ) );
			},
			drag: function( event, ui ) {
				that._trigger( "drag", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				options.position = [
					ui.position.left - that.document.scrollLeft(),
					ui.position.top - that.document.scrollTop()
				];
				$( this )
					.removeClass( "ui-dialog-dragging" );
				that._trigger( "dragStop", event, filteredUi( ui ) );
				$.ui.dialog.overlay.resize();
			}
		});
	},

	_makeResizable: function( handles ) {
		handles = (handles === undefined ? this.options.resizable : handles);
		var that = this,
			options = this.options,
			// .ui-resizable has position: relative defined in the stylesheet
			// but dialogs have to use absolute or fixed positioning
			position = this.uiDialog.css( "position" ),
			resizeHandles = typeof handles === 'string' ?
				handles	:
				"n,e,s,w,se,sw,ne,nw";

		function filteredUi( ui ) {
			return {
				originalPosition: ui.originalPosition,
				originalSize: ui.originalSize,
				position: ui.position,
				size: ui.size
			};
		}

		this.uiDialog.resizable({
			cancel: ".ui-dialog-content",
			containment: "document",
			alsoResize: this.element,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			minWidth: options.minWidth,
			minHeight: this._minHeight(),
			handles: resizeHandles,
			start: function( event, ui ) {
				$( this ).addClass( "ui-dialog-resizing" );
				that._trigger( "resizeStart", event, filteredUi( ui ) );
			},
			resize: function( event, ui ) {
				that._trigger( "resize", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				$( this ).removeClass( "ui-dialog-resizing" );
				options.height = $( this ).height();
				options.width = $( this ).width();
				that._trigger( "resizeStop", event, filteredUi( ui ) );
				$.ui.dialog.overlay.resize();
			}
		})
		.css( "position", position )
		.find( ".ui-resizable-se" )
			.addClass( "ui-icon ui-icon-grip-diagonal-se" );
	},

	_minHeight: function() {
		var options = this.options;

		if ( options.height === "auto" ) {
			return options.minHeight;
		} else {
			return Math.min( options.minHeight, options.height );
		}
	},

	_position: function( position ) {
		var myAt = [],
			offset = [ 0, 0 ],
			isVisible;

		if ( position ) {
			// deep extending converts arrays to objects in jQuery <= 1.3.2 :-(
	//		if (typeof position == 'string' || $.isArray(position)) {
	//			myAt = $.isArray(position) ? position : position.split(' ');

			if ( typeof position === "string" || (typeof position === "object" && "0" in position ) ) {
				myAt = position.split ? position.split( " " ) : [ position[ 0 ], position[ 1 ] ];
				if ( myAt.length === 1 ) {
					myAt[ 1 ] = myAt[ 0 ];
				}

				$.each( [ "left", "top" ], function( i, offsetPosition ) {
					if ( +myAt[ i ] === myAt[ i ] ) {
						offset[ i ] = myAt[ i ];
						myAt[ i ] = offsetPosition;
					}
				});

				position = {
					my: myAt[0] + (offset[0] < 0 ? offset[0] : "+" + offset[0]) + " " +
						myAt[1] + (offset[1] < 0 ? offset[1] : "+" + offset[1]),
					at: myAt.join( " " )
				};
			}

			position = $.extend( {}, $.ui.dialog.prototype.options.position, position );
		} else {
			position = $.ui.dialog.prototype.options.position;
		}

		// need to show the dialog to get the actual offset in the position plugin
		isVisible = this.uiDialog.is( ":visible" );
		if ( !isVisible ) {
			this.uiDialog.show();
		}
		this.uiDialog.position( position );
		if ( !isVisible ) {
			this.uiDialog.hide();
		}
	},

	_setOptions: function( options ) {
		var that = this,
			resizableOptions = {},
			resize = false;

		$.each( options, function( key, value ) {
			that._setOption( key, value );

			if ( key in sizeRelatedOptions ) {
				resize = true;
			}
			if ( key in resizableRelatedOptions ) {
				resizableOptions[ key ] = value;
			}
		});

		if ( resize ) {
			this._size();
		}
		if ( this.uiDialog.is( ":data(resizable)" ) ) {
			this.uiDialog.resizable( "option", resizableOptions );
		}
	},

	_setOption: function( key, value ) {
		var isDraggable, isResizable,
			uiDialog = this.uiDialog;

		switch ( key ) {
			case "buttons":
				this._createButtons( value );
				break;
			case "closeText":
				// ensure that we always pass a string
				this.uiDialogTitlebarCloseText.text( "" + value );
				break;
			case "dialogClass":
				uiDialog
					.removeClass( this.options.dialogClass )
					.addClass( uiDialogClasses + value );
				break;
			case "disabled":
				if ( value ) {
					uiDialog.addClass( "ui-dialog-disabled" );
				} else {
					uiDialog.removeClass( "ui-dialog-disabled" );
				}
				break;
			case "draggable":
				isDraggable = uiDialog.is( ":data(draggable)" );
				if ( isDraggable && !value ) {
					uiDialog.draggable( "destroy" );
				}

				if ( !isDraggable && value ) {
					this._makeDraggable();
				}
				break;
			case "position":
				this._position( value );
				break;
			case "resizable":
				// currently resizable, becoming non-resizable
				isResizable = uiDialog.is( ":data(resizable)" );
				if ( isResizable && !value ) {
					uiDialog.resizable( "destroy" );
				}

				// currently resizable, changing handles
				if ( isResizable && typeof value === "string" ) {
					uiDialog.resizable( "option", "handles", value );
				}

				// currently non-resizable, becoming resizable
				if ( !isResizable && value !== false ) {
					this._makeResizable( value );
				}
				break;
			case "title":
				// convert whatever was passed in o a string, for html() to not throw up
				$( ".ui-dialog-title", this.uiDialogTitlebar )
					.html( "" + ( value || "&#160;" ) );
				break;
		}

		this._super( key, value );
	},

	_size: function() {
		/* If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
		 * divs will both have width and height set, so we need to reset them
		 */
		var nonContentHeight, minContentHeight, autoHeight,
			options = this.options,
			isVisible = this.uiDialog.is( ":visible" );

		// reset content sizing
		this.element.show().css({
			width: "auto",
			minHeight: 0,
			height: 0
		});

		if ( options.minWidth > options.width ) {
			options.width = options.minWidth;
		}

		// reset wrapper sizing
		// determine the height of all the non-content elements
		nonContentHeight = this.uiDialog.css({
				height: "auto",
				width: options.width
			})
			.outerHeight();
		minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );

		if ( options.height === "auto" ) {
			// only needed for IE6 support
			if ( $.support.minHeight ) {
				this.element.css({
					minHeight: minContentHeight,
					height: "auto"
				});
			} else {
				this.uiDialog.show();
				autoHeight = this.element.css( "height", "auto" ).height();
				if ( !isVisible ) {
					this.uiDialog.hide();
				}
				this.element.height( Math.max( autoHeight, minContentHeight ) );
			}
		} else {
			this.element.height( Math.max( options.height - nonContentHeight, 0 ) );
		}

		if (this.uiDialog.is( ":data(resizable)" ) ) {
			this.uiDialog.resizable( "option", "minHeight", this._minHeight() );
		}
	}
});

$.extend($.ui.dialog, {
	uuid: 0,
	maxZ: 0,

	getTitleId: function($el) {
		var id = $el.attr( "id" );
		if ( !id ) {
			this.uuid += 1;
			id = this.uuid;
		}
		return "ui-dialog-title-" + id;
	},

	overlay: function( dialog ) {
		this.$el = $.ui.dialog.overlay.create( dialog );
	}
});

$.extend( $.ui.dialog.overlay, {
	instances: [],
	// reuse old instances due to IE memory leak with alpha transparency (see #5185)
	oldInstances: [],
	maxZ: 0,
	events: $.map(
		"focus,mousedown,mouseup,keydown,keypress,click".split( "," ),
		function( event ) {
			return event + ".dialog-overlay";
		}
	).join( " " ),
	create: function( dialog ) {
		if ( this.instances.length === 0 ) {
			// prevent use of anchors and inputs
			// we use a setTimeout in case the overlay is created from an
			// event that we're going to be cancelling (see #2804)
			setTimeout(function() {
				// handle $(el).dialog().dialog('close') (see #4065)
				if ( $.ui.dialog.overlay.instances.length ) {
					$( document ).bind( $.ui.dialog.overlay.events, function( event ) {
						// stop events if the z-index of the target is < the z-index of the overlay
						// we cannot return true when we don't want to cancel the event (#3523)
						if ( $( event.target ).zIndex() < $.ui.dialog.overlay.maxZ ) {
							return false;
						}
					});
				}
			}, 1 );

			// handle window resize
			$( window ).bind( "resize.dialog-overlay", $.ui.dialog.overlay.resize );
		}

		var $el = ( this.oldInstances.pop() || $( "<div>" ).addClass( "ui-widget-overlay" ) );

		// allow closing by pressing the escape key
		$( document ).bind( "keydown.dialog-overlay", function( event ) {
			var instances = $.ui.dialog.overlay.instances;
			// only react to the event if we're the top overlay
			if ( instances.length !== 0 && instances[ instances.length - 1 ] === $el &&
				dialog.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
				event.keyCode === $.ui.keyCode.ESCAPE ) {

				dialog.close( event );
				event.preventDefault();
			}
		});

		$el.appendTo( document.body ).css({
			width: this.width(),
			height: this.height()
		});

		if ( $.fn.bgiframe ) {
			$el.bgiframe();
		}

		this.instances.push( $el );
		return $el;
	},

	destroy: function( $el ) {
		var indexOf = $.inArray( $el, this.instances ),
			maxZ = 0;

		if ( indexOf !== -1 ) {
			this.oldInstances.push( this.instances.splice( indexOf, 1 )[ 0 ] );
		}

		if ( this.instances.length === 0 ) {
			$( [ document, window ] ).unbind( ".dialog-overlay" );
		}

		$el.height( 0 ).width( 0 ).remove();

		// adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
		$.each( this.instances, function() {
			maxZ = Math.max( maxZ, this.css( "z-index" ) );
		});
		this.maxZ = maxZ;
	},

	height: function() {
		var scrollHeight,
			offsetHeight;
		// handle IE
		if ( $.ui.ie ) {
			scrollHeight = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight
			);
			offsetHeight = Math.max(
				document.documentElement.offsetHeight,
				document.body.offsetHeight
			);

			if ( scrollHeight < offsetHeight ) {
				return $( window ).height() + "px";
			} else {
				return scrollHeight + "px";
			}
		// handle "good" browsers
		} else {
			return $( document ).height() + "px";
		}
	},

	width: function() {
		var scrollWidth,
			offsetWidth;
		// handle IE
		if ( $.ui.ie ) {
			scrollWidth = Math.max(
				document.documentElement.scrollWidth,
				document.body.scrollWidth
			);
			offsetWidth = Math.max(
				document.documentElement.offsetWidth,
				document.body.offsetWidth
			);

			if ( scrollWidth < offsetWidth ) {
				return $( window ).width() + "px";
			} else {
				return scrollWidth + "px";
			}
		// handle "good" browsers
		} else {
			return $( document ).width() + "px";
		}
	},

	resize: function() {
		/* If the dialog is draggable and the user drags it past the
		 * right edge of the window, the document becomes wider so we
		 * need to stretch the overlay. If the user then drags the
		 * dialog back to the left, the document will become narrower,
		 * so we need to shrink the overlay to the appropriate size.
		 * This is handled by shrinking the overlay before setting it
		 * to the full document size.
		 */
		var $overlays = $( [] );
		$.each( $.ui.dialog.overlay.instances, function() {
			$overlays = $overlays.add( this );
		});

		$overlays.css({
			width: 0,
			height: 0
		}).css({
			width: $.ui.dialog.overlay.width(),
			height: $.ui.dialog.overlay.height()
		});
	}
});

$.extend( $.ui.dialog.overlay.prototype, {
	destroy: function() {
		$.ui.dialog.overlay.destroy( this.$el );
	}
});

}( jQuery ) );
(function( $, undefined ) {

var mouseHandled = false;

$.widget( "ui.menu", {
	version: "1.9.2",
	defaultElement: "<ul>",
	delay: 300,
	options: {
		icons: {
			submenu: "ui-icon-carat-1-e"
		},
		menus: "ul",
		position: {
			my: "left top",
			at: "right top"
		},
		role: "menu",

		// callbacks
		blur: null,
		focus: null,
		select: null
	},

	_create: function() {
		this.activeMenu = this.element;
		this.element
			.uniqueId()
			.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
			.toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length )
			.attr({
				role: this.options.role,
				tabIndex: 0
			})
			// need to catch all clicks on disabled menu
			// not possible through _on
			.bind( "click" + this.eventNamespace, $.proxy(function( event ) {
				if ( this.options.disabled ) {
					event.preventDefault();
				}
			}, this ));

		if ( this.options.disabled ) {
			this.element
				.addClass( "ui-state-disabled" )
				.attr( "aria-disabled", "true" );
		}

		this._on({
			// Prevent focus from sticking to links inside menu after clicking
			// them (focus should always stay on UL during navigation).
			"mousedown .ui-menu-item > a": function( event ) {
				event.preventDefault();
			},
			"click .ui-state-disabled > a": function( event ) {
				event.preventDefault();
			},
			"click .ui-menu-item:has(a)": function( event ) {
				var target = $( event.target ).closest( ".ui-menu-item" );
				if ( !mouseHandled && target.not( ".ui-state-disabled" ).length ) {
					mouseHandled = true;

					this.select( event );
					// Open submenu on click
					if ( target.has( ".ui-menu" ).length ) {
						this.expand( event );
					} else if ( !this.element.is( ":focus" ) ) {
						// Redirect focus to the menu
						this.element.trigger( "focus", [ true ] );

						// If the active item is on the top level, let it stay active.
						// Otherwise, blur the active item since it is no longer visible.
						if ( this.active && this.active.parents( ".ui-menu" ).length === 1 ) {
							clearTimeout( this.timer );
						}
					}
				}
			},
			"mouseenter .ui-menu-item": function( event ) {
				var target = $( event.currentTarget );
				// Remove ui-state-active class from siblings of the newly focused menu item
				// to avoid a jump caused by adjacent elements both having a class with a border
				target.siblings().children( ".ui-state-active" ).removeClass( "ui-state-active" );
				this.focus( event, target );
			},
			mouseleave: "collapseAll",
			"mouseleave .ui-menu": "collapseAll",
			focus: function( event, keepActiveItem ) {
				// If there's already an active item, keep it active
				// If not, activate the first item
				var item = this.active || this.element.children( ".ui-menu-item" ).eq( 0 );

				if ( !keepActiveItem ) {
					this.focus( event, item );
				}
			},
			blur: function( event ) {
				this._delay(function() {
					if ( !$.contains( this.element[0], this.document[0].activeElement ) ) {
						this.collapseAll( event );
					}
				});
			},
			keydown: "_keydown"
		});

		this.refresh();

		// Clicks outside of a menu collapse any open menus
		this._on( this.document, {
			click: function( event ) {
				if ( !$( event.target ).closest( ".ui-menu" ).length ) {
					this.collapseAll( event );
				}

				// Reset the mouseHandled flag
				mouseHandled = false;
			}
		});
	},

	_destroy: function() {
		// Destroy (sub)menus
		this.element
			.removeAttr( "aria-activedescendant" )
			.find( ".ui-menu" ).andSelf()
				.removeClass( "ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons" )
				.removeAttr( "role" )
				.removeAttr( "tabIndex" )
				.removeAttr( "aria-labelledby" )
				.removeAttr( "aria-expanded" )
				.removeAttr( "aria-hidden" )
				.removeAttr( "aria-disabled" )
				.removeUniqueId()
				.show();

		// Destroy menu items
		this.element.find( ".ui-menu-item" )
			.removeClass( "ui-menu-item" )
			.removeAttr( "role" )
			.removeAttr( "aria-disabled" )
			.children( "a" )
				.removeUniqueId()
				.removeClass( "ui-corner-all ui-state-hover" )
				.removeAttr( "tabIndex" )
				.removeAttr( "role" )
				.removeAttr( "aria-haspopup" )
				.children().each( function() {
					var elem = $( this );
					if ( elem.data( "ui-menu-submenu-carat" ) ) {
						elem.remove();
					}
				});

		// Destroy menu dividers
		this.element.find( ".ui-menu-divider" ).removeClass( "ui-menu-divider ui-widget-content" );
	},

	_keydown: function( event ) {
		var match, prev, character, skip, regex,
			preventDefault = true;

		function escape( value ) {
			return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
		}

		switch ( event.keyCode ) {
		case $.ui.keyCode.PAGE_UP:
			this.previousPage( event );
			break;
		case $.ui.keyCode.PAGE_DOWN:
			this.nextPage( event );
			break;
		case $.ui.keyCode.HOME:
			this._move( "first", "first", event );
			break;
		case $.ui.keyCode.END:
			this._move( "last", "last", event );
			break;
		case $.ui.keyCode.UP:
			this.previous( event );
			break;
		case $.ui.keyCode.DOWN:
			this.next( event );
			break;
		case $.ui.keyCode.LEFT:
			this.collapse( event );
			break;
		case $.ui.keyCode.RIGHT:
			if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
				this.expand( event );
			}
			break;
		case $.ui.keyCode.ENTER:
		case $.ui.keyCode.SPACE:
			this._activate( event );
			break;
		case $.ui.keyCode.ESCAPE:
			this.collapse( event );
			break;
		default:
			preventDefault = false;
			prev = this.previousFilter || "";
			character = String.fromCharCode( event.keyCode );
			skip = false;

			clearTimeout( this.filterTimer );

			if ( character === prev ) {
				skip = true;
			} else {
				character = prev + character;
			}

			regex = new RegExp( "^" + escape( character ), "i" );
			match = this.activeMenu.children( ".ui-menu-item" ).filter(function() {
				return regex.test( $( this ).children( "a" ).text() );
			});
			match = skip && match.index( this.active.next() ) !== -1 ?
				this.active.nextAll( ".ui-menu-item" ) :
				match;

			// If no matches on the current filter, reset to the last character pressed
			// to move down the menu to the first item that starts with that character
			if ( !match.length ) {
				character = String.fromCharCode( event.keyCode );
				regex = new RegExp( "^" + escape( character ), "i" );
				match = this.activeMenu.children( ".ui-menu-item" ).filter(function() {
					return regex.test( $( this ).children( "a" ).text() );
				});
			}

			if ( match.length ) {
				this.focus( event, match );
				if ( match.length > 1 ) {
					this.previousFilter = character;
					this.filterTimer = this._delay(function() {
						delete this.previousFilter;
					}, 1000 );
				} else {
					delete this.previousFilter;
				}
			} else {
				delete this.previousFilter;
			}
		}

		if ( preventDefault ) {
			event.preventDefault();
		}
	},

	_activate: function( event ) {
		if ( !this.active.is( ".ui-state-disabled" ) ) {
			if ( this.active.children( "a[aria-haspopup='true']" ).length ) {
				this.expand( event );
			} else {
				this.select( event );
			}
		}
	},

	refresh: function() {
		var menus,
			icon = this.options.icons.submenu,
			submenus = this.element.find( this.options.menus );

		// Initialize nested menus
		submenus.filter( ":not(.ui-menu)" )
			.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
			.hide()
			.attr({
				role: this.options.role,
				"aria-hidden": "true",
				"aria-expanded": "false"
			})
			.each(function() {
				var menu = $( this ),
					item = menu.prev( "a" ),
					submenuCarat = $( "<span>" )
						.addClass( "ui-menu-icon ui-icon " + icon )
						.data( "ui-menu-submenu-carat", true );

				item
					.attr( "aria-haspopup", "true" )
					.prepend( submenuCarat );
				menu.attr( "aria-labelledby", item.attr( "id" ) );
			});

		menus = submenus.add( this.element );

		// Don't refresh list items that are already adapted
		menus.children( ":not(.ui-menu-item):has(a)" )
			.addClass( "ui-menu-item" )
			.attr( "role", "presentation" )
			.children( "a" )
				.uniqueId()
				.addClass( "ui-corner-all" )
				.attr({
					tabIndex: -1,
					role: this._itemRole()
				});

		// Initialize unlinked menu-items containing spaces and/or dashes only as dividers
		menus.children( ":not(.ui-menu-item)" ).each(function() {
			var item = $( this );
			// hyphen, em dash, en dash
			if ( !/[^\-—–\s]/.test( item.text() ) ) {
				item.addClass( "ui-widget-content ui-menu-divider" );
			}
		});

		// Add aria-disabled attribute to any disabled menu item
		menus.children( ".ui-state-disabled" ).attr( "aria-disabled", "true" );

		// If the active item has been removed, blur the menu
		if ( this.active && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
			this.blur();
		}
	},

	_itemRole: function() {
		return {
			menu: "menuitem",
			listbox: "option"
		}[ this.options.role ];
	},

	focus: function( event, item ) {
		var nested, focused;
		this.blur( event, event && event.type === "focus" );

		this._scrollIntoView( item );

		this.active = item.first();
		focused = this.active.children( "a" ).addClass( "ui-state-focus" );
		// Only update aria-activedescendant if there's a role
		// otherwise we assume focus is managed elsewhere
		if ( this.options.role ) {
			this.element.attr( "aria-activedescendant", focused.attr( "id" ) );
		}

		// Highlight active parent menu item, if any
		this.active
			.parent()
			.closest( ".ui-menu-item" )
			.children( "a:first" )
			.addClass( "ui-state-active" );

		if ( event && event.type === "keydown" ) {
			this._close();
		} else {
			this.timer = this._delay(function() {
				this._close();
			}, this.delay );
		}

		nested = item.children( ".ui-menu" );
		if ( nested.length && ( /^mouse/.test( event.type ) ) ) {
			this._startOpening(nested);
		}
		this.activeMenu = item.parent();

		this._trigger( "focus", event, { item: item } );
	},

	_scrollIntoView: function( item ) {
		var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
		if ( this._hasScroll() ) {
			borderTop = parseFloat( $.css( this.activeMenu[0], "borderTopWidth" ) ) || 0;
			paddingTop = parseFloat( $.css( this.activeMenu[0], "paddingTop" ) ) || 0;
			offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
			scroll = this.activeMenu.scrollTop();
			elementHeight = this.activeMenu.height();
			itemHeight = item.height();

			if ( offset < 0 ) {
				this.activeMenu.scrollTop( scroll + offset );
			} else if ( offset + itemHeight > elementHeight ) {
				this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
			}
		}
	},

	blur: function( event, fromFocus ) {
		if ( !fromFocus ) {
			clearTimeout( this.timer );
		}

		if ( !this.active ) {
			return;
		}

		this.active.children( "a" ).removeClass( "ui-state-focus" );
		this.active = null;

		this._trigger( "blur", event, { item: this.active } );
	},

	_startOpening: function( submenu ) {
		clearTimeout( this.timer );

		// Don't open if already open fixes a Firefox bug that caused a .5 pixel
		// shift in the submenu position when mousing over the carat icon
		if ( submenu.attr( "aria-hidden" ) !== "true" ) {
			return;
		}

		this.timer = this._delay(function() {
			this._close();
			this._open( submenu );
		}, this.delay );
	},

	_open: function( submenu ) {
		var position = $.extend({
			of: this.active
		}, this.options.position );

		clearTimeout( this.timer );
		this.element.find( ".ui-menu" ).not( submenu.parents( ".ui-menu" ) )
			.hide()
			.attr( "aria-hidden", "true" );

		submenu
			.show()
			.removeAttr( "aria-hidden" )
			.attr( "aria-expanded", "true" )
			.position( position );
	},

	collapseAll: function( event, all ) {
		clearTimeout( this.timer );
		this.timer = this._delay(function() {
			// If we were passed an event, look for the submenu that contains the event
			var currentMenu = all ? this.element :
				$( event && event.target ).closest( this.element.find( ".ui-menu" ) );

			// If we found no valid submenu ancestor, use the main menu to close all sub menus anyway
			if ( !currentMenu.length ) {
				currentMenu = this.element;
			}

			this._close( currentMenu );

			this.blur( event );
			this.activeMenu = currentMenu;
		}, this.delay );
	},

	// With no arguments, closes the currently active menu - if nothing is active
	// it closes all menus.  If passed an argument, it will search for menus BELOW
	_close: function( startMenu ) {
		if ( !startMenu ) {
			startMenu = this.active ? this.active.parent() : this.element;
		}

		startMenu
			.find( ".ui-menu" )
				.hide()
				.attr( "aria-hidden", "true" )
				.attr( "aria-expanded", "false" )
			.end()
			.find( "a.ui-state-active" )
				.removeClass( "ui-state-active" );
	},

	collapse: function( event ) {
		var newItem = this.active &&
			this.active.parent().closest( ".ui-menu-item", this.element );
		if ( newItem && newItem.length ) {
			this._close();
			this.focus( event, newItem );
		}
	},

	expand: function( event ) {
		var newItem = this.active &&
			this.active
				.children( ".ui-menu " )
				.children( ".ui-menu-item" )
				.first();

		if ( newItem && newItem.length ) {
			this._open( newItem.parent() );

			// Delay so Firefox will not hide activedescendant change in expanding submenu from AT
			this._delay(function() {
				this.focus( event, newItem );
			});
		}
	},

	next: function( event ) {
		this._move( "next", "first", event );
	},

	previous: function( event ) {
		this._move( "prev", "last", event );
	},

	isFirstItem: function() {
		return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
	},

	isLastItem: function() {
		return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
	},

	_move: function( direction, filter, event ) {
		var next;
		if ( this.active ) {
			if ( direction === "first" || direction === "last" ) {
				next = this.active
					[ direction === "first" ? "prevAll" : "nextAll" ]( ".ui-menu-item" )
					.eq( -1 );
			} else {
				next = this.active
					[ direction + "All" ]( ".ui-menu-item" )
					.eq( 0 );
			}
		}
		if ( !next || !next.length || !this.active ) {
			next = this.activeMenu.children( ".ui-menu-item" )[ filter ]();
		}

		this.focus( event, next );
	},

	nextPage: function( event ) {
		var item, base, height;

		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isLastItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.nextAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base - height < 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.children( ".ui-menu-item" )
				[ !this.active ? "first" : "last" ]() );
		}
	},

	previousPage: function( event ) {
		var item, base, height;
		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isFirstItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.prevAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base + height > 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.children( ".ui-menu-item" ).first() );
		}
	},

	_hasScroll: function() {
		return this.element.outerHeight() < this.element.prop( "scrollHeight" );
	},

	select: function( event ) {
		// TODO: It should never be possible to not have an active item at this
		// point, but the tests don't trigger mouseenter before click.
		this.active = this.active || $( event.target ).closest( ".ui-menu-item" );
		var ui = { item: this.active };
		if ( !this.active.has( ".ui-menu" ).length ) {
			this.collapseAll( event, true );
		}
		this._trigger( "select", event, ui );
	}
});

}( jQuery ));
(function( $, undefined ) {

$.widget( "ui.progressbar", {
	version: "1.9.2",
	options: {
		value: 0,
		max: 100
	},

	min: 0,

	_create: function() {
		this.element
			.addClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.attr({
				role: "progressbar",
				"aria-valuemin": this.min,
				"aria-valuemax": this.options.max,
				"aria-valuenow": this._value()
			});

		this.valueDiv = $( "<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>" )
			.appendTo( this.element );

		this.oldValue = this._value();
		this._refreshValue();
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.removeAttr( "role" )
			.removeAttr( "aria-valuemin" )
			.removeAttr( "aria-valuemax" )
			.removeAttr( "aria-valuenow" );

		this.valueDiv.remove();
	},

	value: function( newValue ) {
		if ( newValue === undefined ) {
			return this._value();
		}

		this._setOption( "value", newValue );
		return this;
	},

	_setOption: function( key, value ) {
		if ( key === "value" ) {
			this.options.value = value;
			this._refreshValue();
			if ( this._value() === this.options.max ) {
				this._trigger( "complete" );
			}
		}

		this._super( key, value );
	},

	_value: function() {
		var val = this.options.value;
		// normalize invalid value
		if ( typeof val !== "number" ) {
			val = 0;
		}
		return Math.min( this.options.max, Math.max( this.min, val ) );
	},

	_percentage: function() {
		return 100 * this._value() / this.options.max;
	},

	_refreshValue: function() {
		var value = this.value(),
			percentage = this._percentage();

		if ( this.oldValue !== value ) {
			this.oldValue = value;
			this._trigger( "change" );
		}

		this.valueDiv
			.toggle( value > this.min )
			.toggleClass( "ui-corner-right", value === this.options.max )
			.width( percentage.toFixed(0) + "%" );
		this.element.attr( "aria-valuenow", value );
	}
});

})( jQuery );
(function( $, undefined ) {

// number of pages in a slider
// (how many times can you page up/down to go through the whole range)
var numPages = 5;

$.widget( "ui.slider", $.ui.mouse, {
	version: "1.9.2",
	widgetEventPrefix: "slide",

	options: {
		animate: false,
		distance: 0,
		max: 100,
		min: 0,
		orientation: "horizontal",
		range: false,
		step: 1,
		value: 0,
		values: null
	},

	_create: function() {
		var i, handleCount,
			o = this.options,
			existingHandles = this.element.find( ".ui-slider-handle" ).addClass( "ui-state-default ui-corner-all" ),
			handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
			handles = [];

		this._keySliding = false;
		this._mouseSliding = false;
		this._animateOff = true;
		this._handleIndex = null;
		this._detectOrientation();
		this._mouseInit();

		this.element
			.addClass( "ui-slider" +
				" ui-slider-" + this.orientation +
				" ui-widget" +
				" ui-widget-content" +
				" ui-corner-all" +
				( o.disabled ? " ui-slider-disabled ui-disabled" : "" ) );

		this.range = $([]);

		if ( o.range ) {
			if ( o.range === true ) {
				if ( !o.values ) {
					o.values = [ this._valueMin(), this._valueMin() ];
				}
				if ( o.values.length && o.values.length !== 2 ) {
					o.values = [ o.values[0], o.values[0] ];
				}
			}

			this.range = $( "<div></div>" )
				.appendTo( this.element )
				.addClass( "ui-slider-range" +
				// note: this isn't the most fittingly semantic framework class for this element,
				// but worked best visually with a variety of themes
				" ui-widget-header" +
				( ( o.range === "min" || o.range === "max" ) ? " ui-slider-range-" + o.range : "" ) );
		}

		handleCount = ( o.values && o.values.length ) || 1;

		for ( i = existingHandles.length; i < handleCount; i++ ) {
			handles.push( handle );
		}

		this.handles = existingHandles.add( $( handles.join( "" ) ).appendTo( this.element ) );

		this.handle = this.handles.eq( 0 );

		this.handles.add( this.range ).filter( "a" )
			.click(function( event ) {
				event.preventDefault();
			})
			.mouseenter(function() {
				if ( !o.disabled ) {
					$( this ).addClass( "ui-state-hover" );
				}
			})
			.mouseleave(function() {
				$( this ).removeClass( "ui-state-hover" );
			})
			.focus(function() {
				if ( !o.disabled ) {
					$( ".ui-slider .ui-state-focus" ).removeClass( "ui-state-focus" );
					$( this ).addClass( "ui-state-focus" );
				} else {
					$( this ).blur();
				}
			})
			.blur(function() {
				$( this ).removeClass( "ui-state-focus" );
			});

		this.handles.each(function( i ) {
			$( this ).data( "ui-slider-handle-index", i );
		});

		this._on( this.handles, {
			keydown: function( event ) {
				var allowed, curVal, newVal, step,
					index = $( event.target ).data( "ui-slider-handle-index" );

				switch ( event.keyCode ) {
					case $.ui.keyCode.HOME:
					case $.ui.keyCode.END:
					case $.ui.keyCode.PAGE_UP:
					case $.ui.keyCode.PAGE_DOWN:
					case $.ui.keyCode.UP:
					case $.ui.keyCode.RIGHT:
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.LEFT:
						event.preventDefault();
						if ( !this._keySliding ) {
							this._keySliding = true;
							$( event.target ).addClass( "ui-state-active" );
							allowed = this._start( event, index );
							if ( allowed === false ) {
								return;
							}
						}
						break;
				}

				step = this.options.step;
				if ( this.options.values && this.options.values.length ) {
					curVal = newVal = this.values( index );
				} else {
					curVal = newVal = this.value();
				}

				switch ( event.keyCode ) {
					case $.ui.keyCode.HOME:
						newVal = this._valueMin();
						break;
					case $.ui.keyCode.END:
						newVal = this._valueMax();
						break;
					case $.ui.keyCode.PAGE_UP:
						newVal = this._trimAlignValue( curVal + ( (this._valueMax() - this._valueMin()) / numPages ) );
						break;
					case $.ui.keyCode.PAGE_DOWN:
						newVal = this._trimAlignValue( curVal - ( (this._valueMax() - this._valueMin()) / numPages ) );
						break;
					case $.ui.keyCode.UP:
					case $.ui.keyCode.RIGHT:
						if ( curVal === this._valueMax() ) {
							return;
						}
						newVal = this._trimAlignValue( curVal + step );
						break;
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.LEFT:
						if ( curVal === this._valueMin() ) {
							return;
						}
						newVal = this._trimAlignValue( curVal - step );
						break;
				}

				this._slide( event, index, newVal );
			},
			keyup: function( event ) {
				var index = $( event.target ).data( "ui-slider-handle-index" );

				if ( this._keySliding ) {
					this._keySliding = false;
					this._stop( event, index );
					this._change( event, index );
					$( event.target ).removeClass( "ui-state-active" );
				}
			}
		});

		this._refreshValue();

		this._animateOff = false;
	},

	_destroy: function() {
		this.handles.remove();
		this.range.remove();

		this.element
			.removeClass( "ui-slider" +
				" ui-slider-horizontal" +
				" ui-slider-vertical" +
				" ui-slider-disabled" +
				" ui-widget" +
				" ui-widget-content" +
				" ui-corner-all" );

		this._mouseDestroy();
	},

	_mouseCapture: function( event ) {
		var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
			that = this,
			o = this.options;

		if ( o.disabled ) {
			return false;
		}

		this.elementSize = {
			width: this.element.outerWidth(),
			height: this.element.outerHeight()
		};
		this.elementOffset = this.element.offset();

		position = { x: event.pageX, y: event.pageY };
		normValue = this._normValueFromMouse( position );
		distance = this._valueMax() - this._valueMin() + 1;
		this.handles.each(function( i ) {
			var thisDistance = Math.abs( normValue - that.values(i) );
			if ( distance > thisDistance ) {
				distance = thisDistance;
				closestHandle = $( this );
				index = i;
			}
		});

		// workaround for bug #3736 (if both handles of a range are at 0,
		// the first is always used as the one with least distance,
		// and moving it is obviously prevented by preventing negative ranges)
		if( o.range === true && this.values(1) === o.min ) {
			index += 1;
			closestHandle = $( this.handles[index] );
		}

		allowed = this._start( event, index );
		if ( allowed === false ) {
			return false;
		}
		this._mouseSliding = true;

		this._handleIndex = index;

		closestHandle
			.addClass( "ui-state-active" )
			.focus();

		offset = closestHandle.offset();
		mouseOverHandle = !$( event.target ).parents().andSelf().is( ".ui-slider-handle" );
		this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
			left: event.pageX - offset.left - ( closestHandle.width() / 2 ),
			top: event.pageY - offset.top -
				( closestHandle.height() / 2 ) -
				( parseInt( closestHandle.css("borderTopWidth"), 10 ) || 0 ) -
				( parseInt( closestHandle.css("borderBottomWidth"), 10 ) || 0) +
				( parseInt( closestHandle.css("marginTop"), 10 ) || 0)
		};

		if ( !this.handles.hasClass( "ui-state-hover" ) ) {
			this._slide( event, index, normValue );
		}
		this._animateOff = true;
		return true;
	},

	_mouseStart: function() {
		return true;
	},

	_mouseDrag: function( event ) {
		var position = { x: event.pageX, y: event.pageY },
			normValue = this._normValueFromMouse( position );

		this._slide( event, this._handleIndex, normValue );

		return false;
	},

	_mouseStop: function( event ) {
		this.handles.removeClass( "ui-state-active" );
		this._mouseSliding = false;

		this._stop( event, this._handleIndex );
		this._change( event, this._handleIndex );

		this._handleIndex = null;
		this._clickOffset = null;
		this._animateOff = false;

		return false;
	},

	_detectOrientation: function() {
		this.orientation = ( this.options.orientation === "vertical" ) ? "vertical" : "horizontal";
	},

	_normValueFromMouse: function( position ) {
		var pixelTotal,
			pixelMouse,
			percentMouse,
			valueTotal,
			valueMouse;

		if ( this.orientation === "horizontal" ) {
			pixelTotal = this.elementSize.width;
			pixelMouse = position.x - this.elementOffset.left - ( this._clickOffset ? this._clickOffset.left : 0 );
		} else {
			pixelTotal = this.elementSize.height;
			pixelMouse = position.y - this.elementOffset.top - ( this._clickOffset ? this._clickOffset.top : 0 );
		}

		percentMouse = ( pixelMouse / pixelTotal );
		if ( percentMouse > 1 ) {
			percentMouse = 1;
		}
		if ( percentMouse < 0 ) {
			percentMouse = 0;
		}
		if ( this.orientation === "vertical" ) {
			percentMouse = 1 - percentMouse;
		}

		valueTotal = this._valueMax() - this._valueMin();
		valueMouse = this._valueMin() + percentMouse * valueTotal;

		return this._trimAlignValue( valueMouse );
	},

	_start: function( event, index ) {
		var uiHash = {
			handle: this.handles[ index ],
			value: this.value()
		};
		if ( this.options.values && this.options.values.length ) {
			uiHash.value = this.values( index );
			uiHash.values = this.values();
		}
		return this._trigger( "start", event, uiHash );
	},

	_slide: function( event, index, newVal ) {
		var otherVal,
			newValues,
			allowed;

		if ( this.options.values && this.options.values.length ) {
			otherVal = this.values( index ? 0 : 1 );

			if ( ( this.options.values.length === 2 && this.options.range === true ) &&
					( ( index === 0 && newVal > otherVal) || ( index === 1 && newVal < otherVal ) )
				) {
				newVal = otherVal;
			}

			if ( newVal !== this.values( index ) ) {
				newValues = this.values();
				newValues[ index ] = newVal;
				// A slide can be canceled by returning false from the slide callback
				allowed = this._trigger( "slide", event, {
					handle: this.handles[ index ],
					value: newVal,
					values: newValues
				} );
				otherVal = this.values( index ? 0 : 1 );
				if ( allowed !== false ) {
					this.values( index, newVal, true );
				}
			}
		} else {
			if ( newVal !== this.value() ) {
				// A slide can be canceled by returning false from the slide callback
				allowed = this._trigger( "slide", event, {
					handle: this.handles[ index ],
					value: newVal
				} );
				if ( allowed !== false ) {
					this.value( newVal );
				}
			}
		}
	},

	_stop: function( event, index ) {
		var uiHash = {
			handle: this.handles[ index ],
			value: this.value()
		};
		if ( this.options.values && this.options.values.length ) {
			uiHash.value = this.values( index );
			uiHash.values = this.values();
		}

		this._trigger( "stop", event, uiHash );
	},

	_change: function( event, index ) {
		if ( !this._keySliding && !this._mouseSliding ) {
			var uiHash = {
				handle: this.handles[ index ],
				value: this.value()
			};
			if ( this.options.values && this.options.values.length ) {
				uiHash.value = this.values( index );
				uiHash.values = this.values();
			}

			this._trigger( "change", event, uiHash );
		}
	},

	value: function( newValue ) {
		if ( arguments.length ) {
			this.options.value = this._trimAlignValue( newValue );
			this._refreshValue();
			this._change( null, 0 );
			return;
		}

		return this._value();
	},

	values: function( index, newValue ) {
		var vals,
			newValues,
			i;

		if ( arguments.length > 1 ) {
			this.options.values[ index ] = this._trimAlignValue( newValue );
			this._refreshValue();
			this._change( null, index );
			return;
		}

		if ( arguments.length ) {
			if ( $.isArray( arguments[ 0 ] ) ) {
				vals = this.options.values;
				newValues = arguments[ 0 ];
				for ( i = 0; i < vals.length; i += 1 ) {
					vals[ i ] = this._trimAlignValue( newValues[ i ] );
					this._change( null, i );
				}
				this._refreshValue();
			} else {
				if ( this.options.values && this.options.values.length ) {
					return this._values( index );
				} else {
					return this.value();
				}
			}
		} else {
			return this._values();
		}
	},

	_setOption: function( key, value ) {
		var i,
			valsLength = 0;

		if ( $.isArray( this.options.values ) ) {
			valsLength = this.options.values.length;
		}

		$.Widget.prototype._setOption.apply( this, arguments );

		switch ( key ) {
			case "disabled":
				if ( value ) {
					this.handles.filter( ".ui-state-focus" ).blur();
					this.handles.removeClass( "ui-state-hover" );
					this.handles.prop( "disabled", true );
					this.element.addClass( "ui-disabled" );
				} else {
					this.handles.prop( "disabled", false );
					this.element.removeClass( "ui-disabled" );
				}
				break;
			case "orientation":
				this._detectOrientation();
				this.element
					.removeClass( "ui-slider-horizontal ui-slider-vertical" )
					.addClass( "ui-slider-" + this.orientation );
				this._refreshValue();
				break;
			case "value":
				this._animateOff = true;
				this._refreshValue();
				this._change( null, 0 );
				this._animateOff = false;
				break;
			case "values":
				this._animateOff = true;
				this._refreshValue();
				for ( i = 0; i < valsLength; i += 1 ) {
					this._change( null, i );
				}
				this._animateOff = false;
				break;
			case "min":
			case "max":
				this._animateOff = true;
				this._refreshValue();
				this._animateOff = false;
				break;
		}
	},

	//internal value getter
	// _value() returns value trimmed by min and max, aligned by step
	_value: function() {
		var val = this.options.value;
		val = this._trimAlignValue( val );

		return val;
	},

	//internal values getter
	// _values() returns array of values trimmed by min and max, aligned by step
	// _values( index ) returns single value trimmed by min and max, aligned by step
	_values: function( index ) {
		var val,
			vals,
			i;

		if ( arguments.length ) {
			val = this.options.values[ index ];
			val = this._trimAlignValue( val );

			return val;
		} else {
			// .slice() creates a copy of the array
			// this copy gets trimmed by min and max and then returned
			vals = this.options.values.slice();
			for ( i = 0; i < vals.length; i+= 1) {
				vals[ i ] = this._trimAlignValue( vals[ i ] );
			}

			return vals;
		}
	},

	// returns the step-aligned value that val is closest to, between (inclusive) min and max
	_trimAlignValue: function( val ) {
		if ( val <= this._valueMin() ) {
			return this._valueMin();
		}
		if ( val >= this._valueMax() ) {
			return this._valueMax();
		}
		var step = ( this.options.step > 0 ) ? this.options.step : 1,
			valModStep = (val - this._valueMin()) % step,
			alignValue = val - valModStep;

		if ( Math.abs(valModStep) * 2 >= step ) {
			alignValue += ( valModStep > 0 ) ? step : ( -step );
		}

		// Since JavaScript has problems with large floats, round
		// the final value to 5 digits after the decimal point (see #4124)
		return parseFloat( alignValue.toFixed(5) );
	},

	_valueMin: function() {
		return this.options.min;
	},

	_valueMax: function() {
		return this.options.max;
	},

	_refreshValue: function() {
		var lastValPercent, valPercent, value, valueMin, valueMax,
			oRange = this.options.range,
			o = this.options,
			that = this,
			animate = ( !this._animateOff ) ? o.animate : false,
			_set = {};

		if ( this.options.values && this.options.values.length ) {
			this.handles.each(function( i ) {
				valPercent = ( that.values(i) - that._valueMin() ) / ( that._valueMax() - that._valueMin() ) * 100;
				_set[ that.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
				$( this ).stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
				if ( that.options.range === true ) {
					if ( that.orientation === "horizontal" ) {
						if ( i === 0 ) {
							that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { left: valPercent + "%" }, o.animate );
						}
						if ( i === 1 ) {
							that.range[ animate ? "animate" : "css" ]( { width: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
						}
					} else {
						if ( i === 0 ) {
							that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { bottom: ( valPercent ) + "%" }, o.animate );
						}
						if ( i === 1 ) {
							that.range[ animate ? "animate" : "css" ]( { height: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
						}
					}
				}
				lastValPercent = valPercent;
			});
		} else {
			value = this.value();
			valueMin = this._valueMin();
			valueMax = this._valueMax();
			valPercent = ( valueMax !== valueMin ) ?
					( value - valueMin ) / ( valueMax - valueMin ) * 100 :
					0;
			_set[ this.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
			this.handle.stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );

			if ( oRange === "min" && this.orientation === "horizontal" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { width: valPercent + "%" }, o.animate );
			}
			if ( oRange === "max" && this.orientation === "horizontal" ) {
				this.range[ animate ? "animate" : "css" ]( { width: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
			}
			if ( oRange === "min" && this.orientation === "vertical" ) {
				this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { height: valPercent + "%" }, o.animate );
			}
			if ( oRange === "max" && this.orientation === "vertical" ) {
				this.range[ animate ? "animate" : "css" ]( { height: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
			}
		}
	}

});

}(jQuery));
(function( $ ) {

function modifier( fn ) {
	return function() {
		var previous = this.element.val();
		fn.apply( this, arguments );
		this._refresh();
		if ( previous !== this.element.val() ) {
			this._trigger( "change" );
		}
	};
}

$.widget( "ui.spinner", {
	version: "1.9.2",
	defaultElement: "<input>",
	widgetEventPrefix: "spin",
	options: {
		culture: null,
		icons: {
			down: "ui-icon-triangle-1-s",
			up: "ui-icon-triangle-1-n"
		},
		incremental: true,
		max: null,
		min: null,
		numberFormat: null,
		page: 10,
		step: 1,

		change: null,
		spin: null,
		start: null,
		stop: null
	},

	_create: function() {
		// handle string values that need to be parsed
		this._setOption( "max", this.options.max );
		this._setOption( "min", this.options.min );
		this._setOption( "step", this.options.step );

		// format the value, but don't constrain
		this._value( this.element.val(), true );

		this._draw();
		this._on( this._events );
		this._refresh();

		// turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeAttr( "autocomplete" );
			}
		});
	},

	_getCreateOptions: function() {
		var options = {},
			element = this.element;

		$.each( [ "min", "max", "step" ], function( i, option ) {
			var value = element.attr( option );
			if ( value !== undefined && value.length ) {
				options[ option ] = value;
			}
		});

		return options;
	},

	_events: {
		keydown: function( event ) {
			if ( this._start( event ) && this._keydown( event ) ) {
				event.preventDefault();
			}
		},
		keyup: "_stop",
		focus: function() {
			this.previous = this.element.val();
		},
		blur: function( event ) {
			if ( this.cancelBlur ) {
				delete this.cancelBlur;
				return;
			}

			this._refresh();
			if ( this.previous !== this.element.val() ) {
				this._trigger( "change", event );
			}
		},
		mousewheel: function( event, delta ) {
			if ( !delta ) {
				return;
			}
			if ( !this.spinning && !this._start( event ) ) {
				return false;
			}

			this._spin( (delta > 0 ? 1 : -1) * this.options.step, event );
			clearTimeout( this.mousewheelTimer );
			this.mousewheelTimer = this._delay(function() {
				if ( this.spinning ) {
					this._stop( event );
				}
			}, 100 );
			event.preventDefault();
		},
		"mousedown .ui-spinner-button": function( event ) {
			var previous;

			// We never want the buttons to have focus; whenever the user is
			// interacting with the spinner, the focus should be on the input.
			// If the input is focused then this.previous is properly set from
			// when the input first received focus. If the input is not focused
			// then we need to set this.previous based on the value before spinning.
			previous = this.element[0] === this.document[0].activeElement ?
				this.previous : this.element.val();
			function checkFocus() {
				var isActive = this.element[0] === this.document[0].activeElement;
				if ( !isActive ) {
					this.element.focus();
					this.previous = previous;
					// support: IE
					// IE sets focus asynchronously, so we need to check if focus
					// moved off of the input because the user clicked on the button.
					this._delay(function() {
						this.previous = previous;
					});
				}
			}

			// ensure focus is on (or stays on) the text field
			event.preventDefault();
			checkFocus.call( this );

			// support: IE
			// IE doesn't prevent moving focus even with event.preventDefault()
			// so we set a flag to know when we should ignore the blur event
			// and check (again) if focus moved off of the input.
			this.cancelBlur = true;
			this._delay(function() {
				delete this.cancelBlur;
				checkFocus.call( this );
			});

			if ( this._start( event ) === false ) {
				return;
			}

			this._repeat( null, $( event.currentTarget ).hasClass( "ui-spinner-up" ) ? 1 : -1, event );
		},
		"mouseup .ui-spinner-button": "_stop",
		"mouseenter .ui-spinner-button": function( event ) {
			// button will add ui-state-active if mouse was down while mouseleave and kept down
			if ( !$( event.currentTarget ).hasClass( "ui-state-active" ) ) {
				return;
			}

			if ( this._start( event ) === false ) {
				return false;
			}
			this._repeat( null, $( event.currentTarget ).hasClass( "ui-spinner-up" ) ? 1 : -1, event );
		},
		// TODO: do we really want to consider this a stop?
		// shouldn't we just stop the repeater and wait until mouseup before
		// we trigger the stop event?
		"mouseleave .ui-spinner-button": "_stop"
	},

	_draw: function() {
		var uiSpinner = this.uiSpinner = this.element
			.addClass( "ui-spinner-input" )
			.attr( "autocomplete", "off" )
			.wrap( this._uiSpinnerHtml() )
			.parent()
				// add buttons
				.append( this._buttonHtml() );

		this.element.attr( "role", "spinbutton" );

		// button bindings
		this.buttons = uiSpinner.find( ".ui-spinner-button" )
			.attr( "tabIndex", -1 )
			.button()
			.removeClass( "ui-corner-all" );

		// IE 6 doesn't understand height: 50% for the buttons
		// unless the wrapper has an explicit height
		if ( this.buttons.height() > Math.ceil( uiSpinner.height() * 0.5 ) &&
				uiSpinner.height() > 0 ) {
			uiSpinner.height( uiSpinner.height() );
		}

		// disable spinner if element was already disabled
		if ( this.options.disabled ) {
			this.disable();
		}
	},

	_keydown: function( event ) {
		var options = this.options,
			keyCode = $.ui.keyCode;

		switch ( event.keyCode ) {
		case keyCode.UP:
			this._repeat( null, 1, event );
			return true;
		case keyCode.DOWN:
			this._repeat( null, -1, event );
			return true;
		case keyCode.PAGE_UP:
			this._repeat( null, options.page, event );
			return true;
		case keyCode.PAGE_DOWN:
			this._repeat( null, -options.page, event );
			return true;
		}

		return false;
	},

	_uiSpinnerHtml: function() {
		return "<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>";
	},

	_buttonHtml: function() {
		return "" +
			"<a class='ui-spinner-button ui-spinner-up ui-corner-tr'>" +
				"<span class='ui-icon " + this.options.icons.up + "'>&#9650;</span>" +
			"</a>" +
			"<a class='ui-spinner-button ui-spinner-down ui-corner-br'>" +
				"<span class='ui-icon " + this.options.icons.down + "'>&#9660;</span>" +
			"</a>";
	},

	_start: function( event ) {
		if ( !this.spinning && this._trigger( "start", event ) === false ) {
			return false;
		}

		if ( !this.counter ) {
			this.counter = 1;
		}
		this.spinning = true;
		return true;
	},

	_repeat: function( i, steps, event ) {
		i = i || 500;

		clearTimeout( this.timer );
		this.timer = this._delay(function() {
			this._repeat( 40, steps, event );
		}, i );

		this._spin( steps * this.options.step, event );
	},

	_spin: function( step, event ) {
		var value = this.value() || 0;

		if ( !this.counter ) {
			this.counter = 1;
		}

		value = this._adjustValue( value + step * this._increment( this.counter ) );

		if ( !this.spinning || this._trigger( "spin", event, { value: value } ) !== false) {
			this._value( value );
			this.counter++;
		}
	},

	_increment: function( i ) {
		var incremental = this.options.incremental;

		if ( incremental ) {
			return $.isFunction( incremental ) ?
				incremental( i ) :
				Math.floor( i*i*i/50000 - i*i/500 + 17*i/200 + 1 );
		}

		return 1;
	},

	_precision: function() {
		var precision = this._precisionOf( this.options.step );
		if ( this.options.min !== null ) {
			precision = Math.max( precision, this._precisionOf( this.options.min ) );
		}
		return precision;
	},

	_precisionOf: function( num ) {
		var str = num.toString(),
			decimal = str.indexOf( "." );
		return decimal === -1 ? 0 : str.length - decimal - 1;
	},

	_adjustValue: function( value ) {
		var base, aboveMin,
			options = this.options;

		// make sure we're at a valid step
		// - find out where we are relative to the base (min or 0)
		base = options.min !== null ? options.min : 0;
		aboveMin = value - base;
		// - round to the nearest step
		aboveMin = Math.round(aboveMin / options.step) * options.step;
		// - rounding is based on 0, so adjust back to our base
		value = base + aboveMin;

		// fix precision from bad JS floating point math
		value = parseFloat( value.toFixed( this._precision() ) );

		// clamp the value
		if ( options.max !== null && value > options.max) {
			return options.max;
		}
		if ( options.min !== null && value < options.min ) {
			return options.min;
		}

		return value;
	},

	_stop: function( event ) {
		if ( !this.spinning ) {
			return;
		}

		clearTimeout( this.timer );
		clearTimeout( this.mousewheelTimer );
		this.counter = 0;
		this.spinning = false;
		this._trigger( "stop", event );
	},

	_setOption: function( key, value ) {
		if ( key === "culture" || key === "numberFormat" ) {
			var prevValue = this._parse( this.element.val() );
			this.options[ key ] = value;
			this.element.val( this._format( prevValue ) );
			return;
		}

		if ( key === "max" || key === "min" || key === "step" ) {
			if ( typeof value === "string" ) {
				value = this._parse( value );
			}
		}

		this._super( key, value );

		if ( key === "disabled" ) {
			if ( value ) {
				this.element.prop( "disabled", true );
				this.buttons.button( "disable" );
			} else {
				this.element.prop( "disabled", false );
				this.buttons.button( "enable" );
			}
		}
	},

	_setOptions: modifier(function( options ) {
		this._super( options );
		this._value( this.element.val() );
	}),

	_parse: function( val ) {
		if ( typeof val === "string" && val !== "" ) {
			val = window.Globalize && this.options.numberFormat ?
				Globalize.parseFloat( val, 10, this.options.culture ) : +val;
		}
		return val === "" || isNaN( val ) ? null : val;
	},

	_format: function( value ) {
		if ( value === "" ) {
			return "";
		}
		return window.Globalize && this.options.numberFormat ?
			Globalize.format( value, this.options.numberFormat, this.options.culture ) :
			value;
	},

	_refresh: function() {
		this.element.attr({
			"aria-valuemin": this.options.min,
			"aria-valuemax": this.options.max,
			// TODO: what should we do with values that can't be parsed?
			"aria-valuenow": this._parse( this.element.val() )
		});
	},

	// update the value without triggering change
	_value: function( value, allowAny ) {
		var parsed;
		if ( value !== "" ) {
			parsed = this._parse( value );
			if ( parsed !== null ) {
				if ( !allowAny ) {
					parsed = this._adjustValue( parsed );
				}
				value = this._format( parsed );
			}
		}
		this.element.val( value );
		this._refresh();
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-spinner-input" )
			.prop( "disabled", false )
			.removeAttr( "autocomplete" )
			.removeAttr( "role" )
			.removeAttr( "aria-valuemin" )
			.removeAttr( "aria-valuemax" )
			.removeAttr( "aria-valuenow" );
		this.uiSpinner.replaceWith( this.element );
	},

	stepUp: modifier(function( steps ) {
		this._stepUp( steps );
	}),
	_stepUp: function( steps ) {
		this._spin( (steps || 1) * this.options.step );
	},

	stepDown: modifier(function( steps ) {
		this._stepDown( steps );
	}),
	_stepDown: function( steps ) {
		this._spin( (steps || 1) * -this.options.step );
	},

	pageUp: modifier(function( pages ) {
		this._stepUp( (pages || 1) * this.options.page );
	}),

	pageDown: modifier(function( pages ) {
		this._stepDown( (pages || 1) * this.options.page );
	}),

	value: function( newVal ) {
		if ( !arguments.length ) {
			return this._parse( this.element.val() );
		}
		modifier( this._value ).call( this, newVal );
	},

	widget: function() {
		return this.uiSpinner;
	}
});

}( jQuery ) );
(function( $, undefined ) {

var tabId = 0,
	rhash = /#.*$/;

function getNextTabId() {
	return ++tabId;
}

function isLocal( anchor ) {
	return anchor.hash.length > 1 &&
		anchor.href.replace( rhash, "" ) ===
			location.href.replace( rhash, "" )
				// support: Safari 5.1
				// Safari 5.1 doesn't encode spaces in window.location
				// but it does encode spaces from anchors (#8777)
				.replace( /\s/g, "%20" );
}

$.widget( "ui.tabs", {
	version: "1.9.2",
	delay: 300,
	options: {
		active: null,
		collapsible: false,
		event: "click",
		heightStyle: "content",
		hide: null,
		show: null,

		// callbacks
		activate: null,
		beforeActivate: null,
		beforeLoad: null,
		load: null
	},

	_create: function() {
		var that = this,
			options = this.options,
			active = options.active,
			locationHash = location.hash.substring( 1 );

		this.running = false;

		this.element
			.addClass( "ui-tabs ui-widget ui-widget-content ui-corner-all" )
			.toggleClass( "ui-tabs-collapsible", options.collapsible )
			// Prevent users from focusing disabled tabs via click
			.delegate( ".ui-tabs-nav > li", "mousedown" + this.eventNamespace, function( event ) {
				if ( $( this ).is( ".ui-state-disabled" ) ) {
					event.preventDefault();
				}
			})
			// support: IE <9
			// Preventing the default action in mousedown doesn't prevent IE
			// from focusing the element, so if the anchor gets focused, blur.
			// We don't have to worry about focusing the previously focused
			// element since clicking on a non-focusable element should focus
			// the body anyway.
			.delegate( ".ui-tabs-anchor", "focus" + this.eventNamespace, function() {
				if ( $( this ).closest( "li" ).is( ".ui-state-disabled" ) ) {
					this.blur();
				}
			});

		this._processTabs();

		if ( active === null ) {
			// check the fragment identifier in the URL
			if ( locationHash ) {
				this.tabs.each(function( i, tab ) {
					if ( $( tab ).attr( "aria-controls" ) === locationHash ) {
						active = i;
						return false;
					}
				});
			}

			// check for a tab marked active via a class
			if ( active === null ) {
				active = this.tabs.index( this.tabs.filter( ".ui-tabs-active" ) );
			}

			// no active tab, set to false
			if ( active === null || active === -1 ) {
				active = this.tabs.length ? 0 : false;
			}
		}

		// handle numbers: negative, out of range
		if ( active !== false ) {
			active = this.tabs.index( this.tabs.eq( active ) );
			if ( active === -1 ) {
				active = options.collapsible ? false : 0;
			}
		}
		options.active = active;

		// don't allow collapsible: false and active: false
		if ( !options.collapsible && options.active === false && this.anchors.length ) {
			options.active = 0;
		}

		// Take disabling tabs via class attribute from HTML
		// into account and update option properly.
		if ( $.isArray( options.disabled ) ) {
			options.disabled = $.unique( options.disabled.concat(
				$.map( this.tabs.filter( ".ui-state-disabled" ), function( li ) {
					return that.tabs.index( li );
				})
			) ).sort();
		}

		// check for length avoids error when initializing empty list
		if ( this.options.active !== false && this.anchors.length ) {
			this.active = this._findActive( this.options.active );
		} else {
			this.active = $();
		}

		this._refresh();

		if ( this.active.length ) {
			this.load( options.active );
		}
	},

	_getCreateEventData: function() {
		return {
			tab: this.active,
			panel: !this.active.length ? $() : this._getPanelForTab( this.active )
		};
	},

	_tabKeydown: function( event ) {
		var focusedTab = $( this.document[0].activeElement ).closest( "li" ),
			selectedIndex = this.tabs.index( focusedTab ),
			goingForward = true;

		if ( this._handlePageNav( event ) ) {
			return;
		}

		switch ( event.keyCode ) {
			case $.ui.keyCode.RIGHT:
			case $.ui.keyCode.DOWN:
				selectedIndex++;
				break;
			case $.ui.keyCode.UP:
			case $.ui.keyCode.LEFT:
				goingForward = false;
				selectedIndex--;
				break;
			case $.ui.keyCode.END:
				selectedIndex = this.anchors.length - 1;
				break;
			case $.ui.keyCode.HOME:
				selectedIndex = 0;
				break;
			case $.ui.keyCode.SPACE:
				// Activate only, no collapsing
				event.preventDefault();
				clearTimeout( this.activating );
				this._activate( selectedIndex );
				return;
			case $.ui.keyCode.ENTER:
				// Toggle (cancel delayed activation, allow collapsing)
				event.preventDefault();
				clearTimeout( this.activating );
				// Determine if we should collapse or activate
				this._activate( selectedIndex === this.options.active ? false : selectedIndex );
				return;
			default:
				return;
		}

		// Focus the appropriate tab, based on which key was pressed
		event.preventDefault();
		clearTimeout( this.activating );
		selectedIndex = this._focusNextTab( selectedIndex, goingForward );

		// Navigating with control key will prevent automatic activation
		if ( !event.ctrlKey ) {
			// Update aria-selected immediately so that AT think the tab is already selected.
			// Otherwise AT may confuse the user by stating that they need to activate the tab,
			// but the tab will already be activated by the time the announcement finishes.
			focusedTab.attr( "aria-selected", "false" );
			this.tabs.eq( selectedIndex ).attr( "aria-selected", "true" );

			this.activating = this._delay(function() {
				this.option( "active", selectedIndex );
			}, this.delay );
		}
	},

	_panelKeydown: function( event ) {
		if ( this._handlePageNav( event ) ) {
			return;
		}

		// Ctrl+up moves focus to the current tab
		if ( event.ctrlKey && event.keyCode === $.ui.keyCode.UP ) {
			event.preventDefault();
			this.active.focus();
		}
	},

	// Alt+page up/down moves focus to the previous/next tab (and activates)
	_handlePageNav: function( event ) {
		if ( event.altKey && event.keyCode === $.ui.keyCode.PAGE_UP ) {
			this._activate( this._focusNextTab( this.options.active - 1, false ) );
			return true;
		}
		if ( event.altKey && event.keyCode === $.ui.keyCode.PAGE_DOWN ) {
			this._activate( this._focusNextTab( this.options.active + 1, true ) );
			return true;
		}
	},

	_findNextTab: function( index, goingForward ) {
		var lastTabIndex = this.tabs.length - 1;

		function constrain() {
			if ( index > lastTabIndex ) {
				index = 0;
			}
			if ( index < 0 ) {
				index = lastTabIndex;
			}
			return index;
		}

		while ( $.inArray( constrain(), this.options.disabled ) !== -1 ) {
			index = goingForward ? index + 1 : index - 1;
		}

		return index;
	},

	_focusNextTab: function( index, goingForward ) {
		index = this._findNextTab( index, goingForward );
		this.tabs.eq( index ).focus();
		return index;
	},

	_setOption: function( key, value ) {
		if ( key === "active" ) {
			// _activate() will handle invalid values and update this.options
			this._activate( value );
			return;
		}

		if ( key === "disabled" ) {
			// don't use the widget factory's disabled handling
			this._setupDisabled( value );
			return;
		}

		this._super( key, value);

		if ( key === "collapsible" ) {
			this.element.toggleClass( "ui-tabs-collapsible", value );
			// Setting collapsible: false while collapsed; open first panel
			if ( !value && this.options.active === false ) {
				this._activate( 0 );
			}
		}

		if ( key === "event" ) {
			this._setupEvents( value );
		}

		if ( key === "heightStyle" ) {
			this._setupHeightStyle( value );
		}
	},

	_tabId: function( tab ) {
		return tab.attr( "aria-controls" ) || "ui-tabs-" + getNextTabId();
	},

	_sanitizeSelector: function( hash ) {
		return hash ? hash.replace( /[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&" ) : "";
	},

	refresh: function() {
		var options = this.options,
			lis = this.tablist.children( ":has(a[href])" );

		// get disabled tabs from class attribute from HTML
		// this will get converted to a boolean if needed in _refresh()
		options.disabled = $.map( lis.filter( ".ui-state-disabled" ), function( tab ) {
			return lis.index( tab );
		});

		this._processTabs();

		// was collapsed or no tabs
		if ( options.active === false || !this.anchors.length ) {
			options.active = false;
			this.active = $();
		// was active, but active tab is gone
		} else if ( this.active.length && !$.contains( this.tablist[ 0 ], this.active[ 0 ] ) ) {
			// all remaining tabs are disabled
			if ( this.tabs.length === options.disabled.length ) {
				options.active = false;
				this.active = $();
			// activate previous tab
			} else {
				this._activate( this._findNextTab( Math.max( 0, options.active - 1 ), false ) );
			}
		// was active, active tab still exists
		} else {
			// make sure active index is correct
			options.active = this.tabs.index( this.active );
		}

		this._refresh();
	},

	_refresh: function() {
		this._setupDisabled( this.options.disabled );
		this._setupEvents( this.options.event );
		this._setupHeightStyle( this.options.heightStyle );

		this.tabs.not( this.active ).attr({
			"aria-selected": "false",
			tabIndex: -1
		});
		this.panels.not( this._getPanelForTab( this.active ) )
			.hide()
			.attr({
				"aria-expanded": "false",
				"aria-hidden": "true"
			});

		// Make sure one tab is in the tab order
		if ( !this.active.length ) {
			this.tabs.eq( 0 ).attr( "tabIndex", 0 );
		} else {
			this.active
				.addClass( "ui-tabs-active ui-state-active" )
				.attr({
					"aria-selected": "true",
					tabIndex: 0
				});
			this._getPanelForTab( this.active )
				.show()
				.attr({
					"aria-expanded": "true",
					"aria-hidden": "false"
				});
		}
	},

	_processTabs: function() {
		var that = this;

		this.tablist = this._getList()
			.addClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" )
			.attr( "role", "tablist" );

		this.tabs = this.tablist.find( "> li:has(a[href])" )
			.addClass( "ui-state-default ui-corner-top" )
			.attr({
				role: "tab",
				tabIndex: -1
			});

		this.anchors = this.tabs.map(function() {
				return $( "a", this )[ 0 ];
			})
			.addClass( "ui-tabs-anchor" )
			.attr({
				role: "presentation",
				tabIndex: -1
			});

		this.panels = $();

		this.anchors.each(function( i, anchor ) {
			var selector, panel, panelId,
				anchorId = $( anchor ).uniqueId().attr( "id" ),
				tab = $( anchor ).closest( "li" ),
				originalAriaControls = tab.attr( "aria-controls" );

			// inline tab
			if ( isLocal( anchor ) ) {
				selector = anchor.hash;
				panel = that.element.find( that._sanitizeSelector( selector ) );
			// remote tab
			} else {
				panelId = that._tabId( tab );
				selector = "#" + panelId;
				panel = that.element.find( selector );
				if ( !panel.length ) {
					panel = that._createPanel( panelId );
					panel.insertAfter( that.panels[ i - 1 ] || that.tablist );
				}
				panel.attr( "aria-live", "polite" );
			}

			if ( panel.length) {
				that.panels = that.panels.add( panel );
			}
			if ( originalAriaControls ) {
				tab.data( "ui-tabs-aria-controls", originalAriaControls );
			}
			tab.attr({
				"aria-controls": selector.substring( 1 ),
				"aria-labelledby": anchorId
			});
			panel.attr( "aria-labelledby", anchorId );
		});

		this.panels
			.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" )
			.attr( "role", "tabpanel" );
	},

	// allow overriding how to find the list for rare usage scenarios (#7715)
	_getList: function() {
		return this.element.find( "ol,ul" ).eq( 0 );
	},

	_createPanel: function( id ) {
		return $( "<div>" )
			.attr( "id", id )
			.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" )
			.data( "ui-tabs-destroy", true );
	},

	_setupDisabled: function( disabled ) {
		if ( $.isArray( disabled ) ) {
			if ( !disabled.length ) {
				disabled = false;
			} else if ( disabled.length === this.anchors.length ) {
				disabled = true;
			}
		}

		// disable tabs
		for ( var i = 0, li; ( li = this.tabs[ i ] ); i++ ) {
			if ( disabled === true || $.inArray( i, disabled ) !== -1 ) {
				$( li )
					.addClass( "ui-state-disabled" )
					.attr( "aria-disabled", "true" );
			} else {
				$( li )
					.removeClass( "ui-state-disabled" )
					.removeAttr( "aria-disabled" );
			}
		}

		this.options.disabled = disabled;
	},

	_setupEvents: function( event ) {
		var events = {
			click: function( event ) {
				event.preventDefault();
			}
		};
		if ( event ) {
			$.each( event.split(" "), function( index, eventName ) {
				events[ eventName ] = "_eventHandler";
			});
		}

		this._off( this.anchors.add( this.tabs ).add( this.panels ) );
		this._on( this.anchors, events );
		this._on( this.tabs, { keydown: "_tabKeydown" } );
		this._on( this.panels, { keydown: "_panelKeydown" } );

		this._focusable( this.tabs );
		this._hoverable( this.tabs );
	},

	_setupHeightStyle: function( heightStyle ) {
		var maxHeight, overflow,
			parent = this.element.parent();

		if ( heightStyle === "fill" ) {
			// IE 6 treats height like minHeight, so we need to turn off overflow
			// in order to get a reliable height
			// we use the minHeight support test because we assume that only
			// browsers that don't support minHeight will treat height as minHeight
			if ( !$.support.minHeight ) {
				overflow = parent.css( "overflow" );
				parent.css( "overflow", "hidden");
			}
			maxHeight = parent.height();
			this.element.siblings( ":visible" ).each(function() {
				var elem = $( this ),
					position = elem.css( "position" );

				if ( position === "absolute" || position === "fixed" ) {
					return;
				}
				maxHeight -= elem.outerHeight( true );
			});
			if ( overflow ) {
				parent.css( "overflow", overflow );
			}

			this.element.children().not( this.panels ).each(function() {
				maxHeight -= $( this ).outerHeight( true );
			});

			this.panels.each(function() {
				$( this ).height( Math.max( 0, maxHeight -
					$( this ).innerHeight() + $( this ).height() ) );
			})
			.css( "overflow", "auto" );
		} else if ( heightStyle === "auto" ) {
			maxHeight = 0;
			this.panels.each(function() {
				maxHeight = Math.max( maxHeight, $( this ).height( "" ).height() );
			}).height( maxHeight );
		}
	},

	_eventHandler: function( event ) {
		var options = this.options,
			active = this.active,
			anchor = $( event.currentTarget ),
			tab = anchor.closest( "li" ),
			clickedIsActive = tab[ 0 ] === active[ 0 ],
			collapsing = clickedIsActive && options.collapsible,
			toShow = collapsing ? $() : this._getPanelForTab( tab ),
			toHide = !active.length ? $() : this._getPanelForTab( active ),
			eventData = {
				oldTab: active,
				oldPanel: toHide,
				newTab: collapsing ? $() : tab,
				newPanel: toShow
			};

		event.preventDefault();

		if ( tab.hasClass( "ui-state-disabled" ) ||
				// tab is already loading
				tab.hasClass( "ui-tabs-loading" ) ||
				// can't switch durning an animation
				this.running ||
				// click on active header, but not collapsible
				( clickedIsActive && !options.collapsible ) ||
				// allow canceling activation
				( this._trigger( "beforeActivate", event, eventData ) === false ) ) {
			return;
		}

		options.active = collapsing ? false : this.tabs.index( tab );

		this.active = clickedIsActive ? $() : tab;
		if ( this.xhr ) {
			this.xhr.abort();
		}

		if ( !toHide.length && !toShow.length ) {
			$.error( "jQuery UI Tabs: Mismatching fragment identifier." );
		}

		if ( toShow.length ) {
			this.load( this.tabs.index( tab ), event );
		}
		this._toggle( event, eventData );
	},

	// handles show/hide for selecting tabs
	_toggle: function( event, eventData ) {
		var that = this,
			toShow = eventData.newPanel,
			toHide = eventData.oldPanel;

		this.running = true;

		function complete() {
			that.running = false;
			that._trigger( "activate", event, eventData );
		}

		function show() {
			eventData.newTab.closest( "li" ).addClass( "ui-tabs-active ui-state-active" );

			if ( toShow.length && that.options.show ) {
				that._show( toShow, that.options.show, complete );
			} else {
				toShow.show();
				complete();
			}
		}

		// start out by hiding, then showing, then completing
		if ( toHide.length && this.options.hide ) {
			this._hide( toHide, this.options.hide, function() {
				eventData.oldTab.closest( "li" ).removeClass( "ui-tabs-active ui-state-active" );
				show();
			});
		} else {
			eventData.oldTab.closest( "li" ).removeClass( "ui-tabs-active ui-state-active" );
			toHide.hide();
			show();
		}

		toHide.attr({
			"aria-expanded": "false",
			"aria-hidden": "true"
		});
		eventData.oldTab.attr( "aria-selected", "false" );
		// If we're switching tabs, remove the old tab from the tab order.
		// If we're opening from collapsed state, remove the previous tab from the tab order.
		// If we're collapsing, then keep the collapsing tab in the tab order.
		if ( toShow.length && toHide.length ) {
			eventData.oldTab.attr( "tabIndex", -1 );
		} else if ( toShow.length ) {
			this.tabs.filter(function() {
				return $( this ).attr( "tabIndex" ) === 0;
			})
			.attr( "tabIndex", -1 );
		}

		toShow.attr({
			"aria-expanded": "true",
			"aria-hidden": "false"
		});
		eventData.newTab.attr({
			"aria-selected": "true",
			tabIndex: 0
		});
	},

	_activate: function( index ) {
		var anchor,
			active = this._findActive( index );

		// trying to activate the already active panel
		if ( active[ 0 ] === this.active[ 0 ] ) {
			return;
		}

		// trying to collapse, simulate a click on the current active header
		if ( !active.length ) {
			active = this.active;
		}

		anchor = active.find( ".ui-tabs-anchor" )[ 0 ];
		this._eventHandler({
			target: anchor,
			currentTarget: anchor,
			preventDefault: $.noop
		});
	},

	_findActive: function( index ) {
		return index === false ? $() : this.tabs.eq( index );
	},

	_getIndex: function( index ) {
		// meta-function to give users option to provide a href string instead of a numerical index.
		if ( typeof index === "string" ) {
			index = this.anchors.index( this.anchors.filter( "[href$='" + index + "']" ) );
		}

		return index;
	},

	_destroy: function() {
		if ( this.xhr ) {
			this.xhr.abort();
		}

		this.element.removeClass( "ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible" );

		this.tablist
			.removeClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" )
			.removeAttr( "role" );

		this.anchors
			.removeClass( "ui-tabs-anchor" )
			.removeAttr( "role" )
			.removeAttr( "tabIndex" )
			.removeData( "href.tabs" )
			.removeData( "load.tabs" )
			.removeUniqueId();

		this.tabs.add( this.panels ).each(function() {
			if ( $.data( this, "ui-tabs-destroy" ) ) {
				$( this ).remove();
			} else {
				$( this )
					.removeClass( "ui-state-default ui-state-active ui-state-disabled " +
						"ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel" )
					.removeAttr( "tabIndex" )
					.removeAttr( "aria-live" )
					.removeAttr( "aria-busy" )
					.removeAttr( "aria-selected" )
					.removeAttr( "aria-labelledby" )
					.removeAttr( "aria-hidden" )
					.removeAttr( "aria-expanded" )
					.removeAttr( "role" );
			}
		});

		this.tabs.each(function() {
			var li = $( this ),
				prev = li.data( "ui-tabs-aria-controls" );
			if ( prev ) {
				li.attr( "aria-controls", prev );
			} else {
				li.removeAttr( "aria-controls" );
			}
		});

		this.panels.show();

		if ( this.options.heightStyle !== "content" ) {
			this.panels.css( "height", "" );
		}
	},

	enable: function( index ) {
		var disabled = this.options.disabled;
		if ( disabled === false ) {
			return;
		}

		if ( index === undefined ) {
			disabled = false;
		} else {
			index = this._getIndex( index );
			if ( $.isArray( disabled ) ) {
				disabled = $.map( disabled, function( num ) {
					return num !== index ? num : null;
				});
			} else {
				disabled = $.map( this.tabs, function( li, num ) {
					return num !== index ? num : null;
				});
			}
		}
		this._setupDisabled( disabled );
	},

	disable: function( index ) {
		var disabled = this.options.disabled;
		if ( disabled === true ) {
			return;
		}

		if ( index === undefined ) {
			disabled = true;
		} else {
			index = this._getIndex( index );
			if ( $.inArray( index, disabled ) !== -1 ) {
				return;
			}
			if ( $.isArray( disabled ) ) {
				disabled = $.merge( [ index ], disabled ).sort();
			} else {
				disabled = [ index ];
			}
		}
		this._setupDisabled( disabled );
	},

	load: function( index, event ) {
		index = this._getIndex( index );
		var that = this,
			tab = this.tabs.eq( index ),
			anchor = tab.find( ".ui-tabs-anchor" ),
			panel = this._getPanelForTab( tab ),
			eventData = {
				tab: tab,
				panel: panel
			};

		// not remote
		if ( isLocal( anchor[ 0 ] ) ) {
			return;
		}

		this.xhr = $.ajax( this._ajaxSettings( anchor, event, eventData ) );

		// support: jQuery <1.8
		// jQuery <1.8 returns false if the request is canceled in beforeSend,
		// but as of 1.8, $.ajax() always returns a jqXHR object.
		if ( this.xhr && this.xhr.statusText !== "canceled" ) {
			tab.addClass( "ui-tabs-loading" );
			panel.attr( "aria-busy", "true" );

			this.xhr
				.success(function( response ) {
					// support: jQuery <1.8
					// http://bugs.jquery.com/ticket/11778
					setTimeout(function() {
						panel.html( response );
						that._trigger( "load", event, eventData );
					}, 1 );
				})
				.complete(function( jqXHR, status ) {
					// support: jQuery <1.8
					// http://bugs.jquery.com/ticket/11778
					setTimeout(function() {
						if ( status === "abort" ) {
							that.panels.stop( false, true );
						}

						tab.removeClass( "ui-tabs-loading" );
						panel.removeAttr( "aria-busy" );

						if ( jqXHR === that.xhr ) {
							delete that.xhr;
						}
					}, 1 );
				});
		}
	},

	// TODO: Remove this function in 1.10 when ajaxOptions is removed
	_ajaxSettings: function( anchor, event, eventData ) {
		var that = this;
		return {
			url: anchor.attr( "href" ),
			beforeSend: function( jqXHR, settings ) {
				return that._trigger( "beforeLoad", event,
					$.extend( { jqXHR : jqXHR, ajaxSettings: settings }, eventData ) );
			}
		};
	},

	_getPanelForTab: function( tab ) {
		var id = $( tab ).attr( "aria-controls" );
		return this.element.find( this._sanitizeSelector( "#" + id ) );
	}
});

// DEPRECATED
if ( $.uiBackCompat !== false ) {

	// helper method for a lot of the back compat extensions
	$.ui.tabs.prototype._ui = function( tab, panel ) {
		return {
			tab: tab,
			panel: panel,
			index: this.anchors.index( tab )
		};
	};

	// url method
	$.widget( "ui.tabs", $.ui.tabs, {
		url: function( index, url ) {
			this.anchors.eq( index ).attr( "href", url );
		}
	});

	// TODO: Remove _ajaxSettings() method when removing this extension
	// ajaxOptions and cache options
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			ajaxOptions: null,
			cache: false
		},

		_create: function() {
			this._super();

			var that = this;

			this._on({ tabsbeforeload: function( event, ui ) {
				// tab is already cached
				if ( $.data( ui.tab[ 0 ], "cache.tabs" ) ) {
					event.preventDefault();
					return;
				}

				ui.jqXHR.success(function() {
					if ( that.options.cache ) {
						$.data( ui.tab[ 0 ], "cache.tabs", true );
					}
				});
			}});
		},

		_ajaxSettings: function( anchor, event, ui ) {
			var ajaxOptions = this.options.ajaxOptions;
			return $.extend( {}, ajaxOptions, {
				error: function( xhr, status ) {
					try {
						// Passing index avoid a race condition when this method is
						// called after the user has selected another tab.
						// Pass the anchor that initiated this request allows
						// loadError to manipulate the tab content panel via $(a.hash)
						ajaxOptions.error(
							xhr, status, ui.tab.closest( "li" ).index(), ui.tab[ 0 ] );
					}
					catch ( error ) {}
				}
			}, this._superApply( arguments ) );
		},

		_setOption: function( key, value ) {
			// reset cache if switching from cached to not cached
			if ( key === "cache" && value === false ) {
				this.anchors.removeData( "cache.tabs" );
			}
			this._super( key, value );
		},

		_destroy: function() {
			this.anchors.removeData( "cache.tabs" );
			this._super();
		},

		url: function( index ){
			this.anchors.eq( index ).removeData( "cache.tabs" );
			this._superApply( arguments );
		}
	});

	// abort method
	$.widget( "ui.tabs", $.ui.tabs, {
		abort: function() {
			if ( this.xhr ) {
				this.xhr.abort();
			}
		}
	});

	// spinner
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			spinner: "<em>Loading&#8230;</em>"
		},
		_create: function() {
			this._super();
			this._on({
				tabsbeforeload: function( event, ui ) {
					// Don't react to nested tabs or tabs that don't use a spinner
					if ( event.target !== this.element[ 0 ] ||
							!this.options.spinner ) {
						return;
					}

					var span = ui.tab.find( "span" ),
						html = span.html();
					span.html( this.options.spinner );
					ui.jqXHR.complete(function() {
						span.html( html );
					});
				}
			});
		}
	});

	// enable/disable events
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			enable: null,
			disable: null
		},

		enable: function( index ) {
			var options = this.options,
				trigger;

			if ( index && options.disabled === true ||
					( $.isArray( options.disabled ) && $.inArray( index, options.disabled ) !== -1 ) ) {
				trigger = true;
			}

			this._superApply( arguments );

			if ( trigger ) {
				this._trigger( "enable", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
			}
		},

		disable: function( index ) {
			var options = this.options,
				trigger;

			if ( index && options.disabled === false ||
					( $.isArray( options.disabled ) && $.inArray( index, options.disabled ) === -1 ) ) {
				trigger = true;
			}

			this._superApply( arguments );

			if ( trigger ) {
				this._trigger( "disable", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
			}
		}
	});

	// add/remove methods and events
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			add: null,
			remove: null,
			tabTemplate: "<li><a href='#{href}'><span>#{label}</span></a></li>"
		},

		add: function( url, label, index ) {
			if ( index === undefined ) {
				index = this.anchors.length;
			}

			var doInsertAfter, panel,
				options = this.options,
				li = $( options.tabTemplate
					.replace( /#\{href\}/g, url )
					.replace( /#\{label\}/g, label ) ),
				id = !url.indexOf( "#" ) ?
					url.replace( "#", "" ) :
					this._tabId( li );

			li.addClass( "ui-state-default ui-corner-top" ).data( "ui-tabs-destroy", true );
			li.attr( "aria-controls", id );

			doInsertAfter = index >= this.tabs.length;

			// try to find an existing element before creating a new one
			panel = this.element.find( "#" + id );
			if ( !panel.length ) {
				panel = this._createPanel( id );
				if ( doInsertAfter ) {
					if ( index > 0 ) {
						panel.insertAfter( this.panels.eq( -1 ) );
					} else {
						panel.appendTo( this.element );
					}
				} else {
					panel.insertBefore( this.panels[ index ] );
				}
			}
			panel.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" ).hide();

			if ( doInsertAfter ) {
				li.appendTo( this.tablist );
			} else {
				li.insertBefore( this.tabs[ index ] );
			}

			options.disabled = $.map( options.disabled, function( n ) {
				return n >= index ? ++n : n;
			});

			this.refresh();
			if ( this.tabs.length === 1 && options.active === false ) {
				this.option( "active", 0 );
			}

			this._trigger( "add", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
			return this;
		},

		remove: function( index ) {
			index = this._getIndex( index );
			var options = this.options,
				tab = this.tabs.eq( index ).remove(),
				panel = this._getPanelForTab( tab ).remove();

			// If selected tab was removed focus tab to the right or
			// in case the last tab was removed the tab to the left.
			// We check for more than 2 tabs, because if there are only 2,
			// then when we remove this tab, there will only be one tab left
			// so we don't need to detect which tab to activate.
			if ( tab.hasClass( "ui-tabs-active" ) && this.anchors.length > 2 ) {
				this._activate( index + ( index + 1 < this.anchors.length ? 1 : -1 ) );
			}

			options.disabled = $.map(
				$.grep( options.disabled, function( n ) {
					return n !== index;
				}),
				function( n ) {
					return n >= index ? --n : n;
				});

			this.refresh();

			this._trigger( "remove", null, this._ui( tab.find( "a" )[ 0 ], panel[ 0 ] ) );
			return this;
		}
	});

	// length method
	$.widget( "ui.tabs", $.ui.tabs, {
		length: function() {
			return this.anchors.length;
		}
	});

	// panel ids (idPrefix option + title attribute)
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			idPrefix: "ui-tabs-"
		},

		_tabId: function( tab ) {
			var a = tab.is( "li" ) ? tab.find( "a[href]" ) : tab;
			a = a[0];
			return $( a ).closest( "li" ).attr( "aria-controls" ) ||
				a.title && a.title.replace( /\s/g, "_" ).replace( /[^\w\u00c0-\uFFFF\-]/g, "" ) ||
				this.options.idPrefix + getNextTabId();
		}
	});

	// _createPanel method
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			panelTemplate: "<div></div>"
		},

		_createPanel: function( id ) {
			return $( this.options.panelTemplate )
				.attr( "id", id )
				.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" )
				.data( "ui-tabs-destroy", true );
		}
	});

	// selected option
	$.widget( "ui.tabs", $.ui.tabs, {
		_create: function() {
			var options = this.options;
			if ( options.active === null && options.selected !== undefined ) {
				options.active = options.selected === -1 ? false : options.selected;
			}
			this._super();
			options.selected = options.active;
			if ( options.selected === false ) {
				options.selected = -1;
			}
		},

		_setOption: function( key, value ) {
			if ( key !== "selected" ) {
				return this._super( key, value );
			}

			var options = this.options;
			this._super( "active", value === -1 ? false : value );
			options.selected = options.active;
			if ( options.selected === false ) {
				options.selected = -1;
			}
		},

		_eventHandler: function() {
			this._superApply( arguments );
			this.options.selected = this.options.active;
			if ( this.options.selected === false ) {
				this.options.selected = -1;
			}
		}
	});

	// show and select event
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			show: null,
			select: null
		},
		_create: function() {
			this._super();
			if ( this.options.active !== false ) {
				this._trigger( "show", null, this._ui(
					this.active.find( ".ui-tabs-anchor" )[ 0 ],
					this._getPanelForTab( this.active )[ 0 ] ) );
			}
		},
		_trigger: function( type, event, data ) {
			var tab, panel,
				ret = this._superApply( arguments );

			if ( !ret ) {
				return false;
			}

			if ( type === "beforeActivate" ) {
				tab = data.newTab.length ? data.newTab : data.oldTab;
				panel = data.newPanel.length ? data.newPanel : data.oldPanel;
				ret = this._super( "select", event, {
					tab: tab.find( ".ui-tabs-anchor" )[ 0],
					panel: panel[ 0 ],
					index: tab.closest( "li" ).index()
				});
			} else if ( type === "activate" && data.newTab.length ) {
				ret = this._super( "show", event, {
					tab: data.newTab.find( ".ui-tabs-anchor" )[ 0 ],
					panel: data.newPanel[ 0 ],
					index: data.newTab.closest( "li" ).index()
				});
			}
			return ret;
		}
	});

	// select method
	$.widget( "ui.tabs", $.ui.tabs, {
		select: function( index ) {
			index = this._getIndex( index );
			if ( index === -1 ) {
				if ( this.options.collapsible && this.options.selected !== -1 ) {
					index = this.options.selected;
				} else {
					return;
				}
			}
			this.anchors.eq( index ).trigger( this.options.event + this.eventNamespace );
		}
	});

	// cookie option
	(function() {

	var listId = 0;

	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			cookie: null // e.g. { expires: 7, path: '/', domain: 'jquery.com', secure: true }
		},
		_create: function() {
			var options = this.options,
				active;
			if ( options.active == null && options.cookie ) {
				active = parseInt( this._cookie(), 10 );
				if ( active === -1 ) {
					active = false;
				}
				options.active = active;
			}
			this._super();
		},
		_cookie: function( active ) {
			var cookie = [ this.cookie ||
				( this.cookie = this.options.cookie.name || "ui-tabs-" + (++listId) ) ];
			if ( arguments.length ) {
				cookie.push( active === false ? -1 : active );
				cookie.push( this.options.cookie );
			}
			return $.cookie.apply( null, cookie );
		},
		_refresh: function() {
			this._super();
			if ( this.options.cookie ) {
				this._cookie( this.options.active, this.options.cookie );
			}
		},
		_eventHandler: function() {
			this._superApply( arguments );
			if ( this.options.cookie ) {
				this._cookie( this.options.active, this.options.cookie );
			}
		},
		_destroy: function() {
			this._super();
			if ( this.options.cookie ) {
				this._cookie( null, this.options.cookie );
			}
		}
	});

	})();

	// load event
	$.widget( "ui.tabs", $.ui.tabs, {
		_trigger: function( type, event, data ) {
			var _data = $.extend( {}, data );
			if ( type === "load" ) {
				_data.panel = _data.panel[ 0 ];
				_data.tab = _data.tab.find( ".ui-tabs-anchor" )[ 0 ];
			}
			return this._super( type, event, _data );
		}
	});

	// fx option
	// The new animation options (show, hide) conflict with the old show callback.
	// The old fx option wins over show/hide anyway (always favor back-compat).
	// If a user wants to use the new animation API, they must give up the old API.
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			fx: null // e.g. { height: "toggle", opacity: "toggle", duration: 200 }
		},

		_getFx: function() {
			var hide, show,
				fx = this.options.fx;

			if ( fx ) {
				if ( $.isArray( fx ) ) {
					hide = fx[ 0 ];
					show = fx[ 1 ];
				} else {
					hide = show = fx;
				}
			}

			return fx ? { show: show, hide: hide } : null;
		},

		_toggle: function( event, eventData ) {
			var that = this,
				toShow = eventData.newPanel,
				toHide = eventData.oldPanel,
				fx = this._getFx();

			if ( !fx ) {
				return this._super( event, eventData );
			}

			that.running = true;

			function complete() {
				that.running = false;
				that._trigger( "activate", event, eventData );
			}

			function show() {
				eventData.newTab.closest( "li" ).addClass( "ui-tabs-active ui-state-active" );

				if ( toShow.length && fx.show ) {
					toShow
						.animate( fx.show, fx.show.duration, function() {
							complete();
						});
				} else {
					toShow.show();
					complete();
				}
			}

			// start out by hiding, then showing, then completing
			if ( toHide.length && fx.hide ) {
				toHide.animate( fx.hide, fx.hide.duration, function() {
					eventData.oldTab.closest( "li" ).removeClass( "ui-tabs-active ui-state-active" );
					show();
				});
			} else {
				eventData.oldTab.closest( "li" ).removeClass( "ui-tabs-active ui-state-active" );
				toHide.hide();
				show();
			}
		}
	});
}

})( jQuery );
(function( $ ) {

var increments = 0;

function addDescribedBy( elem, id ) {
	var describedby = (elem.attr( "aria-describedby" ) || "").split( /\s+/ );
	describedby.push( id );
	elem
		.data( "ui-tooltip-id", id )
		.attr( "aria-describedby", $.trim( describedby.join( " " ) ) );
}

function removeDescribedBy( elem ) {
	var id = elem.data( "ui-tooltip-id" ),
		describedby = (elem.attr( "aria-describedby" ) || "").split( /\s+/ ),
		index = $.inArray( id, describedby );
	if ( index !== -1 ) {
		describedby.splice( index, 1 );
	}

	elem.removeData( "ui-tooltip-id" );
	describedby = $.trim( describedby.join( " " ) );
	if ( describedby ) {
		elem.attr( "aria-describedby", describedby );
	} else {
		elem.removeAttr( "aria-describedby" );
	}
}

$.widget( "ui.tooltip", {
	version: "1.9.2",
	options: {
		content: function() {
			return $( this ).attr( "title" );
		},
		hide: true,
		// Disabled elements have inconsistent behavior across browsers (#8661)
		items: "[title]:not([disabled])",
		position: {
			my: "left top+15",
			at: "left bottom",
			collision: "flipfit flip"
		},
		show: true,
		tooltipClass: null,
		track: false,

		// callbacks
		close: null,
		open: null
	},

	_create: function() {
		this._on({
			mouseover: "open",
			focusin: "open"
		});

		// IDs of generated tooltips, needed for destroy
		this.tooltips = {};
		// IDs of parent tooltips where we removed the title attribute
		this.parents = {};

		if ( this.options.disabled ) {
			this._disable();
		}
	},

	_setOption: function( key, value ) {
		var that = this;

		if ( key === "disabled" ) {
			this[ value ? "_disable" : "_enable" ]();
			this.options[ key ] = value;
			// disable element style changes
			return;
		}

		this._super( key, value );

		if ( key === "content" ) {
			$.each( this.tooltips, function( id, element ) {
				that._updateContent( element );
			});
		}
	},

	_disable: function() {
		var that = this;

		// close open tooltips
		$.each( this.tooltips, function( id, element ) {
			var event = $.Event( "blur" );
			event.target = event.currentTarget = element[0];
			that.close( event, true );
		});

		// remove title attributes to prevent native tooltips
		this.element.find( this.options.items ).andSelf().each(function() {
			var element = $( this );
			if ( element.is( "[title]" ) ) {
				element
					.data( "ui-tooltip-title", element.attr( "title" ) )
					.attr( "title", "" );
			}
		});
	},

	_enable: function() {
		// restore title attributes
		this.element.find( this.options.items ).andSelf().each(function() {
			var element = $( this );
			if ( element.data( "ui-tooltip-title" ) ) {
				element.attr( "title", element.data( "ui-tooltip-title" ) );
			}
		});
	},

	open: function( event ) {
		var that = this,
			target = $( event ? event.target : this.element )
				// we need closest here due to mouseover bubbling,
				// but always pointing at the same event target
				.closest( this.options.items );

		// No element to show a tooltip for or the tooltip is already open
		if ( !target.length || target.data( "ui-tooltip-id" ) ) {
			return;
		}

		if ( target.attr( "title" ) ) {
			target.data( "ui-tooltip-title", target.attr( "title" ) );
		}

		target.data( "ui-tooltip-open", true );

		// kill parent tooltips, custom or native, for hover
		if ( event && event.type === "mouseover" ) {
			target.parents().each(function() {
				var parent = $( this ),
					blurEvent;
				if ( parent.data( "ui-tooltip-open" ) ) {
					blurEvent = $.Event( "blur" );
					blurEvent.target = blurEvent.currentTarget = this;
					that.close( blurEvent, true );
				}
				if ( parent.attr( "title" ) ) {
					parent.uniqueId();
					that.parents[ this.id ] = {
						element: this,
						title: parent.attr( "title" )
					};
					parent.attr( "title", "" );
				}
			});
		}

		this._updateContent( target, event );
	},

	_updateContent: function( target, event ) {
		var content,
			contentOption = this.options.content,
			that = this,
			eventType = event ? event.type : null;

		if ( typeof contentOption === "string" ) {
			return this._open( event, target, contentOption );
		}

		content = contentOption.call( target[0], function( response ) {
			// ignore async response if tooltip was closed already
			if ( !target.data( "ui-tooltip-open" ) ) {
				return;
			}
			// IE may instantly serve a cached response for ajax requests
			// delay this call to _open so the other call to _open runs first
			that._delay(function() {
				// jQuery creates a special event for focusin when it doesn't
				// exist natively. To improve performance, the native event
				// object is reused and the type is changed. Therefore, we can't
				// rely on the type being correct after the event finished
				// bubbling, so we set it back to the previous value. (#8740)
				if ( event ) {
					event.type = eventType;
				}
				this._open( event, target, response );
			});
		});
		if ( content ) {
			this._open( event, target, content );
		}
	},

	_open: function( event, target, content ) {
		var tooltip, events, delayedShow,
			positionOption = $.extend( {}, this.options.position );

		if ( !content ) {
			return;
		}

		// Content can be updated multiple times. If the tooltip already
		// exists, then just update the content and bail.
		tooltip = this._find( target );
		if ( tooltip.length ) {
			tooltip.find( ".ui-tooltip-content" ).html( content );
			return;
		}

		// if we have a title, clear it to prevent the native tooltip
		// we have to check first to avoid defining a title if none exists
		// (we don't want to cause an element to start matching [title])
		//
		// We use removeAttr only for key events, to allow IE to export the correct
		// accessible attributes. For mouse events, set to empty string to avoid
		// native tooltip showing up (happens only when removing inside mouseover).
		if ( target.is( "[title]" ) ) {
			if ( event && event.type === "mouseover" ) {
				target.attr( "title", "" );
			} else {
				target.removeAttr( "title" );
			}
		}

		tooltip = this._tooltip( target );
		addDescribedBy( target, tooltip.attr( "id" ) );
		tooltip.find( ".ui-tooltip-content" ).html( content );

		function position( event ) {
			positionOption.of = event;
			if ( tooltip.is( ":hidden" ) ) {
				return;
			}
			tooltip.position( positionOption );
		}
		if ( this.options.track && event && /^mouse/.test( event.type ) ) {
			this._on( this.document, {
				mousemove: position
			});
			// trigger once to override element-relative positioning
			position( event );
		} else {
			tooltip.position( $.extend({
				of: target
			}, this.options.position ) );
		}

		tooltip.hide();

		this._show( tooltip, this.options.show );
		// Handle tracking tooltips that are shown with a delay (#8644). As soon
		// as the tooltip is visible, position the tooltip using the most recent
		// event.
		if ( this.options.show && this.options.show.delay ) {
			delayedShow = setInterval(function() {
				if ( tooltip.is( ":visible" ) ) {
					position( positionOption.of );
					clearInterval( delayedShow );
				}
			}, $.fx.interval );
		}

		this._trigger( "open", event, { tooltip: tooltip } );

		events = {
			keyup: function( event ) {
				if ( event.keyCode === $.ui.keyCode.ESCAPE ) {
					var fakeEvent = $.Event(event);
					fakeEvent.currentTarget = target[0];
					this.close( fakeEvent, true );
				}
			},
			remove: function() {
				this._removeTooltip( tooltip );
			}
		};
		if ( !event || event.type === "mouseover" ) {
			events.mouseleave = "close";
		}
		if ( !event || event.type === "focusin" ) {
			events.focusout = "close";
		}
		this._on( true, target, events );
	},

	close: function( event ) {
		var that = this,
			target = $( event ? event.currentTarget : this.element ),
			tooltip = this._find( target );

		// disabling closes the tooltip, so we need to track when we're closing
		// to avoid an infinite loop in case the tooltip becomes disabled on close
		if ( this.closing ) {
			return;
		}

		// only set title if we had one before (see comment in _open())
		if ( target.data( "ui-tooltip-title" ) ) {
			target.attr( "title", target.data( "ui-tooltip-title" ) );
		}

		removeDescribedBy( target );

		tooltip.stop( true );
		this._hide( tooltip, this.options.hide, function() {
			that._removeTooltip( $( this ) );
		});

		target.removeData( "ui-tooltip-open" );
		this._off( target, "mouseleave focusout keyup" );
		// Remove 'remove' binding only on delegated targets
		if ( target[0] !== this.element[0] ) {
			this._off( target, "remove" );
		}
		this._off( this.document, "mousemove" );

		if ( event && event.type === "mouseleave" ) {
			$.each( this.parents, function( id, parent ) {
				$( parent.element ).attr( "title", parent.title );
				delete that.parents[ id ];
			});
		}

		this.closing = true;
		this._trigger( "close", event, { tooltip: tooltip } );
		this.closing = false;
	},

	_tooltip: function( element ) {
		var id = "ui-tooltip-" + increments++,
			tooltip = $( "<div>" )
				.attr({
					id: id,
					role: "tooltip"
				})
				.addClass( "ui-tooltip ui-widget ui-corner-all ui-widget-content " +
					( this.options.tooltipClass || "" ) );
		$( "<div>" )
			.addClass( "ui-tooltip-content" )
			.appendTo( tooltip );
		tooltip.appendTo( this.document[0].body );
		if ( $.fn.bgiframe ) {
			tooltip.bgiframe();
		}
		this.tooltips[ id ] = element;
		return tooltip;
	},

	_find: function( target ) {
		var id = target.data( "ui-tooltip-id" );
		return id ? $( "#" + id ) : $();
	},

	_removeTooltip: function( tooltip ) {
		tooltip.remove();
		delete this.tooltips[ tooltip.attr( "id" ) ];
	},

	_destroy: function() {
		var that = this;

		// close open tooltips
		$.each( this.tooltips, function( id, element ) {
			// Delegate to close method to handle common cleanup
			var event = $.Event( "blur" );
			event.target = event.currentTarget = element[0];
			that.close( event, true );

			// Remove immediately; destroying an open tooltip doesn't use the
			// hide animation
			$( "#" + id ).remove();

			// Restore the title
			if ( element.data( "ui-tooltip-title" ) ) {
				element.attr( "title", element.data( "ui-tooltip-title" ) );
				element.removeData( "ui-tooltip-title" );
			}
		});
	}
});

}( jQuery ) );
;(jQuery.effects || (function($, undefined) {

var backCompat = $.uiBackCompat !== false,
	// prefix used for storing data on .data()
	dataSpace = "ui-effects-";

$.effects = {
	effect: {}
};

/*!
 * jQuery Color Animations v2.0.0
 * http://jquery.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: Mon Aug 13 13:41:02 2012 -0500
 */
(function( jQuery, undefined ) {

	var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor".split(" "),

	// plusequals test for += 100 -= 100
	rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
	// a set of RE's that can match strings and generate color tuples.
	stringParsers = [{
			re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			parse: function( execResult ) {
				return [
					execResult[ 1 ],
					execResult[ 2 ],
					execResult[ 3 ],
					execResult[ 4 ]
				];
			}
		}, {
			re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			parse: function( execResult ) {
				return [
					execResult[ 1 ] * 2.55,
					execResult[ 2 ] * 2.55,
					execResult[ 3 ] * 2.55,
					execResult[ 4 ]
				];
			}
		}, {
			// this regex ignores A-F because it's compared against an already lowercased string
			re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
			parse: function( execResult ) {
				return [
					parseInt( execResult[ 1 ], 16 ),
					parseInt( execResult[ 2 ], 16 ),
					parseInt( execResult[ 3 ], 16 )
				];
			}
		}, {
			// this regex ignores A-F because it's compared against an already lowercased string
			re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
			parse: function( execResult ) {
				return [
					parseInt( execResult[ 1 ] + execResult[ 1 ], 16 ),
					parseInt( execResult[ 2 ] + execResult[ 2 ], 16 ),
					parseInt( execResult[ 3 ] + execResult[ 3 ], 16 )
				];
			}
		}, {
			re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			space: "hsla",
			parse: function( execResult ) {
				return [
					execResult[ 1 ],
					execResult[ 2 ] / 100,
					execResult[ 3 ] / 100,
					execResult[ 4 ]
				];
			}
		}],

	// jQuery.Color( )
	color = jQuery.Color = function( color, green, blue, alpha ) {
		return new jQuery.Color.fn.parse( color, green, blue, alpha );
	},
	spaces = {
		rgba: {
			props: {
				red: {
					idx: 0,
					type: "byte"
				},
				green: {
					idx: 1,
					type: "byte"
				},
				blue: {
					idx: 2,
					type: "byte"
				}
			}
		},

		hsla: {
			props: {
				hue: {
					idx: 0,
					type: "degrees"
				},
				saturation: {
					idx: 1,
					type: "percent"
				},
				lightness: {
					idx: 2,
					type: "percent"
				}
			}
		}
	},
	propTypes = {
		"byte": {
			floor: true,
			max: 255
		},
		"percent": {
			max: 1
		},
		"degrees": {
			mod: 360,
			floor: true
		}
	},
	support = color.support = {},

	// element for support tests
	supportElem = jQuery( "<p>" )[ 0 ],

	// colors = jQuery.Color.names
	colors,

	// local aliases of functions called often
	each = jQuery.each;

// determine rgba support immediately
supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
support.rgba = supportElem.style.backgroundColor.indexOf( "rgba" ) > -1;

// define cache name and alpha properties
// for rgba and hsla spaces
each( spaces, function( spaceName, space ) {
	space.cache = "_" + spaceName;
	space.props.alpha = {
		idx: 3,
		type: "percent",
		def: 1
	};
});

function clamp( value, prop, allowEmpty ) {
	var type = propTypes[ prop.type ] || {};

	if ( value == null ) {
		return (allowEmpty || !prop.def) ? null : prop.def;
	}

	// ~~ is an short way of doing floor for positive numbers
	value = type.floor ? ~~value : parseFloat( value );

	// IE will pass in empty strings as value for alpha,
	// which will hit this case
	if ( isNaN( value ) ) {
		return prop.def;
	}

	if ( type.mod ) {
		// we add mod before modding to make sure that negatives values
		// get converted properly: -10 -> 350
		return (value + type.mod) % type.mod;
	}

	// for now all property types without mod have min and max
	return 0 > value ? 0 : type.max < value ? type.max : value;
}

function stringParse( string ) {
	var inst = color(),
		rgba = inst._rgba = [];

	string = string.toLowerCase();

	each( stringParsers, function( i, parser ) {
		var parsed,
			match = parser.re.exec( string ),
			values = match && parser.parse( match ),
			spaceName = parser.space || "rgba";

		if ( values ) {
			parsed = inst[ spaceName ]( values );

			// if this was an rgba parse the assignment might happen twice
			// oh well....
			inst[ spaces[ spaceName ].cache ] = parsed[ spaces[ spaceName ].cache ];
			rgba = inst._rgba = parsed._rgba;

			// exit each( stringParsers ) here because we matched
			return false;
		}
	});

	// Found a stringParser that handled it
	if ( rgba.length ) {

		// if this came from a parsed string, force "transparent" when alpha is 0
		// chrome, (and maybe others) return "transparent" as rgba(0,0,0,0)
		if ( rgba.join() === "0,0,0,0" ) {
			jQuery.extend( rgba, colors.transparent );
		}
		return inst;
	}

	// named colors
	return colors[ string ];
}

color.fn = jQuery.extend( color.prototype, {
	parse: function( red, green, blue, alpha ) {
		if ( red === undefined ) {
			this._rgba = [ null, null, null, null ];
			return this;
		}
		if ( red.jquery || red.nodeType ) {
			red = jQuery( red ).css( green );
			green = undefined;
		}

		var inst = this,
			type = jQuery.type( red ),
			rgba = this._rgba = [];

		// more than 1 argument specified - assume ( red, green, blue, alpha )
		if ( green !== undefined ) {
			red = [ red, green, blue, alpha ];
			type = "array";
		}

		if ( type === "string" ) {
			return this.parse( stringParse( red ) || colors._default );
		}

		if ( type === "array" ) {
			each( spaces.rgba.props, function( key, prop ) {
				rgba[ prop.idx ] = clamp( red[ prop.idx ], prop );
			});
			return this;
		}

		if ( type === "object" ) {
			if ( red instanceof color ) {
				each( spaces, function( spaceName, space ) {
					if ( red[ space.cache ] ) {
						inst[ space.cache ] = red[ space.cache ].slice();
					}
				});
			} else {
				each( spaces, function( spaceName, space ) {
					var cache = space.cache;
					each( space.props, function( key, prop ) {

						// if the cache doesn't exist, and we know how to convert
						if ( !inst[ cache ] && space.to ) {

							// if the value was null, we don't need to copy it
							// if the key was alpha, we don't need to copy it either
							if ( key === "alpha" || red[ key ] == null ) {
								return;
							}
							inst[ cache ] = space.to( inst._rgba );
						}

						// this is the only case where we allow nulls for ALL properties.
						// call clamp with alwaysAllowEmpty
						inst[ cache ][ prop.idx ] = clamp( red[ key ], prop, true );
					});

					// everything defined but alpha?
					if ( inst[ cache ] && $.inArray( null, inst[ cache ].slice( 0, 3 ) ) < 0 ) {
						// use the default of 1
						inst[ cache ][ 3 ] = 1;
						if ( space.from ) {
							inst._rgba = space.from( inst[ cache ] );
						}
					}
				});
			}
			return this;
		}
	},
	is: function( compare ) {
		var is = color( compare ),
			same = true,
			inst = this;

		each( spaces, function( _, space ) {
			var localCache,
				isCache = is[ space.cache ];
			if (isCache) {
				localCache = inst[ space.cache ] || space.to && space.to( inst._rgba ) || [];
				each( space.props, function( _, prop ) {
					if ( isCache[ prop.idx ] != null ) {
						same = ( isCache[ prop.idx ] === localCache[ prop.idx ] );
						return same;
					}
				});
			}
			return same;
		});
		return same;
	},
	_space: function() {
		var used = [],
			inst = this;
		each( spaces, function( spaceName, space ) {
			if ( inst[ space.cache ] ) {
				used.push( spaceName );
			}
		});
		return used.pop();
	},
	transition: function( other, distance ) {
		var end = color( other ),
			spaceName = end._space(),
			space = spaces[ spaceName ],
			startColor = this.alpha() === 0 ? color( "transparent" ) : this,
			start = startColor[ space.cache ] || space.to( startColor._rgba ),
			result = start.slice();

		end = end[ space.cache ];
		each( space.props, function( key, prop ) {
			var index = prop.idx,
				startValue = start[ index ],
				endValue = end[ index ],
				type = propTypes[ prop.type ] || {};

			// if null, don't override start value
			if ( endValue === null ) {
				return;
			}
			// if null - use end
			if ( startValue === null ) {
				result[ index ] = endValue;
			} else {
				if ( type.mod ) {
					if ( endValue - startValue > type.mod / 2 ) {
						startValue += type.mod;
					} else if ( startValue - endValue > type.mod / 2 ) {
						startValue -= type.mod;
					}
				}
				result[ index ] = clamp( ( endValue - startValue ) * distance + startValue, prop );
			}
		});
		return this[ spaceName ]( result );
	},
	blend: function( opaque ) {
		// if we are already opaque - return ourself
		if ( this._rgba[ 3 ] === 1 ) {
			return this;
		}

		var rgb = this._rgba.slice(),
			a = rgb.pop(),
			blend = color( opaque )._rgba;

		return color( jQuery.map( rgb, function( v, i ) {
			return ( 1 - a ) * blend[ i ] + a * v;
		}));
	},
	toRgbaString: function() {
		var prefix = "rgba(",
			rgba = jQuery.map( this._rgba, function( v, i ) {
				return v == null ? ( i > 2 ? 1 : 0 ) : v;
			});

		if ( rgba[ 3 ] === 1 ) {
			rgba.pop();
			prefix = "rgb(";
		}

		return prefix + rgba.join() + ")";
	},
	toHslaString: function() {
		var prefix = "hsla(",
			hsla = jQuery.map( this.hsla(), function( v, i ) {
				if ( v == null ) {
					v = i > 2 ? 1 : 0;
				}

				// catch 1 and 2
				if ( i && i < 3 ) {
					v = Math.round( v * 100 ) + "%";
				}
				return v;
			});

		if ( hsla[ 3 ] === 1 ) {
			hsla.pop();
			prefix = "hsl(";
		}
		return prefix + hsla.join() + ")";
	},
	toHexString: function( includeAlpha ) {
		var rgba = this._rgba.slice(),
			alpha = rgba.pop();

		if ( includeAlpha ) {
			rgba.push( ~~( alpha * 255 ) );
		}

		return "#" + jQuery.map( rgba, function( v ) {

			// default to 0 when nulls exist
			v = ( v || 0 ).toString( 16 );
			return v.length === 1 ? "0" + v : v;
		}).join("");
	},
	toString: function() {
		return this._rgba[ 3 ] === 0 ? "transparent" : this.toRgbaString();
	}
});
color.fn.parse.prototype = color.fn;

// hsla conversions adapted from:
// https://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/src/graphics/colors/HUE2RGB.as?r=5021

function hue2rgb( p, q, h ) {
	h = ( h + 1 ) % 1;
	if ( h * 6 < 1 ) {
		return p + (q - p) * h * 6;
	}
	if ( h * 2 < 1) {
		return q;
	}
	if ( h * 3 < 2 ) {
		return p + (q - p) * ((2/3) - h) * 6;
	}
	return p;
}

spaces.hsla.to = function ( rgba ) {
	if ( rgba[ 0 ] == null || rgba[ 1 ] == null || rgba[ 2 ] == null ) {
		return [ null, null, null, rgba[ 3 ] ];
	}
	var r = rgba[ 0 ] / 255,
		g = rgba[ 1 ] / 255,
		b = rgba[ 2 ] / 255,
		a = rgba[ 3 ],
		max = Math.max( r, g, b ),
		min = Math.min( r, g, b ),
		diff = max - min,
		add = max + min,
		l = add * 0.5,
		h, s;

	if ( min === max ) {
		h = 0;
	} else if ( r === max ) {
		h = ( 60 * ( g - b ) / diff ) + 360;
	} else if ( g === max ) {
		h = ( 60 * ( b - r ) / diff ) + 120;
	} else {
		h = ( 60 * ( r - g ) / diff ) + 240;
	}

	if ( l === 0 || l === 1 ) {
		s = l;
	} else if ( l <= 0.5 ) {
		s = diff / add;
	} else {
		s = diff / ( 2 - add );
	}
	return [ Math.round(h) % 360, s, l, a == null ? 1 : a ];
};

spaces.hsla.from = function ( hsla ) {
	if ( hsla[ 0 ] == null || hsla[ 1 ] == null || hsla[ 2 ] == null ) {
		return [ null, null, null, hsla[ 3 ] ];
	}
	var h = hsla[ 0 ] / 360,
		s = hsla[ 1 ],
		l = hsla[ 2 ],
		a = hsla[ 3 ],
		q = l <= 0.5 ? l * ( 1 + s ) : l + s - l * s,
		p = 2 * l - q;

	return [
		Math.round( hue2rgb( p, q, h + ( 1 / 3 ) ) * 255 ),
		Math.round( hue2rgb( p, q, h ) * 255 ),
		Math.round( hue2rgb( p, q, h - ( 1 / 3 ) ) * 255 ),
		a
	];
};


each( spaces, function( spaceName, space ) {
	var props = space.props,
		cache = space.cache,
		to = space.to,
		from = space.from;

	// makes rgba() and hsla()
	color.fn[ spaceName ] = function( value ) {

		// generate a cache for this space if it doesn't exist
		if ( to && !this[ cache ] ) {
			this[ cache ] = to( this._rgba );
		}
		if ( value === undefined ) {
			return this[ cache ].slice();
		}

		var ret,
			type = jQuery.type( value ),
			arr = ( type === "array" || type === "object" ) ? value : arguments,
			local = this[ cache ].slice();

		each( props, function( key, prop ) {
			var val = arr[ type === "object" ? key : prop.idx ];
			if ( val == null ) {
				val = local[ prop.idx ];
			}
			local[ prop.idx ] = clamp( val, prop );
		});

		if ( from ) {
			ret = color( from( local ) );
			ret[ cache ] = local;
			return ret;
		} else {
			return color( local );
		}
	};

	// makes red() green() blue() alpha() hue() saturation() lightness()
	each( props, function( key, prop ) {
		// alpha is included in more than one space
		if ( color.fn[ key ] ) {
			return;
		}
		color.fn[ key ] = function( value ) {
			var vtype = jQuery.type( value ),
				fn = ( key === "alpha" ? ( this._hsla ? "hsla" : "rgba" ) : spaceName ),
				local = this[ fn ](),
				cur = local[ prop.idx ],
				match;

			if ( vtype === "undefined" ) {
				return cur;
			}

			if ( vtype === "function" ) {
				value = value.call( this, cur );
				vtype = jQuery.type( value );
			}
			if ( value == null && prop.empty ) {
				return this;
			}
			if ( vtype === "string" ) {
				match = rplusequals.exec( value );
				if ( match ) {
					value = cur + parseFloat( match[ 2 ] ) * ( match[ 1 ] === "+" ? 1 : -1 );
				}
			}
			local[ prop.idx ] = value;
			return this[ fn ]( local );
		};
	});
});

// add .fx.step functions
each( stepHooks, function( i, hook ) {
	jQuery.cssHooks[ hook ] = {
		set: function( elem, value ) {
			var parsed, curElem,
				backgroundColor = "";

			if ( jQuery.type( value ) !== "string" || ( parsed = stringParse( value ) ) ) {
				value = color( parsed || value );
				if ( !support.rgba && value._rgba[ 3 ] !== 1 ) {
					curElem = hook === "backgroundColor" ? elem.parentNode : elem;
					while (
						(backgroundColor === "" || backgroundColor === "transparent") &&
						curElem && curElem.style
					) {
						try {
							backgroundColor = jQuery.css( curElem, "backgroundColor" );
							curElem = curElem.parentNode;
						} catch ( e ) {
						}
					}

					value = value.blend( backgroundColor && backgroundColor !== "transparent" ?
						backgroundColor :
						"_default" );
				}

				value = value.toRgbaString();
			}
			try {
				elem.style[ hook ] = value;
			} catch( error ) {
				// wrapped to prevent IE from throwing errors on "invalid" values like 'auto' or 'inherit'
			}
		}
	};
	jQuery.fx.step[ hook ] = function( fx ) {
		if ( !fx.colorInit ) {
			fx.start = color( fx.elem, hook );
			fx.end = color( fx.end );
			fx.colorInit = true;
		}
		jQuery.cssHooks[ hook ].set( fx.elem, fx.start.transition( fx.end, fx.pos ) );
	};
});

jQuery.cssHooks.borderColor = {
	expand: function( value ) {
		var expanded = {};

		each( [ "Top", "Right", "Bottom", "Left" ], function( i, part ) {
			expanded[ "border" + part + "Color" ] = value;
		});
		return expanded;
	}
};

// Basic color names only.
// Usage of any of the other color names requires adding yourself or including
// jquery.color.svg-names.js.
colors = jQuery.Color.names = {
	// 4.1. Basic color keywords
	aqua: "#00ffff",
	black: "#000000",
	blue: "#0000ff",
	fuchsia: "#ff00ff",
	gray: "#808080",
	green: "#008000",
	lime: "#00ff00",
	maroon: "#800000",
	navy: "#000080",
	olive: "#808000",
	purple: "#800080",
	red: "#ff0000",
	silver: "#c0c0c0",
	teal: "#008080",
	white: "#ffffff",
	yellow: "#ffff00",

	// 4.2.3. "transparent" color keyword
	transparent: [ null, null, null, 0 ],

	_default: "#ffffff"
};

})( jQuery );



/******************************************************************************/
/****************************** CLASS ANIMATIONS ******************************/
/******************************************************************************/
(function() {

var classAnimationActions = [ "add", "remove", "toggle" ],
	shorthandStyles = {
		border: 1,
		borderBottom: 1,
		borderColor: 1,
		borderLeft: 1,
		borderRight: 1,
		borderTop: 1,
		borderWidth: 1,
		margin: 1,
		padding: 1
	};

$.each([ "borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle" ], function( _, prop ) {
	$.fx.step[ prop ] = function( fx ) {
		if ( fx.end !== "none" && !fx.setAttr || fx.pos === 1 && !fx.setAttr ) {
			jQuery.style( fx.elem, prop, fx.end );
			fx.setAttr = true;
		}
	};
});

function getElementStyles() {
	var style = this.ownerDocument.defaultView ?
			this.ownerDocument.defaultView.getComputedStyle( this, null ) :
			this.currentStyle,
		newStyle = {},
		key,
		len;

	// webkit enumerates style porperties
	if ( style && style.length && style[ 0 ] && style[ style[ 0 ] ] ) {
		len = style.length;
		while ( len-- ) {
			key = style[ len ];
			if ( typeof style[ key ] === "string" ) {
				newStyle[ $.camelCase( key ) ] = style[ key ];
			}
		}
	} else {
		for ( key in style ) {
			if ( typeof style[ key ] === "string" ) {
				newStyle[ key ] = style[ key ];
			}
		}
	}

	return newStyle;
}


function styleDifference( oldStyle, newStyle ) {
	var diff = {},
		name, value;

	for ( name in newStyle ) {
		value = newStyle[ name ];
		if ( oldStyle[ name ] !== value ) {
			if ( !shorthandStyles[ name ] ) {
				if ( $.fx.step[ name ] || !isNaN( parseFloat( value ) ) ) {
					diff[ name ] = value;
				}
			}
		}
	}

	return diff;
}

$.effects.animateClass = function( value, duration, easing, callback ) {
	var o = $.speed( duration, easing, callback );

	return this.queue( function() {
		var animated = $( this ),
			baseClass = animated.attr( "class" ) || "",
			applyClassChange,
			allAnimations = o.children ? animated.find( "*" ).andSelf() : animated;

		// map the animated objects to store the original styles.
		allAnimations = allAnimations.map(function() {
			var el = $( this );
			return {
				el: el,
				start: getElementStyles.call( this )
			};
		});

		// apply class change
		applyClassChange = function() {
			$.each( classAnimationActions, function(i, action) {
				if ( value[ action ] ) {
					animated[ action + "Class" ]( value[ action ] );
				}
			});
		};
		applyClassChange();

		// map all animated objects again - calculate new styles and diff
		allAnimations = allAnimations.map(function() {
			this.end = getElementStyles.call( this.el[ 0 ] );
			this.diff = styleDifference( this.start, this.end );
			return this;
		});

		// apply original class
		animated.attr( "class", baseClass );

		// map all animated objects again - this time collecting a promise
		allAnimations = allAnimations.map(function() {
			var styleInfo = this,
				dfd = $.Deferred(),
				opts = jQuery.extend({}, o, {
					queue: false,
					complete: function() {
						dfd.resolve( styleInfo );
					}
				});

			this.el.animate( this.diff, opts );
			return dfd.promise();
		});

		// once all animations have completed:
		$.when.apply( $, allAnimations.get() ).done(function() {

			// set the final class
			applyClassChange();

			// for each animated element,
			// clear all css properties that were animated
			$.each( arguments, function() {
				var el = this.el;
				$.each( this.diff, function(key) {
					el.css( key, '' );
				});
			});

			// this is guarnteed to be there if you use jQuery.speed()
			// it also handles dequeuing the next anim...
			o.complete.call( animated[ 0 ] );
		});
	});
};

$.fn.extend({
	_addClass: $.fn.addClass,
	addClass: function( classNames, speed, easing, callback ) {
		return speed ?
			$.effects.animateClass.call( this,
				{ add: classNames }, speed, easing, callback ) :
			this._addClass( classNames );
	},

	_removeClass: $.fn.removeClass,
	removeClass: function( classNames, speed, easing, callback ) {
		return speed ?
			$.effects.animateClass.call( this,
				{ remove: classNames }, speed, easing, callback ) :
			this._removeClass( classNames );
	},

	_toggleClass: $.fn.toggleClass,
	toggleClass: function( classNames, force, speed, easing, callback ) {
		if ( typeof force === "boolean" || force === undefined ) {
			if ( !speed ) {
				// without speed parameter
				return this._toggleClass( classNames, force );
			} else {
				return $.effects.animateClass.call( this,
					(force ? { add: classNames } : { remove: classNames }),
					speed, easing, callback );
			}
		} else {
			// without force parameter
			return $.effects.animateClass.call( this,
				{ toggle: classNames }, force, speed, easing );
		}
	},

	switchClass: function( remove, add, speed, easing, callback) {
		return $.effects.animateClass.call( this, {
			add: add,
			remove: remove
		}, speed, easing, callback );
	}
});

})();

/******************************************************************************/
/*********************************** EFFECTS **********************************/
/******************************************************************************/

(function() {

$.extend( $.effects, {
	version: "1.9.2",

	// Saves a set of properties in a data storage
	save: function( element, set ) {
		for( var i=0; i < set.length; i++ ) {
			if ( set[ i ] !== null ) {
				element.data( dataSpace + set[ i ], element[ 0 ].style[ set[ i ] ] );
			}
		}
	},

	// Restores a set of previously saved properties from a data storage
	restore: function( element, set ) {
		var val, i;
		for( i=0; i < set.length; i++ ) {
			if ( set[ i ] !== null ) {
				val = element.data( dataSpace + set[ i ] );
				// support: jQuery 1.6.2
				// http://bugs.jquery.com/ticket/9917
				// jQuery 1.6.2 incorrectly returns undefined for any falsy value.
				// We can't differentiate between "" and 0 here, so we just assume
				// empty string since it's likely to be a more common value...
				if ( val === undefined ) {
					val = "";
				}
				element.css( set[ i ], val );
			}
		}
	},

	setMode: function( el, mode ) {
		if (mode === "toggle") {
			mode = el.is( ":hidden" ) ? "show" : "hide";
		}
		return mode;
	},

	// Translates a [top,left] array into a baseline value
	// this should be a little more flexible in the future to handle a string & hash
	getBaseline: function( origin, original ) {
		var y, x;
		switch ( origin[ 0 ] ) {
			case "top": y = 0; break;
			case "middle": y = 0.5; break;
			case "bottom": y = 1; break;
			default: y = origin[ 0 ] / original.height;
		}
		switch ( origin[ 1 ] ) {
			case "left": x = 0; break;
			case "center": x = 0.5; break;
			case "right": x = 1; break;
			default: x = origin[ 1 ] / original.width;
		}
		return {
			x: x,
			y: y
		};
	},

	// Wraps the element around a wrapper that copies position properties
	createWrapper: function( element ) {

		// if the element is already wrapped, return it
		if ( element.parent().is( ".ui-effects-wrapper" )) {
			return element.parent();
		}

		// wrap the element
		var props = {
				width: element.outerWidth(true),
				height: element.outerHeight(true),
				"float": element.css( "float" )
			},
			wrapper = $( "<div></div>" )
				.addClass( "ui-effects-wrapper" )
				.css({
					fontSize: "100%",
					background: "transparent",
					border: "none",
					margin: 0,
					padding: 0
				}),
			// Store the size in case width/height are defined in % - Fixes #5245
			size = {
				width: element.width(),
				height: element.height()
			},
			active = document.activeElement;

		// support: Firefox
		// Firefox incorrectly exposes anonymous content
		// https://bugzilla.mozilla.org/show_bug.cgi?id=561664
		try {
			active.id;
		} catch( e ) {
			active = document.body;
		}

		element.wrap( wrapper );

		// Fixes #7595 - Elements lose focus when wrapped.
		if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
			$( active ).focus();
		}

		wrapper = element.parent(); //Hotfix for jQuery 1.4 since some change in wrap() seems to actually lose the reference to the wrapped element

		// transfer positioning properties to the wrapper
		if ( element.css( "position" ) === "static" ) {
			wrapper.css({ position: "relative" });
			element.css({ position: "relative" });
		} else {
			$.extend( props, {
				position: element.css( "position" ),
				zIndex: element.css( "z-index" )
			});
			$.each([ "top", "left", "bottom", "right" ], function(i, pos) {
				props[ pos ] = element.css( pos );
				if ( isNaN( parseInt( props[ pos ], 10 ) ) ) {
					props[ pos ] = "auto";
				}
			});
			element.css({
				position: "relative",
				top: 0,
				left: 0,
				right: "auto",
				bottom: "auto"
			});
		}
		element.css(size);

		return wrapper.css( props ).show();
	},

	removeWrapper: function( element ) {
		var active = document.activeElement;

		if ( element.parent().is( ".ui-effects-wrapper" ) ) {
			element.parent().replaceWith( element );

			// Fixes #7595 - Elements lose focus when wrapped.
			if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
				$( active ).focus();
			}
		}


		return element;
	},

	setTransition: function( element, list, factor, value ) {
		value = value || {};
		$.each( list, function( i, x ) {
			var unit = element.cssUnit( x );
			if ( unit[ 0 ] > 0 ) {
				value[ x ] = unit[ 0 ] * factor + unit[ 1 ];
			}
		});
		return value;
	}
});

// return an effect options object for the given parameters:
function _normalizeArguments( effect, options, speed, callback ) {

	// allow passing all options as the first parameter
	if ( $.isPlainObject( effect ) ) {
		options = effect;
		effect = effect.effect;
	}

	// convert to an object
	effect = { effect: effect };

	// catch (effect, null, ...)
	if ( options == null ) {
		options = {};
	}

	// catch (effect, callback)
	if ( $.isFunction( options ) ) {
		callback = options;
		speed = null;
		options = {};
	}

	// catch (effect, speed, ?)
	if ( typeof options === "number" || $.fx.speeds[ options ] ) {
		callback = speed;
		speed = options;
		options = {};
	}

	// catch (effect, options, callback)
	if ( $.isFunction( speed ) ) {
		callback = speed;
		speed = null;
	}

	// add options to effect
	if ( options ) {
		$.extend( effect, options );
	}

	speed = speed || options.duration;
	effect.duration = $.fx.off ? 0 :
		typeof speed === "number" ? speed :
		speed in $.fx.speeds ? $.fx.speeds[ speed ] :
		$.fx.speeds._default;

	effect.complete = callback || options.complete;

	return effect;
}

function standardSpeed( speed ) {
	// valid standard speeds
	if ( !speed || typeof speed === "number" || $.fx.speeds[ speed ] ) {
		return true;
	}

	// invalid strings - treat as "normal" speed
	if ( typeof speed === "string" && !$.effects.effect[ speed ] ) {
		// TODO: remove in 2.0 (#7115)
		if ( backCompat && $.effects[ speed ] ) {
			return false;
		}
		return true;
	}

	return false;
}

$.fn.extend({
	effect: function( /* effect, options, speed, callback */ ) {
		var args = _normalizeArguments.apply( this, arguments ),
			mode = args.mode,
			queue = args.queue,
			effectMethod = $.effects.effect[ args.effect ],

			// DEPRECATED: remove in 2.0 (#7115)
			oldEffectMethod = !effectMethod && backCompat && $.effects[ args.effect ];

		if ( $.fx.off || !( effectMethod || oldEffectMethod ) ) {
			// delegate to the original method (e.g., .show()) if possible
			if ( mode ) {
				return this[ mode ]( args.duration, args.complete );
			} else {
				return this.each( function() {
					if ( args.complete ) {
						args.complete.call( this );
					}
				});
			}
		}

		function run( next ) {
			var elem = $( this ),
				complete = args.complete,
				mode = args.mode;

			function done() {
				if ( $.isFunction( complete ) ) {
					complete.call( elem[0] );
				}
				if ( $.isFunction( next ) ) {
					next();
				}
			}

			// if the element is hiddden and mode is hide,
			// or element is visible and mode is show
			if ( elem.is( ":hidden" ) ? mode === "hide" : mode === "show" ) {
				done();
			} else {
				effectMethod.call( elem[0], args, done );
			}
		}

		// TODO: remove this check in 2.0, effectMethod will always be true
		if ( effectMethod ) {
			return queue === false ? this.each( run ) : this.queue( queue || "fx", run );
		} else {
			// DEPRECATED: remove in 2.0 (#7115)
			return oldEffectMethod.call(this, {
				options: args,
				duration: args.duration,
				callback: args.complete,
				mode: args.mode
			});
		}
	},

	_show: $.fn.show,
	show: function( speed ) {
		if ( standardSpeed( speed ) ) {
			return this._show.apply( this, arguments );
		} else {
			var args = _normalizeArguments.apply( this, arguments );
			args.mode = "show";
			return this.effect.call( this, args );
		}
	},

	_hide: $.fn.hide,
	hide: function( speed ) {
		if ( standardSpeed( speed ) ) {
			return this._hide.apply( this, arguments );
		} else {
			var args = _normalizeArguments.apply( this, arguments );
			args.mode = "hide";
			return this.effect.call( this, args );
		}
	},

	// jQuery core overloads toggle and creates _toggle
	__toggle: $.fn.toggle,
	toggle: function( speed ) {
		if ( standardSpeed( speed ) || typeof speed === "boolean" || $.isFunction( speed ) ) {
			return this.__toggle.apply( this, arguments );
		} else {
			var args = _normalizeArguments.apply( this, arguments );
			args.mode = "toggle";
			return this.effect.call( this, args );
		}
	},

	// helper functions
	cssUnit: function(key) {
		var style = this.css( key ),
			val = [];

		$.each( [ "em", "px", "%", "pt" ], function( i, unit ) {
			if ( style.indexOf( unit ) > 0 ) {
				val = [ parseFloat( style ), unit ];
			}
		});
		return val;
	}
});

})();

/******************************************************************************/
/*********************************** EASING ***********************************/
/******************************************************************************/

(function() {

// based on easing equations from Robert Penner (http://www.robertpenner.com/easing)

var baseEasings = {};

$.each( [ "Quad", "Cubic", "Quart", "Quint", "Expo" ], function( i, name ) {
	baseEasings[ name ] = function( p ) {
		return Math.pow( p, i + 2 );
	};
});

$.extend( baseEasings, {
	Sine: function ( p ) {
		return 1 - Math.cos( p * Math.PI / 2 );
	},
	Circ: function ( p ) {
		return 1 - Math.sqrt( 1 - p * p );
	},
	Elastic: function( p ) {
		return p === 0 || p === 1 ? p :
			-Math.pow( 2, 8 * (p - 1) ) * Math.sin( ( (p - 1) * 80 - 7.5 ) * Math.PI / 15 );
	},
	Back: function( p ) {
		return p * p * ( 3 * p - 2 );
	},
	Bounce: function ( p ) {
		var pow2,
			bounce = 4;

		while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
		return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
	}
});

$.each( baseEasings, function( name, easeIn ) {
	$.easing[ "easeIn" + name ] = easeIn;
	$.easing[ "easeOut" + name ] = function( p ) {
		return 1 - easeIn( 1 - p );
	};
	$.easing[ "easeInOut" + name ] = function( p ) {
		return p < 0.5 ?
			easeIn( p * 2 ) / 2 :
			1 - easeIn( p * -2 + 2 ) / 2;
	};
});

})();

})(jQuery));
(function( $, undefined ) {

var rvertical = /up|down|vertical/,
	rpositivemotion = /up|left|vertical|horizontal/;

$.effects.effect.blind = function( o, done ) {
	// Create element
	var el = $( this ),
		props = [ "position", "top", "bottom", "left", "right", "height", "width" ],
		mode = $.effects.setMode( el, o.mode || "hide" ),
		direction = o.direction || "up",
		vertical = rvertical.test( direction ),
		ref = vertical ? "height" : "width",
		ref2 = vertical ? "top" : "left",
		motion = rpositivemotion.test( direction ),
		animation = {},
		show = mode === "show",
		wrapper, distance, margin;

	// if already wrapped, the wrapper's properties are my property. #6245
	if ( el.parent().is( ".ui-effects-wrapper" ) ) {
		$.effects.save( el.parent(), props );
	} else {
		$.effects.save( el, props );
	}
	el.show();
	wrapper = $.effects.createWrapper( el ).css({
		overflow: "hidden"
	});

	distance = wrapper[ ref ]();
	margin = parseFloat( wrapper.css( ref2 ) ) || 0;

	animation[ ref ] = show ? distance : 0;
	if ( !motion ) {
		el
			.css( vertical ? "bottom" : "right", 0 )
			.css( vertical ? "top" : "left", "auto" )
			.css({ position: "absolute" });

		animation[ ref2 ] = show ? margin : distance + margin;
	}

	// start at 0 if we are showing
	if ( show ) {
		wrapper.css( ref, 0 );
		if ( ! motion ) {
			wrapper.css( ref2, margin + distance );
		}
	}

	// Animate
	wrapper.animate( animation, {
		duration: o.duration,
		easing: o.easing,
		queue: false,
		complete: function() {
			if ( mode === "hide" ) {
				el.hide();
			}
			$.effects.restore( el, props );
			$.effects.removeWrapper( el );
			done();
		}
	});

};

})(jQuery);
(function( $, undefined ) {

$.effects.effect.bounce = function( o, done ) {
	var el = $( this ),
		props = [ "position", "top", "bottom", "left", "right", "height", "width" ],

		// defaults:
		mode = $.effects.setMode( el, o.mode || "effect" ),
		hide = mode === "hide",
		show = mode === "show",
		direction = o.direction || "up",
		distance = o.distance,
		times = o.times || 5,

		// number of internal animations
		anims = times * 2 + ( show || hide ? 1 : 0 ),
		speed = o.duration / anims,
		easing = o.easing,

		// utility:
		ref = ( direction === "up" || direction === "down" ) ? "top" : "left",
		motion = ( direction === "up" || direction === "left" ),
		i,
		upAnim,
		downAnim,

		// we will need to re-assemble the queue to stack our animations in place
		queue = el.queue(),
		queuelen = queue.length;

	// Avoid touching opacity to prevent clearType and PNG issues in IE
	if ( show || hide ) {
		props.push( "opacity" );
	}

	$.effects.save( el, props );
	el.show();
	$.effects.createWrapper( el ); // Create Wrapper

	// default distance for the BIGGEST bounce is the outer Distance / 3
	if ( !distance ) {
		distance = el[ ref === "top" ? "outerHeight" : "outerWidth" ]() / 3;
	}

	if ( show ) {
		downAnim = { opacity: 1 };
		downAnim[ ref ] = 0;

		// if we are showing, force opacity 0 and set the initial position
		// then do the "first" animation
		el.css( "opacity", 0 )
			.css( ref, motion ? -distance * 2 : distance * 2 )
			.animate( downAnim, speed, easing );
	}

	// start at the smallest distance if we are hiding
	if ( hide ) {
		distance = distance / Math.pow( 2, times - 1 );
	}

	downAnim = {};
	downAnim[ ref ] = 0;
	// Bounces up/down/left/right then back to 0 -- times * 2 animations happen here
	for ( i = 0; i < times; i++ ) {
		upAnim = {};
		upAnim[ ref ] = ( motion ? "-=" : "+=" ) + distance;

		el.animate( upAnim, speed, easing )
			.animate( downAnim, speed, easing );

		distance = hide ? distance * 2 : distance / 2;
	}

	// Last Bounce when Hiding
	if ( hide ) {
		upAnim = { opacity: 0 };
		upAnim[ ref ] = ( motion ? "-=" : "+=" ) + distance;

		el.animate( upAnim, speed, easing );
	}

	el.queue(function() {
		if ( hide ) {
			el.hide();
		}
		$.effects.restore( el, props );
		$.effects.removeWrapper( el );
		done();
	});

	// inject all the animations we just queued to be first in line (after "inprogress")
	if ( queuelen > 1) {
		queue.splice.apply( queue,
			[ 1, 0 ].concat( queue.splice( queuelen, anims + 1 ) ) );
	}
	el.dequeue();

};

})(jQuery);
(function( $, undefined ) {

$.effects.effect.clip = function( o, done ) {
	// Create element
	var el = $( this ),
		props = [ "position", "top", "bottom", "left", "right", "height", "width" ],
		mode = $.effects.setMode( el, o.mode || "hide" ),
		show = mode === "show",
		direction = o.direction || "vertical",
		vert = direction === "vertical",
		size = vert ? "height" : "width",
		position = vert ? "top" : "left",
		animation = {},
		wrapper, animate, distance;

	// Save & Show
	$.effects.save( el, props );
	el.show();

	// Create Wrapper
	wrapper = $.effects.createWrapper( el ).css({
		overflow: "hidden"
	});
	animate = ( el[0].tagName === "IMG" ) ? wrapper : el;
	distance = animate[ size ]();

	// Shift
	if ( show ) {
		animate.css( size, 0 );
		animate.css( position, distance / 2 );
	}

	// Create Animation Object:
	animation[ size ] = show ? distance : 0;
	animation[ position ] = show ? 0 : distance / 2;

	// Animate
	animate.animate( animation, {
		queue: false,
		duration: o.duration,
		easing: o.easing,
		complete: function() {
			if ( !show ) {
				el.hide();
			}
			$.effects.restore( el, props );
			$.effects.removeWrapper( el );
			done();
		}
	});

};

})(jQuery);
(function( $, undefined ) {

$.effects.effect.drop = function( o, done ) {

	var el = $( this ),
		props = [ "position", "top", "bottom", "left", "right", "opacity", "height", "width" ],
		mode = $.effects.setMode( el, o.mode || "hide" ),
		show = mode === "show",
		direction = o.direction || "left",
		ref = ( direction === "up" || direction === "down" ) ? "top" : "left",
		motion = ( direction === "up" || direction === "left" ) ? "pos" : "neg",
		animation = {
			opacity: show ? 1 : 0
		},
		distance;

	// Adjust
	$.effects.save( el, props );
	el.show();
	$.effects.createWrapper( el );

	distance = o.distance || el[ ref === "top" ? "outerHeight": "outerWidth" ]( true ) / 2;

	if ( show ) {
		el
			.css( "opacity", 0 )
			.css( ref, motion === "pos" ? -distance : distance );
	}

	// Animation
	animation[ ref ] = ( show ?
		( motion === "pos" ? "+=" : "-=" ) :
		( motion === "pos" ? "-=" : "+=" ) ) +
		distance;

	// Animate
	el.animate( animation, {
		queue: false,
		duration: o.duration,
		easing: o.easing,
		complete: function() {
			if ( mode === "hide" ) {
				el.hide();
			}
			$.effects.restore( el, props );
			$.effects.removeWrapper( el );
			done();
		}
	});
};

})(jQuery);
(function( $, undefined ) {

$.effects.effect.explode = function( o, done ) {

	var rows = o.pieces ? Math.round( Math.sqrt( o.pieces ) ) : 3,
		cells = rows,
		el = $( this ),
		mode = $.effects.setMode( el, o.mode || "hide" ),
		show = mode === "show",

		// show and then visibility:hidden the element before calculating offset
		offset = el.show().css( "visibility", "hidden" ).offset(),

		// width and height of a piece
		width = Math.ceil( el.outerWidth() / cells ),
		height = Math.ceil( el.outerHeight() / rows ),
		pieces = [],

		// loop
		i, j, left, top, mx, my;

	// children animate complete:
	function childComplete() {
		pieces.push( this );
		if ( pieces.length === rows * cells ) {
			animComplete();
		}
	}

	// clone the element for each row and cell.
	for( i = 0; i < rows ; i++ ) { // ===>
		top = offset.top + i * height;
		my = i - ( rows - 1 ) / 2 ;

		for( j = 0; j < cells ; j++ ) { // |||
			left = offset.left + j * width;
			mx = j - ( cells - 1 ) / 2 ;

			// Create a clone of the now hidden main element that will be absolute positioned
			// within a wrapper div off the -left and -top equal to size of our pieces
			el
				.clone()
				.appendTo( "body" )
				.wrap( "<div></div>" )
				.css({
					position: "absolute",
					visibility: "visible",
					left: -j * width,
					top: -i * height
				})

			// select the wrapper - make it overflow: hidden and absolute positioned based on
			// where the original was located +left and +top equal to the size of pieces
				.parent()
				.addClass( "ui-effects-explode" )
				.css({
					position: "absolute",
					overflow: "hidden",
					width: width,
					height: height,
					left: left + ( show ? mx * width : 0 ),
					top: top + ( show ? my * height : 0 ),
					opacity: show ? 0 : 1
				}).animate({
					left: left + ( show ? 0 : mx * width ),
					top: top + ( show ? 0 : my * height ),
					opacity: show ? 1 : 0
				}, o.duration || 500, o.easing, childComplete );
		}
	}

	function animComplete() {
		el.css({
			visibility: "visible"
		});
		$( pieces ).remove();
		if ( !show ) {
			el.hide();
		}
		done();
	}
};

})(jQuery);
(function( $, undefined ) {

$.effects.effect.fade = function( o, done ) {
	var el = $( this ),
		mode = $.effects.setMode( el, o.mode || "toggle" );

	el.animate({
		opacity: mode
	}, {
		queue: false,
		duration: o.duration,
		easing: o.easing,
		complete: done
	});
};

})( jQuery );
(function( $, undefined ) {

$.effects.effect.fold = function( o, done ) {

	// Create element
	var el = $( this ),
		props = [ "position", "top", "bottom", "left", "right", "height", "width" ],
		mode = $.effects.setMode( el, o.mode || "hide" ),
		show = mode === "show",
		hide = mode === "hide",
		size = o.size || 15,
		percent = /([0-9]+)%/.exec( size ),
		horizFirst = !!o.horizFirst,
		widthFirst = show !== horizFirst,
		ref = widthFirst ? [ "width", "height" ] : [ "height", "width" ],
		duration = o.duration / 2,
		wrapper, distance,
		animation1 = {},
		animation2 = {};

	$.effects.save( el, props );
	el.show();

	// Create Wrapper
	wrapper = $.effects.createWrapper( el ).css({
		overflow: "hidden"
	});
	distance = widthFirst ?
		[ wrapper.width(), wrapper.height() ] :
		[ wrapper.height(), wrapper.width() ];

	if ( percent ) {
		size = parseInt( percent[ 1 ], 10 ) / 100 * distance[ hide ? 0 : 1 ];
	}
	if ( show ) {
		wrapper.css( horizFirst ? {
			height: 0,
			width: size
		} : {
			height: size,
			width: 0
		});
	}

	// Animation
	animation1[ ref[ 0 ] ] = show ? distance[ 0 ] : size;
	animation2[ ref[ 1 ] ] = show ? distance[ 1 ] : 0;

	// Animate
	wrapper
		.animate( animation1, duration, o.easing )
		.animate( animation2, duration, o.easing, function() {
			if ( hide ) {
				el.hide();
			}
			$.effects.restore( el, props );
			$.effects.removeWrapper( el );
			done();
		});

};

})(jQuery);
(function( $, undefined ) {

$.effects.effect.highlight = function( o, done ) {
	var elem = $( this ),
		props = [ "backgroundImage", "backgroundColor", "opacity" ],
		mode = $.effects.setMode( elem, o.mode || "show" ),
		animation = {
			backgroundColor: elem.css( "backgroundColor" )
		};

	if (mode === "hide") {
		animation.opacity = 0;
	}

	$.effects.save( elem, props );

	elem
		.show()
		.css({
			backgroundImage: "none",
			backgroundColor: o.color || "#ffff99"
		})
		.animate( animation, {
			queue: false,
			duration: o.duration,
			easing: o.easing,
			complete: function() {
				if ( mode === "hide" ) {
					elem.hide();
				}
				$.effects.restore( elem, props );
				done();
			}
		});
};

})(jQuery);
(function( $, undefined ) {

$.effects.effect.pulsate = function( o, done ) {
	var elem = $( this ),
		mode = $.effects.setMode( elem, o.mode || "show" ),
		show = mode === "show",
		hide = mode === "hide",
		showhide = ( show || mode === "hide" ),

		// showing or hiding leaves of the "last" animation
		anims = ( ( o.times || 5 ) * 2 ) + ( showhide ? 1 : 0 ),
		duration = o.duration / anims,
		animateTo = 0,
		queue = elem.queue(),
		queuelen = queue.length,
		i;

	if ( show || !elem.is(":visible")) {
		elem.css( "opacity", 0 ).show();
		animateTo = 1;
	}

	// anims - 1 opacity "toggles"
	for ( i = 1; i < anims; i++ ) {
		elem.animate({
			opacity: animateTo
		}, duration, o.easing );
		animateTo = 1 - animateTo;
	}

	elem.animate({
		opacity: animateTo
	}, duration, o.easing);

	elem.queue(function() {
		if ( hide ) {
			elem.hide();
		}
		done();
	});

	// We just queued up "anims" animations, we need to put them next in the queue
	if ( queuelen > 1 ) {
		queue.splice.apply( queue,
			[ 1, 0 ].concat( queue.splice( queuelen, anims + 1 ) ) );
	}
	elem.dequeue();
};

})(jQuery);
(function( $, undefined ) {

$.effects.effect.puff = function( o, done ) {
	var elem = $( this ),
		mode = $.effects.setMode( elem, o.mode || "hide" ),
		hide = mode === "hide",
		percent = parseInt( o.percent, 10 ) || 150,
		factor = percent / 100,
		original = {
			height: elem.height(),
			width: elem.width(),
			outerHeight: elem.outerHeight(),
			outerWidth: elem.outerWidth()
		};

	$.extend( o, {
		effect: "scale",
		queue: false,
		fade: true,
		mode: mode,
		complete: done,
		percent: hide ? percent : 100,
		from: hide ?
			original :
			{
				height: original.height * factor,
				width: original.width * factor,
				outerHeight: original.outerHeight * factor,
				outerWidth: original.outerWidth * factor
			}
	});

	elem.effect( o );
};

$.effects.effect.scale = function( o, done ) {

	// Create element
	var el = $( this ),
		options = $.extend( true, {}, o ),
		mode = $.effects.setMode( el, o.mode || "effect" ),
		percent = parseInt( o.percent, 10 ) ||
			( parseInt( o.percent, 10 ) === 0 ? 0 : ( mode === "hide" ? 0 : 100 ) ),
		direction = o.direction || "both",
		origin = o.origin,
		original = {
			height: el.height(),
			width: el.width(),
			outerHeight: el.outerHeight(),
			outerWidth: el.outerWidth()
		},
		factor = {
			y: direction !== "horizontal" ? (percent / 100) : 1,
			x: direction !== "vertical" ? (percent / 100) : 1
		};

	// We are going to pass this effect to the size effect:
	options.effect = "size";
	options.queue = false;
	options.complete = done;

	// Set default origin and restore for show/hide
	if ( mode !== "effect" ) {
		options.origin = origin || ["middle","center"];
		options.restore = true;
	}

	options.from = o.from || ( mode === "show" ? {
		height: 0,
		width: 0,
		outerHeight: 0,
		outerWidth: 0
	} : original );
	options.to = {
		height: original.height * factor.y,
		width: original.width * factor.x,
		outerHeight: original.outerHeight * factor.y,
		outerWidth: original.outerWidth * factor.x
	};

	// Fade option to support puff
	if ( options.fade ) {
		if ( mode === "show" ) {
			options.from.opacity = 0;
			options.to.opacity = 1;
		}
		if ( mode === "hide" ) {
			options.from.opacity = 1;
			options.to.opacity = 0;
		}
	}

	// Animate
	el.effect( options );

};

$.effects.effect.size = function( o, done ) {

	// Create element
	var original, baseline, factor,
		el = $( this ),
		props0 = [ "position", "top", "bottom", "left", "right", "width", "height", "overflow", "opacity" ],

		// Always restore
		props1 = [ "position", "top", "bottom", "left", "right", "overflow", "opacity" ],

		// Copy for children
		props2 = [ "width", "height", "overflow" ],
		cProps = [ "fontSize" ],
		vProps = [ "borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom" ],
		hProps = [ "borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight" ],

		// Set options
		mode = $.effects.setMode( el, o.mode || "effect" ),
		restore = o.restore || mode !== "effect",
		scale = o.scale || "both",
		origin = o.origin || [ "middle", "center" ],
		position = el.css( "position" ),
		props = restore ? props0 : props1,
		zero = {
			height: 0,
			width: 0,
			outerHeight: 0,
			outerWidth: 0
		};

	if ( mode === "show" ) {
		el.show();
	}
	original = {
		height: el.height(),
		width: el.width(),
		outerHeight: el.outerHeight(),
		outerWidth: el.outerWidth()
	};

	if ( o.mode === "toggle" && mode === "show" ) {
		el.from = o.to || zero;
		el.to = o.from || original;
	} else {
		el.from = o.from || ( mode === "show" ? zero : original );
		el.to = o.to || ( mode === "hide" ? zero : original );
	}

	// Set scaling factor
	factor = {
		from: {
			y: el.from.height / original.height,
			x: el.from.width / original.width
		},
		to: {
			y: el.to.height / original.height,
			x: el.to.width / original.width
		}
	};

	// Scale the css box
	if ( scale === "box" || scale === "both" ) {

		// Vertical props scaling
		if ( factor.from.y !== factor.to.y ) {
			props = props.concat( vProps );
			el.from = $.effects.setTransition( el, vProps, factor.from.y, el.from );
			el.to = $.effects.setTransition( el, vProps, factor.to.y, el.to );
		}

		// Horizontal props scaling
		if ( factor.from.x !== factor.to.x ) {
			props = props.concat( hProps );
			el.from = $.effects.setTransition( el, hProps, factor.from.x, el.from );
			el.to = $.effects.setTransition( el, hProps, factor.to.x, el.to );
		}
	}

	// Scale the content
	if ( scale === "content" || scale === "both" ) {

		// Vertical props scaling
		if ( factor.from.y !== factor.to.y ) {
			props = props.concat( cProps ).concat( props2 );
			el.from = $.effects.setTransition( el, cProps, factor.from.y, el.from );
			el.to = $.effects.setTransition( el, cProps, factor.to.y, el.to );
		}
	}

	$.effects.save( el, props );
	el.show();
	$.effects.createWrapper( el );
	el.css( "overflow", "hidden" ).css( el.from );

	// Adjust
	if (origin) { // Calculate baseline shifts
		baseline = $.effects.getBaseline( origin, original );
		el.from.top = ( original.outerHeight - el.outerHeight() ) * baseline.y;
		el.from.left = ( original.outerWidth - el.outerWidth() ) * baseline.x;
		el.to.top = ( original.outerHeight - el.to.outerHeight ) * baseline.y;
		el.to.left = ( original.outerWidth - el.to.outerWidth ) * baseline.x;
	}
	el.css( el.from ); // set top & left

	// Animate
	if ( scale === "content" || scale === "both" ) { // Scale the children

		// Add margins/font-size
		vProps = vProps.concat([ "marginTop", "marginBottom" ]).concat(cProps);
		hProps = hProps.concat([ "marginLeft", "marginRight" ]);
		props2 = props0.concat(vProps).concat(hProps);

		el.find( "*[width]" ).each( function(){
			var child = $( this ),
				c_original = {
					height: child.height(),
					width: child.width(),
					outerHeight: child.outerHeight(),
					outerWidth: child.outerWidth()
				};
			if (restore) {
				$.effects.save(child, props2);
			}

			child.from = {
				height: c_original.height * factor.from.y,
				width: c_original.width * factor.from.x,
				outerHeight: c_original.outerHeight * factor.from.y,
				outerWidth: c_original.outerWidth * factor.from.x
			};
			child.to = {
				height: c_original.height * factor.to.y,
				width: c_original.width * factor.to.x,
				outerHeight: c_original.height * factor.to.y,
				outerWidth: c_original.width * factor.to.x
			};

			// Vertical props scaling
			if ( factor.from.y !== factor.to.y ) {
				child.from = $.effects.setTransition( child, vProps, factor.from.y, child.from );
				child.to = $.effects.setTransition( child, vProps, factor.to.y, child.to );
			}

			// Horizontal props scaling
			if ( factor.from.x !== factor.to.x ) {
				child.from = $.effects.setTransition( child, hProps, factor.from.x, child.from );
				child.to = $.effects.setTransition( child, hProps, factor.to.x, child.to );
			}

			// Animate children
			child.css( child.from );
			child.animate( child.to, o.duration, o.easing, function() {

				// Restore children
				if ( restore ) {
					$.effects.restore( child, props2 );
				}
			});
		});
	}

	// Animate
	el.animate( el.to, {
		queue: false,
		duration: o.duration,
		easing: o.easing,
		complete: function() {
			if ( el.to.opacity === 0 ) {
				el.css( "opacity", el.from.opacity );
			}
			if( mode === "hide" ) {
				el.hide();
			}
			$.effects.restore( el, props );
			if ( !restore ) {

				// we need to calculate our new positioning based on the scaling
				if ( position === "static" ) {
					el.css({
						position: "relative",
						top: el.to.top,
						left: el.to.left
					});
				} else {
					$.each([ "top", "left" ], function( idx, pos ) {
						el.css( pos, function( _, str ) {
							var val = parseInt( str, 10 ),
								toRef = idx ? el.to.left : el.to.top;

							// if original was "auto", recalculate the new value from wrapper
							if ( str === "auto" ) {
								return toRef + "px";
							}

							return val + toRef + "px";
						});
					});
				}
			}

			$.effects.removeWrapper( el );
			done();
		}
	});

};

})(jQuery);
(function( $, undefined ) {

$.effects.effect.shake = function( o, done ) {

	var el = $( this ),
		props = [ "position", "top", "bottom", "left", "right", "height", "width" ],
		mode = $.effects.setMode( el, o.mode || "effect" ),
		direction = o.direction || "left",
		distance = o.distance || 20,
		times = o.times || 3,
		anims = times * 2 + 1,
		speed = Math.round(o.duration/anims),
		ref = (direction === "up" || direction === "down") ? "top" : "left",
		positiveMotion = (direction === "up" || direction === "left"),
		animation = {},
		animation1 = {},
		animation2 = {},
		i,

		// we will need to re-assemble the queue to stack our animations in place
		queue = el.queue(),
		queuelen = queue.length;

	$.effects.save( el, props );
	el.show();
	$.effects.createWrapper( el );

	// Animation
	animation[ ref ] = ( positiveMotion ? "-=" : "+=" ) + distance;
	animation1[ ref ] = ( positiveMotion ? "+=" : "-=" ) + distance * 2;
	animation2[ ref ] = ( positiveMotion ? "-=" : "+=" ) + distance * 2;

	// Animate
	el.animate( animation, speed, o.easing );

	// Shakes
	for ( i = 1; i < times; i++ ) {
		el.animate( animation1, speed, o.easing ).animate( animation2, speed, o.easing );
	}
	el
		.animate( animation1, speed, o.easing )
		.animate( animation, speed / 2, o.easing )
		.queue(function() {
			if ( mode === "hide" ) {
				el.hide();
			}
			$.effects.restore( el, props );
			$.effects.removeWrapper( el );
			done();
		});

	// inject all the animations we just queued to be first in line (after "inprogress")
	if ( queuelen > 1) {
		queue.splice.apply( queue,
			[ 1, 0 ].concat( queue.splice( queuelen, anims + 1 ) ) );
	}
	el.dequeue();

};

})(jQuery);
(function( $, undefined ) {

$.effects.effect.slide = function( o, done ) {

	// Create element
	var el = $( this ),
		props = [ "position", "top", "bottom", "left", "right", "width", "height" ],
		mode = $.effects.setMode( el, o.mode || "show" ),
		show = mode === "show",
		direction = o.direction || "left",
		ref = (direction === "up" || direction === "down") ? "top" : "left",
		positiveMotion = (direction === "up" || direction === "left"),
		distance,
		animation = {};

	// Adjust
	$.effects.save( el, props );
	el.show();
	distance = o.distance || el[ ref === "top" ? "outerHeight" : "outerWidth" ]( true );

	$.effects.createWrapper( el ).css({
		overflow: "hidden"
	});

	if ( show ) {
		el.css( ref, positiveMotion ? (isNaN(distance) ? "-" + distance : -distance) : distance );
	}

	// Animation
	animation[ ref ] = ( show ?
		( positiveMotion ? "+=" : "-=") :
		( positiveMotion ? "-=" : "+=")) +
		distance;

	// Animate
	el.animate( animation, {
		queue: false,
		duration: o.duration,
		easing: o.easing,
		complete: function() {
			if ( mode === "hide" ) {
				el.hide();
			}
			$.effects.restore( el, props );
			$.effects.removeWrapper( el );
			done();
		}
	});
};

})(jQuery);
(function( $, undefined ) {

$.effects.effect.transfer = function( o, done ) {
	var elem = $( this ),
		target = $( o.to ),
		targetFixed = target.css( "position" ) === "fixed",
		body = $("body"),
		fixTop = targetFixed ? body.scrollTop() : 0,
		fixLeft = targetFixed ? body.scrollLeft() : 0,
		endPosition = target.offset(),
		animation = {
			top: endPosition.top - fixTop ,
			left: endPosition.left - fixLeft ,
			height: target.innerHeight(),
			width: target.innerWidth()
		},
		startPosition = elem.offset(),
		transfer = $( '<div class="ui-effects-transfer"></div>' )
			.appendTo( document.body )
			.addClass( o.className )
			.css({
				top: startPosition.top - fixTop ,
				left: startPosition.left - fixLeft ,
				height: elem.innerHeight(),
				width: elem.innerWidth(),
				position: targetFixed ? "fixed" : "absolute"
			})
			.animate( animation, o.duration, o.easing, function() {
				transfer.remove();
				done();
			});
};

})(jQuery);

// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
/**
 * @license jqGrid  4.5.4 - jQuery Grid
 * Copyright (c) 2008, Tony Tomov, tony@trirand.com
 * Dual licensed under the MIT and GPL licenses
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 * Date: 2013-10-06
 */
//jsHint options
/*jshint evil:true, eqeqeq:false, eqnull:true, devel:true */
/*global jQuery */

(function ($) {
"use strict";
$.jgrid = $.jgrid || {};
$.extend($.jgrid,{
	version : "4.5.4",
	htmlDecode : function(value){
		if(value && (value==='&nbsp;' || value==='&#160;' || (value.length===1 && value.charCodeAt(0)===160))) { return "";}
		return !value ? value : String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");		
	},
	htmlEncode : function (value){
		return !value ? value : String(value).replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	},
	format : function(format){ //jqgformat
		var args = $.makeArray(arguments).slice(1);
		if(format==null) { format = ""; }
		return format.replace(/\{(\d+)\}/g, function(m, i){
			return args[i];
		});
	},
	msie : navigator.appName === 'Microsoft Internet Explorer',
	msiever : function () {
		var rv = -1;
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null) {
			rv = parseFloat( RegExp.$1 );
		}
		return rv;
	},
	getCellIndex : function (cell) {
		var c = $(cell);
		if (c.is('tr')) { return -1; }
		c = (!c.is('td') && !c.is('th') ? c.closest("td,th") : c)[0];
		if ($.jgrid.msie) { return $.inArray(c, c.parentNode.cells); }
		return c.cellIndex;
	},
	stripHtml : function(v) {
		v = String(v);
		var regexp = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
		if (v) {
			v = v.replace(regexp,"");
			return (v && v !== '&nbsp;' && v !== '&#160;') ? v.replace(/\"/g,"'") : "";
		} 
			return v;
	},
	stripPref : function (pref, id) {
		var obj = $.type( pref );
		if( obj === "string" || obj === "number") {
			pref =  String(pref);
			id = pref !== "" ? String(id).replace(String(pref), "") : id;
		}
		return id;
	},
	parse : function(jsonString) {
		var js = jsonString;
		if (js.substr(0,9) === "while(1);") { js = js.substr(9); }
		if (js.substr(0,2) === "/*") { js = js.substr(2,js.length-4); }
		if(!js) { js = "{}"; }
		return ($.jgrid.useJSON===true && typeof JSON === 'object' && typeof JSON.parse === 'function') ?
			JSON.parse(js) :
			eval('(' + js + ')');
	},
	parseDate : function(format, date, newformat, opts) {
		var	token = /\\.|[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		msDateRegExp = new RegExp("^\/Date\\((([-+])?[0-9]+)(([-+])([0-9]{2})([0-9]{2}))?\\)\/$"),
		msMatch = ((typeof date === 'string') ? date.match(msDateRegExp): null),
		pad = function (value, length) {
			value = String(value);
			length = parseInt(length,10) || 2;
			while (value.length < length)  { value = '0' + value; }
			return value;
		},
		ts = {m : 1, d : 1, y : 1970, h : 0, i : 0, s : 0, u:0},
		timestamp=0, dM, k,hl,
		h12to24 = function(ampm, h){
			if (ampm === 0){ if (h === 12) { h = 0;} }
			else { if (h !== 12) { h += 12; } }
			return h;
		};
		if(opts === undefined) {
			opts = $.jgrid.formatter.date;
		}
		// old lang files
		if(opts.parseRe === undefined ) {
			opts.parseRe = /[Tt\\\/:_;.,\t\s-]/;
		}
		if( opts.masks.hasOwnProperty(format) ) { format = opts.masks[format]; }
		if(date && date != null) {
			if( !isNaN( date - 0 ) && String(format).toLowerCase() === "u") {
				//Unix timestamp
				timestamp = new Date( parseFloat(date)*1000 );
			} else if(date.constructor === Date) {
				timestamp = date;
				// Microsoft date format support
			} else if( msMatch !== null ) {
				timestamp = new Date(parseInt(msMatch[1], 10));
				if (msMatch[3]) {
					var offset = Number(msMatch[5]) * 60 + Number(msMatch[6]);
					offset *= ((msMatch[4] === '-') ? 1 : -1);
					offset -= timestamp.getTimezoneOffset();
					timestamp.setTime(Number(Number(timestamp) + (offset * 60 * 1000)));
				}
			} else {
				date = String(date).replace(/\\T/g,"T").replace(/\\t/,"t").split(opts.parseRe);
				format = format.replace(/\\T/g,"T").replace(/\\t/,"t").split(opts.parseRe);
				// parsing for month names
				for(k=0,hl=format.length;k<hl;k++){
					if(format[k] === 'M') {
						dM = $.inArray(date[k],opts.monthNames);
						if(dM !== -1 && dM < 12){date[k] = dM+1; ts.m = date[k];}
					}
					if(format[k] === 'F') {
						dM = $.inArray(date[k],opts.monthNames,12);
						if(dM !== -1 && dM > 11){date[k] = dM+1-12; ts.m = date[k];}
					}
					if(format[k] === 'a') {
						dM = $.inArray(date[k],opts.AmPm);
						if(dM !== -1 && dM < 2 && date[k] === opts.AmPm[dM]){
							date[k] = dM;
							ts.h = h12to24(date[k], ts.h);
						}
					}
					if(format[k] === 'A') {
						dM = $.inArray(date[k],opts.AmPm);
						if(dM !== -1 && dM > 1 && date[k] === opts.AmPm[dM]){
							date[k] = dM-2;
							ts.h = h12to24(date[k], ts.h);
						}
					}
					if (format[k] === 'g') {
						ts.h = parseInt(date[k], 10);
					}
					if(date[k] !== undefined) {
						ts[format[k].toLowerCase()] = parseInt(date[k],10);
					}
				}
				if(ts.f) {ts.m = ts.f;}
				if( ts.m === 0 && ts.y === 0 && ts.d === 0) {
					return "&#160;" ;
				}
				ts.m = parseInt(ts.m,10)-1;
				var ty = ts.y;
				if (ty >= 70 && ty <= 99) {ts.y = 1900+ts.y;}
				else if (ty >=0 && ty <=69) {ts.y= 2000+ts.y;}
				timestamp = new Date(ts.y, ts.m, ts.d, ts.h, ts.i, ts.s, ts.u);
			}
		} else {
			timestamp = new Date(ts.y, ts.m, ts.d, ts.h, ts.i, ts.s, ts.u);
		}
		if( newformat === undefined ) {
			return timestamp;
		}
		if( opts.masks.hasOwnProperty(newformat) )  {
			newformat = opts.masks[newformat];
		} else if ( !newformat ) {
			newformat = 'Y-m-d';
		}
		var 
			G = timestamp.getHours(),
			i = timestamp.getMinutes(),
			j = timestamp.getDate(),
			n = timestamp.getMonth() + 1,
			o = timestamp.getTimezoneOffset(),
			s = timestamp.getSeconds(),
			u = timestamp.getMilliseconds(),
			w = timestamp.getDay(),
			Y = timestamp.getFullYear(),
			N = (w + 6) % 7 + 1,
			z = (new Date(Y, n - 1, j) - new Date(Y, 0, 1)) / 86400000,
			flags = {
				// Day
				d: pad(j),
				D: opts.dayNames[w],
				j: j,
				l: opts.dayNames[w + 7],
				N: N,
				S: opts.S(j),
				//j < 11 || j > 13 ? ['st', 'nd', 'rd', 'th'][Math.min((j - 1) % 10, 3)] : 'th',
				w: w,
				z: z,
				// Week
				W: N < 5 ? Math.floor((z + N - 1) / 7) + 1 : Math.floor((z + N - 1) / 7) || ((new Date(Y - 1, 0, 1).getDay() + 6) % 7 < 4 ? 53 : 52),
				// Month
				F: opts.monthNames[n - 1 + 12],
				m: pad(n),
				M: opts.monthNames[n - 1],
				n: n,
				t: '?',
				// Year
				L: '?',
				o: '?',
				Y: Y,
				y: String(Y).substring(2),
				// Time
				a: G < 12 ? opts.AmPm[0] : opts.AmPm[1],
				A: G < 12 ? opts.AmPm[2] : opts.AmPm[3],
				B: '?',
				g: G % 12 || 12,
				G: G,
				h: pad(G % 12 || 12),
				H: pad(G),
				i: pad(i),
				s: pad(s),
				u: u,
				// Timezone
				e: '?',
				I: '?',
				O: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				P: '?',
				T: (String(timestamp).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				Z: '?',
				// Full Date/Time
				c: '?',
				r: '?',
				U: Math.floor(timestamp / 1000)
			};
		return newformat.replace(token, function ($0) {
			return flags.hasOwnProperty($0) ? flags[$0] : $0.substring(1);
		});
	},
	jqID : function(sid){
		return String(sid).replace(/[!"#$%&'()*+,.\/:; <=>?@\[\\\]\^`{|}~]/g,"\\$&");
	},
	guid : 1,
	uidPref: 'jqg',
	randId : function( prefix )	{
		return (prefix || $.jgrid.uidPref) + ($.jgrid.guid++);
	},
	getAccessor : function(obj, expr) {
		var ret,p,prm = [], i;
		if( typeof expr === 'function') { return expr(obj); }
		ret = obj[expr];
		if(ret===undefined) {
			try {
				if ( typeof expr === 'string' ) {
					prm = expr.split('.');
				}
				i = prm.length;
				if( i ) {
					ret = obj;
					while (ret && i--) {
						p = prm.shift();
						ret = ret[p];
					}
				}
			} catch (e) {}
		}
		return ret;
	},
	getXmlData: function (obj, expr, returnObj) {
		var ret, m = typeof expr === 'string' ? expr.match(/^(.*)\[(\w+)\]$/) : null;
		if (typeof expr === 'function') { return expr(obj); }
		if (m && m[2]) {
			// m[2] is the attribute selector
			// m[1] is an optional element selector
			// examples: "[id]", "rows[page]"
			return m[1] ? $(m[1], obj).attr(m[2]) : $(obj).attr(m[2]);
		}
			ret = $(expr, obj);
			if (returnObj) { return ret; }
			//$(expr, obj).filter(':last'); // we use ':last' to be more compatible with old version of jqGrid
			return ret.length > 0 ? $(ret).text() : undefined;
	},
	cellWidth : function () {
		var $testDiv = $("<div class='ui-jqgrid' style='left:10000px'><table class='ui-jqgrid-btable' style='width:5px;'><tr class='jqgrow'><td style='width:5px;display:block;'></td></tr></table></div>"),
		testCell = $testDiv.appendTo("body")
			.find("td")
			.width();
		$testDiv.remove();
		return Math.abs(testCell-5) > 0.1;
	},
	cell_width : true,
	ajaxOptions: {},
	from : function(source){
		// Original Author Hugo Bonacci
		// License MIT http://jlinq.codeplex.com/license
		var QueryObject=function(d,q){
		if(typeof d==="string"){
			d=$.data(d);
		}
		var self=this,
		_data=d,
		_usecase=true,
		_trim=false,
		_query=q,
		_stripNum = /[\$,%]/g,
		_lastCommand=null,
		_lastField=null,
		_orDepth=0,
		_negate=false,
		_queuedOperator="",
		_sorting=[],
		_useProperties=true;
		if(typeof d==="object"&&d.push) {
			if(d.length>0){
				if(typeof d[0]!=="object"){
					_useProperties=false;
				}else{
					_useProperties=true;
				}
			}
		}else{
			throw "data provides is not an array";
		}
		this._hasData=function(){
			return _data===null?false:_data.length===0?false:true;
		};
		this._getStr=function(s){
			var phrase=[];
			if(_trim){
				phrase.push("jQuery.trim(");
			}
			phrase.push("String("+s+")");
			if(_trim){
				phrase.push(")");
			}
			if(!_usecase){
				phrase.push(".toLowerCase()");
			}
			return phrase.join("");
		};
		this._strComp=function(val){
			if(typeof val==="string"){
				return".toString()";
			}
			return"";
		};
		this._group=function(f,u){
			return({field:f.toString(),unique:u,items:[]});
		};
		this._toStr=function(phrase){
			if(_trim){
				phrase=$.trim(phrase);
			}
			phrase=phrase.toString().replace(/\\/g,'\\\\').replace(/\"/g,'\\"');
			return _usecase ? phrase : phrase.toLowerCase();
		};
		this._funcLoop=function(func){
			var results=[];
			$.each(_data,function(i,v){
				results.push(func(v));
			});
			return results;
		};
		this._append=function(s){
			var i;
			if(_query===null){
				_query="";
			} else {
				_query+=_queuedOperator === "" ? " && " :_queuedOperator;
			}
			for (i=0;i<_orDepth;i++){
				_query+="(";
			}
			if(_negate){
				_query+="!";
			}
			_query+="("+s+")";
			_negate=false;
			_queuedOperator="";
			_orDepth=0;
		};
		this._setCommand=function(f,c){
			_lastCommand=f;
			_lastField=c;
		};
		this._resetNegate=function(){
			_negate=false;
		};
		this._repeatCommand=function(f,v){
			if(_lastCommand===null){
				return self;
			}
			if(f!==null&&v!==null){
				return _lastCommand(f,v);
			}
			if(_lastField===null){
				return _lastCommand(f);
			}
			if(!_useProperties){
				return _lastCommand(f);
			}
			return _lastCommand(_lastField,f);
		};
		this._equals=function(a,b){
			return(self._compare(a,b,1)===0);
		};
		this._compare=function(a,b,d){
			var toString = Object.prototype.toString;
			if( d === undefined) { d = 1; }
			if(a===undefined) { a = null; }
			if(b===undefined) { b = null; }
			if(a===null && b===null){
				return 0;
			}
			if(a===null&&b!==null){
				return 1;
			}
			if(a!==null&&b===null){
				return -1;
			}
			if (toString.call(a) === '[object Date]' && toString.call(b) === '[object Date]') {
				if (a < b) { return -d; }
				if (a > b) { return d; }
				return 0;
			}
			if(!_usecase && typeof a !== "number" && typeof b !== "number" ) {
				a=String(a);
				b=String(b);
			}
			if(a<b){return -d;}
			if(a>b){return d;}
			return 0;
		};
		this._performSort=function(){
			if(_sorting.length===0){return;}
			_data=self._doSort(_data,0);
		};
		this._doSort=function(d,q){
			var by=_sorting[q].by,
			dir=_sorting[q].dir,
			type = _sorting[q].type,
			dfmt = _sorting[q].datefmt;
			if(q===_sorting.length-1){
				return self._getOrder(d, by, dir, type, dfmt);
			}
			q++;
			var values=self._getGroup(d,by,dir,type,dfmt), results=[], i, j, sorted;
			for(i=0;i<values.length;i++){
				sorted=self._doSort(values[i].items,q);
				for(j=0;j<sorted.length;j++){
					results.push(sorted[j]);
				}
			}
			return results;
		};
		this._getOrder=function(data,by,dir,type, dfmt){
			var sortData=[],_sortData=[], newDir = dir==="a" ? 1 : -1, i,ab,j,
			findSortKey;

			if(type === undefined ) { type = "text"; }
			if (type === 'float' || type=== 'number' || type=== 'currency' || type=== 'numeric') {
				findSortKey = function($cell) {
					var key = parseFloat( String($cell).replace(_stripNum, ''));
					return isNaN(key) ? 0.00 : key;
				};
			} else if (type==='int' || type==='integer') {
				findSortKey = function($cell) {
					return $cell ? parseFloat(String($cell).replace(_stripNum, '')) : 0;
				};
			} else if(type === 'date' || type === 'datetime') {
				findSortKey = function($cell) {
					return $.jgrid.parseDate(dfmt,$cell).getTime();
				};
			} else if($.isFunction(type)) {
				findSortKey = type;
			} else {
				findSortKey = function($cell) {
					$cell = $cell ? $.trim(String($cell)) : "";
					return _usecase ? $cell : $cell.toLowerCase();
				};
			}
			$.each(data,function(i,v){
				ab = by!=="" ? $.jgrid.getAccessor(v,by) : v;
				if(ab === undefined) { ab = ""; }
				ab = findSortKey(ab, v);
				_sortData.push({ 'vSort': ab,'index':i});
			});

			_sortData.sort(function(a,b){
				a = a.vSort;
				b = b.vSort;
				return self._compare(a,b,newDir);
			});
			j=0;
			var nrec= data.length;
			// overhead, but we do not change the original data.
			while(j<nrec) {
				i = _sortData[j].index;
				sortData.push(data[i]);
				j++;
			}
			return sortData;
		};
		this._getGroup=function(data,by,dir,type, dfmt){
			var results=[],
			group=null,
			last=null, val;
			$.each(self._getOrder(data,by,dir,type, dfmt),function(i,v){
				val = $.jgrid.getAccessor(v, by);
				if(val == null) { val = ""; }
				if(!self._equals(last,val)){
					last=val;
					if(group !== null){
						results.push(group);
					}
					group=self._group(by,val);
				}
				group.items.push(v);
			});
			if(group !== null){
				results.push(group);
			}
			return results;
		};
		this.ignoreCase=function(){
			_usecase=false;
			return self;
		};
		this.useCase=function(){
			_usecase=true;
			return self;
		};
		this.trim=function(){
			_trim=true;
			return self;
		};
		this.noTrim=function(){
			_trim=false;
			return self;
		};
		this.execute=function(){
			var match=_query, results=[];
			if(match === null){
				return self;
			}
			$.each(_data,function(){
				if(eval(match)){results.push(this);}
			});
			_data=results;
			return self;
		};
		this.data=function(){
			return _data;
		};
		this.select=function(f){
			self._performSort();
			if(!self._hasData()){ return[]; }
			self.execute();
			if($.isFunction(f)){
				var results=[];
				$.each(_data,function(i,v){
					results.push(f(v));
				});
				return results;
			}
			return _data;
		};
		this.hasMatch=function(){
			if(!self._hasData()) { return false; }
			self.execute();
			return _data.length>0;
		};
		this.andNot=function(f,v,x){
			_negate=!_negate;
			return self.and(f,v,x);
		};
		this.orNot=function(f,v,x){
			_negate=!_negate;
			return self.or(f,v,x);
		};
		this.not=function(f,v,x){
			return self.andNot(f,v,x);
		};
		this.and=function(f,v,x){
			_queuedOperator=" && ";
			if(f===undefined){
				return self;
			}
			return self._repeatCommand(f,v,x);
		};
		this.or=function(f,v,x){
			_queuedOperator=" || ";
			if(f===undefined) { return self; }
			return self._repeatCommand(f,v,x);
		};
		this.orBegin=function(){
			_orDepth++;
			return self;
		};
		this.orEnd=function(){
			if (_query !== null){
				_query+=")";
			}
			return self;
		};
		this.isNot=function(f){
			_negate=!_negate;
			return self.is(f);
		};
		this.is=function(f){
			self._append('this.'+f);
			self._resetNegate();
			return self;
		};
		this._compareValues=function(func,f,v,how,t){
			var fld;
			if(_useProperties){
				fld='jQuery.jgrid.getAccessor(this,\''+f+'\')';
			}else{
				fld='this';
			}
			if(v===undefined) { v = null; }
			//var val=v===null?f:v,
			var val =v,
			swst = t.stype === undefined ? "text" : t.stype;
			if(v !== null) {
			switch(swst) {
				case 'int':
				case 'integer':
					val = (isNaN(Number(val)) || val==="") ? '0' : val; // To be fixed with more inteligent code
					fld = 'parseInt('+fld+',10)';
					val = 'parseInt('+val+',10)';
					break;
				case 'float':
				case 'number':
				case 'numeric':
					val = String(val).replace(_stripNum, '');
					val = (isNaN(Number(val)) || val==="") ? '0' : val; // To be fixed with more inteligent code
					fld = 'parseFloat('+fld+')';
					val = 'parseFloat('+val+')';
					break;
				case 'date':
				case 'datetime':
					val = String($.jgrid.parseDate(t.newfmt || 'Y-m-d',val).getTime());
					fld = 'jQuery.jgrid.parseDate("'+t.srcfmt+'",'+fld+').getTime()';
					break;
				default :
					fld=self._getStr(fld);
					val=self._getStr('"'+self._toStr(val)+'"');
			}
			}
			self._append(fld+' '+how+' '+val);
			self._setCommand(func,f);
			self._resetNegate();
			return self;
		};
		this.equals=function(f,v,t){
			return self._compareValues(self.equals,f,v,"==",t);
		};
		this.notEquals=function(f,v,t){
			return self._compareValues(self.equals,f,v,"!==",t);
		};
		this.isNull = function(f,v,t){
			return self._compareValues(self.equals,f,null,"===",t);
		};
		this.greater=function(f,v,t){
			return self._compareValues(self.greater,f,v,">",t);
		};
		this.less=function(f,v,t){
			return self._compareValues(self.less,f,v,"<",t);
		};
		this.greaterOrEquals=function(f,v,t){
			return self._compareValues(self.greaterOrEquals,f,v,">=",t);
		};
		this.lessOrEquals=function(f,v,t){
			return self._compareValues(self.lessOrEquals,f,v,"<=",t);
		};
		this.startsWith=function(f,v){
			var val = (v==null) ? f: v,
			length=_trim ? $.trim(val.toString()).length : val.toString().length;
			if(_useProperties){
				self._append(self._getStr('jQuery.jgrid.getAccessor(this,\''+f+'\')')+'.substr(0,'+length+') == '+self._getStr('"'+self._toStr(v)+'"'));
			}else{
				length=_trim?$.trim(v.toString()).length:v.toString().length;
				self._append(self._getStr('this')+'.substr(0,'+length+') == '+self._getStr('"'+self._toStr(f)+'"'));
			}
			self._setCommand(self.startsWith,f);
			self._resetNegate();
			return self;
		};
		this.endsWith=function(f,v){
			var val = (v==null) ? f: v,
			length=_trim ? $.trim(val.toString()).length:val.toString().length;
			if(_useProperties){
				self._append(self._getStr('jQuery.jgrid.getAccessor(this,\''+f+'\')')+'.substr('+self._getStr('jQuery.jgrid.getAccessor(this,\''+f+'\')')+'.length-'+length+','+length+') == "'+self._toStr(v)+'"');
			} else {
				self._append(self._getStr('this')+'.substr('+self._getStr('this')+'.length-"'+self._toStr(f)+'".length,"'+self._toStr(f)+'".length) == "'+self._toStr(f)+'"');
			}
			self._setCommand(self.endsWith,f);self._resetNegate();
			return self;
		};
		this.contains=function(f,v){
			if(_useProperties){
				self._append(self._getStr('jQuery.jgrid.getAccessor(this,\''+f+'\')')+'.indexOf("'+self._toStr(v)+'",0) > -1');
			}else{
				self._append(self._getStr('this')+'.indexOf("'+self._toStr(f)+'",0) > -1');
			}
			self._setCommand(self.contains,f);
			self._resetNegate();
			return self;
		};
		this.groupBy=function(by,dir,type, datefmt){
			if(!self._hasData()){
				return null;
			}
			return self._getGroup(_data,by,dir,type, datefmt);
		};
		this.orderBy=function(by,dir,stype, dfmt){
			dir = dir == null ? "a" :$.trim(dir.toString().toLowerCase());
			if(stype == null) { stype = "text"; }
			if(dfmt == null) { dfmt = "Y-m-d"; }
			if(dir==="desc"||dir==="descending"){dir="d";}
			if(dir==="asc"||dir==="ascending"){dir="a";}
			_sorting.push({by:by,dir:dir,type:stype, datefmt: dfmt});
			return self;
		};
		return self;
		};
	return new QueryObject(source,null);
	},
	getMethod: function (name) {
        return this.getAccessor($.fn.jqGrid, name);
	},
	extend : function(methods) {
		$.extend($.fn.jqGrid,methods);
		if (!this.no_legacy_api) {
			$.fn.extend(methods);
		}
	}
});

$.fn.jqGrid = function( pin ) {
	if (typeof pin === 'string') {
		var fn = $.jgrid.getMethod(pin);
		if (!fn) {
			throw ("jqGrid - No such method: " + pin);
		}
		var args = $.makeArray(arguments).slice(1);
		return fn.apply(this,args);
	}
	return this.each( function() {
		if(this.grid) {return;}

		var p = $.extend(true,{
			url: "",
			height: 150,
			page: 1,
			rowNum: 20,
			rowTotal : null,
			records: 0,
			pager: "",
			pgbuttons: true,
			pginput: true,
			colModel: [],
			rowList: [],
			colNames: [],
			sortorder: "asc",
			sortname: "",
			datatype: "xml",
			mtype: "GET",
			altRows: false,
			selarrrow: [],
			savedRow: [],
			shrinkToFit: true,
			xmlReader: {},
			jsonReader: {},
			subGrid: false,
			subGridModel :[],
			reccount: 0,
			lastpage: 0,
			lastsort: 0,
			selrow: null,
			beforeSelectRow: null,
			onSelectRow: null,
			onSortCol: null,
			ondblClickRow: null,
			onRightClickRow: null,
			onPaging: null,
			onSelectAll: null,
			onInitGrid : null,
			loadComplete: null,
			gridComplete: null,
			loadError: null,
			loadBeforeSend: null,
			afterInsertRow: null,
			beforeRequest: null,
			beforeProcessing : null,
			onHeaderClick: null,
			viewrecords: false,
			loadonce: false,
			multiselect: false,
			multikey: false,
			editurl: null,
			search: false,
			caption: "",
			hidegrid: true,
			hiddengrid: false,
			postData: {},
			userData: {},
			treeGrid : false,
			treeGridModel : 'nested',
			treeReader : {},
			treeANode : -1,
			ExpandColumn: null,
			tree_root_level : 0,
			prmNames: {page:"page",rows:"rows", sort: "sidx",order: "sord", search:"_search", nd:"nd", id:"id",oper:"oper",editoper:"edit",addoper:"add",deloper:"del", subgridid:"id", npage: null, totalrows:"totalrows"},
			forceFit : false,
			gridstate : "visible",
			cellEdit: false,
			cellsubmit: "remote",
			nv:0,
			loadui: "enable",
			toolbar: [false,""],
			scroll: false,
			multiboxonly : false,
			deselectAfterSort : true,
			scrollrows : false,
			autowidth: false,
			scrollOffset :18,
			cellLayout: 5,
			subGridWidth: 20,
			multiselectWidth: 20,
			gridview: false,
			rownumWidth: 25,
			rownumbers : false,
			pagerpos: 'center',
			recordpos: 'right',
			footerrow : false,
			userDataOnFooter : false,
			hoverrows : true,
			altclass : 'ui-priority-secondary',
			viewsortcols : [false,'vertical',true],
			resizeclass : '',
			autoencode : false,
			remapColumns : [],
			ajaxGridOptions :{},
			direction : "ltr",
			toppager: false,
			headertitles: false,
			scrollTimeout: 40,
			data : [],
			_index : {},
			grouping : false,
			groupingView : {groupField:[],groupOrder:[], groupText:[],groupColumnShow:[],groupSummary:[], showSummaryOnHide: false, sortitems:[], sortnames:[], summary:[],summaryval:[], plusicon: 'ui-icon-circlesmall-plus', minusicon: 'ui-icon-circlesmall-minus', displayField: []},
			ignoreCase : false,
			cmTemplate : {},
			idPrefix : "",
			multiSort :  false
		}, $.jgrid.defaults, pin || {});
		var ts= this, grid={
			headers:[],
			cols:[],
			footers: [],
			dragStart: function(i,x,y) {
				var gridLeftPos = $(this.bDiv).offset().left;
				this.resizing = { idx: i, startX: x.clientX, sOL : x.clientX - gridLeftPos };
				this.hDiv.style.cursor = "col-resize";
				this.curGbox = $("#rs_m"+$.jgrid.jqID(p.id),"#gbox_"+$.jgrid.jqID(p.id));
				this.curGbox.css({display:"block",left:x.clientX-gridLeftPos,top:y[1],height:y[2]});
				$(ts).triggerHandler("jqGridResizeStart", [x, i]);
				if($.isFunction(p.resizeStart)) { p.resizeStart.call(ts,x,i); }
				document.onselectstart=function(){return false;};
			},
			dragMove: function(x) {
				if(this.resizing) {
					var diff = x.clientX-this.resizing.startX,
					h = this.headers[this.resizing.idx],
					newWidth = p.direction === "ltr" ? h.width + diff : h.width - diff, hn, nWn;
					if(newWidth > 33) {
						this.curGbox.css({left:this.resizing.sOL+diff});
						if(p.forceFit===true ){
							hn = this.headers[this.resizing.idx+p.nv];
							nWn = p.direction === "ltr" ? hn.width - diff : hn.width + diff;
							if(nWn >33) {
								h.newWidth = newWidth;
								hn.newWidth = nWn;
							}
						} else {
							this.newWidth = p.direction === "ltr" ? p.tblwidth+diff : p.tblwidth-diff;
							h.newWidth = newWidth;
						}
					}
				}
			},
			dragEnd: function() {
				this.hDiv.style.cursor = "default";
				if(this.resizing) {
					var idx = this.resizing.idx,
					nw = this.headers[idx].newWidth || this.headers[idx].width;
					nw = parseInt(nw,10);
					this.resizing = false;
					$("#rs_m"+$.jgrid.jqID(p.id)).css("display","none");
					p.colModel[idx].width = nw;
					this.headers[idx].width = nw;
					this.headers[idx].el.style.width = nw + "px";
					this.cols[idx].style.width = nw+"px";
					if(this.footers.length>0) {this.footers[idx].style.width = nw+"px";}
					if(p.forceFit===true){
						nw = this.headers[idx+p.nv].newWidth || this.headers[idx+p.nv].width;
						this.headers[idx+p.nv].width = nw;
						this.headers[idx+p.nv].el.style.width = nw + "px";
						this.cols[idx+p.nv].style.width = nw+"px";
						if(this.footers.length>0) {this.footers[idx+p.nv].style.width = nw+"px";}
						p.colModel[idx+p.nv].width = nw;
					} else {
						p.tblwidth = this.newWidth || p.tblwidth;
						$('table:first',this.bDiv).css("width",p.tblwidth+"px");
						$('table:first',this.hDiv).css("width",p.tblwidth+"px");
						this.hDiv.scrollLeft = this.bDiv.scrollLeft;
						if(p.footerrow) {
							$('table:first',this.sDiv).css("width",p.tblwidth+"px");
							this.sDiv.scrollLeft = this.bDiv.scrollLeft;
						}
					}
					$(ts).triggerHandler("jqGridResizeStop", [nw, idx]);
					if($.isFunction(p.resizeStop)) { p.resizeStop.call(ts,nw,idx); }
				}
				this.curGbox = null;
				document.onselectstart=function(){return true;};
			},
			populateVisible: function() {
				if (grid.timer) { clearTimeout(grid.timer); }
				grid.timer = null;
				var dh = $(grid.bDiv).height();
				if (!dh) { return; }
				var table = $("table:first", grid.bDiv);
				var rows, rh;
				if(table[0].rows.length) {
					try {
						rows = table[0].rows[1];
						rh = rows ? $(rows).outerHeight() || grid.prevRowHeight : grid.prevRowHeight;
					} catch (pv) {
						rh = grid.prevRowHeight;
					}
				}
				if (!rh) { return; }
				grid.prevRowHeight = rh;
				var rn = p.rowNum;
				var scrollTop = grid.scrollTop = grid.bDiv.scrollTop;
				var ttop = Math.round(table.position().top) - scrollTop;
				var tbot = ttop + table.height();
				var div = rh * rn;
				var page, npage, empty;
				if ( tbot < dh && ttop <= 0 &&
					(p.lastpage===undefined||parseInt((tbot + scrollTop + div - 1) / div,10) <= p.lastpage))
				{
					npage = parseInt((dh - tbot + div - 1) / div,10);
					if (tbot >= 0 || npage < 2 || p.scroll === true) {
						page = Math.round((tbot + scrollTop) / div) + 1;
						ttop = -1;
					} else {

						ttop = 1;
					}
				}
				if (ttop > 0) {
					page = parseInt(scrollTop / div,10) + 1;
					npage = parseInt((scrollTop + dh) / div,10) + 2 - page;
					empty = true;
				}
				if (npage) {
					if (p.lastpage && (page > p.lastpage || p.lastpage===1 || (page === p.page && page===p.lastpage)) ) {
						return;
					}
					if (grid.hDiv.loading) {
						grid.timer = setTimeout(grid.populateVisible, p.scrollTimeout);
					} else {
						p.page = page;
						if (empty) {
							grid.selectionPreserver(table[0]);
							grid.emptyRows.call(table[0], false, false);
						}
						grid.populate(npage);
					}
				}
			},
			scrollGrid: function( e ) {
				if(p.scroll) {
					var scrollTop = grid.bDiv.scrollTop;
					if(grid.scrollTop === undefined) { grid.scrollTop = 0; }
					if (scrollTop !== grid.scrollTop) {
						grid.scrollTop = scrollTop;
						if (grid.timer) { clearTimeout(grid.timer); }
						grid.timer = setTimeout(grid.populateVisible, p.scrollTimeout);
					}
				}
				grid.hDiv.scrollLeft = grid.bDiv.scrollLeft;
				if(p.footerrow) {
					grid.sDiv.scrollLeft = grid.bDiv.scrollLeft;
				}
				if( e ) { e.stopPropagation(); }
			},
			selectionPreserver : function(ts) {
				var p = ts.p,
				sr = p.selrow, sra = p.selarrrow ? $.makeArray(p.selarrrow) : null,
				left = ts.grid.bDiv.scrollLeft,
				restoreSelection = function() {
					var i;
					p.selrow = null;
					p.selarrrow = [];
					if(p.multiselect && sra && sra.length>0) {
						for(i=0;i<sra.length;i++){
							if (sra[i] !== sr) {
								$(ts).jqGrid("setSelection",sra[i],false, null);
							}
						}
					}
					if (sr) {
						$(ts).jqGrid("setSelection",sr,false,null);
					}
					ts.grid.bDiv.scrollLeft = left;
					$(ts).unbind('.selectionPreserver', restoreSelection);
				};
				$(ts).bind('jqGridGridComplete.selectionPreserver', restoreSelection);				
			}
		};
		if(this.tagName.toUpperCase() !== 'TABLE') {
			alert("Element is not a table");
			return;
		}
		if(document.documentMode !== undefined ) { // IE only
			if(document.documentMode <= 5) {
				alert("Grid can not be used in this ('quirks') mode!");
				return;
			}
		}
		$(this).empty().attr("tabindex","0");
		this.p = p ;
		this.p.useProp = !!$.fn.prop;
		var i, dir;
		if(this.p.colNames.length === 0) {
			for (i=0;i<this.p.colModel.length;i++){
				this.p.colNames[i] = this.p.colModel[i].label || this.p.colModel[i].name;
			}
		}
		if( this.p.colNames.length !== this.p.colModel.length ) {
			alert($.jgrid.errors.model);
			return;
		}
		var gv = $("<div class='ui-jqgrid-view'></div>"),
		isMSIE = $.jgrid.msie;
		ts.p.direction = $.trim(ts.p.direction.toLowerCase());
		if($.inArray(ts.p.direction,["ltr","rtl"]) === -1) { ts.p.direction = "ltr"; }
		dir = ts.p.direction;

		$(gv).insertBefore(this);
		$(this).removeClass("scroll").appendTo(gv);
		var eg = $("<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'></div>");
		$(eg).attr({"id" : "gbox_"+this.id,"dir":dir}).insertBefore(gv);
		$(gv).attr("id","gview_"+this.id).appendTo(eg);
		$("<div class='ui-widget-overlay jqgrid-overlay' id='lui_"+this.id+"'></div>").insertBefore(gv);
		$("<div class='loading ui-state-default ui-state-active' id='load_"+this.id+"'>"+this.p.loadtext+"</div>").insertBefore(gv);
		$(this).attr({cellspacing:"0",cellpadding:"0",border:"0","role":"grid","aria-multiselectable":!!this.p.multiselect,"aria-labelledby":"gbox_"+this.id});
		var sortkeys = ["shiftKey","altKey","ctrlKey"],
		intNum = function(val,defval) {
			val = parseInt(val,10);
			if (isNaN(val)) { return defval || 0;}
			return val;
		},
		formatCol = function (pos, rowInd, tv, rawObject, rowId, rdata){
			var cm = ts.p.colModel[pos],
			ral = cm.align, result="style=\"", clas = cm.classes, nm = cm.name, celp, acp=[];
			if(ral) { result += "text-align:"+ral+";"; }
			if(cm.hidden===true) { result += "display:none;"; }
			if(rowInd===0) {
				result += "width: "+grid.headers[pos].width+"px;";
			} else if (cm.cellattr && $.isFunction(cm.cellattr))
			{
				celp = cm.cellattr.call(ts, rowId, tv, rawObject, cm, rdata);
				if(celp && typeof celp === "string") {
					celp = celp.replace(/style/i,'style').replace(/title/i,'title');
					if(celp.indexOf('title') > -1) { cm.title=false;}
					if(celp.indexOf('class') > -1) { clas = undefined;}
					acp = celp.replace('-style','-sti').split(/style/);
					if(acp.length === 2 ) {
						acp[1] =  $.trim(acp[1].replace('-sti','-style').replace("=",""));
						if(acp[1].indexOf("'") === 0 || acp[1].indexOf('"') === 0) {
							acp[1] = acp[1].substring(1);
						}
						result += acp[1].replace(/'/gi,'"');
					} else {
						result += "\"";
					}
				}
			}
			if(!acp.length) { acp[0] = ""; result += "\"";}
			result += (clas !== undefined ? (" class=\""+clas+"\"") :"") + ((cm.title && tv) ? (" title=\""+$.jgrid.stripHtml(tv)+"\"") :"");
			result += " aria-describedby=\""+ts.p.id+"_"+nm+"\"";
			return result + acp[0];
		},
		cellVal =  function (val) {
			return val == null || val === "" ? "&#160;" : (ts.p.autoencode ? $.jgrid.htmlEncode(val) : String(val));
		},
		formatter = function (rowId, cellval , colpos, rwdat, _act){
			var cm = ts.p.colModel[colpos],v;
			if(cm.formatter !== undefined) {
				rowId = String(ts.p.idPrefix) !== "" ? $.jgrid.stripPref(ts.p.idPrefix, rowId) : rowId;
				var opts= {rowId: rowId, colModel:cm, gid:ts.p.id, pos:colpos };
				if($.isFunction( cm.formatter ) ) {
					v = cm.formatter.call(ts,cellval,opts,rwdat,_act);
				} else if($.fmatter){
					v = $.fn.fmatter.call(ts,cm.formatter,cellval,opts,rwdat,_act);
				} else {
					v = cellVal(cellval);
				}
			} else {
				v = cellVal(cellval);
			}
			return v;
		},
		addCell = function(rowId,cell,pos,irow, srvr, rdata) {
			var v,prp;
			v = formatter(rowId,cell,pos,srvr,'add');
			prp = formatCol( pos,irow, v, srvr, rowId, rdata);
			return "<td role=\"gridcell\" "+prp+">"+v+"</td>";
		},
		addMulti = function(rowid,pos,irow,checked){
			var	v = "<input role=\"checkbox\" type=\"checkbox\""+" id=\"jqg_"+ts.p.id+"_"+rowid+"\" class=\"cbox\" name=\"jqg_"+ts.p.id+"_"+rowid+"\"" + (checked ? "checked=\"checked\"" : "")+"/>",
			prp = formatCol( pos,irow,'',null, rowid, true);
			return "<td role=\"gridcell\" "+prp+">"+v+"</td>";
		},
		addRowNum = function (pos,irow,pG,rN) {
			var v =  (parseInt(pG,10)-1)*parseInt(rN,10)+1+irow,
			prp = formatCol( pos,irow,v, null, irow, true);
			return "<td role=\"gridcell\" class=\"ui-state-default jqgrid-rownum\" "+prp+">"+v+"</td>";
		},
		reader = function (datatype) {
			var field, f=[], j=0, i;
			for(i =0; i<ts.p.colModel.length; i++){
				field = ts.p.colModel[i];
				if (field.name !== 'cb' && field.name !=='subgrid' && field.name !=='rn') {
					f[j]= datatype === "local" ?
					field.name :
					( (datatype==="xml" || datatype === "xmlstring") ? field.xmlmap || field.name : field.jsonmap || field.name );
					if(ts.p.keyIndex !== false && field.key===true ) {
						ts.p.keyName = f[j];
					}
					j++;
				}
			}
			return f;
		},
		orderedCols = function (offset) {
			var order = ts.p.remapColumns;
			if (!order || !order.length) {
				order = $.map(ts.p.colModel, function(v,i) { return i; });
			}
			if (offset) {
				order = $.map(order, function(v) { return v<offset?null:v-offset; });
			}
			return order;
		},
		emptyRows = function (scroll, locdata) {
			var firstrow;
			if (this.p.deepempty) {
				$(this.rows).slice(1).remove();
			} else {
				firstrow = this.rows.length > 0 ? this.rows[0] : null;
				$(this.firstChild).empty().append(firstrow);
			}
			if (scroll && this.p.scroll) {
				$(this.grid.bDiv.firstChild).css({height: "auto"});
				$(this.grid.bDiv.firstChild.firstChild).css({height: 0, display: "none"});
				if (this.grid.bDiv.scrollTop !== 0) {
					this.grid.bDiv.scrollTop = 0;
				}
			}
			if(locdata === true && this.p.treeGrid) {
				this.p.data = []; this.p._index = {};
			}
		},
		refreshIndex = function() {
			var datalen = ts.p.data.length, idname, i, val,
			ni = ts.p.rownumbers===true ? 1 :0,
			gi = ts.p.multiselect ===true ? 1 :0,
			si = ts.p.subGrid===true ? 1 :0;

			if(ts.p.keyIndex === false || ts.p.loadonce === true) {
				idname = ts.p.localReader.id;
			} else {
				idname = ts.p.colModel[ts.p.keyIndex+gi+si+ni].name;
			}
			for(i =0;i < datalen; i++) {
				val = $.jgrid.getAccessor(ts.p.data[i],idname);
				if (val === undefined) { val=String(i+1); }
				ts.p._index[val] = i;
			}
		},
		constructTr = function(id, hide, altClass, rd, cur, selected) {
			var tabindex = '-1', restAttr = '', attrName, style = hide ? 'display:none;' : '',
				classes = 'ui-widget-content jqgrow ui-row-' + ts.p.direction + (altClass ? ' ' + altClass : '') + (selected ? ' ui-state-highlight' : ''),
				rowAttrObj = $(ts).triggerHandler("jqGridRowAttr", [rd, cur, id]);
				if( typeof rowAttrObj !== "object" ) {
					rowAttrObj =   $.isFunction(ts.p.rowattr) ? ts.p.rowattr.call(ts, rd, cur, id) :{};
				}
			if(!$.isEmptyObject( rowAttrObj )) {
				if (rowAttrObj.hasOwnProperty("id")) {
					id = rowAttrObj.id;
					delete rowAttrObj.id;
				}
				if (rowAttrObj.hasOwnProperty("tabindex")) {
					tabindex = rowAttrObj.tabindex;
					delete rowAttrObj.tabindex;
				}
				if (rowAttrObj.hasOwnProperty("style")) {
					style += rowAttrObj.style;
					delete rowAttrObj.style;
				}
				if (rowAttrObj.hasOwnProperty("class")) {
					classes += ' ' + rowAttrObj['class'];
					delete rowAttrObj['class'];
				}
				// dot't allow to change role attribute
				try { delete rowAttrObj.role; } catch(ra){}
				for (attrName in rowAttrObj) {
					if (rowAttrObj.hasOwnProperty(attrName)) {
						restAttr += ' ' + attrName + '=' + rowAttrObj[attrName];
					}
				}
			}
			return '<tr role="row" id="' + id + '" tabindex="' + tabindex + '" class="' + classes + '"' +
				(style === '' ? '' : ' style="' + style + '"') + restAttr + '>';
		},
		addXmlData = function (xml,t, rcnt, more, adjust) {
			var startReq = new Date(),
			locdata = (ts.p.datatype !== "local" && ts.p.loadonce) || ts.p.datatype === "xmlstring",
			xmlid = "_id_", xmlRd = ts.p.xmlReader,
			frd = ts.p.datatype === "local" ? "local" : "xml";
			if(locdata) {
				ts.p.data = [];
				ts.p._index = {};
				ts.p.localReader.id = xmlid;
			}
			ts.p.reccount = 0;
			if($.isXMLDoc(xml)) {
				if(ts.p.treeANode===-1 && !ts.p.scroll) {
					emptyRows.call(ts, false, true);
					rcnt=1;
				} else { rcnt = rcnt > 1 ? rcnt :1; }
			} else { return; }
			var self= $(ts), i,fpos,ir=0,v,gi=ts.p.multiselect===true?1:0,si=0,addSubGridCell,ni=ts.p.rownumbers===true?1:0,idn, getId,f=[],F,rd ={}, xmlr,rid, rowData=[], cn=(ts.p.altRows === true) ? ts.p.altclass:"",cn1;
			if(ts.p.subGrid===true) {
				si = 1;
				addSubGridCell = $.jgrid.getMethod("addSubGridCell");
			}
			if(!xmlRd.repeatitems) {f = reader(frd);}
			if( ts.p.keyIndex===false) {
				idn = $.isFunction( xmlRd.id ) ?  xmlRd.id.call(ts, xml) : xmlRd.id;
			} else {
				idn = ts.p.keyIndex;
			}
			if(f.length>0 && !isNaN(idn)) {
				idn=ts.p.keyName;
			}
			if( String(idn).indexOf("[") === -1 ) {
				if (f.length) {
					getId = function( trow, k) {return $(idn,trow).text() || k;};
				} else {
					getId = function( trow, k) {return $(xmlRd.cell,trow).eq(idn).text() || k;};
				}
			}
			else {
				getId = function( trow, k) {return trow.getAttribute(idn.replace(/[\[\]]/g,"")) || k;};
			}
			ts.p.userData = {};
			ts.p.page = intNum($.jgrid.getXmlData(xml, xmlRd.page), ts.p.page);
			ts.p.lastpage = intNum($.jgrid.getXmlData(xml, xmlRd.total), 1);
			ts.p.records = intNum($.jgrid.getXmlData(xml, xmlRd.records));
			if($.isFunction(xmlRd.userdata)) {
				ts.p.userData = xmlRd.userdata.call(ts, xml) || {};
			} else {
				$.jgrid.getXmlData(xml, xmlRd.userdata, true).each(function() {ts.p.userData[this.getAttribute("name")]= $(this).text();});
			}
			var gxml = $.jgrid.getXmlData( xml, xmlRd.root, true);
			gxml = $.jgrid.getXmlData( gxml, xmlRd.row, true);
			if (!gxml) { gxml = []; }
			var gl = gxml.length, j=0, grpdata=[], rn = parseInt(ts.p.rowNum,10), br=ts.p.scroll?$.jgrid.randId():1, altr;
			if (gl > 0 &&  ts.p.page <= 0) { ts.p.page = 1; }
			if(gxml && gl){
			if (adjust) { rn *= adjust+1; }
			var afterInsRow = $.isFunction(ts.p.afterInsertRow), hiderow=false, groupingPrepare;
			if(ts.p.grouping)  {
				hiderow = ts.p.groupingView.groupCollapse === true;
				groupingPrepare = $.jgrid.getMethod("groupingPrepare");
			}
			while (j<gl) {
				xmlr = gxml[j];
				rid = getId(xmlr,br+j);
				rid  = ts.p.idPrefix + rid;
				altr = rcnt === 0 ? 0 : rcnt+1;
				cn1 = (altr+j)%2 === 1 ? cn : '';
				var iStartTrTag = rowData.length;
				rowData.push("");
				if( ni ) {
					rowData.push( addRowNum(0,j,ts.p.page,ts.p.rowNum) );
				}
				if( gi ) {
					rowData.push( addMulti(rid,ni,j, false) );
				}
				if( si ) {
					rowData.push( addSubGridCell.call(self,gi+ni,j+rcnt) );
				}
				if(xmlRd.repeatitems){
					if (!F) { F=orderedCols(gi+si+ni); }
					var cells = $.jgrid.getXmlData( xmlr, xmlRd.cell, true);
					$.each(F, function (k) {
						var cell = cells[this];
						if (!cell) { return false; }
						v = cell.textContent || cell.text;
						rd[ts.p.colModel[k+gi+si+ni].name] = v;
						rowData.push( addCell(rid,v,k+gi+si+ni,j+rcnt,xmlr, rd) );
					});
				} else {
					for(i = 0; i < f.length;i++) {
						v = $.jgrid.getXmlData( xmlr, f[i]);
						rd[ts.p.colModel[i+gi+si+ni].name] = v;
						rowData.push( addCell(rid, v, i+gi+si+ni, j+rcnt, xmlr, rd) );
					}
				}
				rowData[iStartTrTag] = constructTr(rid, hiderow, cn1, rd, xmlr, false);
				rowData.push("</tr>");
				if(ts.p.grouping) {
					grpdata = groupingPrepare.call(self,rowData, grpdata, rd, j);
					rowData = [];
				}
				if(locdata || ts.p.treeGrid === true) {
					rd[xmlid] = $.jgrid.stripPref(ts.p.idPrefix, rid);
					ts.p.data.push(rd);
					ts.p._index[rd[xmlid]] = ts.p.data.length-1;
				}
				if(ts.p.gridview === false ) {
					$("tbody:first",t).append(rowData.join(''));
					self.triggerHandler("jqGridAfterInsertRow", [rid, rd, xmlr]);
					if(afterInsRow) {ts.p.afterInsertRow.call(ts,rid,rd,xmlr);}
					rowData=[];
				}
				rd={};
				ir++;
				j++;
				if(ir===rn) {break;}
			}
			}
			if(ts.p.gridview === true) {
				fpos = ts.p.treeANode > -1 ? ts.p.treeANode: 0;
				if(ts.p.grouping) {
					self.jqGrid('groupingRender',grpdata,ts.p.colModel.length);
					grpdata = null;
				} else if(ts.p.treeGrid === true && fpos > 0) {
					$(ts.rows[fpos]).after(rowData.join(''));
				} else {
					$("tbody:first",t).append(rowData.join(''));
				}
			}
			if(ts.p.subGrid === true ) {
				try {self.jqGrid("addSubGrid",gi+ni);} catch (_){}
			}
			ts.p.totaltime = new Date() - startReq;
			if(ir>0) { if(ts.p.records===0) { ts.p.records=gl;} }
			rowData =null;
			if( ts.p.treeGrid === true) {
				try {self.jqGrid("setTreeNode", fpos+1, ir+fpos+1);} catch (e) {}
			}
			if(!ts.p.treeGrid && !ts.p.scroll) {ts.grid.bDiv.scrollTop = 0;}
			ts.p.reccount=ir;
			ts.p.treeANode = -1;
			if(ts.p.userDataOnFooter) { self.jqGrid("footerData","set",ts.p.userData,true); }
			if(locdata) {
				ts.p.records = gl;
				ts.p.lastpage = Math.ceil(gl/ rn);
			}
			if (!more) { ts.updatepager(false,true); }
			if(locdata) {
				while (ir<gl) {
					xmlr = gxml[ir];
					rid = getId(xmlr,ir+br);
					rid  = ts.p.idPrefix + rid;
					if(xmlRd.repeatitems){
						if (!F) { F=orderedCols(gi+si+ni); }
						var cells2 = $.jgrid.getXmlData( xmlr, xmlRd.cell, true);
						$.each(F, function (k) {
							var cell = cells2[this];
							if (!cell) { return false; }
							v = cell.textContent || cell.text;
							rd[ts.p.colModel[k+gi+si+ni].name] = v;
						});
					} else {
						for(i = 0; i < f.length;i++) {
							v = $.jgrid.getXmlData( xmlr, f[i]);
							rd[ts.p.colModel[i+gi+si+ni].name] = v;
						}
					}
					rd[xmlid] = $.jgrid.stripPref(ts.p.idPrefix, rid);
					ts.p.data.push(rd);
					ts.p._index[rd[xmlid]] = ts.p.data.length-1;
					rd = {};
					ir++;
				}
			}
		},
		addJSONData = function(data,t, rcnt, more, adjust) {
			var startReq = new Date();
			if(data) {
				if(ts.p.treeANode === -1 && !ts.p.scroll) {
					emptyRows.call(ts, false, true);
					rcnt=1;
				} else { rcnt = rcnt > 1 ? rcnt :1; }
			} else { return; }

			var dReader, locid = "_id_", frd,
			locdata = (ts.p.datatype !== "local" && ts.p.loadonce) || ts.p.datatype === "jsonstring";
			if(locdata) { ts.p.data = []; ts.p._index = {}; ts.p.localReader.id = locid;}
			ts.p.reccount = 0;
			if(ts.p.datatype === "local") {
				dReader =  ts.p.localReader;
				frd= 'local';
			} else {
				dReader =  ts.p.jsonReader;
				frd='json';
			}
			var self = $(ts), ir=0,v,i,j,f=[],cur,gi=ts.p.multiselect?1:0,si=ts.p.subGrid===true?1:0,addSubGridCell,ni=ts.p.rownumbers===true?1:0,arrayReader=orderedCols(gi+si+ni),objectReader=reader(frd),rowReader,len,drows,idn,rd={}, fpos, idr,rowData=[],cn=(ts.p.altRows === true) ? ts.p.altclass:"",cn1;
			ts.p.page = intNum($.jgrid.getAccessor(data,dReader.page), ts.p.page);
			ts.p.lastpage = intNum($.jgrid.getAccessor(data,dReader.total), 1);
			ts.p.records = intNum($.jgrid.getAccessor(data,dReader.records));
			ts.p.userData = $.jgrid.getAccessor(data,dReader.userdata) || {};
			if(si) {
				addSubGridCell = $.jgrid.getMethod("addSubGridCell");
			}
			if( ts.p.keyIndex===false ) {
				idn = $.isFunction(dReader.id) ? dReader.id.call(ts, data) : dReader.id; 
			} else {
				idn = ts.p.keyIndex;
			}
			if(!dReader.repeatitems) {
				f = objectReader;
				if(f.length>0 && !isNaN(idn)) {
					idn=ts.p.keyName;
				}
			}
			drows = $.jgrid.getAccessor(data,dReader.root);
			if (drows == null && $.isArray(data)) { drows = data; }
			if (!drows) { drows = []; }
			len = drows.length; i=0;
			if (len > 0 && ts.p.page <= 0) { ts.p.page = 1; }
			var rn = parseInt(ts.p.rowNum,10),br=ts.p.scroll?$.jgrid.randId():1, altr, selected=false, selr;
			if (adjust) { rn *= adjust+1; }
			if(ts.p.datatype === "local" && !ts.p.deselectAfterSort) {
				selected = true;
			}
			var afterInsRow = $.isFunction(ts.p.afterInsertRow), grpdata=[],hiderow=false, groupingPrepare;
			if(ts.p.grouping)  {
				hiderow = ts.p.groupingView.groupCollapse === true;
				groupingPrepare = $.jgrid.getMethod("groupingPrepare");
			}
			while (i<len) {
				cur = drows[i];
				idr = $.jgrid.getAccessor(cur,idn);
				if(idr === undefined) {
					if (typeof idn === "number" && ts.p.colModel[idn+gi+si+ni] != null) {
						// reread id by name
						idr = $.jgrid.getAccessor(cur,ts.p.colModel[idn+gi+si+ni].name);
					}
					if(idr === undefined) {
						idr = br+i;
						if(f.length===0){
							if(dReader.cell){
								var ccur = $.jgrid.getAccessor(cur,dReader.cell) || cur;
								idr = ccur != null && ccur[idn] !== undefined ? ccur[idn] : idr;
								ccur=null;
							}
						}
					}
				}
				idr  = ts.p.idPrefix + idr;
				altr = rcnt === 1 ? 0 : rcnt;
				cn1 = (altr+i)%2 === 1 ? cn : '';
				if( selected) {
					if( ts.p.multiselect) {
						selr = ($.inArray(idr, ts.p.selarrrow) !== -1);
					} else {
						selr = (idr === ts.p.selrow);
					}
				}
				var iStartTrTag = rowData.length;
				rowData.push("");
				if( ni ) {
					rowData.push( addRowNum(0,i,ts.p.page,ts.p.rowNum) );
				}
				if( gi ){
					rowData.push( addMulti(idr,ni,i,selr) );
				}
				if( si ) {
					rowData.push( addSubGridCell.call(self,gi+ni,i+rcnt) );
				}
				rowReader=objectReader;
				if (dReader.repeatitems) {
					if(dReader.cell) {cur = $.jgrid.getAccessor(cur,dReader.cell) || cur;}
					if ($.isArray(cur)) { rowReader=arrayReader; }
				}
				for (j=0;j<rowReader.length;j++) {
					v = $.jgrid.getAccessor(cur,rowReader[j]);
					rd[ts.p.colModel[j+gi+si+ni].name] = v;
					rowData.push( addCell(idr,v,j+gi+si+ni,i+rcnt,cur, rd) );
				}
				rowData[iStartTrTag] = constructTr(idr, hiderow, cn1, rd, cur, selr);
				rowData.push( "</tr>" );
				if(ts.p.grouping) {
					grpdata = groupingPrepare.call(self,rowData, grpdata, rd, i);
					rowData = [];
				}
				if(locdata || ts.p.treeGrid===true) {
					rd[locid] = $.jgrid.stripPref(ts.p.idPrefix, idr);
					ts.p.data.push(rd);
					ts.p._index[rd[locid]] = ts.p.data.length-1;
				}
				if(ts.p.gridview === false ) {
					$("#"+$.jgrid.jqID(ts.p.id)+" tbody:first").append(rowData.join(''));
					self.triggerHandler("jqGridAfterInsertRow", [idr, rd, cur]);
					if(afterInsRow) {ts.p.afterInsertRow.call(ts,idr,rd,cur);}
					rowData=[];//ari=0;
				}
				rd={};
				ir++;
				i++;
				if(ir===rn) { break; }
			}
			if(ts.p.gridview === true ) {
				fpos = ts.p.treeANode > -1 ? ts.p.treeANode: 0;
				if(ts.p.grouping) {
					self.jqGrid('groupingRender',grpdata,ts.p.colModel.length);
					grpdata = null;
				} else if(ts.p.treeGrid === true && fpos > 0) {
					$(ts.rows[fpos]).after(rowData.join(''));
				} else {
					$("#"+$.jgrid.jqID(ts.p.id)+" tbody:first").append(rowData.join(''));
				}
			}
			if(ts.p.subGrid === true ) {
				try { self.jqGrid("addSubGrid",gi+ni);} catch (_){}
			}
			ts.p.totaltime = new Date() - startReq;
			if(ir>0) {
				if(ts.p.records===0) { ts.p.records=len; }
			}
			rowData = null;
			if( ts.p.treeGrid === true) {
				try {self.jqGrid("setTreeNode", fpos+1, ir+fpos+1);} catch (e) {}
			}
			if(!ts.p.treeGrid && !ts.p.scroll) {ts.grid.bDiv.scrollTop = 0;}
			ts.p.reccount=ir;
			ts.p.treeANode = -1;
			if(ts.p.userDataOnFooter) { self.jqGrid("footerData","set",ts.p.userData,true); }
			if(locdata) {
				ts.p.records = len;
				ts.p.lastpage = Math.ceil(len/ rn);
			}
			if (!more) { ts.updatepager(false,true); }
			if(locdata) {
				while (ir<len && drows[ir]) {
					cur = drows[ir];
					idr = $.jgrid.getAccessor(cur,idn);
					if(idr === undefined) {
						if (typeof idn === "number" && ts.p.colModel[idn+gi+si+ni] != null) {
							// reread id by name
							idr = $.jgrid.getAccessor(cur,ts.p.colModel[idn+gi+si+ni].name);
						}
						if(idr === undefined) {
							idr = br+ir;
							if(f.length===0){
								if(dReader.cell){
									var ccur2 = $.jgrid.getAccessor(cur,dReader.cell) || cur;
									idr = ccur2 != null && ccur2[idn] !== undefined ? ccur2[idn] : idr;
									ccur2=null;
								}
							}
						}
					}
					if(cur) {
						idr  = ts.p.idPrefix + idr;
						rowReader=objectReader;
						if (dReader.repeatitems) {
							if(dReader.cell) {cur = $.jgrid.getAccessor(cur,dReader.cell) || cur;}
							if ($.isArray(cur)) { rowReader=arrayReader; }
						}

						for (j=0;j<rowReader.length;j++) {
							rd[ts.p.colModel[j+gi+si+ni].name] = $.jgrid.getAccessor(cur,rowReader[j]);
						}
						rd[locid] = $.jgrid.stripPref(ts.p.idPrefix, idr);
						ts.p.data.push(rd);
						ts.p._index[rd[locid]] = ts.p.data.length-1;
						rd = {};
					}
					ir++;
				}
			}
		},
		addLocalData = function() {
			var st = ts.p.multiSort ? [] : "", sto=[], fndsort=false, cmtypes={}, grtypes=[], grindexes=[], srcformat, sorttype, newformat;
			if(!$.isArray(ts.p.data)) {
				return;
			}
			var grpview = ts.p.grouping ? ts.p.groupingView : false, lengrp, gin;
			$.each(ts.p.colModel,function(){
				sorttype = this.sorttype || "text";
				if(sorttype === "date" || sorttype === "datetime") {
					if(this.formatter && typeof this.formatter === 'string' && this.formatter === 'date') {
						if(this.formatoptions && this.formatoptions.srcformat) {
							srcformat = this.formatoptions.srcformat;
						} else {
							srcformat = $.jgrid.formatter.date.srcformat;
						}
						if(this.formatoptions && this.formatoptions.newformat) {
							newformat = this.formatoptions.newformat;
						} else {
							newformat = $.jgrid.formatter.date.newformat;
						}
					} else {
						srcformat = newformat = this.datefmt || "Y-m-d";
					}
					cmtypes[this.name] = {"stype": sorttype, "srcfmt": srcformat,"newfmt":newformat};
				} else {
					cmtypes[this.name] = {"stype": sorttype, "srcfmt":'',"newfmt":''};
				}
				if(ts.p.grouping ) {
					for(gin =0, lengrp = grpview.groupField.length; gin< lengrp; gin++) {
						if( this.name === grpview.groupField[gin]) {
							var grindex = this.name;
							if (this.index) {
								grindex = this.index;
							}
							grtypes[gin] = cmtypes[grindex];
							grindexes[gin]= grindex;
						}
					}
				}
				if(ts.p.multiSort) {
					if(this.lso) {
						st.push(this.name);
						var tmplso= this.lso.split("-");
						sto.push( tmplso[tmplso.length-1] );
					}
				} else {
					if(!fndsort && (this.index === ts.p.sortname || this.name === ts.p.sortname)){
						st = this.name; // ???
						fndsort = true;
					}
				}
			});
			if(ts.p.treeGrid) {
				$(ts).jqGrid("SortTree", st, ts.p.sortorder, cmtypes[st].stype || 'text', cmtypes[st].srcfmt || '');
				return;
			}
			var compareFnMap = {
				'eq':function(queryObj) {return queryObj.equals;},
				'ne':function(queryObj) {return queryObj.notEquals;},
				'lt':function(queryObj) {return queryObj.less;},
				'le':function(queryObj) {return queryObj.lessOrEquals;},
				'gt':function(queryObj) {return queryObj.greater;},
				'ge':function(queryObj) {return queryObj.greaterOrEquals;},
				'cn':function(queryObj) {return queryObj.contains;},
				'nc':function(queryObj,op) {return op === "OR" ? queryObj.orNot().contains : queryObj.andNot().contains;},
				'bw':function(queryObj) {return queryObj.startsWith;},
				'bn':function(queryObj,op) {return op === "OR" ? queryObj.orNot().startsWith : queryObj.andNot().startsWith;},
				'en':function(queryObj,op) {return op === "OR" ? queryObj.orNot().endsWith : queryObj.andNot().endsWith;},
				'ew':function(queryObj) {return queryObj.endsWith;},
				'ni':function(queryObj,op) {return op === "OR" ? queryObj.orNot().equals : queryObj.andNot().equals;},
				'in':function(queryObj) {return queryObj.equals;},
				'nu':function(queryObj) {return queryObj.isNull;},
				'nn':function(queryObj,op) {return op === "OR" ? queryObj.orNot().isNull : queryObj.andNot().isNull;}

			},
			query = $.jgrid.from(ts.p.data);
			if (ts.p.ignoreCase) { query = query.ignoreCase(); }
			function tojLinq ( group ) {
				var s = 0, index, gor, ror, opr, rule;
				if (group.groups != null) {
					gor = group.groups.length && group.groupOp.toString().toUpperCase() === "OR";
					if (gor) {
						query.orBegin();
					}
					for (index = 0; index < group.groups.length; index++) {
						if (s > 0 && gor) {
							query.or();
						}
						try {
							tojLinq(group.groups[index]);
						} catch (e) {alert(e);}
						s++;
					}
					if (gor) {
						query.orEnd();
					}
				}
				if (group.rules != null) {
					//if(s>0) {
					//	var result = query.select();
					//	query = $.jgrid.from( result);
					//	if (ts.p.ignoreCase) { query = query.ignoreCase(); } 
					//}
					try{
						ror = group.rules.length && group.groupOp.toString().toUpperCase() === "OR";
						if (ror) {
							query.orBegin();
						}
						for (index = 0; index < group.rules.length; index++) {
							rule = group.rules[index];
							opr = group.groupOp.toString().toUpperCase();
							if (compareFnMap[rule.op] && rule.field ) {
								if(s > 0 && opr && opr === "OR") {
									query = query.or();
								}
								query = compareFnMap[rule.op](query, opr)(rule.field, rule.data, cmtypes[rule.field]);
							}
							s++;
						}
						if (ror) {
							query.orEnd();
						}
					} catch (g) {alert(g);}
				}
			}

			if (ts.p.search === true) {
				var srules = ts.p.postData.filters;
				if(srules) {
					if(typeof srules === "string") { srules = $.jgrid.parse(srules);}
					tojLinq( srules );
				} else {
					try {
						query = compareFnMap[ts.p.postData.searchOper](query)(ts.p.postData.searchField, ts.p.postData.searchString,cmtypes[ts.p.postData.searchField]);
					} catch (se){}
				}
			}
			if(ts.p.grouping) {
				for(gin=0; gin<lengrp;gin++) {
					query.orderBy(grindexes[gin],grpview.groupOrder[gin],grtypes[gin].stype, grtypes[gin].srcfmt);
				}
			}
			if(ts.p.multiSort) {
				$.each(st,function(i){
					query.orderBy(this, sto[i], cmtypes[this].stype, cmtypes[this].srcfmt);
				});
			} else {
				if (st && ts.p.sortorder && fndsort) {
					if(ts.p.sortorder.toUpperCase() === "DESC") {
						query.orderBy(ts.p.sortname, "d", cmtypes[st].stype, cmtypes[st].srcfmt);
					} else {
						query.orderBy(ts.p.sortname, "a", cmtypes[st].stype, cmtypes[st].srcfmt);
					}
				}
			}
			var queryResults = query.select(),
			recordsperpage = parseInt(ts.p.rowNum,10),
			total = queryResults.length,
			page = parseInt(ts.p.page,10),
			totalpages = Math.ceil(total / recordsperpage),
			retresult = {};
			queryResults = queryResults.slice( (page-1)*recordsperpage , page*recordsperpage );
			query = null;
			cmtypes = null;
			retresult[ts.p.localReader.total] = totalpages;
			retresult[ts.p.localReader.page] = page;
			retresult[ts.p.localReader.records] = total;
			retresult[ts.p.localReader.root] = queryResults;
			retresult[ts.p.localReader.userdata] = ts.p.userData;
			queryResults = null;
			return  retresult;
		},
		updatepager = function(rn, dnd) {
			var cp, last, base, from,to,tot,fmt, pgboxes = "", sppg,
			tspg = ts.p.pager ? "_"+$.jgrid.jqID(ts.p.pager.substr(1)) : "",
			tspg_t = ts.p.toppager ? "_"+ts.p.toppager.substr(1) : "";
			base = parseInt(ts.p.page,10)-1;
			if(base < 0) { base = 0; }
			base = base*parseInt(ts.p.rowNum,10);
			to = base + ts.p.reccount;
			if (ts.p.scroll) {
				var rows = $("tbody:first > tr:gt(0)", ts.grid.bDiv);
				base = to - rows.length;
				ts.p.reccount = rows.length;
				var rh = rows.outerHeight() || ts.grid.prevRowHeight;
				if (rh) {
					var top = base * rh;
					var height = parseInt(ts.p.records,10) * rh;
					$(">div:first",ts.grid.bDiv).css({height : height}).children("div:first").css({height:top,display:top?"":"none"});
					if (ts.grid.bDiv.scrollTop == 0 && ts.p.page > 1) {
						ts.grid.bDiv.scrollTop = ts.p.rowNum * (ts.p.page - 1) * rh;
					}
				}
				ts.grid.bDiv.scrollLeft = ts.grid.hDiv.scrollLeft;
			}
			pgboxes = ts.p.pager || "";
			pgboxes += ts.p.toppager ?  (pgboxes ? "," + ts.p.toppager : ts.p.toppager) : "";
			if(pgboxes) {
				fmt = $.jgrid.formatter.integer || {};
				cp = intNum(ts.p.page);
				last = intNum(ts.p.lastpage);
				$(".selbox",pgboxes)[ this.p.useProp ? 'prop' : 'attr' ]("disabled",false);
				if(ts.p.pginput===true) {
					$('.ui-pg-input',pgboxes).val(ts.p.page);
					sppg = ts.p.toppager ? '#sp_1'+tspg+",#sp_1"+tspg_t : '#sp_1'+tspg;
					$(sppg).html($.fmatter ? $.fmatter.util.NumberFormat(ts.p.lastpage,fmt):ts.p.lastpage);

				}
				if (ts.p.viewrecords){
					if(ts.p.reccount === 0) {
						$(".ui-paging-info",pgboxes).html(ts.p.emptyrecords);
					} else {
						from = base+1;
						tot=ts.p.records;
						if($.fmatter) {
							from = $.fmatter.util.NumberFormat(from,fmt);
							to = $.fmatter.util.NumberFormat(to,fmt);
							tot = $.fmatter.util.NumberFormat(tot,fmt);
						}
						$(".ui-paging-info",pgboxes).html($.jgrid.format(ts.p.recordtext,from,to,tot));
					}
				}
				if(ts.p.pgbuttons===true) {
					if(cp<=0) {cp = last = 0;}
					if(cp===1 || cp === 0) {
						$("#first"+tspg+", #prev"+tspg).addClass('ui-state-disabled').removeClass('ui-state-hover');
						if(ts.p.toppager) { $("#first_t"+tspg_t+", #prev_t"+tspg_t).addClass('ui-state-disabled').removeClass('ui-state-hover'); }
					} else {
						$("#first"+tspg+", #prev"+tspg).removeClass('ui-state-disabled');
						if(ts.p.toppager) { $("#first_t"+tspg_t+", #prev_t"+tspg_t).removeClass('ui-state-disabled'); }
					}
					if(cp===last || cp === 0) {
						$("#next"+tspg+", #last"+tspg).addClass('ui-state-disabled').removeClass('ui-state-hover');
						if(ts.p.toppager) { $("#next_t"+tspg_t+", #last_t"+tspg_t).addClass('ui-state-disabled').removeClass('ui-state-hover'); }
					} else {
						$("#next"+tspg+", #last"+tspg).removeClass('ui-state-disabled');
						if(ts.p.toppager) { $("#next_t"+tspg_t+", #last_t"+tspg_t).removeClass('ui-state-disabled'); }
					}
				}
			}
			if(rn===true && ts.p.rownumbers === true) {
				$(">td.jqgrid-rownum",ts.rows).each(function(i){
					$(this).html(base+1+i);
				});
			}
			if(dnd && ts.p.jqgdnd) { $(ts).jqGrid('gridDnD','updateDnD');}
			$(ts).triggerHandler("jqGridGridComplete");
			if($.isFunction(ts.p.gridComplete)) {ts.p.gridComplete.call(ts);}
			$(ts).triggerHandler("jqGridAfterGridComplete");
		},
		beginReq = function() {
			ts.grid.hDiv.loading = true;
			if(ts.p.hiddengrid) { return;}
			switch(ts.p.loadui) {
				case "disable":
					break;
				case "enable":
					$("#load_"+$.jgrid.jqID(ts.p.id)).show();
					break;
				case "block":
					$("#lui_"+$.jgrid.jqID(ts.p.id)).show();
					$("#load_"+$.jgrid.jqID(ts.p.id)).show();
					break;
			}
		},
		endReq = function() {
			ts.grid.hDiv.loading = false;
			switch(ts.p.loadui) {
				case "disable":
					break;
				case "enable":
					$("#load_"+$.jgrid.jqID(ts.p.id)).hide();
					break;
				case "block":
					$("#lui_"+$.jgrid.jqID(ts.p.id)).hide();
					$("#load_"+$.jgrid.jqID(ts.p.id)).hide();
					break;
			}
		},
		populate = function (npage) {
			if(!ts.grid.hDiv.loading) {
				var pvis = ts.p.scroll && npage === false,
				prm = {}, dt, dstr, pN=ts.p.prmNames;
				if(ts.p.page <=0) { ts.p.page = Math.min(1,ts.p.lastpage); }
				if(pN.search !== null) {prm[pN.search] = ts.p.search;} if(pN.nd !== null) {prm[pN.nd] = new Date().getTime();}
				if(pN.rows !== null) {prm[pN.rows]= ts.p.rowNum;} if(pN.page !== null) {prm[pN.page]= ts.p.page;}
				if(pN.sort !== null) {prm[pN.sort]= ts.p.sortname;} if(pN.order !== null) {prm[pN.order]= ts.p.sortorder;}
				if(ts.p.rowTotal !== null && pN.totalrows !== null) { prm[pN.totalrows]= ts.p.rowTotal; }
				var lcf = $.isFunction(ts.p.loadComplete), lc = lcf ? ts.p.loadComplete : null;
				var adjust = 0;
				npage = npage || 1;
				if (npage > 1) {
					if(pN.npage !== null) {
						prm[pN.npage] = npage;
						adjust = npage - 1;
						npage = 1;
					} else {
						lc = function(req) {
							ts.p.page++;
							ts.grid.hDiv.loading = false;
							if (lcf) {
								ts.p.loadComplete.call(ts,req);
							}
							populate(npage-1);
						};
					}
				} else if (pN.npage !== null) {
					delete ts.p.postData[pN.npage];
				}
				if(ts.p.grouping) {
					$(ts).jqGrid('groupingSetup');
					var grp = ts.p.groupingView, gi, gs="";
					for(gi=0;gi<grp.groupField.length;gi++) {
						var index = grp.groupField[gi];
						$.each(ts.p.colModel, function(cmIndex, cmValue) {
							if (cmValue.name === index && cmValue.index){
								index = cmValue.index;
							}
						} );
						gs += index +" "+grp.groupOrder[gi]+", ";
					}
					prm[pN.sort] = gs + prm[pN.sort];
				}
				$.extend(ts.p.postData,prm);
				var rcnt = !ts.p.scroll ? 1 : ts.rows.length-1;
				var bfr = $(ts).triggerHandler("jqGridBeforeRequest");
				if (bfr === false || bfr === 'stop') { return; }
				if ($.isFunction(ts.p.datatype)) { ts.p.datatype.call(ts,ts.p.postData,"load_"+ts.p.id, rcnt, npage, adjust); return;}
				if ($.isFunction(ts.p.beforeRequest)) {
					bfr = ts.p.beforeRequest.call(ts);
					if(bfr === undefined) { bfr = true; }
					if ( bfr === false ) { return; }
				}
				dt = ts.p.datatype.toLowerCase();
				switch(dt)
				{
				case "json":
				case "jsonp":
				case "xml":
				case "script":
					$.ajax($.extend({
						url:ts.p.url,
						type:ts.p.mtype,
						dataType: dt ,
						data: $.isFunction(ts.p.serializeGridData)? ts.p.serializeGridData.call(ts,ts.p.postData) : ts.p.postData,
						success:function(data,st, xhr) {
							if ($.isFunction(ts.p.beforeProcessing)) {
								if (ts.p.beforeProcessing.call(ts, data, st, xhr) === false) {
									endReq();
									return;
								}
							}
							if(dt === "xml") { addXmlData(data,ts.grid.bDiv,rcnt,npage>1,adjust); }
							else { addJSONData(data,ts.grid.bDiv,rcnt,npage>1,adjust); }
							$(ts).triggerHandler("jqGridLoadComplete", [data]);
							if(lc) { lc.call(ts,data); }
							$(ts).triggerHandler("jqGridAfterLoadComplete", [data]);
							if (pvis) { ts.grid.populateVisible(); }
							if( ts.p.loadonce || ts.p.treeGrid) {ts.p.datatype = "local";}
							data=null;
							if (npage === 1) { endReq(); }
						},
						error:function(xhr,st,err){
							if($.isFunction(ts.p.loadError)) { ts.p.loadError.call(ts,xhr,st,err); }
							if (npage === 1) { endReq(); }
							xhr=null;
						},
						beforeSend: function(xhr, settings ){
							var gotoreq = true;
							if($.isFunction(ts.p.loadBeforeSend)) {
								gotoreq = ts.p.loadBeforeSend.call(ts,xhr, settings); 
							}
							if(gotoreq === undefined) { gotoreq = true; }
							if(gotoreq === false) {
								return false;
							}
								beginReq();
							}
					},$.jgrid.ajaxOptions, ts.p.ajaxGridOptions));
				break;
				case "xmlstring":
					beginReq();
					dstr = typeof ts.p.datastr !== 'string' ? ts.p.datastr : $.parseXML(ts.p.datastr);
					addXmlData(dstr,ts.grid.bDiv);
					$(ts).triggerHandler("jqGridLoadComplete", [dstr]);
					if(lcf) {ts.p.loadComplete.call(ts,dstr);}
					$(ts).triggerHandler("jqGridAfterLoadComplete", [dstr]);
					ts.p.datatype = "local";
					ts.p.datastr = null;
					endReq();
				break;
				case "jsonstring":
					beginReq();
					if(typeof ts.p.datastr === 'string') { dstr = $.jgrid.parse(ts.p.datastr); }
					else { dstr = ts.p.datastr; }
					addJSONData(dstr,ts.grid.bDiv);
					$(ts).triggerHandler("jqGridLoadComplete", [dstr]);
					if(lcf) {ts.p.loadComplete.call(ts,dstr);}
					$(ts).triggerHandler("jqGridAfterLoadComplete", [dstr]);
					ts.p.datatype = "local";
					ts.p.datastr = null;
					endReq();
				break;
				case "local":
				case "clientside":
					beginReq();
					ts.p.datatype = "local";
					var req = addLocalData();
					addJSONData(req,ts.grid.bDiv,rcnt,npage>1,adjust);
					$(ts).triggerHandler("jqGridLoadComplete", [req]);
					if(lc) { lc.call(ts,req); }
					$(ts).triggerHandler("jqGridAfterLoadComplete", [req]);
					if (pvis) { ts.grid.populateVisible(); }
					endReq();
				break;
				}
			}
		},
		setHeadCheckBox = function ( checked ) {
			$('#cb_'+$.jgrid.jqID(ts.p.id),ts.grid.hDiv)[ts.p.useProp ? 'prop': 'attr']("checked", checked);
			var fid = ts.p.frozenColumns ? ts.p.id+"_frozen" : "";
			if(fid) {
				$('#cb_'+$.jgrid.jqID(ts.p.id),ts.grid.fhDiv)[ts.p.useProp ? 'prop': 'attr']("checked", checked);
			}
		},
		setPager = function (pgid, tp){
			// TBD - consider escaping pgid with pgid = $.jgrid.jqID(pgid);
			var sep = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>",
			pginp = "",
			pgl="<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>",
			str="", pgcnt, lft, cent, rgt, twd, tdw, i,
			clearVals = function(onpaging){
				var ret;
				if ($.isFunction(ts.p.onPaging) ) { ret = ts.p.onPaging.call(ts,onpaging); }
				if(ret==='stop') {return false;}
				ts.p.selrow = null;
				if(ts.p.multiselect) {ts.p.selarrrow =[]; setHeadCheckBox( false );}
				ts.p.savedRow = [];
				return true;
			};
			pgid = pgid.substr(1);
			tp += "_" + pgid;
			pgcnt = "pg_"+pgid;
			lft = pgid+"_left"; cent = pgid+"_center"; rgt = pgid+"_right";
			$("#"+$.jgrid.jqID(pgid) )
			.append("<div id='"+pgcnt+"' class='ui-pager-control' role='group'><table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'><tbody><tr><td id='"+lft+"' align='left'></td><td id='"+cent+"' align='center' style='white-space:pre;'></td><td id='"+rgt+"' align='right'></td></tr></tbody></table></div>")
			.attr("dir","ltr"); //explicit setting
			if(ts.p.rowList.length >0){
				str = "<td dir='"+dir+"'>";
				str +="<select class='ui-pg-selbox' role='listbox'>";
				for(i=0;i<ts.p.rowList.length;i++){
					str +="<option role=\"option\" value=\""+ts.p.rowList[i]+"\""+((ts.p.rowNum === ts.p.rowList[i])?" selected=\"selected\"":"")+">"+ts.p.rowList[i]+"</option>";
				}
				str +="</select></td>";
			}
			if(dir==="rtl") { pgl += str; }
			if(ts.p.pginput===true) { pginp= "<td dir='"+dir+"'>"+$.jgrid.format(ts.p.pgtext || "","<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>","<span id='sp_1_"+$.jgrid.jqID(pgid)+"'></span>")+"</td>";}
			if(ts.p.pgbuttons===true) {
				var po=["first"+tp,"prev"+tp, "next"+tp,"last"+tp]; if(dir==="rtl") { po.reverse(); }
				pgl += "<td id='"+po[0]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-first'></span></td>";
				pgl += "<td id='"+po[1]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-prev'></span></td>";
				pgl += pginp !== "" ? sep+pginp+sep:"";
				pgl += "<td id='"+po[2]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-next'></span></td>";
				pgl += "<td id='"+po[3]+"' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-end'></span></td>";
			} else if (pginp !== "") { pgl += pginp; }
			if(dir==="ltr") { pgl += str; }
			pgl += "</tr></tbody></table>";
			if(ts.p.viewrecords===true) {$("td#"+pgid+"_"+ts.p.recordpos,"#"+pgcnt).append("<div dir='"+dir+"' style='text-align:"+ts.p.recordpos+"' class='ui-paging-info'></div>");}
			$("td#"+pgid+"_"+ts.p.pagerpos,"#"+pgcnt).append(pgl);
			tdw = $(".ui-jqgrid").css("font-size") || "11px";
			$(document.body).append("<div id='testpg' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:"+tdw+";visibility:hidden;' ></div>");
			twd = $(pgl).clone().appendTo("#testpg").width();
			$("#testpg").remove();
			if(twd > 0) {
				if(pginp !== "") { twd += 50; } //should be param
				$("td#"+pgid+"_"+ts.p.pagerpos,"#"+pgcnt).width(twd);
			}
			ts.p._nvtd = [];
			ts.p._nvtd[0] = twd ? Math.floor((ts.p.width - twd)/2) : Math.floor(ts.p.width/3);
			ts.p._nvtd[1] = 0;
			pgl=null;
			$('.ui-pg-selbox',"#"+pgcnt).bind('change',function() {
				if(!clearVals('records')) { return false; }
				ts.p.page = Math.round(ts.p.rowNum*(ts.p.page-1)/this.value-0.5)+1;
				ts.p.rowNum = this.value;
				if(ts.p.pager) { $('.ui-pg-selbox',ts.p.pager).val(this.value); }
				if(ts.p.toppager) { $('.ui-pg-selbox',ts.p.toppager).val(this.value); }
				populate();
				return false;
			});
			if(ts.p.pgbuttons===true) {
			$(".ui-pg-button","#"+pgcnt).hover(function(){
				if($(this).hasClass('ui-state-disabled')) {
					this.style.cursor='default';
				} else {
					$(this).addClass('ui-state-hover');
					this.style.cursor='pointer';
				}
			},function() {
				if(!$(this).hasClass('ui-state-disabled')) {
					$(this).removeClass('ui-state-hover');
					this.style.cursor= "default";
				}
			});
			$("#first"+$.jgrid.jqID(tp)+", #prev"+$.jgrid.jqID(tp)+", #next"+$.jgrid.jqID(tp)+", #last"+$.jgrid.jqID(tp)).click( function() {
				var cp = intNum(ts.p.page,1),
				last = intNum(ts.p.lastpage,1), selclick = false,
				fp=true, pp=true, np=true,lp=true;
				if(last ===0 || last===1) {fp=false;pp=false;np=false;lp=false; }
				else if( last>1 && cp >=1) {
					if( cp === 1) { fp=false; pp=false; }
					//else if( cp>1 && cp <last){ }
					else if( cp===last){ np=false;lp=false; }
				} else if( last>1 && cp===0 ) { np=false;lp=false; cp=last-1;}
				if(!clearVals(this.id)) { return false; }
				if( this.id === 'first'+tp && fp ) { ts.p.page=1; selclick=true;}
				if( this.id === 'prev'+tp && pp) { ts.p.page=(cp-1); selclick=true;}
				if( this.id === 'next'+tp && np) { ts.p.page=(cp+1); selclick=true;}
				if( this.id === 'last'+tp && lp) { ts.p.page=last; selclick=true;}
				if(selclick) {
					populate();
				}
				return false;
			});
			}
			if(ts.p.pginput===true) {
			$('input.ui-pg-input',"#"+pgcnt).keypress( function(e) {
				var key = e.charCode || e.keyCode || 0;
				if(key === 13) {
					if(!clearVals('user')) { return false; }
					$(this).val( intNum( $(this).val(), 1));
					ts.p.page = ($(this).val()>0) ? $(this).val():ts.p.page;
					populate();
					return false;
				}
				return this;
			});
			}
		},
		multiSort = function(iCol, obj ) {
			var splas, sort="", cm = ts.p.colModel, fs=false, ls, 
					selTh = ts.p.frozenColumns ?  obj : ts.grid.headers[iCol].el, so="";
			$("span.ui-grid-ico-sort",selTh).addClass('ui-state-disabled');
			$(selTh).attr("aria-selected","false");

			if(cm[iCol].lso) {
				if(cm[iCol].lso==="asc") {
					cm[iCol].lso += "-desc";
					so = "desc";
				} else if(cm[iCol].lso==="desc") {
					cm[iCol].lso += "-asc";
					so = "asc";
				} else if(cm[iCol].lso==="asc-desc" || cm[iCol].lso==="desc-asc") {
					cm[iCol].lso="";
				}
			} else {
				cm[iCol].lso = so = cm[iCol].firstsortorder || 'asc';
			}
			if( so ) {
				$("span.s-ico",selTh).show();
				$("span.ui-icon-"+so,selTh).removeClass('ui-state-disabled');
				$(selTh).attr("aria-selected","true");
			} else {
				if(!ts.p.viewsortcols[0]) {
					$("span.s-ico",selTh).hide();
				}
			}
			ts.p.sortorder = "";
			$.each(cm, function(i){
				if(this.lso) {
					if(i>0 && fs) {
						sort += ", ";
					}
					splas = this.lso.split("-");
					sort += cm[i].index || cm[i].name;
					sort += " "+splas[splas.length-1];
					fs = true;
					ts.p.sortorder = splas[splas.length-1];
				}
			});
			ls = sort.lastIndexOf(ts.p.sortorder);
			sort = sort.substring(0, ls);
			ts.p.sortname = sort;
		},
		sortData = function (index, idxcol,reload,sor, obj){
			if(!ts.p.colModel[idxcol].sortable) { return; }
			if(ts.p.savedRow.length > 0) {return;}
			if(!reload) {
				if( ts.p.lastsort === idxcol ) {
					if( ts.p.sortorder === 'asc') {
						ts.p.sortorder = 'desc';
					} else if(ts.p.sortorder === 'desc') { ts.p.sortorder = 'asc';}
				} else { ts.p.sortorder = ts.p.colModel[idxcol].firstsortorder || 'asc'; }
				ts.p.page = 1;
			}
			if(ts.p.multiSort) {
				multiSort( idxcol, obj);
			} else {
				if(sor) {
					if(ts.p.lastsort === idxcol && ts.p.sortorder === sor && !reload) { return; }
					ts.p.sortorder = sor;
				}
				var previousSelectedTh = ts.grid.headers[ts.p.lastsort].el, newSelectedTh = ts.p.frozenColumns ?  obj : ts.grid.headers[idxcol].el;

				$("span.ui-grid-ico-sort",previousSelectedTh).addClass('ui-state-disabled');
				$(previousSelectedTh).attr("aria-selected","false");
				if(ts.p.frozenColumns) {
					ts.grid.fhDiv.find("span.ui-grid-ico-sort").addClass('ui-state-disabled');
					ts.grid.fhDiv.find("th").attr("aria-selected","false");
				}
				$("span.ui-icon-"+ts.p.sortorder,newSelectedTh).removeClass('ui-state-disabled');
				$(newSelectedTh).attr("aria-selected","true");
				if(!ts.p.viewsortcols[0]) {
					if(ts.p.lastsort !== idxcol) {
						if(ts.p.frozenColumns){
							ts.grid.fhDiv.find("span.s-ico").hide();
						}
						$("span.s-ico",previousSelectedTh).hide();
						$("span.s-ico",newSelectedTh).show();
					}
				}
				index = index.substring(5 + ts.p.id.length + 1); // bad to be changed!?!
				ts.p.sortname = ts.p.colModel[idxcol].index || index;
			}
			if ($(ts).triggerHandler("jqGridSortCol", [ts.p.sortname, idxcol, ts.p.sortorder]) === 'stop') {
				ts.p.lastsort = idxcol;
				return;
			}
			if($.isFunction(ts.p.onSortCol)) {if (ts.p.onSortCol.call(ts, ts.p.sortname, idxcol, ts.p.sortorder)==='stop') {ts.p.lastsort = idxcol; return;}}
			if(ts.p.datatype === "local") {
				if(ts.p.deselectAfterSort) {$(ts).jqGrid("resetSelection");}
			} else {
				ts.p.selrow = null;
				if(ts.p.multiselect){setHeadCheckBox( false );}
				ts.p.selarrrow =[];
				ts.p.savedRow =[];
			}
			if(ts.p.scroll) {
				var sscroll = ts.grid.bDiv.scrollLeft;
				emptyRows.call(ts, true, false);
				ts.grid.hDiv.scrollLeft = sscroll;
			}
			if(ts.p.subGrid && ts.p.datatype === 'local') {
				$("td.sgexpanded","#"+$.jgrid.jqID(ts.p.id)).each(function(){
					$(this).trigger("click");
				});
			}
			populate();
			ts.p.lastsort = idxcol;
			if(ts.p.sortname !== index && idxcol) {ts.p.lastsort = idxcol;}
		},
		setColWidth = function () {
			var initwidth = 0, brd=$.jgrid.cell_width? 0: intNum(ts.p.cellLayout,0), vc=0, lvc, scw=intNum(ts.p.scrollOffset,0),cw,hs=false,aw,gw=0,cr;
			$.each(ts.p.colModel, function() {
				if(this.hidden === undefined) {this.hidden=false;}
				if(ts.p.grouping && ts.p.autowidth) {
					var ind = $.inArray(this.name, ts.p.groupingView.groupField);
					if(ind >= 0 && ts.p.groupingView.groupColumnShow.length > ind) {
						this.hidden = !ts.p.groupingView.groupColumnShow[ind];
					}
				}
				this.widthOrg = cw = intNum(this.width,0);
				if(this.hidden===false){
					initwidth += cw+brd;
					if(this.fixed) {
						gw += cw+brd;
					} else {
						vc++;
					}
				}
			});
			if(isNaN(ts.p.width)) {
				ts.p.width  = initwidth + ((ts.p.shrinkToFit ===false && !isNaN(ts.p.height)) ? scw : 0);
			}
			grid.width = ts.p.width;
			ts.p.tblwidth = initwidth;
			if(ts.p.shrinkToFit ===false && ts.p.forceFit === true) {ts.p.forceFit=false;}
			if(ts.p.shrinkToFit===true && vc > 0) {
				aw = grid.width-brd*vc-gw;
				if(!isNaN(ts.p.height)) {
					aw -= scw;
					hs = true;
				}
				initwidth =0;
				$.each(ts.p.colModel, function(i) {
					if(this.hidden === false && !this.fixed){
						cw = Math.round(aw*this.width/(ts.p.tblwidth-brd*vc-gw));
						this.width =cw;
						initwidth += cw;
						lvc = i;
					}
				});
				cr =0;
				if (hs) {
					if(grid.width-gw-(initwidth+brd*vc) !== scw){
						cr = grid.width-gw-(initwidth+brd*vc)-scw;
					}
				} else if(!hs && Math.abs(grid.width-gw-(initwidth+brd*vc)) !== 1) {
					cr = grid.width-gw-(initwidth+brd*vc);
				}
				ts.p.colModel[lvc].width += cr;
				ts.p.tblwidth = initwidth+cr+brd*vc+gw;
				if(ts.p.tblwidth > ts.p.width) {
					ts.p.colModel[lvc].width -= (ts.p.tblwidth - parseInt(ts.p.width,10));
					ts.p.tblwidth = ts.p.width;
				}
			}
		},
		nextVisible= function(iCol) {
			var ret = iCol, j=iCol, i;
			for (i = iCol+1;i<ts.p.colModel.length;i++){
				if(ts.p.colModel[i].hidden !== true ) {
					j=i; break;
				}
			}
			return j-ret;
		},
		getOffset = function (iCol) {
			var $th = $(ts.grid.headers[iCol].el), ret = [$th.position().left + $th.outerWidth()];
			if(ts.p.direction==="rtl") { ret[0] = ts.p.width - ret[0]; }
			ret[0] -= ts.grid.bDiv.scrollLeft;
			ret.push($(ts.grid.hDiv).position().top);
			ret.push($(ts.grid.bDiv).offset().top - $(ts.grid.hDiv).offset().top + $(ts.grid.bDiv).height());
			return ret;
		},
		getColumnHeaderIndex = function (th) {
			var i, headers = ts.grid.headers, ci = $.jgrid.getCellIndex(th);
			for (i = 0; i < headers.length; i++) {
				if (th === headers[i].el) {
					ci = i;
					break;
				}
			}
			return ci;
		};
		this.p.id = this.id;
		if ($.inArray(ts.p.multikey,sortkeys) === -1 ) {ts.p.multikey = false;}
		ts.p.keyIndex=false;
		ts.p.keyName=false;
		for (i=0; i<ts.p.colModel.length;i++) {
			ts.p.colModel[i] = $.extend(true, {}, ts.p.cmTemplate, ts.p.colModel[i].template || {}, ts.p.colModel[i]);
			if (ts.p.keyIndex === false && ts.p.colModel[i].key===true) {
				ts.p.keyIndex = i;
			}
		}
		ts.p.sortorder = ts.p.sortorder.toLowerCase();
		$.jgrid.cell_width = $.jgrid.cellWidth();
		if(ts.p.grouping===true) {
			ts.p.scroll = false;
			ts.p.rownumbers = false;
			//ts.p.subGrid = false; expiremental
			ts.p.treeGrid = false;
			ts.p.gridview = true;
		}
		if(this.p.treeGrid === true) {
			try { $(this).jqGrid("setTreeGrid");} catch (_) {}
			if(ts.p.datatype !== "local") { ts.p.localReader = {id: "_id_"};	}
		}
		if(this.p.subGrid) {
			try { $(ts).jqGrid("setSubGrid");} catch (s){}
		}
		if(this.p.multiselect) {
			this.p.colNames.unshift("<input role='checkbox' id='cb_"+this.p.id+"' class='cbox' type='checkbox'/>");
			this.p.colModel.unshift({name:'cb',width:$.jgrid.cell_width ? ts.p.multiselectWidth+ts.p.cellLayout : ts.p.multiselectWidth,sortable:false,resizable:false,hidedlg:true,search:false,align:'center',fixed:true});
		}
		if(this.p.rownumbers) {
			this.p.colNames.unshift("");
			this.p.colModel.unshift({name:'rn',width:ts.p.rownumWidth,sortable:false,resizable:false,hidedlg:true,search:false,align:'center',fixed:true});
		}
		ts.p.xmlReader = $.extend(true,{
			root: "rows",
			row: "row",
			page: "rows>page",
			total: "rows>total",
			records : "rows>records",
			repeatitems: true,
			cell: "cell",
			id: "[id]",
			userdata: "userdata",
			subgrid: {root:"rows", row: "row", repeatitems: true, cell:"cell"}
		}, ts.p.xmlReader);
		ts.p.jsonReader = $.extend(true,{
			root: "rows",
			page: "page",
			total: "total",
			records: "records",
			repeatitems: true,
			cell: "cell",
			id: "id",
			userdata: "userdata",
			subgrid: {root:"rows", repeatitems: true, cell:"cell"}
		},ts.p.jsonReader);
		ts.p.localReader = $.extend(true,{
			root: "rows",
			page: "page",
			total: "total",
			records: "records",
			repeatitems: false,
			cell: "cell",
			id: "id",
			userdata: "userdata",
			subgrid: {root:"rows", repeatitems: true, cell:"cell"}
		},ts.p.localReader);
		if(ts.p.scroll){
			ts.p.pgbuttons = false; ts.p.pginput=false; ts.p.rowList=[];
		}
		if(ts.p.data.length) { refreshIndex(); }
		var thead = "<thead><tr class='ui-jqgrid-labels' role='rowheader'>",
		tdc, idn, w, res, sort,
		td, ptr, tbody, imgs,iac="",idc="",sortarr=[], sortord=[], sotmp=[];
		if(ts.p.shrinkToFit===true && ts.p.forceFit===true) {
			for (i=ts.p.colModel.length-1;i>=0;i--){
				if(!ts.p.colModel[i].hidden) {
					ts.p.colModel[i].resizable=false;
					break;
				}
			}
		}
		if(ts.p.viewsortcols[1] === 'horizontal') {iac=" ui-i-asc";idc=" ui-i-desc";}
		tdc = isMSIE ?  "class='ui-th-div-ie'" :"";
		imgs = "<span class='s-ico' style='display:none'><span sort='asc' class='ui-grid-ico-sort ui-icon-asc"+iac+" ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-"+dir+"'></span>";
		imgs += "<span sort='desc' class='ui-grid-ico-sort ui-icon-desc"+idc+" ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-"+dir+"'></span></span>";
		if(ts.p.multiSort) {
			sortarr = ts.p.sortname.split(",");
			for (i=0; i<sortarr.length; i++) {
				sotmp = $.trim(sortarr[i]).split(" ");
				sortarr[i] = $.trim(sotmp[0]);
				sortord[i] = sotmp[1] ? $.trim(sotmp[1]) : ts.p.sortorder || "asc";
			}
		}
		for(i=0;i<this.p.colNames.length;i++){
			var tooltip = ts.p.headertitles ? (" title=\""+$.jgrid.stripHtml(ts.p.colNames[i])+"\"") :"";
			thead += "<th id='"+ts.p.id+"_"+ts.p.colModel[i].name+"' role='columnheader' class='ui-state-default ui-th-column ui-th-"+dir+"'"+ tooltip+">";
			idn = ts.p.colModel[i].index || ts.p.colModel[i].name;
			thead += "<div id='jqgh_"+ts.p.id+"_"+ts.p.colModel[i].name+"' "+tdc+">"+ts.p.colNames[i];
			if(!ts.p.colModel[i].width)  { ts.p.colModel[i].width = 150; }
			else { ts.p.colModel[i].width = parseInt(ts.p.colModel[i].width,10); }
			if(typeof ts.p.colModel[i].title !== "boolean") { ts.p.colModel[i].title = true; }
			ts.p.colModel[i].lso = "";
			if (idn === ts.p.sortname) {
				ts.p.lastsort = i;
			}
			if(ts.p.multiSort) {
				sotmp = $.inArray(idn,sortarr);
				if( sotmp !== -1 ) {
					ts.p.colModel[i].lso = sortord[sotmp];
				}
			}
			thead += imgs+"</div></th>";
		}
		thead += "</tr></thead>";
		imgs = null;
		$(this).append(thead);
		$("thead tr:first th",this).hover(function(){$(this).addClass('ui-state-hover');},function(){$(this).removeClass('ui-state-hover');});
		if(this.p.multiselect) {
			var emp=[], chk;
			$('#cb_'+$.jgrid.jqID(ts.p.id),this).bind('click',function(){
				ts.p.selarrrow = [];
				var froz = ts.p.frozenColumns === true ? ts.p.id + "_frozen" : "";
				if (this.checked) {
					$(ts.rows).each(function(i) {
						if (i>0) {
							if(!$(this).hasClass("ui-subgrid") && !$(this).hasClass("jqgroup") && !$(this).hasClass('ui-state-disabled')){
								$("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+$.jgrid.jqID(this.id) )[ts.p.useProp ? 'prop': 'attr']("checked",true);
								$(this).addClass("ui-state-highlight").attr("aria-selected","true");  
								ts.p.selarrrow.push(this.id);
								ts.p.selrow = this.id;
								if(froz) {
									$("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+$.jgrid.jqID(this.id), ts.grid.fbDiv )[ts.p.useProp ? 'prop': 'attr']("checked",true);
									$("#"+$.jgrid.jqID(this.id), ts.grid.fbDiv).addClass("ui-state-highlight");
								}
							}
						}
					});
					chk=true;
					emp=[];
				}
				else {
					$(ts.rows).each(function(i) {
						if(i>0) {
							if(!$(this).hasClass("ui-subgrid") && !$(this).hasClass('ui-state-disabled')){
								$("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+$.jgrid.jqID(this.id) )[ts.p.useProp ? 'prop': 'attr']("checked", false);
								$(this).removeClass("ui-state-highlight").attr("aria-selected","false");
								emp.push(this.id);
								if(froz) {
									$("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+$.jgrid.jqID(this.id), ts.grid.fbDiv )[ts.p.useProp ? 'prop': 'attr']("checked",false);
									$("#"+$.jgrid.jqID(this.id), ts.grid.fbDiv).removeClass("ui-state-highlight");
								}
							}
						}
					});
					ts.p.selrow = null;
					chk=false;
				}
				$(ts).triggerHandler("jqGridSelectAll", [chk ? ts.p.selarrrow : emp, chk]);
				if($.isFunction(ts.p.onSelectAll)) {ts.p.onSelectAll.call(ts, chk ? ts.p.selarrrow : emp,chk);}
			});
		}

		if(ts.p.autowidth===true) {
			var pw = $(eg).innerWidth();
			ts.p.width = pw > 0?  pw: 'nw';
		}
		setColWidth();
		$(eg).css("width",grid.width+"px").append("<div class='ui-jqgrid-resize-mark' id='rs_m"+ts.p.id+"'>&#160;</div>");
		$(gv).css("width",grid.width+"px");
		thead = $("thead:first",ts).get(0);
		var	tfoot = "";
		if(ts.p.footerrow) { tfoot += "<table role='grid' style='width:"+ts.p.tblwidth+"px' class='ui-jqgrid-ftable' cellspacing='0' cellpadding='0' border='0'><tbody><tr role='row' class='ui-widget-content footrow footrow-"+dir+"'>"; }
		var thr = $("tr:first",thead),
		firstr = "<tr class='jqgfirstrow' role='row' style='height:auto'>";
		ts.p.disableClick=false;
		$("th",thr).each(function ( j ) {
			w = ts.p.colModel[j].width;
			if(ts.p.colModel[j].resizable === undefined) {ts.p.colModel[j].resizable = true;}
			if(ts.p.colModel[j].resizable){
				res = document.createElement("span");
				$(res).html("&#160;").addClass('ui-jqgrid-resize ui-jqgrid-resize-'+dir)
				.css("cursor","col-resize");
				$(this).addClass(ts.p.resizeclass);
			} else {
				res = "";
			}
			$(this).css("width",w+"px").prepend(res);
			res = null;
			var hdcol = "";
			if( ts.p.colModel[j].hidden ) {
				$(this).css("display","none");
				hdcol = "display:none;";
			}
			firstr += "<td role='gridcell' style='height:0px;width:"+w+"px;"+hdcol+"'></td>";
			grid.headers[j] = { width: w, el: this };
			sort = ts.p.colModel[j].sortable;
			if( typeof sort !== 'boolean') {ts.p.colModel[j].sortable =  true; sort=true;}
			var nm = ts.p.colModel[j].name;
			if( !(nm === 'cb' || nm==='subgrid' || nm==='rn') ) {
				if(ts.p.viewsortcols[2]){
					$(">div",this).addClass('ui-jqgrid-sortable');
				}
			}
			if(sort) {
				if(ts.p.multiSort) {
					if(ts.p.viewsortcols[0]) {
						$("div span.s-ico",this).show(); 
						if(ts.p.colModel[j].lso){ 
							$("div span.ui-icon-"+ts.p.colModel[j].lso,this).removeClass("ui-state-disabled");
						}
					} else if( ts.p.colModel[j].lso) {
						$("div span.s-ico",this).show();
						$("div span.ui-icon-"+ts.p.colModel[j].lso,this).removeClass("ui-state-disabled");
					}
				} else {
					if(ts.p.viewsortcols[0]) {$("div span.s-ico",this).show(); if(j===ts.p.lastsort){ $("div span.ui-icon-"+ts.p.sortorder,this).removeClass("ui-state-disabled");}}
					else if( j === ts.p.lastsort) {$("div span.s-ico",this).show();$("div span.ui-icon-"+ts.p.sortorder,this).removeClass("ui-state-disabled");}
				}
			}
			if(ts.p.footerrow) { tfoot += "<td role='gridcell' "+formatCol(j,0,'', null, '', false)+">&#160;</td>"; }
		}).mousedown(function(e) {
			if ($(e.target).closest("th>span.ui-jqgrid-resize").length !== 1) { return; }
			var ci = getColumnHeaderIndex(this);
			if(ts.p.forceFit===true) {ts.p.nv= nextVisible(ci);}
			grid.dragStart(ci, e, getOffset(ci));
			return false;
		}).click(function(e) {
			if (ts.p.disableClick) {
				ts.p.disableClick = false;
				return false;
			}
			var s = "th>div.ui-jqgrid-sortable",r,d;
			if (!ts.p.viewsortcols[2]) { s = "th>div>span>span.ui-grid-ico-sort"; }
			var t = $(e.target).closest(s);
			if (t.length !== 1) { return; }
			var ci;
			if(ts.p.frozenColumns) {
				var tid =  $(this)[0].id.substring( ts.p.id.length + 1 );
				$(ts.p.colModel).each(function(i){
					if (this.name === tid) {
						ci = i;return false;
					}
				});
			} else {
				ci = getColumnHeaderIndex(this);
			}
			if (!ts.p.viewsortcols[2]) { r=true;d=t.attr("sort"); }
			if(ci != null){
				sortData( $('div',this)[0].id, ci, r, d, this);
			}
			return false;
		});
		if (ts.p.sortable && $.fn.sortable) {
			try {
				$(ts).jqGrid("sortableColumns", thr);
			} catch (e){}
		}
		if(ts.p.footerrow) { tfoot += "</tr></tbody></table>"; }
		firstr += "</tr>";
		tbody = document.createElement("tbody");
		this.appendChild(tbody);
		$(this).addClass('ui-jqgrid-btable').append(firstr);
		firstr = null;
		var hTable = $("<table class='ui-jqgrid-htable' style='width:"+ts.p.tblwidth+"px' role='grid' aria-labelledby='gbox_"+this.id+"' cellspacing='0' cellpadding='0' border='0'></table>").append(thead),
		hg = (ts.p.caption && ts.p.hiddengrid===true) ? true : false,
		hb = $("<div class='ui-jqgrid-hbox" + (dir==="rtl" ? "-rtl" : "" )+"'></div>");
		thead = null;
		grid.hDiv = document.createElement("div");
		$(grid.hDiv)
			.css({ width: grid.width+"px"})
			.addClass("ui-state-default ui-jqgrid-hdiv")
			.append(hb);
		$(hb).append(hTable);
		hTable = null;
		if(hg) { $(grid.hDiv).hide(); }
		if(ts.p.pager){
			// TBD -- escape ts.p.pager here?
			if(typeof ts.p.pager === "string") {if(ts.p.pager.substr(0,1) !== "#") { ts.p.pager = "#"+ts.p.pager;} }
			else { ts.p.pager = "#"+ $(ts.p.pager).attr("id");}
			$(ts.p.pager).css({width: grid.width+"px"}).addClass('ui-state-default ui-jqgrid-pager ui-corner-bottom').appendTo(eg);
			if(hg) {$(ts.p.pager).hide();}
			setPager(ts.p.pager,'');
		}
		if( ts.p.cellEdit === false && ts.p.hoverrows === true) {
		$(ts).bind('mouseover',function(e) {
			ptr = $(e.target).closest("tr.jqgrow");
			if($(ptr).attr("class") !== "ui-subgrid") {
				$(ptr).addClass("ui-state-hover");
			}
		}).bind('mouseout',function(e) {
			ptr = $(e.target).closest("tr.jqgrow");
			$(ptr).removeClass("ui-state-hover");
		});
		}
		var ri,ci, tdHtml;
		$(ts).before(grid.hDiv).click(function(e) {
			td = e.target;
			ptr = $(td,ts.rows).closest("tr.jqgrow");
			if($(ptr).length === 0 || ptr[0].className.indexOf( 'ui-state-disabled' ) > -1 || ($(td,ts).closest("table.ui-jqgrid-btable").attr('id') || '').replace("_frozen","") !== ts.id ) {
				return this;
			}
			var scb = $(td).hasClass("cbox"),
			cSel = $(ts).triggerHandler("jqGridBeforeSelectRow", [ptr[0].id, e]);
			cSel = (cSel === false || cSel === 'stop') ? false : true;
			if(cSel && $.isFunction(ts.p.beforeSelectRow)) { cSel = ts.p.beforeSelectRow.call(ts,ptr[0].id, e); }
			if (td.tagName === 'A' || ((td.tagName === 'INPUT' || td.tagName === 'TEXTAREA' || td.tagName === 'OPTION' || td.tagName === 'SELECT' ) && !scb) ) { return; }
			if(cSel === true) {
				ri = ptr[0].id;
				ci = $.jgrid.getCellIndex(td);
				tdHtml = $(td).closest("td,th").html();
				$(ts).triggerHandler("jqGridCellSelect", [ri,ci,tdHtml,e]);
				if($.isFunction(ts.p.onCellSelect)) {
					ts.p.onCellSelect.call(ts,ri,ci,tdHtml,e);
				}
				if(ts.p.cellEdit === true) {
					if(ts.p.multiselect && scb){
						$(ts).jqGrid("setSelection", ri ,true,e);
					} else {
						ri = ptr[0].rowIndex;
						try {$(ts).jqGrid("editCell",ri,ci,true);} catch (_) {}
					}
				} else if ( !ts.p.multikey ) {
					if(ts.p.multiselect && ts.p.multiboxonly) {
						if(scb){$(ts).jqGrid("setSelection",ri,true,e);}
						else {
							var frz = ts.p.frozenColumns ? ts.p.id+"_frozen" : "";
							$(ts.p.selarrrow).each(function(i,n){
								var trid = $(ts).jqGrid('getGridRowById',n);
								$( trid ).removeClass("ui-state-highlight");
								$("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+$.jgrid.jqID(n))[ts.p.useProp ? 'prop': 'attr']("checked", false);
								if(frz) {
									$("#"+$.jgrid.jqID(n), "#"+$.jgrid.jqID(frz)).removeClass("ui-state-highlight");
									$("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+$.jgrid.jqID(n), "#"+$.jgrid.jqID(frz))[ts.p.useProp ? 'prop': 'attr']("checked", false);
								}
							});
							ts.p.selarrrow = [];
							$(ts).jqGrid("setSelection",ri,true,e);
						}
					} else {
						$(ts).jqGrid("setSelection",ri,true,e);
					}
				} else {
					if(e[ts.p.multikey]) {
						$(ts).jqGrid("setSelection",ri,true,e);
					} else if(ts.p.multiselect && scb) {
						scb = $("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+ri).is(":checked");
						$("#jqg_"+$.jgrid.jqID(ts.p.id)+"_"+ri)[ts.p.useProp ? 'prop' : 'attr']("checked", scb);
					}
				}
			}
		}).bind('reloadGrid', function(e,opts) {
			if(ts.p.treeGrid ===true) {	ts.p.datatype = ts.p.treedatatype;}
			if (opts && opts.current) {
				ts.grid.selectionPreserver(ts);
			}
			if(ts.p.datatype==="local"){ $(ts).jqGrid("resetSelection");  if(ts.p.data.length) { refreshIndex();} }
			else if(!ts.p.treeGrid) {
				ts.p.selrow=null;
				if(ts.p.multiselect) {ts.p.selarrrow =[];setHeadCheckBox(false);}
				ts.p.savedRow = [];
			}
			if(ts.p.scroll) {emptyRows.call(ts, true, false);}
			if (opts && opts.page) {
				var page = opts.page;
				if (page > ts.p.lastpage) { page = ts.p.lastpage; }
				if (page < 1) { page = 1; }
				ts.p.page = page;
				if (ts.grid.prevRowHeight) {
					ts.grid.bDiv.scrollTop = (page - 1) * ts.grid.prevRowHeight * ts.p.rowNum;
				} else {
					ts.grid.bDiv.scrollTop = 0;
				}
			}
			if (ts.grid.prevRowHeight && ts.p.scroll) {
				delete ts.p.lastpage;
				ts.grid.populateVisible();
			} else {
				ts.grid.populate();
			}
			if(ts.p._inlinenav===true) {$(ts).jqGrid('showAddEditButtons');}
			return false;
		})
		.dblclick(function(e) {
			td = e.target;
			ptr = $(td,ts.rows).closest("tr.jqgrow");
			if($(ptr).length === 0 ){return;}
			ri = ptr[0].rowIndex;
			ci = $.jgrid.getCellIndex(td);
			$(ts).triggerHandler("jqGridDblClickRow", [$(ptr).attr("id"),ri,ci,e]);
			if ($.isFunction(ts.p.ondblClickRow)) { ts.p.ondblClickRow.call(ts,$(ptr).attr("id"),ri,ci, e); }
		})
		.bind('contextmenu', function(e) {
			td = e.target;
			ptr = $(td,ts.rows).closest("tr.jqgrow");
			if($(ptr).length === 0 ){return;}
			if(!ts.p.multiselect) {	$(ts).jqGrid("setSelection",ptr[0].id,true,e);	}
			ri = ptr[0].rowIndex;
			ci = $.jgrid.getCellIndex(td);
			$(ts).triggerHandler("jqGridRightClickRow", [$(ptr).attr("id"),ri,ci,e]);
			if ($.isFunction(ts.p.onRightClickRow)) { ts.p.onRightClickRow.call(ts,$(ptr).attr("id"),ri,ci, e); }
		});
		grid.bDiv = document.createElement("div");
		if(isMSIE) { if(String(ts.p.height).toLowerCase() === "auto") { ts.p.height = "100%"; } }
		$(grid.bDiv)
			.append($('<div style="position:relative;'+(isMSIE && $.jgrid.msiever() < 8 ? "height:0.01%;" : "")+'"></div>').append('<div></div>').append(this))
			.addClass("ui-jqgrid-bdiv")
			.css({ height: ts.p.height+(isNaN(ts.p.height)?"":"px"), width: (grid.width)+"px"})
			.scroll(grid.scrollGrid);
		$("table:first",grid.bDiv).css({width:ts.p.tblwidth+"px"});
		if( !$.support.tbody ) { //IE
			if( $("tbody",this).length === 2 ) { $("tbody:gt(0)",this).remove();}
		}
		if(ts.p.multikey){
			if( $.jgrid.msie) {
				$(grid.bDiv).bind("selectstart",function(){return false;});
			} else {
				$(grid.bDiv).bind("mousedown",function(){return false;});
			}
		}
		if(hg) {$(grid.bDiv).hide();}
		grid.cDiv = document.createElement("div");
		var arf = ts.p.hidegrid===true ? $("<a role='link' class='ui-jqgrid-titlebar-close HeaderButton' />").hover(
			function(){ arf.addClass('ui-state-hover');},
			function() {arf.removeClass('ui-state-hover');})
		.append("<span class='ui-icon ui-icon-circle-triangle-n'></span>").css((dir==="rtl"?"left":"right"),"0px") : "";
		$(grid.cDiv).append(arf).append("<span class='ui-jqgrid-title'>"+ts.p.caption+"</span>")
		.addClass("ui-jqgrid-titlebar ui-jqgrid-caption"+(dir==="rtl" ? "-rtl" :"" )+" ui-widget-header ui-corner-top ui-helper-clearfix");
		$(grid.cDiv).insertBefore(grid.hDiv);
		if( ts.p.toolbar[0] ) {
			grid.uDiv = document.createElement("div");
			if(ts.p.toolbar[1] === "top") {$(grid.uDiv).insertBefore(grid.hDiv);}
			else if (ts.p.toolbar[1]==="bottom" ) {$(grid.uDiv).insertAfter(grid.hDiv);}
			if(ts.p.toolbar[1]==="both") {
				grid.ubDiv = document.createElement("div");
				$(grid.uDiv).addClass("ui-userdata ui-state-default").attr("id","t_"+this.id).insertBefore(grid.hDiv);
				$(grid.ubDiv).addClass("ui-userdata ui-state-default").attr("id","tb_"+this.id).insertAfter(grid.hDiv);
				if(hg)  {$(grid.ubDiv).hide();}
			} else {
				$(grid.uDiv).width(grid.width).addClass("ui-userdata ui-state-default").attr("id","t_"+this.id);
			}
			if(hg) {$(grid.uDiv).hide();}
		}
		if(ts.p.toppager) {
			ts.p.toppager = $.jgrid.jqID(ts.p.id)+"_toppager";
			grid.topDiv = $("<div id='"+ts.p.toppager+"'></div>")[0];
			ts.p.toppager = "#"+ts.p.toppager;
			$(grid.topDiv).addClass('ui-state-default ui-jqgrid-toppager').width(grid.width).insertBefore(grid.hDiv);
			setPager(ts.p.toppager,'_t');
		}
		if(ts.p.footerrow) {
			grid.sDiv = $("<div class='ui-jqgrid-sdiv'></div>")[0];
			hb = $("<div class='ui-jqgrid-hbox"+(dir==="rtl"?"-rtl":"")+"'></div>");
			$(grid.sDiv).append(hb).width(grid.width).insertAfter(grid.hDiv);
			$(hb).append(tfoot);
			grid.footers = $(".ui-jqgrid-ftable",grid.sDiv)[0].rows[0].cells;
			if(ts.p.rownumbers) { grid.footers[0].className = 'ui-state-default jqgrid-rownum'; }
			if(hg) {$(grid.sDiv).hide();}
		}
		hb = null;
		if(ts.p.caption) {
			var tdt = ts.p.datatype;
			if(ts.p.hidegrid===true) {
				$(".ui-jqgrid-titlebar-close",grid.cDiv).click( function(e){
					var onHdCl = $.isFunction(ts.p.onHeaderClick),
					elems = ".ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-pager, .ui-jqgrid-sdiv",
					counter, self = this;
					if(ts.p.toolbar[0]===true) {
						if( ts.p.toolbar[1]==='both') {
							elems += ', #' + $(grid.ubDiv).attr('id');
						}
						elems += ', #' + $(grid.uDiv).attr('id');
					}
					counter = $(elems,"#gview_"+$.jgrid.jqID(ts.p.id)).length;

					if(ts.p.gridstate === 'visible') {
						$(elems,"#gbox_"+$.jgrid.jqID(ts.p.id)).slideUp("fast", function() {
							counter--;
							if (counter === 0) {
								$("span",self).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
								ts.p.gridstate = 'hidden';
								if($("#gbox_"+$.jgrid.jqID(ts.p.id)).hasClass("ui-resizable")) { $(".ui-resizable-handle","#gbox_"+$.jgrid.jqID(ts.p.id)).hide(); }
								$(ts).triggerHandler("jqGridHeaderClick", [ts.p.gridstate,e]);
								if(onHdCl) {if(!hg) {ts.p.onHeaderClick.call(ts,ts.p.gridstate,e);}}
							}
						});
					} else if(ts.p.gridstate === 'hidden'){
						$(elems,"#gbox_"+$.jgrid.jqID(ts.p.id)).slideDown("fast", function() {
							counter--;
							if (counter === 0) {
								$("span",self).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
								if(hg) {ts.p.datatype = tdt;populate();hg=false;}
								ts.p.gridstate = 'visible';
								if($("#gbox_"+$.jgrid.jqID(ts.p.id)).hasClass("ui-resizable")) { $(".ui-resizable-handle","#gbox_"+$.jgrid.jqID(ts.p.id)).show(); }
								$(ts).triggerHandler("jqGridHeaderClick", [ts.p.gridstate,e]);
								if(onHdCl) {if(!hg) {ts.p.onHeaderClick.call(ts,ts.p.gridstate,e);}}
							}
						});
					}
					return false;
				});
				if(hg) {ts.p.datatype="local"; $(".ui-jqgrid-titlebar-close",grid.cDiv).trigger("click");}
			}
		} else {$(grid.cDiv).hide();}
		$(grid.hDiv).after(grid.bDiv)
		.mousemove(function (e) {
			if(grid.resizing){grid.dragMove(e);return false;}
		});
		$(".ui-jqgrid-labels",grid.hDiv).bind("selectstart", function () { return false; });
		$(document).bind( "mouseup.jqGrid" + ts.p.id, function () {
			if(grid.resizing) {	grid.dragEnd(); return false;}
			return true;
		});
		ts.formatCol = formatCol;
		ts.sortData = sortData;
		ts.updatepager = updatepager;
		ts.refreshIndex = refreshIndex;
		ts.setHeadCheckBox = setHeadCheckBox;
		ts.constructTr = constructTr;
		ts.formatter = function ( rowId, cellval , colpos, rwdat, act){return formatter(rowId, cellval , colpos, rwdat, act);};
		$.extend(grid,{populate : populate, emptyRows: emptyRows, beginReq: beginReq, endReq: endReq});
		this.grid = grid;
		ts.addXmlData = function(d) {addXmlData(d,ts.grid.bDiv);};
		ts.addJSONData = function(d) {addJSONData(d,ts.grid.bDiv);};
		this.grid.cols = this.rows[0].cells;
		$(ts).triggerHandler("jqGridInitGrid");
		if ($.isFunction( ts.p.onInitGrid )) { ts.p.onInitGrid.call(ts); }

		populate();ts.p.hiddengrid=false;
	});
};
$.jgrid.extend({
	getGridParam : function(pName) {
		var $t = this[0];
		if (!$t || !$t.grid) {return;}
		if (!pName) { return $t.p; }
		return $t.p[pName] !== undefined ? $t.p[pName] : null;
	},
	setGridParam : function (newParams){
		return this.each(function(){
			if (this.grid && typeof newParams === 'object') {$.extend(true,this.p,newParams);}
		});
	},
	getGridRowById: function ( rowid ) {
		var row;
		this.each( function(){
			try {
				//row = this.rows.namedItem( rowid );
				var i = this.rows.length;
				while(i--) {
					if( rowid.toString() === this.rows[i].id) {
						row = this.rows[i];
						break;
					}
				}
			} catch ( e ) {
				row = $(this.grid.bDiv).find( "#" + $.jgrid.jqID( rowid ));
			}
		});
		return row;
	},
	getDataIDs : function () {
		var ids=[], i=0, len, j=0;
		this.each(function(){
			len = this.rows.length;
			if(len && len>0){
				while(i<len) {
					if($(this.rows[i]).hasClass('jqgrow')) {
						ids[j] = this.rows[i].id;
						j++;
					}
					i++;
				}
			}
		});
		return ids;
	},
	setSelection : function(selection,onsr, e) {
		return this.each(function(){
			var $t = this, stat,pt, ner, ia, tpsr, fid;
			if(selection === undefined) { return; }
			onsr = onsr === false ? false : true;
			pt=$($t).jqGrid('getGridRowById', selection);
			if(!pt || !pt.className || pt.className.indexOf( 'ui-state-disabled' ) > -1 ) { return; }
			function scrGrid(iR){
				var ch = $($t.grid.bDiv)[0].clientHeight,
				st = $($t.grid.bDiv)[0].scrollTop,
				rpos = $($t.rows[iR]).position().top,
				rh = $t.rows[iR].clientHeight;
				if(rpos+rh >= ch+st) { $($t.grid.bDiv)[0].scrollTop = rpos-(ch+st)+rh+st; }
				else if(rpos < ch+st) {
					if(rpos < st) {
						$($t.grid.bDiv)[0].scrollTop = rpos;
					}
				}
			}
			if($t.p.scrollrows===true) {
				ner = $($t).jqGrid('getGridRowById',selection).rowIndex;
				if(ner >=0 ){
					scrGrid(ner);
				}
			}
			if($t.p.frozenColumns === true ) {
				fid = $t.p.id+"_frozen";
			}
			if(!$t.p.multiselect) {	
				if(pt.className !== "ui-subgrid") {
					if( $t.p.selrow !== pt.id) {
						$( $($t).jqGrid('getGridRowById', $t.p.selrow) ).removeClass("ui-state-highlight").attr({"aria-selected":"false", "tabindex" : "-1"});
						$(pt).addClass("ui-state-highlight").attr({"aria-selected":"true", "tabindex" : "0"});//.focus();
						if(fid) {
							$("#"+$.jgrid.jqID($t.p.selrow), "#"+$.jgrid.jqID(fid)).removeClass("ui-state-highlight");
							$("#"+$.jgrid.jqID(selection), "#"+$.jgrid.jqID(fid)).addClass("ui-state-highlight");
						}
						stat = true;
					} else {
						stat = false;
					}
					$t.p.selrow = pt.id;
					if( onsr ) { 
						$($t).triggerHandler("jqGridSelectRow", [pt.id, stat, e]);
						if( $t.p.onSelectRow) { $t.p.onSelectRow.call($t, pt.id, stat, e); }
					}
				}
			} else {
				//unselect selectall checkbox when deselecting a specific row
				$t.setHeadCheckBox( false );
				$t.p.selrow = pt.id;
				ia = $.inArray($t.p.selrow,$t.p.selarrrow);
				if (  ia === -1 ){
					if(pt.className !== "ui-subgrid") { $(pt).addClass("ui-state-highlight").attr("aria-selected","true");}
					stat = true;
					$t.p.selarrrow.push($t.p.selrow);
				} else {
					if(pt.className !== "ui-subgrid") { $(pt).removeClass("ui-state-highlight").attr("aria-selected","false");}
					stat = false;
					$t.p.selarrrow.splice(ia,1);
					tpsr = $t.p.selarrrow[0];
					$t.p.selrow = (tpsr === undefined) ? null : tpsr;
				}
				$("#jqg_"+$.jgrid.jqID($t.p.id)+"_"+$.jgrid.jqID(pt.id))[$t.p.useProp ? 'prop': 'attr']("checked",stat);
				if(fid) {
					if(ia === -1) {
						$("#"+$.jgrid.jqID(selection), "#"+$.jgrid.jqID(fid)).addClass("ui-state-highlight");
					} else {
						$("#"+$.jgrid.jqID(selection), "#"+$.jgrid.jqID(fid)).removeClass("ui-state-highlight");
					}
					$("#jqg_"+$.jgrid.jqID($t.p.id)+"_"+$.jgrid.jqID(selection), "#"+$.jgrid.jqID(fid))[$t.p.useProp ? 'prop': 'attr']("checked",stat);
				}
				if( onsr ) {
					$($t).triggerHandler("jqGridSelectRow", [pt.id, stat, e]);
					if( $t.p.onSelectRow) { $t.p.onSelectRow.call($t, pt.id , stat, e); }
				}
			}
		});
	},
	resetSelection : function( rowid ){
		return this.each(function(){
			var t = this, sr, fid;
			if( t.p.frozenColumns === true ) {
				fid = t.p.id+"_frozen";
			}
			if(rowid !== undefined ) {
				sr = rowid === t.p.selrow ? t.p.selrow : rowid;
				$("#"+$.jgrid.jqID(t.p.id)+" tbody:first tr#"+$.jgrid.jqID(sr)).removeClass("ui-state-highlight").attr("aria-selected","false");
				if (fid) { $("#"+$.jgrid.jqID(sr), "#"+$.jgrid.jqID(fid)).removeClass("ui-state-highlight"); }
				if(t.p.multiselect) {
					$("#jqg_"+$.jgrid.jqID(t.p.id)+"_"+$.jgrid.jqID(sr), "#"+$.jgrid.jqID(t.p.id))[t.p.useProp ? 'prop': 'attr']("checked",false);
					if(fid) { $("#jqg_"+$.jgrid.jqID(t.p.id)+"_"+$.jgrid.jqID(sr), "#"+$.jgrid.jqID(fid))[t.p.useProp ? 'prop': 'attr']("checked",false); }
					t.setHeadCheckBox( false);
				}
				sr = null;
			} else if(!t.p.multiselect) {
				if(t.p.selrow) {
					$("#"+$.jgrid.jqID(t.p.id)+" tbody:first tr#"+$.jgrid.jqID(t.p.selrow)).removeClass("ui-state-highlight").attr("aria-selected","false");
					if(fid) { $("#"+$.jgrid.jqID(t.p.selrow), "#"+$.jgrid.jqID(fid)).removeClass("ui-state-highlight"); }
					t.p.selrow = null;
				}
			} else {
				$(t.p.selarrrow).each(function(i,n){
					$( $(t).jqGrid('getGridRowById',n) ).removeClass("ui-state-highlight").attr("aria-selected","false");
					$("#jqg_"+$.jgrid.jqID(t.p.id)+"_"+$.jgrid.jqID(n))[t.p.useProp ? 'prop': 'attr']("checked",false);
					if(fid) { 
						$("#"+$.jgrid.jqID(n), "#"+$.jgrid.jqID(fid)).removeClass("ui-state-highlight"); 
						$("#jqg_"+$.jgrid.jqID(t.p.id)+"_"+$.jgrid.jqID(n), "#"+$.jgrid.jqID(fid))[t.p.useProp ? 'prop': 'attr']("checked",false);
					}
				});
				t.setHeadCheckBox( false );
				t.p.selarrrow = [];
			}
			if(t.p.cellEdit === true) {
				if(parseInt(t.p.iCol,10)>=0  && parseInt(t.p.iRow,10)>=0) {
					$("td:eq("+t.p.iCol+")",t.rows[t.p.iRow]).removeClass("edit-cell ui-state-highlight");
					$(t.rows[t.p.iRow]).removeClass("selected-row ui-state-hover");
				}
			}
			t.p.savedRow = [];
		});
	},
	getRowData : function( rowid ) {
		var res = {}, resall, getall=false, len, j=0;
		this.each(function(){
			var $t = this,nm,ind;
			if(rowid === undefined) {
				getall = true;
				resall = [];
				len = $t.rows.length;
			} else {
				ind = $($t).jqGrid('getGridRowById', rowid);
				if(!ind) { return res; }
				len = 2;
			}
			while(j<len){
				if(getall) { ind = $t.rows[j]; }
				if( $(ind).hasClass('jqgrow') ) {
					$('td[role="gridcell"]',ind).each( function(i) {
						nm = $t.p.colModel[i].name;
						if ( nm !== 'cb' && nm !== 'subgrid' && nm !== 'rn') {
							if($t.p.treeGrid===true && nm === $t.p.ExpandColumn) {
								res[nm] = $.jgrid.htmlDecode($("span:first",this).html());
							} else {
								try {
									res[nm] = $.unformat.call($t,this,{rowId:ind.id, colModel:$t.p.colModel[i]},i);
								} catch (e){
									res[nm] = $.jgrid.htmlDecode($(this).html());
								}
							}
						}
					});
					if(getall) { resall.push(res); res={}; }
				}
				j++;
			}
		});
		return resall || res;
	},
	delRowData : function(rowid) {
		var success = false, rowInd, ia;
		this.each(function() {
			var $t = this;
			rowInd = $($t).jqGrid('getGridRowById', rowid);
			if(!rowInd) {return false;}
				$(rowInd).remove();
				$t.p.records--;
				$t.p.reccount--;
				$t.updatepager(true,false);
				success=true;
				if($t.p.multiselect) {
					ia = $.inArray(rowid,$t.p.selarrrow);
					if(ia !== -1) { $t.p.selarrrow.splice(ia,1);}
				}
				if ($t.p.multiselect && $t.p.selarrrow.length > 0) {
					$t.p.selrow = $t.p.selarrrow[$t.p.selarrrow.length-1];
				} else {
					$t.p.selrow = null;
				}
			if($t.p.datatype === 'local') {
				var id = $.jgrid.stripPref($t.p.idPrefix, rowid),
				pos = $t.p._index[id];
				if(pos !== undefined) {
					$t.p.data.splice(pos,1);
					$t.refreshIndex();
				}
			}
			if( $t.p.altRows === true && success ) {
				var cn = $t.p.altclass;
				$($t.rows).each(function(i){
					if(i % 2 === 1) { $(this).addClass(cn); }
					else { $(this).removeClass(cn); }
				});
			}
		});
		return success;
	},
	setRowData : function(rowid, data, cssp) {
		var nm, success=true, title;
		this.each(function(){
			if(!this.grid) {return false;}
			var t = this, vl, ind, cp = typeof cssp, lcdata={};
			ind = $(this).jqGrid('getGridRowById', rowid);
			if(!ind) { return false; }
			if( data ) {
				try {
					$(this.p.colModel).each(function(i){
						nm = this.name;
						var dval =$.jgrid.getAccessor(data,nm);
						if( dval !== undefined) {
							lcdata[nm] = this.formatter && typeof this.formatter === 'string' && this.formatter === 'date' ? $.unformat.date.call(t,dval,this) : dval;
							vl = t.formatter( rowid, dval, i, data, 'edit');
							title = this.title ? {"title":$.jgrid.stripHtml(vl)} : {};
							if(t.p.treeGrid===true && nm === t.p.ExpandColumn) {
								$("td[role='gridcell']:eq("+i+") > span:first",ind).html(vl).attr(title);
							} else {
								$("td[role='gridcell']:eq("+i+")",ind).html(vl).attr(title);
							}
						}
					});
					if(t.p.datatype === 'local') {
						var id = $.jgrid.stripPref(t.p.idPrefix, rowid),
						pos = t.p._index[id], key;
						if(t.p.treeGrid) {
							for(key in t.p.treeReader){
								if(t.p.treeReader.hasOwnProperty(key)) {
									delete lcdata[t.p.treeReader[key]];
								}
							}
						}
						if(pos !== undefined) {
							t.p.data[pos] = $.extend(true, t.p.data[pos], lcdata);
						}
						lcdata = null;
					}
				} catch (e) {
					success = false;
				}
			}
			if(success) {
				if(cp === 'string') {$(ind).addClass(cssp);} else if(cp === 'object') {$(ind).css(cssp);}
				$(t).triggerHandler("jqGridAfterGridComplete");
			}
		});
		return success;
	},
	addRowData : function(rowid,rdata,pos,src) {
		if(!pos) {pos = "last";}
		var success = false, nm, row, gi, si, ni,sind, i, v, prp="", aradd, cnm, cn, data, cm, id;
		if(rdata) {
			if($.isArray(rdata)) {
				aradd=true;
				pos = "last";
				cnm = rowid;
			} else {
				rdata = [rdata];
				aradd = false;
			}
			this.each(function() {
				var t = this, datalen = rdata.length;
				ni = t.p.rownumbers===true ? 1 :0;
				gi = t.p.multiselect ===true ? 1 :0;
				si = t.p.subGrid===true ? 1 :0;
				if(!aradd) {
					if(rowid !== undefined) { rowid = String(rowid);}
					else {
						rowid = $.jgrid.randId();
						if(t.p.keyIndex !== false) {
							cnm = t.p.colModel[t.p.keyIndex+gi+si+ni].name;
							if(rdata[0][cnm] !== undefined) { rowid = rdata[0][cnm]; }
						}
					}
				}
				cn = t.p.altclass;
				var k = 0, cna ="", lcdata = {},
				air = $.isFunction(t.p.afterInsertRow) ? true : false;
				while(k < datalen) {
					data = rdata[k];
					row=[];
					if(aradd) {
						try {
							rowid = data[cnm];
							if(rowid===undefined) {
								rowid = $.jgrid.randId();
							}
						}
						catch (e) {rowid = $.jgrid.randId();}
						cna = t.p.altRows === true ?  (t.rows.length-1)%2 === 0 ? cn : "" : "";
					}
					id = rowid;
					rowid  = t.p.idPrefix + rowid;
					if(ni){
						prp = t.formatCol(0,1,'',null,rowid, true);
						row[row.length] = "<td role=\"gridcell\" class=\"ui-state-default jqgrid-rownum\" "+prp+">0</td>";
					}
					if(gi) {
						v = "<input role=\"checkbox\" type=\"checkbox\""+" id=\"jqg_"+t.p.id+"_"+rowid+"\" class=\"cbox\"/>";
						prp = t.formatCol(ni,1,'', null, rowid, true);
						row[row.length] = "<td role=\"gridcell\" "+prp+">"+v+"</td>";
					}
					if(si) {
						row[row.length] = $(t).jqGrid("addSubGridCell",gi+ni,1);
					}
					for(i = gi+si+ni; i < t.p.colModel.length;i++){
						cm = t.p.colModel[i];
						nm = cm.name;
						lcdata[nm] = data[nm];
						v = t.formatter( rowid, $.jgrid.getAccessor(data,nm), i, data );
						prp = t.formatCol(i,1,v, data, rowid, lcdata);
						row[row.length] = "<td role=\"gridcell\" "+prp+">"+v+"</td>";
					}
					row.unshift( t.constructTr(rowid, false, cna, lcdata, data, false ) );
					row[row.length] = "</tr>";
					if(t.rows.length === 0){
						$("table:first",t.grid.bDiv).append(row.join(''));
					} else {
						switch (pos) {
							case 'last':
								$(t.rows[t.rows.length-1]).after(row.join(''));
								sind = t.rows.length-1;
								break;
							case 'first':
								$(t.rows[0]).after(row.join(''));
								sind = 1;
								break;
							case 'after':
								sind = $(t).jqGrid('getGridRowById', src);
								if (sind) {
									if($(t.rows[sind.rowIndex+1]).hasClass("ui-subgrid")) { $(t.rows[sind.rowIndex+1]).after(row); }
									else { $(sind).after(row.join('')); }
									sind=sind.rowIndex + 1;
								}	
								break;
							case 'before':
								sind = $(t).jqGrid('getGridRowById', src);
								if(sind) {
									$(sind).before(row.join(''));
									sind=sind.rowIndex - 1;
								}
								break;
						}
					}
					if(t.p.subGrid===true) {
						$(t).jqGrid("addSubGrid",gi+ni, sind);
					}
					t.p.records++;
					t.p.reccount++;
					$(t).triggerHandler("jqGridAfterInsertRow", [rowid,data,data]);
					if(air) { t.p.afterInsertRow.call(t,rowid,data,data); }
					k++;
					if(t.p.datatype === 'local') {
						lcdata[t.p.localReader.id] = id;
						t.p._index[id] = t.p.data.length;
						t.p.data.push(lcdata);
						lcdata = {};
					}
				}
				if( t.p.altRows === true && !aradd) {
					if (pos === "last") {
						if ((t.rows.length-1)%2 === 1)  {$(t.rows[t.rows.length-1]).addClass(cn);}
					} else {
						$(t.rows).each(function(i){
							if(i % 2 ===1) { $(this).addClass(cn); }
							else { $(this).removeClass(cn); }
						});
					}
				}
				t.updatepager(true,true);
				success = true;
			});
		}
		return success;
	},
	footerData : function(action,data, format) {
		var nm, success=false, res={}, title;
		function isEmpty(obj) {
			var i;
			for(i in obj) {
				if (obj.hasOwnProperty(i)) { return false; }
			}
			return true;
		}
		if(action === undefined) { action = "get"; }
		if(typeof format !== "boolean") { format  = true; }
		action = action.toLowerCase();
		this.each(function(){
			var t = this, vl;
			if(!t.grid || !t.p.footerrow) {return false;}
			if(action === "set") { if(isEmpty(data)) { return false; } }
			success=true;
			$(this.p.colModel).each(function(i){
				nm = this.name;
				if(action === "set") {
					if( data[nm] !== undefined) {
						vl = format ? t.formatter( "", data[nm], i, data, 'edit') : data[nm];
						title = this.title ? {"title":$.jgrid.stripHtml(vl)} : {};
						$("tr.footrow td:eq("+i+")",t.grid.sDiv).html(vl).attr(title);
						success = true;
					}
				} else if(action === "get") {
					res[nm] = $("tr.footrow td:eq("+i+")",t.grid.sDiv).html();
				}
			});
		});
		return action === "get" ? res : success;
	},
	showHideCol : function(colname,show) {
		return this.each(function() {
			var $t = this, fndh=false, brd=$.jgrid.cell_width ? 0: $t.p.cellLayout, cw;
			if (!$t.grid ) {return;}
			if( typeof colname === 'string') {colname=[colname];}
			show = show !== "none" ? "" : "none";
			var sw = show === "" ? true :false,
			gh = $t.p.groupHeader && (typeof $t.p.groupHeader === 'object' || $.isFunction($t.p.groupHeader) );
			if(gh) { $($t).jqGrid('destroyGroupHeader', false); }
			$(this.p.colModel).each(function(i) {
				if ($.inArray(this.name,colname) !== -1 && this.hidden === sw) {
					if($t.p.frozenColumns === true && this.frozen === true) {
						return true;
					}
					$("tr[role=rowheader]",$t.grid.hDiv).each(function(){
						$(this.cells[i]).css("display", show);
					});
					$($t.rows).each(function(){
						if (!$(this).hasClass("jqgroup")) {
							$(this.cells[i]).css("display", show);
						}
					});
					if($t.p.footerrow) { $("tr.footrow td:eq("+i+")", $t.grid.sDiv).css("display", show); }
					cw =  parseInt(this.width,10);
					if(show === "none") {
						$t.p.tblwidth -= cw+brd;
					} else {
						$t.p.tblwidth += cw+brd;
					}
					this.hidden = !sw;
					fndh=true;
					$($t).triggerHandler("jqGridShowHideCol", [sw,this.name,i]);
				}
			});
			if(fndh===true) {
				if($t.p.shrinkToFit === true && !isNaN($t.p.height)) { $t.p.tblwidth += parseInt($t.p.scrollOffset,10);}
				$($t).jqGrid("setGridWidth",$t.p.shrinkToFit === true ? $t.p.tblwidth : $t.p.width );
			}
			if( gh )  {
				$($t).jqGrid('setGroupHeaders',$t.p.groupHeader);
			}
		});
	},
	hideCol : function (colname) {
		return this.each(function(){$(this).jqGrid("showHideCol",colname,"none");});
	},
	showCol : function(colname) {
		return this.each(function(){$(this).jqGrid("showHideCol",colname,"");});
	},
	remapColumns : function(permutation, updateCells, keepHeader)
	{
		function resortArray(a) {
			var ac;
			if (a.length) {
				ac = $.makeArray(a);
			} else {
				ac = $.extend({}, a);
			}
			$.each(permutation, function(i) {
				a[i] = ac[this];
			});
		}
		var ts = this.get(0);
		function resortRows(parent, clobj) {
			$(">tr"+(clobj||""), parent).each(function() {
				var row = this;
				var elems = $.makeArray(row.cells);
				$.each(permutation, function() {
					var e = elems[this];
					if (e) {
						row.appendChild(e);
					}
				});
			});
		}
		resortArray(ts.p.colModel);
		resortArray(ts.p.colNames);
		resortArray(ts.grid.headers);
		resortRows($("thead:first", ts.grid.hDiv), keepHeader && ":not(.ui-jqgrid-labels)");
		if (updateCells) {
			resortRows($("#"+$.jgrid.jqID(ts.p.id)+" tbody:first"), ".jqgfirstrow, tr.jqgrow, tr.jqfoot");
		}
		if (ts.p.footerrow) {
			resortRows($("tbody:first", ts.grid.sDiv));
		}
		if (ts.p.remapColumns) {
			if (!ts.p.remapColumns.length){
				ts.p.remapColumns = $.makeArray(permutation);
			} else {
				resortArray(ts.p.remapColumns);
			}
		}
		ts.p.lastsort = $.inArray(ts.p.lastsort, permutation);
		if(ts.p.treeGrid) { ts.p.expColInd = $.inArray(ts.p.expColInd, permutation); }
		$(ts).triggerHandler("jqGridRemapColumns", [permutation, updateCells, keepHeader]);
	},
	setGridWidth : function(nwidth, shrink) {
		return this.each(function(){
			if (!this.grid ) {return;}
			var $t = this, cw,
			initwidth = 0, brd=$.jgrid.cell_width ? 0: $t.p.cellLayout, lvc, vc=0, hs=false, scw=$t.p.scrollOffset, aw, gw=0, cr;
			if(typeof shrink !== 'boolean') {
				shrink=$t.p.shrinkToFit;
			}
			if(isNaN(nwidth)) {return;}
			nwidth = parseInt(nwidth,10); 
			$t.grid.width = $t.p.width = nwidth;
			$("#gbox_"+$.jgrid.jqID($t.p.id)).css("width",nwidth+"px");
			$("#gview_"+$.jgrid.jqID($t.p.id)).css("width",nwidth+"px");
			$($t.grid.bDiv).css("width",nwidth+"px");
			$($t.grid.hDiv).css("width",nwidth+"px");
			if($t.p.pager ) {$($t.p.pager).css("width",nwidth+"px");}
			if($t.p.toppager ) {$($t.p.toppager).css("width",nwidth+"px");}
			if($t.p.toolbar[0] === true){
				$($t.grid.uDiv).css("width",nwidth+"px");
				if($t.p.toolbar[1]==="both") {$($t.grid.ubDiv).css("width",nwidth+"px");}
			}
			if($t.p.footerrow) { $($t.grid.sDiv).css("width",nwidth+"px"); }
			if(shrink ===false && $t.p.forceFit === true) {$t.p.forceFit=false;}
			if(shrink===true) {
				$.each($t.p.colModel, function() {
					if(this.hidden===false){
						cw = this.widthOrg;
						initwidth += cw+brd;
						if(this.fixed) {
							gw += cw+brd;
						} else {
							vc++;
						}
					}
				});
				if(vc  === 0) { return; }
				$t.p.tblwidth = initwidth;
				aw = nwidth-brd*vc-gw;
				if(!isNaN($t.p.height)) {
					if($($t.grid.bDiv)[0].clientHeight < $($t.grid.bDiv)[0].scrollHeight || $t.rows.length === 1){
						hs = true;
						aw -= scw;
					}
				}
				initwidth =0;
				var cle = $t.grid.cols.length >0;
				$.each($t.p.colModel, function(i) {
					if(this.hidden === false && !this.fixed){
						cw = this.widthOrg;
						cw = Math.round(aw*cw/($t.p.tblwidth-brd*vc-gw));
						if (cw < 0) { return; }
						this.width =cw;
						initwidth += cw;
						$t.grid.headers[i].width=cw;
						$t.grid.headers[i].el.style.width=cw+"px";
						if($t.p.footerrow) { $t.grid.footers[i].style.width = cw+"px"; }
						if(cle) { $t.grid.cols[i].style.width = cw+"px"; }
						lvc = i;
					}
				});

				if (!lvc) { return; }

				cr =0;
				if (hs) {
					if(nwidth-gw-(initwidth+brd*vc) !== scw){
						cr = nwidth-gw-(initwidth+brd*vc)-scw;
					}
				} else if( Math.abs(nwidth-gw-(initwidth+brd*vc)) !== 1) {
					cr = nwidth-gw-(initwidth+brd*vc);
				}
				$t.p.colModel[lvc].width += cr;
				$t.p.tblwidth = initwidth+cr+brd*vc+gw;
				if($t.p.tblwidth > nwidth) {
					var delta = $t.p.tblwidth - parseInt(nwidth,10);
					$t.p.tblwidth = nwidth;
					cw = $t.p.colModel[lvc].width = $t.p.colModel[lvc].width-delta;
				} else {
					cw= $t.p.colModel[lvc].width;
				}
				$t.grid.headers[lvc].width = cw;
				$t.grid.headers[lvc].el.style.width=cw+"px";
				if(cle) { $t.grid.cols[lvc].style.width = cw+"px"; }
				if($t.p.footerrow) {
					$t.grid.footers[lvc].style.width = cw+"px";
				}
			}
			if($t.p.tblwidth) {
				$('table:first',$t.grid.bDiv).css("width",$t.p.tblwidth+"px");
				$('table:first',$t.grid.hDiv).css("width",$t.p.tblwidth+"px");
				$t.grid.hDiv.scrollLeft = $t.grid.bDiv.scrollLeft;
				if($t.p.footerrow) {
					$('table:first',$t.grid.sDiv).css("width",$t.p.tblwidth+"px");
				}
			}
		});
	},
	setGridHeight : function (nh) {
		return this.each(function (){
			var $t = this;
			if(!$t.grid) {return;}
			var bDiv = $($t.grid.bDiv);
			bDiv.css({height: nh+(isNaN(nh)?"":"px")});
			if($t.p.frozenColumns === true){
				//follow the original set height to use 16, better scrollbar width detection
				$('#'+$.jgrid.jqID($t.p.id)+"_frozen").parent().height(bDiv.height() - 16);
			}
			$t.p.height = nh;
			if ($t.p.scroll) { $t.grid.populateVisible(); }
		});
	},
	setCaption : function (newcap){
		return this.each(function(){
			this.p.caption=newcap;
			$("span.ui-jqgrid-title, span.ui-jqgrid-title-rtl",this.grid.cDiv).html(newcap);
			$(this.grid.cDiv).show();
		});
	},
	setLabel : function(colname, nData, prop, attrp ){
		return this.each(function(){
			var $t = this, pos=-1;
			if(!$t.grid) {return;}
			if(colname !== undefined) {
				$($t.p.colModel).each(function(i){
					if (this.name === colname) {
						pos = i;return false;
					}
				});
			} else { return; }
			if(pos>=0) {
				var thecol = $("tr.ui-jqgrid-labels th:eq("+pos+")",$t.grid.hDiv);
				if (nData){
					var ico = $(".s-ico",thecol);
					$("[id^=jqgh_]",thecol).empty().html(nData).append(ico);
					$t.p.colNames[pos] = nData;
				}
				if (prop) {
					if(typeof prop === 'string') {$(thecol).addClass(prop);} else {$(thecol).css(prop);}
				}
				if(typeof attrp === 'object') {$(thecol).attr(attrp);}
			}
		});
	},
	setCell : function(rowid,colname,nData,cssp,attrp, forceupd) {
		return this.each(function(){
			var $t = this, pos =-1,v, title;
			if(!$t.grid) {return;}
			if(isNaN(colname)) {
				$($t.p.colModel).each(function(i){
					if (this.name === colname) {
						pos = i;return false;
					}
				});
			} else {pos = parseInt(colname,10);}
			if(pos>=0) {
				var ind = $($t).jqGrid('getGridRowById', rowid); 
				if (ind){
					var tcell = $("td:eq("+pos+")",ind);
					if(nData !== "" || forceupd === true) {
						v = $t.formatter(rowid, nData, pos,ind,'edit');
						title = $t.p.colModel[pos].title ? {"title":$.jgrid.stripHtml(v)} : {};
						if($t.p.treeGrid && $(".tree-wrap",$(tcell)).length>0) {
							$("span",$(tcell)).html(v).attr(title);
						} else {
							$(tcell).html(v).attr(title);
						}
						if($t.p.datatype === "local") {
							var cm = $t.p.colModel[pos], index;
							nData = cm.formatter && typeof cm.formatter === 'string' && cm.formatter === 'date' ? $.unformat.date.call($t,nData,cm) : nData;
							index = $t.p._index[$.jgrid.stripPref($t.p.idPrefix, rowid)];
							if(index !== undefined) {
								$t.p.data[index][cm.name] = nData;
							}
						}
					}
					if(typeof cssp === 'string'){
						$(tcell).addClass(cssp);
					} else if(cssp) {
						$(tcell).css(cssp);
					}
					if(typeof attrp === 'object') {$(tcell).attr(attrp);}
				}
			}
		});
	},
	getCell : function(rowid,col) {
		var ret = false;
		this.each(function(){
			var $t=this, pos=-1;
			if(!$t.grid) {return;}
			if(isNaN(col)) {
				$($t.p.colModel).each(function(i){
					if (this.name === col) {
						pos = i;return false;
					}
				});
			} else {pos = parseInt(col,10);}
			if(pos>=0) {
				var ind = $($t).jqGrid('getGridRowById', rowid);
				if(ind) {
					try {
						ret = $.unformat.call($t,$("td:eq("+pos+")",ind),{rowId:ind.id, colModel:$t.p.colModel[pos]},pos);
					} catch (e){
						ret = $.jgrid.htmlDecode($("td:eq("+pos+")",ind).html());
					}
				}
			}
		});
		return ret;
	},
	getCol : function (col, obj, mathopr) {
		var ret = [], val, sum=0, min, max, v;
		obj = typeof obj !== 'boolean' ? false : obj;
		if(mathopr === undefined) { mathopr = false; }
		this.each(function(){
			var $t=this, pos=-1;
			if(!$t.grid) {return;}
			if(isNaN(col)) {
				$($t.p.colModel).each(function(i){
					if (this.name === col) {
						pos = i;return false;
					}
				});
			} else {pos = parseInt(col,10);}
			if(pos>=0) {
				var ln = $t.rows.length, i =0, dlen=0;
				if (ln && ln>0){
					while(i<ln){
						if($($t.rows[i]).hasClass('jqgrow')) {
							try {
								val = $.unformat.call($t,$($t.rows[i].cells[pos]),{rowId:$t.rows[i].id, colModel:$t.p.colModel[pos]},pos);
							} catch (e) {
								val = $.jgrid.htmlDecode($t.rows[i].cells[pos].innerHTML);
							}
							if(mathopr) {
								v = parseFloat(val);
								if(!isNaN(v)) {
									sum += v;
									if (max === undefined) {max = min = v;}
									min = Math.min(min, v);
									max = Math.max(max, v);
									dlen++;
								}
							}
							else if(obj) { ret.push( {id:$t.rows[i].id,value:val} ); }
							else { ret.push( val ); }
						}
						i++;
					}
					if(mathopr) {
						switch(mathopr.toLowerCase()){
							case 'sum': ret =sum; break;
							case 'avg': ret = sum/dlen; break;
							case 'count': ret = (ln-1); break;
							case 'min': ret = min; break;
							case 'max': ret = max; break;
						}
					}
				}
			}
		});
		return ret;
	},
	clearGridData : function(clearfooter) {
		return this.each(function(){
			var $t = this;
			if(!$t.grid) {return;}
			if(typeof clearfooter !== 'boolean') { clearfooter = false; }
			if($t.p.deepempty) {$("#"+$.jgrid.jqID($t.p.id)+" tbody:first tr:gt(0)").remove();}
			else {
				var trf = $("#"+$.jgrid.jqID($t.p.id)+" tbody:first tr:first")[0];
				$("#"+$.jgrid.jqID($t.p.id)+" tbody:first").empty().append(trf);
			}
			if($t.p.footerrow && clearfooter) { $(".ui-jqgrid-ftable td",$t.grid.sDiv).html("&#160;"); }
			$t.p.selrow = null; $t.p.selarrrow= []; $t.p.savedRow = [];
			$t.p.records = 0;$t.p.page=1;$t.p.lastpage=0;$t.p.reccount=0;
			$t.p.data = []; $t.p._index = {};
			$t.updatepager(true,false);
		});
	},
	getInd : function(rowid,rc){
		var ret =false,rw;
		this.each(function(){
			rw = $(this).jqGrid('getGridRowById', rowid);
			if(rw) {
				ret = rc===true ? rw: rw.rowIndex;
			}
		});
		return ret;
	},
	bindKeys : function( settings ){
		var o = $.extend({
			onEnter: null,
			onSpace: null,
			onLeftKey: null,
			onRightKey: null,
			scrollingRows : true
		},settings || {});
		return this.each(function(){
			var $t = this;
			if( !$('body').is('[role]') ){$('body').attr('role','application');}
			$t.p.scrollrows = o.scrollingRows;
			$($t).keydown(function(event){
				var target = $($t).find('tr[tabindex=0]')[0], id, r, mind,
				expanded = $t.p.treeReader.expanded_field;
				//check for arrow keys
				if(target) {
					mind = $t.p._index[$.jgrid.stripPref($t.p.idPrefix, target.id)];
					if(event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40){
						// up key
						if(event.keyCode === 38 ){
							r = target.previousSibling;
							id = "";
							if(r) {
								if($(r).is(":hidden")) {
									while(r) {
										r = r.previousSibling;
										if(!$(r).is(":hidden") && $(r).hasClass('jqgrow')) {id = r.id;break;}
									}
								} else {
									id = r.id;
								}
							}
							$($t).jqGrid('setSelection', id, true, event);
							event.preventDefault();
						}
						//if key is down arrow
						if(event.keyCode === 40){
							r = target.nextSibling;
							id ="";
							if(r) {
								if($(r).is(":hidden")) {
									while(r) {
										r = r.nextSibling;
										if(!$(r).is(":hidden") && $(r).hasClass('jqgrow') ) {id = r.id;break;}
									}
								} else {
									id = r.id;
								}
							}
							$($t).jqGrid('setSelection', id, true, event);
							event.preventDefault();
						}
						// left
						if(event.keyCode === 37 ){
							if($t.p.treeGrid && $t.p.data[mind][expanded]) {
								$(target).find("div.treeclick").trigger('click');
							}
							$($t).triggerHandler("jqGridKeyLeft", [$t.p.selrow]);
							if($.isFunction(o.onLeftKey)) {
								o.onLeftKey.call($t, $t.p.selrow);
							}
						}
						// right
						if(event.keyCode === 39 ){
							if($t.p.treeGrid && !$t.p.data[mind][expanded]) {
								$(target).find("div.treeclick").trigger('click');
							}
							$($t).triggerHandler("jqGridKeyRight", [$t.p.selrow]);
							if($.isFunction(o.onRightKey)) {
								o.onRightKey.call($t, $t.p.selrow);
							}
						}
					}
					//check if enter was pressed on a grid or treegrid node
					else if( event.keyCode === 13 ){
						$($t).triggerHandler("jqGridKeyEnter", [$t.p.selrow]);
						if($.isFunction(o.onEnter)) {
							o.onEnter.call($t, $t.p.selrow);
						}
					} else if(event.keyCode === 32) {
						$($t).triggerHandler("jqGridKeySpace", [$t.p.selrow]);
						if($.isFunction(o.onSpace)) {
							o.onSpace.call($t, $t.p.selrow);
						}
					}
				}
			});
		});
	},
	unbindKeys : function(){
		return this.each(function(){
			$(this).unbind('keydown');
		});
	},
	getLocalRow : function (rowid) {
		var ret = false, ind;
		this.each(function(){
			if(rowid !== undefined) {
				ind = this.p._index[$.jgrid.stripPref(this.p.idPrefix, rowid)];
				if(ind >= 0 ) {
					ret = this.p.data[ind];
				}
			}
		});
		return ret;
	}
});
})(jQuery);
/*jshint eqeqeq:false */
/*global jQuery */
(function($){
/**
 * jqGrid extension for custom methods
 * Tony Tomov tony@trirand.com
 * http://trirand.com/blog/ 
 * 
 * Wildraid wildraid@mail.ru
 * Oleg Kiriljuk oleg.kiriljuk@ok-soft-gmbh.com
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
**/
"use strict";
$.jgrid.extend({
	getColProp : function(colname){
		var ret ={}, $t = this[0];
		if ( !$t.grid ) { return false; }
		var cM = $t.p.colModel, i;
		for ( i=0;i<cM.length;i++ ) {
			if ( cM[i].name === colname ) {
				ret = cM[i];
				break;
			}
		}
		return ret;
	},
	setColProp : function(colname, obj){
		//do not set width will not work
		return this.each(function(){
			if ( this.grid ) {
				if ( obj ) {
					var cM = this.p.colModel, i;
					for ( i=0;i<cM.length;i++ ) {
						if ( cM[i].name === colname ) {
							$.extend(true, this.p.colModel[i],obj);
							break;
						}
					}
				}
			}
		});
	},
	sortGrid : function(colname,reload, sor){
		return this.each(function(){
			var $t=this,idx=-1,i, sobj=false;
			if ( !$t.grid ) { return;}
			if ( !colname ) { colname = $t.p.sortname; }
			for ( i=0;i<$t.p.colModel.length;i++ ) {
				if ( $t.p.colModel[i].index === colname || $t.p.colModel[i].name === colname ) {
					idx = i;
					if($t.p.frozenColumns === true && $t.p.colModel[i].frozen === true) {
						sobj = $t.grid.fhDiv.find("#" + $t.p.id + "_" + colname);
					}
					break;
				}
			}
			if ( idx !== -1 ){
				var sort = $t.p.colModel[idx].sortable;
				if ( typeof sort !== 'boolean' ) { sort =  true; }
				if ( typeof reload !=='boolean' ) { reload = false; }
				if ( sort ) { $t.sortData("jqgh_"+$t.p.id+"_" + colname, idx, reload, sor, sobj); }
			}
		});
	},
	clearBeforeUnload : function () {
		return this.each(function(){
			var grid = this.grid;
			grid.emptyRows.call(this, true, true); // this work quick enough and reduce the size of memory leaks if we have someone

			$(document).unbind("mouseup.jqGrid" + this.p.id ); 
			$(grid.hDiv).unbind("mousemove"); // TODO add namespace
			$(this).unbind();

			grid.dragEnd = null;
			grid.dragMove = null;
			grid.dragStart = null;
			grid.emptyRows = null;
			grid.populate = null;
			grid.populateVisible = null;
			grid.scrollGrid = null;
			grid.selectionPreserver = null;

			grid.bDiv = null;
			grid.cDiv = null;
			grid.hDiv = null;
			grid.cols = null;
			var i, l = grid.headers.length;
			for (i = 0; i < l; i++) {
				grid.headers[i].el = null;
			}

			this.formatCol = null;
			this.sortData = null;
			this.updatepager = null;
			this.refreshIndex = null;
			this.setHeadCheckBox = null;
			this.constructTr = null;
			this.formatter = null;
			this.addXmlData = null;
			this.addJSONData = null;
		});
	},
	GridDestroy : function () {
		return this.each(function(){
			if ( this.grid ) { 
				if ( this.p.pager ) { // if not part of grid
					$(this.p.pager).remove();
				}
				try {
					$(this).jqGrid('clearBeforeUnload');
					$("#gbox_"+$.jgrid.jqID(this.id)).remove();
				} catch (_) {}
			}
		});
	},
	GridUnload : function(){
		return this.each(function(){
			if ( !this.grid ) {return;}
			var defgrid = {id: $(this).attr('id'),cl: $(this).attr('class')};
			if (this.p.pager) {
				$(this.p.pager).empty().removeClass("ui-state-default ui-jqgrid-pager corner-bottom");
			}
			var newtable = document.createElement('table');
			$(newtable).attr({id:defgrid.id});
			newtable.className = defgrid.cl;
			var gid = $.jgrid.jqID(this.id);
			$(newtable).removeClass("ui-jqgrid-btable");
			if( $(this.p.pager).parents("#gbox_"+gid).length === 1 ) {
				$(newtable).insertBefore("#gbox_"+gid).show();
				$(this.p.pager).insertBefore("#gbox_"+gid);
			} else {
				$(newtable).insertBefore("#gbox_"+gid).show();
			}
			$(this).jqGrid('clearBeforeUnload');
			$("#gbox_"+gid).remove();
		});
	},
	setGridState : function(state) {
		return this.each(function(){
			if ( !this.grid ) {return;}
			var $t = this;
			if(state === 'hidden'){
				$(".ui-jqgrid-bdiv, .ui-jqgrid-hdiv","#gview_"+$.jgrid.jqID($t.p.id)).slideUp("fast");
				if($t.p.pager) {$($t.p.pager).slideUp("fast");}
				if($t.p.toppager) {$($t.p.toppager).slideUp("fast");}
				if($t.p.toolbar[0]===true) {
					if( $t.p.toolbar[1] === 'both') {
						$($t.grid.ubDiv).slideUp("fast");
					}
					$($t.grid.uDiv).slideUp("fast");
				}
				if($t.p.footerrow) { $(".ui-jqgrid-sdiv","#gbox_"+$.jgrid.jqID($t.p.id)).slideUp("fast"); }
				$(".ui-jqgrid-titlebar-close span",$t.grid.cDiv).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
				$t.p.gridstate = 'hidden';
			} else if(state === 'visible') {
				$(".ui-jqgrid-hdiv, .ui-jqgrid-bdiv","#gview_"+$.jgrid.jqID($t.p.id)).slideDown("fast");
				if($t.p.pager) {$($t.p.pager).slideDown("fast");}
				if($t.p.toppager) {$($t.p.toppager).slideDown("fast");}
				if($t.p.toolbar[0]===true) {
					if( $t.p.toolbar[1] === 'both') {
						$($t.grid.ubDiv).slideDown("fast");
					}
					$($t.grid.uDiv).slideDown("fast");
				}
				if($t.p.footerrow) { $(".ui-jqgrid-sdiv","#gbox_"+$.jgrid.jqID($t.p.id)).slideDown("fast"); }
				$(".ui-jqgrid-titlebar-close span",$t.grid.cDiv).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
				$t.p.gridstate = 'visible';
			}

		});
	},
	filterToolbar : function(p){
		p = $.extend({
			autosearch: true,
			searchOnEnter : true,
			beforeSearch: null,
			afterSearch: null,
			beforeClear: null,
			afterClear: null,
			searchurl : '',
			stringResult: false,
			groupOp: 'AND',
			defaultSearch : "bw",
			searchOperators : false,
			operandTitle : "Нажмите для выбора условия.",
			operands : { "eq" :"==", "ne":"!","lt":"<","le":"<=","gt":">","ge":">=","bw":"^","bn":"!^","in":"=","ni":"!=","ew":"|","en":"!@","cn":"~","nc":"!~","nu":"#","nn":"!#"}
		}, $.jgrid.search , p  || {});
		return this.each(function(){
			var $t = this;
			if(this.ftoolbar) { return; }
			var triggerToolbar = function() {
				var sdata={}, j=0, v, nm, sopt={},so;
				$.each($t.p.colModel,function(){
					var $elem = $("#gs_"+$.jgrid.jqID(this.name), (this.frozen===true && $t.p.frozenColumns === true) ?  $t.grid.fhDiv : $t.grid.hDiv);
					nm = this.index || this.name;
					if(p.searchOperators ) {
						so = $elem.parent().prev().children("a").attr("soper") || p.defaultSearch;
					} else {
						so  = (this.searchoptions && this.searchoptions.sopt) ? this.searchoptions.sopt[0] : this.stype==='select'?  'eq' : p.defaultSearch;
					}
					v = this.stype === "custom" && $.isFunction(this.searchoptions.custom_value) && $elem.length > 0 && $elem[0].nodeName.toUpperCase() === "SPAN" ?
						this.searchoptions.custom_value.call($t, $elem.children(".customelement:first"), "get") :
						$elem.val();
					if(v || so==="nu" || so==="nn") {
						sdata[nm] = v;
						sopt[nm] = so;
						j++;
					} else {
						try {
							delete $t.p.postData[nm];
						} catch (z) {}
					}
				});
				var sd =  j>0 ? true : false;
				if(p.stringResult === true || $t.p.datatype === "local") {
					var ruleGroup = "{\"groupOp\":\"" + p.groupOp + "\",\"rules\":[";
					var gi=0;
					$.each(sdata,function(i,n){
						if (gi > 0) {ruleGroup += ",";}
						ruleGroup += "{\"field\":\"" + i + "\",";
						ruleGroup += "\"op\":\"" + sopt[i] + "\",";
						n+="";
						ruleGroup += "\"data\":\"" + n.replace(/\\/g,'\\\\').replace(/\"/g,'\\"') + "\"}";
						gi++;
					});
					ruleGroup += "]}";
					$.extend($t.p.postData,{filters:ruleGroup});
					$.each(['searchField', 'searchString', 'searchOper'], function(i, n){
						if($t.p.postData.hasOwnProperty(n)) { delete $t.p.postData[n];}
					});
				} else {
					$.extend($t.p.postData,sdata);
				}
				var saveurl;
				if($t.p.searchurl) {
					saveurl = $t.p.url;
					$($t).jqGrid("setGridParam",{url:$t.p.searchurl});
				}
				var bsr = $($t).triggerHandler("jqGridToolbarBeforeSearch") === 'stop' ? true : false;
				if(!bsr && $.isFunction(p.beforeSearch)){bsr = p.beforeSearch.call($t);}
				if(!bsr) { $($t).jqGrid("setGridParam",{search:sd}).trigger("reloadGrid",[{page:1}]); }
				if(saveurl) {$($t).jqGrid("setGridParam",{url:saveurl});}
				$($t).triggerHandler("jqGridToolbarAfterSearch");
				if($.isFunction(p.afterSearch)){p.afterSearch.call($t);}
			},
			clearToolbar = function(trigger){
				var sdata={}, j=0, nm;
				trigger = (typeof trigger !== 'boolean') ? true : trigger;
				$.each($t.p.colModel,function(){
					var v, $elem = $("#gs_"+$.jgrid.jqID(this.name),(this.frozen===true && $t.p.frozenColumns === true) ?  $t.grid.fhDiv : $t.grid.hDiv);
					if(this.searchoptions && this.searchoptions.defaultValue !== undefined) { v = this.searchoptions.defaultValue; }
					nm = this.index || this.name;
					switch (this.stype) {
						case 'select' :
							$elem.find("option").each(function (i){
								if(i===0) { this.selected = true; }
								if ($(this).val() === v) {
									this.selected = true;
									return false;
								}
							});
							if ( v !== undefined ) {
								// post the key and not the text
								sdata[nm] = v;
								j++;
							} else {
								try {
									delete $t.p.postData[nm];
								} catch(e) {}
							}
							break;
						case 'text':
							$elem.val(v);
							if(v !== undefined) {
								sdata[nm] = v;
								j++;
							} else {
								try {
									delete $t.p.postData[nm];
								} catch (y){}
							}
							break;
						case 'custom':
							if ($.isFunction(this.searchoptions.custom_value) && $elem.length > 0 && $elem[0].nodeName.toUpperCase() === "SPAN") {
								this.searchoptions.custom_value.call($t, $elem.children(".customelement:first"), "set", v);
							}
							break;
					}
				});
				var sd =  j>0 ? true : false;
				if(p.stringResult === true || $t.p.datatype === "local") {
					var ruleGroup = "{\"groupOp\":\"" + p.groupOp + "\",\"rules\":[";
					var gi=0;
					$.each(sdata,function(i,n){
						if (gi > 0) {ruleGroup += ",";}
						ruleGroup += "{\"field\":\"" + i + "\",";
						ruleGroup += "\"op\":\"" + "eq" + "\",";
						n+="";
						ruleGroup += "\"data\":\"" + n.replace(/\\/g,'\\\\').replace(/\"/g,'\\"') + "\"}";
						gi++;
					});
					ruleGroup += "]}";
					$.extend($t.p.postData,{filters:ruleGroup});
					$.each(['searchField', 'searchString', 'searchOper'], function(i, n){
						if($t.p.postData.hasOwnProperty(n)) { delete $t.p.postData[n];}
					});
				} else {
					$.extend($t.p.postData,sdata);
				}
				var saveurl;
				if($t.p.searchurl) {
					saveurl = $t.p.url;
					$($t).jqGrid("setGridParam",{url:$t.p.searchurl});
				}
				var bcv = $($t).triggerHandler("jqGridToolbarBeforeClear") === 'stop' ? true : false;
				if(!bcv && $.isFunction(p.beforeClear)){bcv = p.beforeClear.call($t);}
				if(!bcv) {
					if(trigger) {
						$($t).jqGrid("setGridParam",{search:sd}).trigger("reloadGrid",[{page:1}]);
					}
				}
				if(saveurl) {$($t).jqGrid("setGridParam",{url:saveurl});}
				$($t).triggerHandler("jqGridToolbarAfterClear");
				if($.isFunction(p.afterClear)){p.afterClear();}
			},
			toggleToolbar = function(){
				var trow = $("tr.ui-search-toolbar",$t.grid.hDiv),
				trow2 = $t.p.frozenColumns === true ?  $("tr.ui-search-toolbar",$t.grid.fhDiv) : false;
				if(trow.css("display") === 'none') {
					trow.show(); 
					if(trow2) {
						trow2.show();
					}
				} else { 
					trow.hide(); 
					if(trow2) {
						trow2.hide();
					}
				}
			},
			buildRuleMenu = function( elem, left, top ){
				$("#sopt_menu").remove();

				left=parseInt(left,10);
				top=parseInt(top,10) + 18;

				var fs =  $('.ui-jqgrid-view').css('font-size') || '11px';
				var str = '<ul id="sopt_menu" class="ui-search-menu" role="menu" tabindex="0" style="font-size:'+fs+';left:'+left+'px;top:'+top+'px;">',
				selected = $(elem).attr("soper"), selclass,
				aoprs = [], ina;
				var i=0, nm =$(elem).attr("colname"),len = $t.p.colModel.length;
				while(i<len) {
					if($t.p.colModel[i].name === nm) {
						break;
					}
					i++;
				}
				var cm = $t.p.colModel[i], options = $.extend({}, cm.searchoptions);
				if(!options.sopt) {
					options.sopt = [];
					options.sopt[0]= cm.stype==='select' ?  'eq' : p.defaultSearch;
				}
				$.each(p.odata, function() { aoprs.push(this.oper); });
				for ( i = 0 ; i < options.sopt.length; i++) {
					ina = $.inArray(options.sopt[i],aoprs);
					if(ina !== -1) {
						selclass = selected === p.odata[ina].oper ? "ui-state-highlight" : "";
						str += '<li class="ui-menu-item '+selclass+'" role="presentation"><a class="ui-corner-all g-menu-item" tabindex="0" role="menuitem" value="'+p.odata[ina].oper+'" oper="'+p.operands[p.odata[ina].oper]+'"><table cellspacing="0" cellpadding="0" border="0"><tr><td width="25px">'+p.operands[p.odata[ina].oper]+'</td><td>'+ p.odata[ina].text+'</td></tr></table></a></li>';
					}
				}
				str += "</ul>";
				$('body').append(str);
				$("#sopt_menu").addClass("ui-menu ui-widget ui-widget-content ui-corner-all");
				$("#sopt_menu > li > a").hover(
					function(){ $(this).addClass("ui-state-hover"); },
					function(){ $(this).removeClass("ui-state-hover"); }
				).click(function( e ){
					var v = $(this).attr("value"),
					oper = $(this).attr("oper");
					$($t).triggerHandler("jqGridToolbarSelectOper", [v, oper, elem]);
					$("#sopt_menu").hide();
					$(elem).text(oper).attr("soper",v);
					if(p.autosearch===true){
						var inpelm = $(elem).parent().next().children()[0];
						if( $(inpelm).val() || v==="nu" || v ==="nn") {
							triggerToolbar();
						}
					}
				});
			};
			// create the row
			var tr = $("<tr class='ui-search-toolbar' role='rowheader'></tr>");
			var timeoutHnd;
			$.each($t.p.colModel,function(ci){
				var cm=this, soptions, surl, self, select = "", sot="=", so, i,
				th = $("<th role='columnheader' class='ui-state-default ui-th-column ui-th-"+$t.p.direction+"'></th>"),
				thd = $("<div style='position:relative;height:100%;padding-right:0.3em;padding-left:0.3em;'></div>"),
				stbl = $("<table class='ui-search-table' cellspacing='0'><tr><td class='ui-search-oper'></td><td class='ui-search-input'></td><td class='ui-search-clear'></td></tr></table>");
				if(this.hidden===true) { $(th).css("display","none");}
				this.search = this.search === false ? false : true;
				if(this.stype === undefined) {this.stype='text';}
				soptions = $.extend({},this.searchoptions || {});
				if(this.search){
					if(p.searchOperators) {
						so  = (soptions.sopt) ? soptions.sopt[0] : cm.stype==='select' ?  'eq' : p.defaultSearch;
						for(i = 0;i<p.odata.length;i++) {
							if(p.odata[i].oper === so) {
								sot = p.operands[so] || "";
								break;
							}
						}
						var st = soptions.searchtitle != null ? soptions.searchtitle : p.operandTitle;
						select = "<a title='"+st+"' style='padding-right: 0.5em;' soper='"+so+"' class='soptclass' colname='"+this.name+"'>"+sot+"</a>";
					}
					$("td:eq(0)",stbl).attr("colindex",ci).append(select);
					if(soptions.clearSearch === undefined) {
						soptions.clearSearch = true;
					}
					if(soptions.clearSearch) {
						$("td:eq(2)",stbl).append("<a title='Удалить значение.' style='padding-right: 0.3em;padding-left: 0.3em;' class='clearsearchclass'>x</a>");
					}
					switch (this.stype)
					{
					case "select":
						surl = this.surl || soptions.dataUrl;
						if(surl) {
							// data returned should have already constructed html select
							// primitive jQuery load
							self = thd;
							$(self).append(stbl);
							$.ajax($.extend({
								url: surl,
								dataType: "html",
								success: function(res) {
									if(soptions.buildSelect !== undefined) {
										var d = soptions.buildSelect(res);
										if (d) {
											$("td:eq(1)",stbl).append(d);
										}
									} else {
										$("td:eq(1)",stbl).append(res);
									}
									if(soptions.defaultValue !== undefined) { $("select",self).val(soptions.defaultValue); }
									$("select",self).attr({name:cm.index || cm.name, id: "gs_"+cm.name});
									if(soptions.attr) {$("select",self).attr(soptions.attr);}
									$("select",self).css({width: "100%"});
									// preserve autoserch
									$.jgrid.bindEv.call($t, $("select",self)[0], soptions);
									if(p.autosearch===true){
										$("select",self).change(function(){
											triggerToolbar();
											return false;
										});
									}
									res=null;
								}
							}, $.jgrid.ajaxOptions, $t.p.ajaxSelectOptions || {} ));
						} else {
							var oSv, sep, delim;
							if(cm.searchoptions) {
								oSv = cm.searchoptions.value === undefined ? "" : cm.searchoptions.value;
								sep = cm.searchoptions.separator === undefined ? ":" : cm.searchoptions.separator;
								delim = cm.searchoptions.delimiter === undefined ? ";" : cm.searchoptions.delimiter;
							} else if(cm.editoptions) {
								oSv = cm.editoptions.value === undefined ? "" : cm.editoptions.value;
								sep = cm.editoptions.separator === undefined ? ":" : cm.editoptions.separator;
								delim = cm.editoptions.delimiter === undefined ? ";" : cm.editoptions.delimiter;
							}
							if (oSv) {	
								var elem = document.createElement("select");
								elem.style.width = "100%";
								$(elem).attr({name:cm.index || cm.name, id: "gs_"+cm.name});
								var sv, ov, key, k;
								if(typeof oSv === "string") {
									so = oSv.split(delim);
									for(k=0; k<so.length;k++){
										sv = so[k].split(sep);
										ov = document.createElement("option");
										ov.value = sv[0]; ov.innerHTML = sv[1];
										elem.appendChild(ov);
									}
								} else if(typeof oSv === "object" ) {
									for (key in oSv) {
										if(oSv.hasOwnProperty(key)) {
											ov = document.createElement("option");
											ov.value = key; ov.innerHTML = oSv[key];
											elem.appendChild(ov);
										}
									}
								}
								if(soptions.defaultValue !== undefined) { $(elem).val(soptions.defaultValue); }
								if(soptions.attr) {$(elem).attr(soptions.attr);}
								$(thd).append(stbl);
								$.jgrid.bindEv.call($t, elem , soptions);
								$("td:eq(1)",stbl).append( elem );
								if(p.autosearch===true){
									$(elem).change(function(){
										triggerToolbar();
										return false;
									});
								}
							}
						}
						break;
					case "text":
						var df = soptions.defaultValue !== undefined ? soptions.defaultValue: "";

						$("td:eq(1)",stbl).append("<input type='text' style='width:100%;padding:0px;' name='"+(cm.index || cm.name)+"' id='gs_"+cm.name+"' value='"+df+"'/>");
						$(thd).append(stbl);

						if(soptions.attr) {$("input",thd).attr(soptions.attr);}
						$.jgrid.bindEv.call($t, $("input",thd)[0], soptions);
						if(p.autosearch===true){
							if(p.searchOnEnter) {
								$("input",thd).keypress(function(e){
									var key = e.charCode || e.keyCode || 0;
									if(key === 13){
										triggerToolbar();
										return false;
									}
									return this;
								});
							} else {
								$("input",thd).keydown(function(e){
									var key = e.which;
									switch (key) {
										case 13:
											return false;
										case 9 :
										case 16:
										case 37:
										case 38:
										case 39:
										case 40:
										case 27:
											break;
										default :
											if(timeoutHnd) { clearTimeout(timeoutHnd); }
											timeoutHnd = setTimeout(function(){triggerToolbar();},500);
									}
								});
							}
						}
						break;
					case "custom":
						$("td:eq(1)",stbl).append("<span style='width:95%;padding:0px;' name='"+(cm.index || cm.name)+"' id='gs_"+cm.name+"'/>");
						$(thd).append(stbl);
						try {
							if($.isFunction(soptions.custom_element)) {
								var celm = soptions.custom_element.call($t,soptions.defaultValue !== undefined ? soptions.defaultValue: "",soptions);
								if(celm) {
									celm = $(celm).addClass("customelement");
									$(thd).find(">span").append(celm);
								} else {
									throw "e2";
								}
							} else {
								throw "e1";
							}
						} catch (e) {
							if (e === "e1") { $.jgrid.info_dialog($.jgrid.errors.errcap,"function 'custom_element' "+$.jgrid.edit.msg.nodefined,$.jgrid.edit.bClose);}
							if (e === "e2") { $.jgrid.info_dialog($.jgrid.errors.errcap,"function 'custom_element' "+$.jgrid.edit.msg.novalue,$.jgrid.edit.bClose);}
							else { $.jgrid.info_dialog($.jgrid.errors.errcap,typeof e==="string"?e:e.message,$.jgrid.edit.bClose); }
						}
						break;
					}
				}
				$(th).append(thd);
				$(tr).append(th);
				if(!p.searchOperators) {
					$("td:eq(0)",stbl).hide();
				}
			});
			$("table thead",$t.grid.hDiv).append(tr);
			if(p.searchOperators) {
				$(".soptclass",tr).click(function(e){
					var offset = $(this).offset(),
					left = ( offset.left ),
					top = ( offset.top);
					buildRuleMenu(this, left, top );
					e.stopPropagation();
				});
				$("body").on('click', function(e){
					if(e.target.className !== "soptclass") {
						$("#sopt_menu").hide();
					}
				});
			}
			$(".clearsearchclass",tr).click(function(e){
				var ptr = $(this).parents("tr:first"),
				coli = parseInt($("td.ui-search-oper", ptr).attr('colindex'),10),
				sval  = $.extend({},$t.p.colModel[coli].searchoptions || {}),
				dval = sval.defaultValue ? sval.defaultValue : "";
				if($t.p.colModel[coli].stype === "select") {
					if(dval) {
						$("td.ui-search-input select", ptr).val( dval );
					} else {
						$("td.ui-search-input select", ptr)[0].selectedIndex = 0;
					}
				} else {
					$("td.ui-search-input input", ptr).val( dval );
				}
				// ToDo custom search type
				if(p.autosearch===true){
					triggerToolbar();
				}

			});
			this.ftoolbar = true;
			this.triggerToolbar = triggerToolbar;
			this.clearToolbar = clearToolbar;
			this.toggleToolbar = toggleToolbar;
		});
	},
	destroyFilterToolbar: function () {
		return this.each(function () {
			if (!this.ftoolbar) {
				return;
			}
			this.triggerToolbar = null;
			this.clearToolbar = null;
			this.toggleToolbar = null;
			this.ftoolbar = false;
			$(this.grid.hDiv).find("table thead tr.ui-search-toolbar").remove();
		});
	},
	destroyGroupHeader : function(nullHeader)
	{
		if(nullHeader === undefined) {
			nullHeader = true;
		}
		return this.each(function()
		{
			var $t = this, $tr, i, l, headers, $th, $resizing, grid = $t.grid,
			thead = $("table.ui-jqgrid-htable thead", grid.hDiv), cm = $t.p.colModel, hc;
			if(!grid) { return; }

			$(this).unbind('.setGroupHeaders');
			$tr = $("<tr>", {role: "rowheader"}).addClass("ui-jqgrid-labels");
			headers = grid.headers;
			for (i = 0, l = headers.length; i < l; i++) {
				hc = cm[i].hidden ? "none" : "";
				$th = $(headers[i].el)
					.width(headers[i].width)
					.css('display',hc);
				try {
					$th.removeAttr("rowSpan");
				} catch (rs) {
					//IE 6/7
					$th.attr("rowSpan",1);
				}
				$tr.append($th);
				$resizing = $th.children("span.ui-jqgrid-resize");
				if ($resizing.length>0) {// resizable column
					$resizing[0].style.height = "";
				}
				$th.children("div")[0].style.top = "";
			}
			$(thead).children('tr.ui-jqgrid-labels').remove();
			$(thead).prepend($tr);

			if(nullHeader === true) {
				$($t).jqGrid('setGridParam',{ 'groupHeader': null});
			}
		});
	},
	setGroupHeaders : function ( o ) {
		o = $.extend({
			useColSpanStyle :  false,
			groupHeaders: []
		},o  || {});
		return this.each(function(){
			this.p.groupHeader = o;
			var ts = this,
			i, cmi, skip = 0, $tr, $colHeader, th, $th, thStyle,
			iCol,
			cghi,
			//startColumnName,
			numberOfColumns,
			titleText,
			cVisibleColumns,
			colModel = ts.p.colModel,
			cml = colModel.length,
			ths = ts.grid.headers,
			$htable = $("table.ui-jqgrid-htable", ts.grid.hDiv),
			$trLabels = $htable.children("thead").children("tr.ui-jqgrid-labels:last").addClass("jqg-second-row-header"),
			$thead = $htable.children("thead"),
			$theadInTable,
			$firstHeaderRow = $htable.find(".jqg-first-row-header");
			if($firstHeaderRow[0] === undefined) {
				$firstHeaderRow = $('<tr>', {role: "row", "aria-hidden": "true"}).addClass("jqg-first-row-header").css("height", "auto");
			} else {
				$firstHeaderRow.empty();
			}
			var $firstRow,
			inColumnHeader = function (text, columnHeaders) {
				var length = columnHeaders.length, i;
				for (i = 0; i < length; i++) {
					if (columnHeaders[i].startColumnName === text) {
						return i;
					}
				}
				return -1;
			};

			$(ts).prepend($thead);
			$tr = $('<tr>', {role: "rowheader"}).addClass("ui-jqgrid-labels jqg-third-row-header");
			for (i = 0; i < cml; i++) {
				th = ths[i].el;
				$th = $(th);
				cmi = colModel[i];
				// build the next cell for the first header row
				thStyle = { height: '0px', width: ths[i].width + 'px', display: (cmi.hidden ? 'none' : '')};
				$("<th>", {role: 'gridcell'}).css(thStyle).addClass("ui-first-th-"+ts.p.direction).appendTo($firstHeaderRow);

				th.style.width = ""; // remove unneeded style
				iCol = inColumnHeader(cmi.name, o.groupHeaders);
				if (iCol >= 0) {
					cghi = o.groupHeaders[iCol];
					numberOfColumns = cghi.numberOfColumns;
					titleText = cghi.titleText;

					// caclulate the number of visible columns from the next numberOfColumns columns
					for (cVisibleColumns = 0, iCol = 0; iCol < numberOfColumns && (i + iCol < cml); iCol++) {
						if (!colModel[i + iCol].hidden) {
							cVisibleColumns++;
						}
					}

					// The next numberOfColumns headers will be moved in the next row
					// in the current row will be placed the new column header with the titleText.
					// The text will be over the cVisibleColumns columns
					$colHeader = $('<th>').attr({role: "columnheader"})
						.addClass("ui-state-default ui-th-column-header ui-th-"+ts.p.direction)
						.css({'height':'22px', 'border-top': '0px none'})
						.html(titleText);
					if(cVisibleColumns > 0) {
						$colHeader.attr("colspan", String(cVisibleColumns));
					}
					if (ts.p.headertitles) {
						$colHeader.attr("title", $colHeader.text());
					}
					// hide if not a visible cols
					if( cVisibleColumns === 0) {
						$colHeader.hide();
					}

					$th.before($colHeader); // insert new column header before the current
					$tr.append(th);         // move the current header in the next row

					// set the coumter of headers which will be moved in the next row
					skip = numberOfColumns - 1;
				} else {
					if (skip === 0) {
						if (o.useColSpanStyle) {
							// expand the header height to two rows
							$th.attr("rowspan", "2");
						} else {
							$('<th>', {role: "columnheader"})
								.addClass("ui-state-default ui-th-column-header ui-th-"+ts.p.direction)
								.css({"display": cmi.hidden ? 'none' : '', 'border-top': '0px none'})
								.insertBefore($th);
							$tr.append(th);
						}
					} else {
						// move the header to the next row
						//$th.css({"padding-top": "2px", height: "19px"});
						$tr.append(th);
						skip--;
					}
				}
			}
			$theadInTable = $(ts).children("thead");
			$theadInTable.prepend($firstHeaderRow);
			$tr.insertAfter($trLabels);
			$htable.append($theadInTable);

			if (o.useColSpanStyle) {
				// Increase the height of resizing span of visible headers
				$htable.find("span.ui-jqgrid-resize").each(function () {
					var $parent = $(this).parent();
					if ($parent.is(":visible")) {
						this.style.cssText = 'height: ' + $parent.height() + 'px !important; cursor: col-resize;';
					}
				});

				// Set position of the sortable div (the main lable)
				// with the column header text to the middle of the cell.
				// One should not do this for hidden headers.
				$htable.find("div.ui-jqgrid-sortable").each(function () {
					var $ts = $(this), $parent = $ts.parent();
					if ($parent.is(":visible") && $parent.is(":has(span.ui-jqgrid-resize)")) {
						$ts.css('top', ($parent.height() - $ts.outerHeight()) / 2 + 'px');
					}
				});
			}

			$firstRow = $theadInTable.find("tr.jqg-first-row-header");
			$(ts).bind('jqGridResizeStop.setGroupHeaders', function (e, nw, idx) {
				$firstRow.find('th').eq(idx).width(nw);
			});
		});				
	},
	setFrozenColumns : function () {
		return this.each(function() {
			if ( !this.grid ) {return;}
			var $t = this, cm = $t.p.colModel,i=0, len = cm.length, maxfrozen = -1, frozen= false;
			// TODO treeGrid and grouping  Support
			if($t.p.subGrid === true || $t.p.treeGrid === true || $t.p.cellEdit === true || $t.p.sortable || $t.p.scroll || $t.p.grouping )
			{
				return;
			}
			if($t.p.rownumbers) { i++; }
			if($t.p.multiselect) { i++; }
			
			// get the max index of frozen col
			while(i<len)
			{
				// from left, no breaking frozen
				if(cm[i].frozen === true)
				{
					frozen = true;
					maxfrozen = i;
				} else {
					break;
				}
				i++;
			}
			if( maxfrozen>=0 && frozen) {
				var top = $t.p.caption ? $($t.grid.cDiv).outerHeight() : 0,
				hth = $(".ui-jqgrid-htable","#gview_"+$.jgrid.jqID($t.p.id)).height();
				//headers
				if($t.p.toppager) {
					top = top + $($t.grid.topDiv).outerHeight();
				}
				if($t.p.toolbar[0] === true) {
					if($t.p.toolbar[1] !== "bottom") {
						top = top + $($t.grid.uDiv).outerHeight();
					}
				}
				$t.grid.fhDiv = $('<div style="position:absolute;left:0px;top:'+top+'px;height:'+hth+'px;" class="frozen-div ui-state-default ui-jqgrid-hdiv"></div>');
				$t.grid.fbDiv = $('<div style="position:absolute;left:0px;top:'+(parseInt(top,10)+parseInt(hth,10) + 1)+'px;overflow-y:hidden" class="frozen-bdiv ui-jqgrid-bdiv"></div>');
				$("#gview_"+$.jgrid.jqID($t.p.id)).append($t.grid.fhDiv);
				var htbl = $(".ui-jqgrid-htable","#gview_"+$.jgrid.jqID($t.p.id)).clone(true);
				// groupheader support - only if useColSpanstyle is false
				if($t.p.groupHeader) {
					$("tr.jqg-first-row-header, tr.jqg-third-row-header", htbl).each(function(){
						$("th:gt("+maxfrozen+")",this).remove();
					});
					var swapfroz = -1, fdel = -1, cs, rs;
					$("tr.jqg-second-row-header th", htbl).each(function(){
						cs= parseInt($(this).attr("colspan"),10);
						rs= parseInt($(this).attr("rowspan"),10);
						if(rs) {
							swapfroz++;
							fdel++;
						}
						if(cs) {
							swapfroz = swapfroz+cs;
							fdel++;
						}
						if(swapfroz === maxfrozen) {
							return false;
						}
					});
					if(swapfroz !== maxfrozen) {
						fdel = maxfrozen;
					}
					$("tr.jqg-second-row-header", htbl).each(function(){
						$("th:gt("+fdel+")",this).remove();
					});
				} else {
					$("tr",htbl).each(function(){
						$("th:gt("+maxfrozen+")",this).remove();
					});
				}
				$(htbl).width(1);
				// resizing stuff
				$($t.grid.fhDiv).append(htbl)
				.mousemove(function (e) {
					if($t.grid.resizing){ $t.grid.dragMove(e);return false; }
				});
				$($t).bind('jqGridResizeStop.setFrozenColumns', function (e, w, index) {
					var rhth = $(".ui-jqgrid-htable",$t.grid.fhDiv);
					$("th:eq("+index+")",rhth).width( w ); 
					var btd = $(".ui-jqgrid-btable",$t.grid.fbDiv);
					$("tr:first td:eq("+index+")",btd).width( w ); 
				});
				// sorting stuff
				$($t).bind('jqGridSortCol.setFrozenColumns', function (e, index, idxcol) {

					var previousSelectedTh = $("tr.ui-jqgrid-labels:last th:eq("+$t.p.lastsort+")",$t.grid.fhDiv), newSelectedTh = $("tr.ui-jqgrid-labels:last th:eq("+idxcol+")",$t.grid.fhDiv);

					$("span.ui-grid-ico-sort",previousSelectedTh).addClass('ui-state-disabled');
					$(previousSelectedTh).attr("aria-selected","false");
					$("span.ui-icon-"+$t.p.sortorder,newSelectedTh).removeClass('ui-state-disabled');
					$(newSelectedTh).attr("aria-selected","true");
					if(!$t.p.viewsortcols[0]) {
						if($t.p.lastsort !== idxcol) {
							$("span.s-ico",previousSelectedTh).hide();
							$("span.s-ico",newSelectedTh).show();
						}
					}
				});
				
				// data stuff
				//TODO support for setRowData
				$("#gview_"+$.jgrid.jqID($t.p.id)).append($t.grid.fbDiv);
				$($t.grid.bDiv).scroll(function () {
					$($t.grid.fbDiv).scrollTop($(this).scrollTop());
				});
				if($t.p.hoverrows === true) {
					$("#"+$.jgrid.jqID($t.p.id)).unbind('mouseover').unbind('mouseout');
				}
				$($t).bind('jqGridAfterGridComplete.setFrozenColumns', function () {
					$("#"+$.jgrid.jqID($t.p.id)+"_frozen").remove();
					$($t.grid.fbDiv).height($($t.grid.bDiv).height()-16);
					var btbl = $("#"+$.jgrid.jqID($t.p.id)).clone(true);
					$("tr[role=row]",btbl).each(function(){
						$("td[role=gridcell]:gt("+maxfrozen+")",this).remove();
					});

					$(btbl).width(1).attr("id",$t.p.id+"_frozen");
					$($t.grid.fbDiv).append(btbl);
					if($t.p.hoverrows === true) {
						$("tr.jqgrow", btbl).hover(
							function(){ $(this).addClass("ui-state-hover"); $("#"+$.jgrid.jqID(this.id), "#"+$.jgrid.jqID($t.p.id)).addClass("ui-state-hover"); },
							function(){ $(this).removeClass("ui-state-hover"); $("#"+$.jgrid.jqID(this.id), "#"+$.jgrid.jqID($t.p.id)).removeClass("ui-state-hover"); }
						);
						$("tr.jqgrow", "#"+$.jgrid.jqID($t.p.id)).hover(
							function(){ $(this).addClass("ui-state-hover"); $("#"+$.jgrid.jqID(this.id), "#"+$.jgrid.jqID($t.p.id)+"_frozen").addClass("ui-state-hover");},
							function(){ $(this).removeClass("ui-state-hover"); $("#"+$.jgrid.jqID(this.id), "#"+$.jgrid.jqID($t.p.id)+"_frozen").removeClass("ui-state-hover"); }
						);
					}
					btbl=null;
				});
				if(!$t.grid.hDiv.loading) {
					$($t).triggerHandler("jqGridAfterGridComplete");
				}
				$t.p.frozenColumns = true;
			}
		});
	},
	destroyFrozenColumns :  function() {
		return this.each(function() {
			if ( !this.grid ) {return;}
			if(this.p.frozenColumns === true) {
				var $t = this;
				$($t.grid.fhDiv).remove();
				$($t.grid.fbDiv).remove();
				$t.grid.fhDiv = null; $t.grid.fbDiv=null;
				$(this).unbind('.setFrozenColumns');
				if($t.p.hoverrows === true) {
					var ptr;
					$("#"+$.jgrid.jqID($t.p.id)).bind('mouseover',function(e) {
						ptr = $(e.target).closest("tr.jqgrow");
						if($(ptr).attr("class") !== "ui-subgrid") {
						$(ptr).addClass("ui-state-hover");
					}
					}).bind('mouseout',function(e) {
						ptr = $(e.target).closest("tr.jqgrow");
						$(ptr).removeClass("ui-state-hover");
					});
				}
				this.p.frozenColumns = false;
			}
		});
	}
});
})(jQuery);
/*
 * jqModal - Minimalist Modaling with jQuery
 *   (http://dev.iceburg.net/jquery/jqmodal/)
 *
 * Copyright (c) 2007,2008 Brice Burgess <bhb@iceburg.net>
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 * 
 * $Version: 07/06/2008 +r13
 */
(function($) {
$.fn.jqm=function(o){
var p={
overlay: 50,
closeoverlay : true,
overlayClass: 'jqmOverlay',
closeClass: 'jqmClose',
trigger: '.jqModal',
ajax: F,
ajaxText: '',
target: F,
modal: F,
toTop: F,
onShow: F,
onHide: F,
onLoad: F
};
return this.each(function(){if(this._jqm)return H[this._jqm].c=$.extend({},H[this._jqm].c,o);s++;this._jqm=s;
H[s]={c:$.extend(p,$.jqm.params,o),a:F,w:$(this).addClass('jqmID'+s),s:s};
if(p.trigger)$(this).jqmAddTrigger(p.trigger);
});};

$.fn.jqmAddClose=function(e){return hs(this,e,'jqmHide');};
$.fn.jqmAddTrigger=function(e){return hs(this,e,'jqmShow');};
$.fn.jqmShow=function(t){return this.each(function(){$.jqm.open(this._jqm,t);});};
$.fn.jqmHide=function(t){return this.each(function(){$.jqm.close(this._jqm,t)});};

$.jqm = {
hash:{},
open:function(s,t){var h=H[s],c=h.c,cc='.'+c.closeClass,z=(parseInt(h.w.css('z-index')));z=(z>0)?z:3000;var o=$('<div></div>').css({height:'100%',width:'100%',position:'fixed',left:0,top:0,'z-index':z-1,opacity:c.overlay/100});if(h.a)return F;h.t=t;h.a=true;h.w.css('z-index',z);
 if(c.modal) {if(!A[0])setTimeout(function(){L('bind');},1);A.push(s);}
 else if(c.overlay > 0) {if(c.closeoverlay) h.w.jqmAddClose(o);}
 else o=F;

 h.o=(o)?o.addClass(c.overlayClass).prependTo('body'):F;

 if(c.ajax) {var r=c.target||h.w,u=c.ajax;r=(typeof r == 'string')?$(r,h.w):$(r);u=(u.substr(0,1) == '@')?$(t).attr(u.substring(1)):u;
  r.html(c.ajaxText).load(u,function(){if(c.onLoad)c.onLoad.call(this,h);if(cc)h.w.jqmAddClose($(cc,h.w));e(h);});}
 else if(cc)h.w.jqmAddClose($(cc,h.w));

 if(c.toTop&&h.o)h.w.before('<span id="jqmP'+h.w[0]._jqm+'"></span>').insertAfter(h.o);	
 (c.onShow)?c.onShow(h):h.w.show();e(h);return F;
},
close:function(s){var h=H[s];if(!h.a)return F;h.a=F;
 if(A[0]){A.pop();if(!A[0])L('unbind');}
 if(h.c.toTop&&h.o)$('#jqmP'+h.w[0]._jqm).after(h.w).remove();
 if(h.c.onHide)h.c.onHide(h);else{h.w.hide();if(h.o)h.o.remove();} return F;
},
params:{}};
var s=0,H=$.jqm.hash,A=[],F=false,
e=function(h){f(h);},
f=function(h){try{$(':input:visible',h.w)[0].focus();}catch(_){}},
L=function(t){$(document)[t]("keypress",m)[t]("keydown",m)[t]("mousedown",m);},
m=function(e){var h=H[A[A.length-1]],r=(!$(e.target).parents('.jqmID'+h.s)[0]);if(r){$('.jqmID'+h.s).each(function(){var $self=$(this),offset=$self.offset();if(offset.top<=e.pageY && e.pageY<=offset.top+$self.height() && offset.left<=e.pageX && e.pageX<=offset.left+$self.width()){r=false;return false;}});f(h);}return !r;},
hs=function(w,t,c){return w.each(function(){var s=this._jqm;$(t).each(function() {
 if(!this[c]){this[c]=[];$(this).click(function(){for(var i in {jqmShow:1,jqmHide:1})for(var s in this[i])if(H[this[i][s]])H[this[i][s]].w[i](this);return F;});}this[c].push(s);});});};
})(jQuery);/*
 * jqDnR - Minimalistic Drag'n'Resize for jQuery.
 *
 * Copyright (c) 2007 Brice Burgess <bhb@iceburg.net>, http://www.iceburg.net
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * $Version: 2007.08.19 +r2
 */

(function($){
$.fn.jqDrag=function(h){return i(this,h,'d');};
$.fn.jqResize=function(h,ar){return i(this,h,'r',ar);};
$.jqDnR={
	dnr:{},
	e:0,
	drag:function(v){
		if(M.k == 'd'){E.css({left:M.X+v.pageX-M.pX,top:M.Y+v.pageY-M.pY});}
		else {
			E.css({width:Math.max(v.pageX-M.pX+M.W,0),height:Math.max(v.pageY-M.pY+M.H,0)});
			if(M1){E1.css({width:Math.max(v.pageX-M1.pX+M1.W,0),height:Math.max(v.pageY-M1.pY+M1.H,0)});}
		}
		return false;
	},
	stop:function(){
		//E.css('opacity',M.o);
		$(document).unbind('mousemove',J.drag).unbind('mouseup',J.stop);
	}
};
var J=$.jqDnR,M=J.dnr,E=J.e,E1,M1,
i=function(e,h,k,aR){
	return e.each(function(){
		h=(h)?$(h,e):e;
		h.bind('mousedown',{e:e,k:k},function(v){
			var d=v.data,p={};E=d.e;E1 = aR ? $(aR) : false;
			// attempt utilization of dimensions plugin to fix IE issues
			if(E.css('position') != 'relative'){try{E.position(p);}catch(e){}}
			M={
				X:p.left||f('left')||0,
				Y:p.top||f('top')||0,
				W:f('width')||E[0].scrollWidth||0,
				H:f('height')||E[0].scrollHeight||0,
				pX:v.pageX,
				pY:v.pageY,
				k:d.k
				//o:E.css('opacity')
			};
			// also resize
			if(E1 && d.k != 'd'){
				M1={
					X:p.left||f1('left')||0,
					Y:p.top||f1('top')||0,
					W:E1[0].offsetWidth||f1('width')||0,
					H:E1[0].offsetHeight||f1('height')||0,
					pX:v.pageX,
					pY:v.pageY,
					k:d.k
				};
			} else {M1 = false;}			
			//E.css({opacity:0.8});
			if($("input.hasDatepicker",E[0])[0]) {
			try {$("input.hasDatepicker",E[0]).datepicker('hide');}catch (dpe){}
			}
			$(document).mousemove($.jqDnR.drag).mouseup($.jqDnR.stop);
			return false;
		});
	});
},
f=function(k){return parseInt(E.css(k),10)||false;},
f1=function(k){return parseInt(E1.css(k),10)||false;};
})(jQuery);/*
	The below work is licensed under Creative Commons GNU LGPL License.

	Original work:

	License:     http://creativecommons.org/licenses/LGPL/2.1/
	Author:      Stefan Goessner/2006
	Web:         http://goessner.net/ 

	Modifications made:

	Version:     0.9-p5
	Description: Restructured code, JSLint validated (no strict whitespaces),
	             added handling of empty arrays, empty strings, and int/floats values.
	Author:      Michael Schøler/2008-01-29
	Web:         http://michael.hinnerup.net/blog/2008/01/26/converting-json-to-xml-and-xml-to-json/
	
	Description: json2xml added support to convert functions as CDATA
	             so it will be easy to write characters that cause some problems when convert
	Author:      Tony Tomov
*/

/*global alert */
var xmlJsonClass = {
	// Param "xml": Element or document DOM node.
	// Param "tab": Tab or indent string for pretty output formatting omit or use empty string "" to supress.
	// Returns:     JSON string
	xml2json: function(xml, tab) {
		if (xml.nodeType === 9) {
			// document node
			xml = xml.documentElement;
		}
		var nws = this.removeWhite(xml);
		var obj = this.toObj(nws);
		var json = this.toJson(obj, xml.nodeName, "\t");
		return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
	},

	// Param "o":   JavaScript object
	// Param "tab": tab or indent string for pretty output formatting omit or use empty string "" to supress.
	// Returns:     XML string
	json2xml: function(o, tab) {
		var toXml = function(v, name, ind) {
			var xml = "";
			var i, n;
			if (v instanceof Array) {
				if (v.length === 0) {
					xml += ind + "<"+name+">__EMPTY_ARRAY_</"+name+">\n";
				}
				else {
					for (i = 0, n = v.length; i < n; i += 1) {
						var sXml = ind + toXml(v[i], name, ind+"\t") + "\n";
						xml += sXml;
					}
				}
			}
			else if (typeof(v) === "object") {
				var hasChild = false;
				xml += ind + "<" + name;
				var m;
				for (m in v) if (v.hasOwnProperty(m)) {
					if (m.charAt(0) === "@") {
						xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
					}
					else {
						hasChild = true;
					}
				}
				xml += hasChild ? ">" : "/>";
				if (hasChild) {
					for (m in v) if (v.hasOwnProperty(m)) {
						if (m === "#text") {
							xml += v[m];
						}
						else if (m === "#cdata") {
							xml += "<![CDATA[" + v[m] + "]]>";
						}
						else if (m.charAt(0) !== "@") {
							xml += toXml(v[m], m, ind+"\t");
						}
					}
					xml += (xml.charAt(xml.length - 1) === "\n" ? ind : "") + "</" + name + ">";
				}
			}
			else if (typeof(v) === "function") {
				xml += ind + "<" + name + ">" + "<![CDATA[" + v + "]]>" + "</" + name + ">";
			}
			else {
				if (v === undefined ) { v = ""; }
				if (v.toString() === "\"\"" || v.toString().length === 0) {
					xml += ind + "<" + name + ">__EMPTY_STRING_</" + name + ">";
				} 
				else {
					xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
				}
			}
			return xml;
		};
		var xml = "";
		var m;
		for (m in o) if (o.hasOwnProperty(m)) {
			xml += toXml(o[m], m, "");
		}
		return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
	},
	// Internal methods
	toObj: function(xml) {
		var o = {};
		var FuncTest = /function/i;
		if (xml.nodeType === 1) {
			// element node ..
			if (xml.attributes.length) {
				// element with attributes ..
				var i;
				for (i = 0; i < xml.attributes.length; i += 1) {
					o["@" + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
				}
			}
			if (xml.firstChild) {
				// element has child nodes ..
				var textChild = 0, cdataChild = 0, hasElementChild = false;
				var n;
				for (n = xml.firstChild; n; n = n.nextSibling) {
					if (n.nodeType === 1) {
						hasElementChild = true;
					}
					else if (n.nodeType === 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) {
						// non-whitespace text
						textChild += 1;
					}
					else if (n.nodeType === 4) {
						// cdata section node
						cdataChild += 1;
					}
				}
				if (hasElementChild) {
					if (textChild < 2 && cdataChild < 2) {
						// structured element with evtl. a single text or/and cdata node ..
						this.removeWhite(xml);
						for (n = xml.firstChild; n; n = n.nextSibling) {
							if (n.nodeType === 3) {
								// text node
								o["#text"] = this.escape(n.nodeValue);
							}
							else if (n.nodeType === 4) {
								// cdata node
								if (FuncTest.test(n.nodeValue)) {
									o[n.nodeName] = [o[n.nodeName], n.nodeValue];
								} else {
									o["#cdata"] = this.escape(n.nodeValue);
								}
							}
							else if (o[n.nodeName]) {
								// multiple occurence of element ..
								if (o[n.nodeName] instanceof Array) {
									o[n.nodeName][o[n.nodeName].length] = this.toObj(n);
								}
								else {
									o[n.nodeName] = [o[n.nodeName], this.toObj(n)];
								}
							}
							else {
								// first occurence of element ..
								o[n.nodeName] = this.toObj(n);
							}
						}
					}

					else {
						// mixed content
						if (!xml.attributes.length) {
							o = this.escape(this.innerXml(xml));
						}
						else {
							o["#text"] = this.escape(this.innerXml(xml));
						}
					}
				}
				else if (textChild) {
					// pure text
					if (!xml.attributes.length) {
						o = this.escape(this.innerXml(xml));
						if (o === "__EMPTY_ARRAY_") {
							o = "[]";
						} else if (o === "__EMPTY_STRING_") {
							o = "";
						}
					}
					else {
						o["#text"] = this.escape(this.innerXml(xml));
					}
				}
				else if (cdataChild) {
					// cdata
					if (cdataChild > 1) {
						o = this.escape(this.innerXml(xml));
					}
					else {
						for (n = xml.firstChild; n; n = n.nextSibling) {
							if(FuncTest.test(xml.firstChild.nodeValue)) {
								o = xml.firstChild.nodeValue;
								break;
							} else {
								o["#cdata"] = this.escape(n.nodeValue);
							}
						}
					}
				}
			}
			if (!xml.attributes.length && !xml.firstChild) {
				o = null;
			}
		}
		else if (xml.nodeType === 9) {
			// document.node
			o = this.toObj(xml.documentElement);
		}
		else {
			alert("unhandled node type: " + xml.nodeType);
		}
		return o;
	},
	toJson: function(o, name, ind, wellform) {
		if(wellform === undefined) wellform = true;
		var json = name ? ("\"" + name + "\"") : "", tab = "\t", newline = "\n";
		if(!wellform) {
			tab= ""; newline= "";
		}

		if (o === "[]") {
			json += (name ? ":[]" : "[]");
		}
		else if (o instanceof Array) {
			var n, i, ar=[];
			for (i = 0, n = o.length; i < n; i += 1) {
				ar[i] = this.toJson(o[i], "", ind + tab, wellform);
			}
			json += (name ? ":[" : "[") + (ar.length > 1 ? (newline + ind + tab + ar.join(","+newline + ind + tab) + newline + ind) : ar.join("")) + "]";
		}
		else if (o === null) {
			json += (name && ":") + "null";
		}
		else if (typeof(o) === "object") {
			var arr = [], m;
			for (m in o) {
				if (o.hasOwnProperty(m)) {
					arr[arr.length] = this.toJson(o[m], m, ind + tab, wellform);
			}
		}
			json += (name ? ":{" : "{") + (arr.length > 1 ? (newline + ind + tab + arr.join(","+newline + ind + tab) + newline + ind) : arr.join("")) + "}";
		}
		else if (typeof(o) === "string") {
			/*
			var objRegExp  = /(^-?\d+\.?\d*$)/;
			var FuncTest = /function/i;
			var os = o.toString();
			if (objRegExp.test(os) || FuncTest.test(os) || os==="false" || os==="true") {
				// int or float
				json += (name && ":")  + "\"" +os + "\"";
			} 
			else {
			*/
				json += (name && ":") + "\"" + o.replace(/\\/g,'\\\\').replace(/\"/g,'\\"') + "\"";
			//}
			}
		else {
			json += (name && ":") +  o.toString();
		}
		return json;
	},
	innerXml: function(node) {
		var s = "";
		if ("innerHTML" in node) {
			s = node.innerHTML;
		}
		else {
			var asXml = function(n) {
				var s = "", i;
				if (n.nodeType === 1) {
					s += "<" + n.nodeName;
					for (i = 0; i < n.attributes.length; i += 1) {
						s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\"";
					}
					if (n.firstChild) {
						s += ">";
						for (var c = n.firstChild; c; c = c.nextSibling) {
							s += asXml(c);
						}
						s += "</" + n.nodeName + ">";
					}
					else {
						s += "/>";
					}
				}
				else if (n.nodeType === 3) {
					s += n.nodeValue;
				}
				else if (n.nodeType === 4) {
					s += "<![CDATA[" + n.nodeValue + "]]>";
				}
				return s;
			};
			for (var c = node.firstChild; c; c = c.nextSibling) {
				s += asXml(c);
			}
		}
		return s;
	},
	escape: function(txt) {
		return txt.replace(/[\\]/g, "\\\\").replace(/[\"]/g, '\\"').replace(/[\n]/g, '\\n').replace(/[\r]/g, '\\r');
	},
	removeWhite: function(e) {
		e.normalize();
		var n;
		for (n = e.firstChild; n; ) {
			if (n.nodeType === 3) {
				// text node
				if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) {
					// pure whitespace text node
					var nxt = n.nextSibling;
					e.removeChild(n);
					n = nxt;
				}
				else {
					n = n.nextSibling;
				}
			}
			else if (n.nodeType === 1) {
				// element node
				this.removeWhite(n);
				n = n.nextSibling;
			}
			else {
				// any other node
				n = n.nextSibling;
			}
		}
		return e;
	}
};/*
**
 * formatter for values but most of the values if for jqGrid
 * Some of this was inspired and based on how YUI does the table datagrid but in jQuery fashion
 * we are trying to keep it as light as possible
 * Joshua Burnett josh@9ci.com	
 * http://www.greenbill.com
 *
 * Changes from Tony Tomov tony@trirand.com
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 * 
**/
/*jshint eqeqeq:false */
/*global jQuery */

(function($) {
"use strict";	
	$.fmatter = {};
	//opts can be id:row id for the row, rowdata:the data for the row, colmodel:the column model for this column
	//example {id:1234,}
	$.extend($.fmatter,{
		isBoolean : function(o) {
			return typeof o === 'boolean';
		},
		isObject : function(o) {
			return (o && (typeof o === 'object' || $.isFunction(o))) || false;
		},
		isString : function(o) {
			return typeof o === 'string';
		},
		isNumber : function(o) {
			return typeof o === 'number' && isFinite(o);
		},
		isValue : function (o) {
			return (this.isObject(o) || this.isString(o) || this.isNumber(o) || this.isBoolean(o));
		},
		isEmpty : function(o) {
			if(!this.isString(o) && this.isValue(o)) {
				return false;
			}
			if (!this.isValue(o)){
				return true;
			}
			o = $.trim(o).replace(/\&nbsp\;/ig,'').replace(/\&#160\;/ig,'');
			return o==="";	
		}
	});
	$.fn.fmatter = function(formatType, cellval, opts, rwd, act) {
		// build main options before element iteration
		var v=cellval;
		opts = $.extend({}, $.jgrid.formatter, opts);

		try {
			v = $.fn.fmatter[formatType].call(this, cellval, opts, rwd, act);
		} catch(fe){}
		return v;
	};
	$.fmatter.util = {
		// Taken from YAHOO utils
		NumberFormat : function(nData,opts) {
			if(!$.fmatter.isNumber(nData)) {
				nData *= 1;
			}
			if($.fmatter.isNumber(nData)) {
				var bNegative = (nData < 0);
				var sOutput = String(nData);
				var sDecimalSeparator = opts.decimalSeparator || ".";
				var nDotIndex;
				if($.fmatter.isNumber(opts.decimalPlaces)) {
					// Round to the correct decimal place
					var nDecimalPlaces = opts.decimalPlaces;
					var nDecimal = Math.pow(10, nDecimalPlaces);
					sOutput = String(Math.round(nData*nDecimal)/nDecimal);
					nDotIndex = sOutput.lastIndexOf(".");
					if(nDecimalPlaces > 0) {
					// Add the decimal separator
						if(nDotIndex < 0) {
							sOutput += sDecimalSeparator;
							nDotIndex = sOutput.length-1;
						}
						// Replace the "."
						else if(sDecimalSeparator !== "."){
							sOutput = sOutput.replace(".",sDecimalSeparator);
						}
					// Add missing zeros
						while((sOutput.length - 1 - nDotIndex) < nDecimalPlaces) {
							sOutput += "0";
						}
					}
				}
				if(opts.thousandsSeparator) {
					var sThousandsSeparator = opts.thousandsSeparator;
					nDotIndex = sOutput.lastIndexOf(sDecimalSeparator);
					nDotIndex = (nDotIndex > -1) ? nDotIndex : sOutput.length;
					var sNewOutput = sOutput.substring(nDotIndex);
					var nCount = -1, i;
					for (i=nDotIndex; i>0; i--) {
						nCount++;
						if ((nCount%3 === 0) && (i !== nDotIndex) && (!bNegative || (i > 1))) {
							sNewOutput = sThousandsSeparator + sNewOutput;
						}
						sNewOutput = sOutput.charAt(i-1) + sNewOutput;
					}
					sOutput = sNewOutput;
				}
				// Prepend prefix
				sOutput = (opts.prefix) ? opts.prefix + sOutput : sOutput;
				// Append suffix
				sOutput = (opts.suffix) ? sOutput + opts.suffix : sOutput;
				return sOutput;
				
			}
			return nData;
		}
	};
	$.fn.fmatter.defaultFormat = function(cellval, opts) {
		return ($.fmatter.isValue(cellval) && cellval!=="" ) ?  cellval : opts.defaultValue || "&#160;";
	};
	$.fn.fmatter.email = function(cellval, opts) {
		if(!$.fmatter.isEmpty(cellval)) {
			return "<a href=\"mailto:" + cellval + "\">" + cellval + "</a>";
		}
		return $.fn.fmatter.defaultFormat(cellval,opts );
	};
	$.fn.fmatter.checkbox =function(cval, opts) {
		var op = $.extend({},opts.checkbox), ds;
		if(opts.colModel !== undefined && opts.colModel.formatoptions !== undefined) {
			op = $.extend({},op,opts.colModel.formatoptions);
		}
		if(op.disabled===true) {ds = "disabled=\"disabled\"";} else {ds="";}
		if($.fmatter.isEmpty(cval) || cval === undefined ) {cval = $.fn.fmatter.defaultFormat(cval,op);}
		cval=String(cval);
		cval=(cval+"").toLowerCase();
		var bchk = cval.search(/(false|f|0|no|n|off|undefined)/i)<0 ? " checked='checked' " : "";
		return "<input type=\"checkbox\" " + bchk  + " value=\""+ cval+"\" offval=\"no\" "+ds+ "/>";
	};
	$.fn.fmatter.link = function(cellval, opts) {
		var op = {target:opts.target};
		var target = "";
		if(opts.colModel !== undefined && opts.colModel.formatoptions !== undefined) {
			op = $.extend({},op,opts.colModel.formatoptions);
		}
		if(op.target) {target = 'target=' + op.target;}
		if(!$.fmatter.isEmpty(cellval)) {
			return "<a "+target+" href=\"" + cellval + "\">" + cellval + "</a>";
		}
		return $.fn.fmatter.defaultFormat(cellval,opts);
	};
	$.fn.fmatter.showlink = function(cellval, opts) {
		var op = {baseLinkUrl: opts.baseLinkUrl,showAction:opts.showAction, addParam: opts.addParam || "", target: opts.target, idName: opts.idName},
		target = "", idUrl;
		if(opts.colModel !== undefined && opts.colModel.formatoptions !== undefined) {
			op = $.extend({},op,opts.colModel.formatoptions);
		}
		if(op.target) {target = 'target=' + op.target;}
		idUrl = op.baseLinkUrl+op.showAction + '?'+ op.idName+'='+opts.rowId+op.addParam;
		if($.fmatter.isString(cellval) || $.fmatter.isNumber(cellval)) {	//add this one even if its blank string
			return "<a "+target+" href=\"" + idUrl + "\">" + cellval + "</a>";
		}
		return $.fn.fmatter.defaultFormat(cellval,opts);
	};
	$.fn.fmatter.integer = function(cellval, opts) {
		var op = $.extend({},opts.integer);
		if(opts.colModel !== undefined && opts.colModel.formatoptions !== undefined) {
			op = $.extend({},op,opts.colModel.formatoptions);
		}
		if($.fmatter.isEmpty(cellval)) {
			return op.defaultValue;
		}
		return $.fmatter.util.NumberFormat(cellval,op);
	};
	$.fn.fmatter.number = function (cellval, opts) {
		var op = $.extend({},opts.number);
		if(opts.colModel !== undefined && opts.colModel.formatoptions !== undefined) {
			op = $.extend({},op,opts.colModel.formatoptions);
		}
		if($.fmatter.isEmpty(cellval)) {
			return op.defaultValue;
		}
		return $.fmatter.util.NumberFormat(cellval,op);
	};
	$.fn.fmatter.currency = function (cellval, opts) {
		var op = $.extend({},opts.currency);
		if(opts.colModel !== undefined && opts.colModel.formatoptions !== undefined) {
			op = $.extend({},op,opts.colModel.formatoptions);
		}
		if($.fmatter.isEmpty(cellval)) {
			return op.defaultValue;
		}
		return $.fmatter.util.NumberFormat(cellval,op);
	};
	$.fn.fmatter.date = function (cellval, opts, rwd, act) {
		var op = $.extend({},opts.date);
		if(opts.colModel !== undefined && opts.colModel.formatoptions !== undefined) {
			op = $.extend({},op,opts.colModel.formatoptions);
		}
		if(!op.reformatAfterEdit && act === 'edit'){
			return $.fn.fmatter.defaultFormat(cellval, opts);
		}
		if(!$.fmatter.isEmpty(cellval)) {
			return $.jgrid.parseDate(op.srcformat,cellval,op.newformat,op);
		}
		return $.fn.fmatter.defaultFormat(cellval, opts);
	};
	$.fn.fmatter.select = function (cellval,opts) {
		// jqGrid specific
		cellval = String(cellval);
		var oSelect = false, ret=[], sep, delim;
		if(opts.colModel.formatoptions !== undefined){
			oSelect= opts.colModel.formatoptions.value;
			sep = opts.colModel.formatoptions.separator === undefined ? ":" : opts.colModel.formatoptions.separator;
			delim = opts.colModel.formatoptions.delimiter === undefined ? ";" : opts.colModel.formatoptions.delimiter;
		} else if(opts.colModel.editoptions !== undefined){
			oSelect= opts.colModel.editoptions.value;
			sep = opts.colModel.editoptions.separator === undefined ? ":" : opts.colModel.editoptions.separator;
			delim = opts.colModel.editoptions.delimiter === undefined ? ";" : opts.colModel.editoptions.delimiter;
		}
		if (oSelect) {
			var	msl =  opts.colModel.editoptions.multiple === true ? true : false,
			scell = [], sv;
			if(msl) {scell = cellval.split(",");scell = $.map(scell,function(n){return $.trim(n);});}
			if ($.fmatter.isString(oSelect)) {
				// mybe here we can use some caching with care ????
				var so = oSelect.split(delim), j=0, i;
				for(i=0; i<so.length;i++){
					sv = so[i].split(sep);
					if(sv.length > 2 ) {
						sv[1] = $.map(sv,function(n,i){if(i>0) {return n;}}).join(sep);
					}
					if(msl) {
						if($.inArray(sv[0],scell)>-1) {
							ret[j] = sv[1];
							j++;
						}
					} else if($.trim(sv[0]) === $.trim(cellval)) {
						ret[0] = sv[1];
						break;
					}
				}
			} else if($.fmatter.isObject(oSelect)) {
				// this is quicker
				if(msl) {
					ret = $.map(scell, function(n){
						return oSelect[n];
					});
				} else {
					ret[0] = oSelect[cellval] || "";
				}
			}
		}
		cellval = ret.join(", ");
		return  cellval === "" ? $.fn.fmatter.defaultFormat(cellval,opts) : cellval;
	};
	$.fn.fmatter.rowactions = function(act) {
		var $tr = $(this).closest("tr.jqgrow"),
			rid = $tr.attr("id"),
			$id = $(this).closest("table.ui-jqgrid-btable").attr('id').replace(/_frozen([^_]*)$/,'$1'),
			$grid = $("#"+$id),
			$t = $grid[0],
			p = $t.p,
			cm = p.colModel[$.jgrid.getCellIndex(this)],
			$actionsDiv = cm.frozen ? $("tr#"+rid+" td:eq("+$.jgrid.getCellIndex(this)+") > div",$grid) :$(this).parent(),
			op = {
				keys: false,
				onEdit: null, 
				onSuccess: null, 
				afterSave: null,
				onError: null,
				afterRestore: null,
				extraparam: {},
				url: null,
				restoreAfterError: true,
				mtype: "POST",
				delOptions: {},
				editOptions: {}
			},
			saverow = function(rowid, res) {
				if($.isFunction(op.afterSave)) { op.afterSave.call($t, rowid, res); }
				$actionsDiv.find("div.ui-inline-edit,div.ui-inline-del").show();
				$actionsDiv.find("div.ui-inline-save,div.ui-inline-cancel").hide();
			},
			restorerow = function(rowid) {
				if($.isFunction(op.afterRestore)) { op.afterRestore.call($t, rowid); }
				$actionsDiv.find("div.ui-inline-edit,div.ui-inline-del").show();
				$actionsDiv.find("div.ui-inline-save,div.ui-inline-cancel").hide();
			};

		if (cm.formatoptions !== undefined) {
			op = $.extend(op,cm.formatoptions);
		}
		if (p.editOptions !== undefined) {
			op.editOptions = p.editOptions;
		}
		if (p.delOptions !== undefined) {
			op.delOptions = p.delOptions;
		}
		if ($tr.hasClass("jqgrid-new-row")){
			op.extraparam[p.prmNames.oper] = p.prmNames.addoper;
		}
		var actop = {
			keys: op.keys,
			oneditfunc: op.onEdit,
			successfunc: op.onSuccess,
			url: op.url,
			extraparam: op.extraparam,
			aftersavefunc: saverow,
			errorfunc: op.onError,
			afterrestorefunc: restorerow,
			restoreAfterError: op.restoreAfterError,
			mtype: op.mtype
		};
		switch(act)
		{
			case 'edit':
				$grid.jqGrid('editRow', rid, actop);
				$actionsDiv.find("div.ui-inline-edit,div.ui-inline-del").hide();
				$actionsDiv.find("div.ui-inline-save,div.ui-inline-cancel").show();
				$grid.triggerHandler("jqGridAfterGridComplete");
				break;
			case 'save':
				if ($grid.jqGrid('saveRow', rid, actop)) {
					$actionsDiv.find("div.ui-inline-edit,div.ui-inline-del").show();
					$actionsDiv.find("div.ui-inline-save,div.ui-inline-cancel").hide();
					$grid.triggerHandler("jqGridAfterGridComplete");
				}
				break;
			case 'cancel' :
				$grid.jqGrid('restoreRow', rid, restorerow);
				$actionsDiv.find("div.ui-inline-edit,div.ui-inline-del").show();
				$actionsDiv.find("div.ui-inline-save,div.ui-inline-cancel").hide();
				$grid.triggerHandler("jqGridAfterGridComplete");
				break;
			case 'del':
				$grid.jqGrid('delGridRow', rid, op.delOptions);
				break;
			case 'formedit':
				$grid.jqGrid('setSelection', rid);
				$grid.jqGrid('editGridRow', rid, op.editOptions);
				break;
		}
	};
	$.fn.fmatter.actions = function(cellval,opts) {
		var op={keys:false, editbutton:true, delbutton:true, editformbutton: false},
			rowid=opts.rowId, str="",ocl;
		if(opts.colModel.formatoptions !== undefined) {
			op = $.extend(op,opts.colModel.formatoptions);
		}
		if(rowid === undefined || $.fmatter.isEmpty(rowid)) {return "";}
		if(op.editformbutton){
			ocl = "id='jEditButton_"+rowid+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'formedit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
			str += "<div title='"+$.jgrid.nav.edittitle+"' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' "+ocl+"><span class='ui-icon ui-icon-pencil'></span></div>";
		} else if(op.editbutton){
			ocl = "id='jEditButton_"+rowid+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'edit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') ";
			str += "<div title='"+$.jgrid.nav.edittitle+"' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' "+ocl+"><span class='ui-icon ui-icon-pencil'></span></div>";
		}
		if(op.delbutton) {
			ocl = "id='jDeleteButton_"+rowid+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'del'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
			str += "<div title='"+$.jgrid.nav.deltitle+"' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' "+ocl+"><span class='ui-icon ui-icon-trash'></span></div>";
		}
		ocl = "id='jSaveButton_"+rowid+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'save'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
		str += "<div title='"+$.jgrid.edit.bSubmit+"' style='float:left;display:none' class='ui-pg-div ui-inline-save' "+ocl+"><span class='ui-icon ui-icon-disk'></span></div>";
		ocl = "id='jCancelButton_"+rowid+"' onclick=jQuery.fn.fmatter.rowactions.call(this,'cancel'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
		str += "<div title='"+$.jgrid.edit.bCancel+"' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel' "+ocl+"><span class='ui-icon ui-icon-cancel'></span></div>";
		return "<div style='margin-left:8px;'>" + str + "</div>";
	};
	$.unformat = function (cellval,options,pos,cnt) {
		// specific for jqGrid only
		var ret, formatType = options.colModel.formatter,
		op =options.colModel.formatoptions || {}, sep,
		re = /([\.\*\_\'\(\)\{\}\+\?\\])/g,
		unformatFunc = options.colModel.unformat||($.fn.fmatter[formatType] && $.fn.fmatter[formatType].unformat);
		if(unformatFunc !== undefined && $.isFunction(unformatFunc) ) {
			ret = unformatFunc.call(this, $(cellval).text(), options, cellval);
		} else if(formatType !== undefined && $.fmatter.isString(formatType) ) {
			var opts = $.jgrid.formatter || {}, stripTag;
			switch(formatType) {
				case 'integer' :
					op = $.extend({},opts.integer,op);
					sep = op.thousandsSeparator.replace(re,"\\$1");
					stripTag = new RegExp(sep, "g");
					ret = $(cellval).text().replace(stripTag,'');
					break;
				case 'number' :
					op = $.extend({},opts.number,op);
					sep = op.thousandsSeparator.replace(re,"\\$1");
					stripTag = new RegExp(sep, "g");
					ret = $(cellval).text().replace(stripTag,"").replace(op.decimalSeparator,'.');
					break;
				case 'currency':
					op = $.extend({},opts.currency,op);
					sep = op.thousandsSeparator.replace(re,"\\$1");
					stripTag = new RegExp(sep, "g");
					ret = $(cellval).text();
					if (op.prefix && op.prefix.length) {
						ret = ret.substr(op.prefix.length);
					}
					if (op.suffix && op.suffix.length) {
						ret = ret.substr(0, ret.length - op.suffix.length);
					}
					ret = ret.replace(stripTag,'').replace(op.decimalSeparator,'.');
					break;
				case 'checkbox':
					var cbv = (options.colModel.editoptions) ? options.colModel.editoptions.value.split(":") : ["Yes","No"];
					ret = $('input',cellval).is(":checked") ? cbv[0] : cbv[1];
					break;
				case 'select' :
					ret = $.unformat.select(cellval,options,pos,cnt);
					break;
				case 'actions':
					return "";
				default:
					ret= $(cellval).text();
			}
		}
		return ret !== undefined ? ret : cnt===true ? $(cellval).text() : $.jgrid.htmlDecode($(cellval).html());
	};
	$.unformat.select = function (cellval,options,pos,cnt) {
		// Spacial case when we have local data and perform a sort
		// cnt is set to true only in sortDataArray
		var ret = [];
		var cell = $(cellval).text();
		if(cnt===true) {return cell;}
		var op = $.extend({}, options.colModel.formatoptions !== undefined ? options.colModel.formatoptions: options.colModel.editoptions),
		sep = op.separator === undefined ? ":" : op.separator,
		delim = op.delimiter === undefined ? ";" : op.delimiter;
		
		if(op.value){
			var oSelect = op.value,
			msl =  op.multiple === true ? true : false,
			scell = [], sv;
			if(msl) {scell = cell.split(",");scell = $.map(scell,function(n){return $.trim(n);});}
			if ($.fmatter.isString(oSelect)) {
				var so = oSelect.split(delim), j=0, i;
				for(i=0; i<so.length;i++){
					sv = so[i].split(sep);
					if(sv.length > 2 ) {
						sv[1] = $.map(sv,function(n,i){if(i>0) {return n;}}).join(sep);
					}					
					if(msl) {
						if($.inArray(sv[1],scell)>-1) {
							ret[j] = sv[0];
							j++;
						}
					} else if($.trim(sv[1]) === $.trim(cell)) {
						ret[0] = sv[0];
						break;
					}
				}
			} else if($.fmatter.isObject(oSelect) || $.isArray(oSelect) ){
				if(!msl) {scell[0] =  cell;}
				ret = $.map(scell, function(n){
					var rv;
					$.each(oSelect, function(i,val){
						if (val === n) {
							rv = i;
							return false;
						}
					});
					if( rv !== undefined ) {return rv;}
				});
			}
			return ret.join(", ");
		}
		return cell || "";
	};
	$.unformat.date = function (cellval, opts) {
		var op = $.jgrid.formatter.date || {};
		if(opts.formatoptions !== undefined) {
			op = $.extend({},op,opts.formatoptions);
		}		
		if(!$.fmatter.isEmpty(cellval)) {
			return $.jgrid.parseDate(op.newformat,cellval,op.srcformat,op);
		}
		return $.fn.fmatter.defaultFormat(cellval, opts);
	};
})(jQuery);
/*jshint eqeqeq:false */
/*global jQuery */
(function($){
/*
 * jqGrid common function
 * Tony Tomov tony@trirand.com
 * http://trirand.com/blog/ 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
*/
"use strict";
$.extend($.jgrid,{
// Modal functions
	showModal : function(h) {
		h.w.show();
	},
	closeModal : function(h) {
		h.w.hide().attr("aria-hidden","true");
		if(h.o) {h.o.remove();}
	},
	hideModal : function (selector,o) {
		o = $.extend({jqm : true, gb :''}, o || {});
		if(o.onClose) {
			var oncret = o.gb && typeof o.gb === "string" && o.gb.substr(0,6) === "#gbox_" ? o.onClose.call($("#" + o.gb.substr(6))[0], selector) : o.onClose(selector);
			if (typeof oncret === 'boolean'  && !oncret ) { return; }
		}
		if ($.fn.jqm && o.jqm === true) {
			$(selector).attr("aria-hidden","true").jqmHide();
		} else {
			if(o.gb !== '') {
				try {$(".jqgrid-overlay:first",o.gb).hide();} catch (e){}
			}
			$(selector).hide().attr("aria-hidden","true");
		}
	},
//Helper functions
	findPos : function(obj) {
		var curleft = 0, curtop = 0;
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
			//do not change obj == obj.offsetParent
		}
		return [curleft,curtop];
	},
	createModal : function(aIDs, content, p, insertSelector, posSelector, appendsel, css) {
		p = $.extend(true, {}, $.jgrid.jqModal || {}, p);
		var mw  = document.createElement('div'), rtlsup, self = this;
		css = $.extend({}, css || {});
		rtlsup = $(p.gbox).attr("dir") === "rtl" ? true : false;
		mw.className= "ui-widget ui-widget-content ui-corner-all ui-jqdialog";
		mw.id = aIDs.themodal;
		var mh = document.createElement('div');
		mh.className = "ui-jqdialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix";
		mh.id = aIDs.modalhead;
		$(mh).append("<span class='ui-jqdialog-title'>"+p.caption+"</span>");
		var ahr= $("<a class='ui-jqdialog-titlebar-close ui-corner-all'></a>")
		.hover(function(){ahr.addClass('ui-state-hover');},
			function(){ahr.removeClass('ui-state-hover');})
		.append("<span class='ui-icon ui-icon-closethick'></span>");
		$(mh).append(ahr);
		if(rtlsup) {
			mw.dir = "rtl";
			$(".ui-jqdialog-title",mh).css("float","right");
			$(".ui-jqdialog-titlebar-close",mh).css("left",0.3+"em");
		} else {
			mw.dir = "ltr";
			$(".ui-jqdialog-title",mh).css("float","left");
			$(".ui-jqdialog-titlebar-close",mh).css("right",0.3+"em");
		}
		var mc = document.createElement('div');
		$(mc).addClass("ui-jqdialog-content ui-widget-content").attr("id",aIDs.modalcontent);
		$(mc).append(content);
		mw.appendChild(mc);
		$(mw).prepend(mh);
		if(appendsel===true) { $('body').append(mw); } //append as first child in body -for alert dialog
		else if (typeof appendsel === "string") {
			$(appendsel).append(mw);
		} else {$(mw).insertBefore(insertSelector);}
		$(mw).css(css);
		if(p.jqModal === undefined) {p.jqModal = true;} // internal use
		var coord = {};
		if ( $.fn.jqm && p.jqModal === true) {
			if(p.left ===0 && p.top===0 && p.overlay) {
				var pos = [];
				pos = $.jgrid.findPos(posSelector);
				p.left = pos[0] + 4;
				p.top = pos[1] + 4;
			}
			coord.top = p.top+"px";
			coord.left = p.left;
		} else if(p.left !==0 || p.top!==0) {
			coord.left = p.left;
			coord.top = p.top+"px";
		}
		$("a.ui-jqdialog-titlebar-close",mh).click(function(){
			var oncm = $("#"+$.jgrid.jqID(aIDs.themodal)).data("onClose") || p.onClose;
			var gboxclose = $("#"+$.jgrid.jqID(aIDs.themodal)).data("gbox") || p.gbox;
			self.hideModal("#"+$.jgrid.jqID(aIDs.themodal),{gb:gboxclose,jqm:p.jqModal,onClose:oncm});
			return false;
		});
		if (p.width === 0 || !p.width) {p.width = 300;}
		if(p.height === 0 || !p.height) {p.height =200;}
		if(!p.zIndex) {
			var parentZ = $(insertSelector).parents("*[role=dialog]").filter(':first').css("z-index");
			if(parentZ) {
				p.zIndex = parseInt(parentZ,10)+2;
			} else {
				p.zIndex = 950;
			}
		}
		var rtlt = 0;
		if( rtlsup && coord.left && !appendsel) {
			rtlt = $(p.gbox).width()- (!isNaN(p.width) ? parseInt(p.width,10) :0) - 8; // to do
		// just in case
			coord.left = parseInt(coord.left,10) + parseInt(rtlt,10);
		}
		if(coord.left) { coord.left += "px"; }
		$(mw).css($.extend({
			width: isNaN(p.width) ? "auto": p.width+"px",
			height:isNaN(p.height) ? "auto" : p.height + "px",
			zIndex:p.zIndex,
			overflow: 'hidden'
		},coord))
		.attr({tabIndex: "-1","role":"dialog","aria-labelledby":aIDs.modalhead,"aria-hidden":"true"});
		if(p.drag === undefined) { p.drag=true;}
		if(p.resize === undefined) {p.resize=true;}
		if (p.drag) {
			$(mh).css('cursor','move');
			if($.fn.jqDrag) {
				$(mw).jqDrag(mh);
			} else {
				try {
					$(mw).draggable({handle: $("#"+$.jgrid.jqID(mh.id))});
				} catch (e) {}
			}
		}
		if(p.resize) {
			if($.fn.jqResize) {
				$(mw).append("<div class='jqResize ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se'></div>");
				$("#"+$.jgrid.jqID(aIDs.themodal)).jqResize(".jqResize",aIDs.scrollelm ? "#"+$.jgrid.jqID(aIDs.scrollelm) : false);
			} else {
				try {
					$(mw).resizable({handles: 'se, sw',alsoResize: aIDs.scrollelm ? "#"+$.jgrid.jqID(aIDs.scrollelm) : false});
				} catch (r) {}
			}
		}
		if(p.closeOnEscape === true){
			$(mw).keydown( function( e ) {
				if( e.which == 27 ) {
					var cone = $("#"+$.jgrid.jqID(aIDs.themodal)).data("onClose") || p.onClose;
					self.hideModal("#"+$.jgrid.jqID(aIDs.themodal),{gb:p.gbox,jqm:p.jqModal,onClose: cone});
				}
			});
		}
	},
	viewModal : function (selector,o){
		o = $.extend({
			toTop: true,
			overlay: 10,
			modal: false,
			overlayClass : 'ui-widget-overlay',
			onShow: $.jgrid.showModal,
			onHide: $.jgrid.closeModal,
			gbox: '',
			jqm : true,
			jqM : true
		}, o || {});
		if ($.fn.jqm && o.jqm === true) {
			if(o.jqM) { $(selector).attr("aria-hidden","false").jqm(o).jqmShow(); }
			else {$(selector).attr("aria-hidden","false").jqmShow();}
		} else {
			if(o.gbox !== '') {
				$(".jqgrid-overlay:first",o.gbox).show();
				$(selector).data("gbox",o.gbox);
			}
			$(selector).show().attr("aria-hidden","false");
			try{$(':input:visible',selector)[0].focus();}catch(_){}
		}
	},
	info_dialog : function(caption, content,c_b, modalopt) {
		var mopt = {
			width:290,
			height:'auto',
			dataheight: 'auto',
			drag: true,
			resize: false,
			left:250,
			top:170,
			zIndex : 1000,
			jqModal : true,
			modal : false,
			closeOnEscape : true,
			align: 'center',
			buttonalign : 'center',
			buttons : []
		// {text:'textbutt', id:"buttid", onClick : function(){...}}
		// if the id is not provided we set it like info_button_+ the index in the array - i.e info_button_0,info_button_1...
		};
		$.extend(true, mopt, $.jgrid.jqModal || {}, {caption:"<b>"+caption+"</b>"}, modalopt || {});
		var jm = mopt.jqModal, self = this;
		if($.fn.jqm && !jm) { jm = false; }
		// in case there is no jqModal
		var buttstr ="", i;
		if(mopt.buttons.length > 0) {
			for(i=0;i<mopt.buttons.length;i++) {
				if(mopt.buttons[i].id === undefined) { mopt.buttons[i].id = "info_button_"+i; }
				buttstr += "<a id='"+mopt.buttons[i].id+"' class='fm-button ui-state-default ui-corner-all'>"+mopt.buttons[i].text+"</a>";
			}
		}
		var dh = isNaN(mopt.dataheight) ? mopt.dataheight : mopt.dataheight+"px",
		cn = "text-align:"+mopt.align+";";
		var cnt = "<div id='info_id'>";
		cnt += "<div id='infocnt' style='margin:0px;padding-bottom:1em;width:100%;overflow:auto;position:relative;height:"+dh+";"+cn+"'>"+content+"</div>";
		cnt += c_b ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:"+mopt.buttonalign+";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'><a id='closedialog' class='fm-button ui-state-default ui-corner-all'>"+c_b+"</a>"+buttstr+"</div>" :
			buttstr !== ""  ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:"+mopt.buttonalign+";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'>"+buttstr+"</div>" : "";
		cnt += "</div>";

		try {
			if($("#info_dialog").attr("aria-hidden") === "false") {
				$.jgrid.hideModal("#info_dialog",{jqm:jm});
			}
			$("#info_dialog").remove();
		} catch (e){}
		$.jgrid.createModal({
			themodal:'info_dialog',
			modalhead:'info_head',
			modalcontent:'info_content',
			scrollelm: 'infocnt'},
			cnt,
			mopt,
			'','',true
		);
		// attach onclick after inserting into the dom
		if(buttstr) {
			$.each(mopt.buttons,function(i){
				$("#"+$.jgrid.jqID(this.id),"#info_id").bind('click',function(){mopt.buttons[i].onClick.call($("#info_dialog")); return false;});
			});
		}
		$("#closedialog", "#info_id").click(function(){
			self.hideModal("#info_dialog",{
				jqm:jm,
				onClose: $("#info_dialog").data("onClose") || mopt.onClose,
				gb: $("#info_dialog").data("gbox") || mopt.gbox
			});
			return false;
		});
		$(".fm-button","#info_dialog").hover(
			function(){$(this).addClass('ui-state-hover');},
			function(){$(this).removeClass('ui-state-hover');}
		);
		if($.isFunction(mopt.beforeOpen) ) { mopt.beforeOpen(); }
		$.jgrid.viewModal("#info_dialog",{
			onHide: function(h) {
				h.w.hide().remove();
				if(h.o) { h.o.remove(); }
			},
			modal :mopt.modal,
			jqm:jm
		});
		if($.isFunction(mopt.afterOpen) ) { mopt.afterOpen(); }
		try{ $("#info_dialog").focus();} catch (m){}
	},
	bindEv: function  (el, opt) {
		var $t = this;
		if($.isFunction(opt.dataInit)) {
			opt.dataInit.call($t,el,opt);
		}
		if(opt.dataEvents) {
			$.each(opt.dataEvents, function() {
				if (this.data !== undefined) {
					$(el).bind(this.type, this.data, this.fn);
				} else {
					$(el).bind(this.type, this.fn);
				}
			});
		}
	},
// Form Functions
	createEl : function(eltype,options,vl,autowidth, ajaxso) {
		var elem = "", $t = this;
		function setAttributes(elm, atr, exl ) {
			var exclude = ['dataInit','dataEvents','dataUrl', 'buildSelect','sopt', 'searchhidden', 'defaultValue', 'attr', 'custom_element', 'custom_value'];
			if(exl !== undefined && $.isArray(exl)) {
				$.merge(exclude, exl);
			}
			$.each(atr, function(key, value){
				if($.inArray(key, exclude) === -1) {
					$(elm).attr(key,value);
				}
			});
			if(!atr.hasOwnProperty('id')) {
				$(elm).attr('id', $.jgrid.randId());
			}
		}
		switch (eltype)
		{
			case "textarea" :
				elem = document.createElement("textarea");
				if(autowidth) {
					if(!options.cols) { $(elem).css({width:"98%"});}
				} else if (!options.cols) { options.cols = 20; }
				if(!options.rows) { options.rows = 2; }
				if(vl==='&nbsp;' || vl==='&#160;' || (vl.length===1 && vl.charCodeAt(0)===160)) {vl="";}
				elem.value = vl;
				setAttributes(elem, options);
				$(elem).attr({"role":"textbox","multiline":"true"});
			break;
			case "checkbox" : //what code for simple checkbox
				elem = document.createElement("input");
				elem.type = "checkbox";
				if( !options.value ) {
					var vl1 = (vl+"").toLowerCase();
					if(vl1.search(/(false|f|0|no|n|off|undefined)/i)<0 && vl1!=="") {
						elem.checked=true;
						elem.defaultChecked=true;
						elem.value = vl;
					} else {
						elem.value = "on";
					}
					$(elem).attr("offval","off");
				} else {
					var cbval = options.value.split(":");
					if(vl === cbval[0]) {
						elem.checked=true;
						elem.defaultChecked=true;
					}
					elem.value = cbval[0];
					$(elem).attr("offval",cbval[1]);
				}
				setAttributes(elem, options, ['value']);
				$(elem).attr("role","checkbox");
			break;
			case "select" :
				elem = document.createElement("select");
				elem.setAttribute("role","select");
				var msl, ovm = [];
				if(options.multiple===true) {
					msl = true;
					elem.multiple="multiple";
					$(elem).attr("aria-multiselectable","true");
				} else { msl = false; }
				if(options.dataUrl !== undefined) {
					var rowid = options.name ? String(options.id).substring(0, String(options.id).length - String(options.name).length - 1) : String(options.id),
						postData = options.postData || ajaxso.postData;

					if ($t.p && $t.p.idPrefix) {
						rowid = $.jgrid.stripPref($t.p.idPrefix, rowid);
					}
					$.ajax($.extend({
						url: $.isFunction(options.dataUrl) ? options.dataUrl.call($t, rowid, vl, String(options.name)) : options.dataUrl,
						type : "GET",
						dataType: "html",
						data: $.isFunction(postData) ? postData.call($t, rowid, vl, String(options.name)) : postData,
						context: {elem:elem, options:options, vl:vl},
						success: function(data){
							var ovm = [], elem = this.elem, vl = this.vl,
							options = $.extend({},this.options),
							msl = options.multiple===true,
							a = $.isFunction(options.buildSelect) ? options.buildSelect.call($t,data) : data;
							if(typeof a === 'string') {
								a = $( $.trim( a ) ).html();
							}
							if(a) {
								$(elem).append(a);
								setAttributes(elem, options, postData ? ['postData'] : undefined );
								if(options.size === undefined) { options.size =  msl ? 3 : 1;}
								if(msl) {
									ovm = vl.split(",");
									ovm = $.map(ovm,function(n){return $.trim(n);});
								} else {
									ovm[0] = $.trim(vl);
								}
								//$(elem).attr(options);
								setTimeout(function(){
									$("option",elem).each(function(i){
										//if(i===0) { this.selected = ""; }
										// fix IE8/IE7 problem with selecting of the first item on multiple=true
										if (i === 0 && elem.multiple) { this.selected = false; }
										$(this).attr("role","option");
										if($.inArray($.trim($(this).text()),ovm) > -1 || $.inArray($.trim($(this).val()),ovm) > -1 ) {
											this.selected= "selected";
										}
									});
								},0);
							}
						}
					},ajaxso || {}));
				} else if(options.value) {
					var i;
					if(options.size === undefined) {
						options.size = msl ? 3 : 1;
					}
					if(msl) {
						ovm = vl.split(",");
						ovm = $.map(ovm,function(n){return $.trim(n);});
					}
					if(typeof options.value === 'function') { options.value = options.value(); }
					var so,sv, ov, 
					sep = options.separator === undefined ? ":" : options.separator,
					delim = options.delimiter === undefined ? ";" : options.delimiter;
					if(typeof options.value === 'string') {
						so = options.value.split(delim);
						for(i=0; i<so.length;i++){
							sv = so[i].split(sep);
							if(sv.length > 2 ) {
								sv[1] = $.map(sv,function(n,ii){if(ii>0) { return n;} }).join(sep);
							}
							ov = document.createElement("option");
							ov.setAttribute("role","option");
							ov.value = sv[0]; ov.innerHTML = sv[1];
							elem.appendChild(ov);
							if (!msl &&  ($.trim(sv[0]) === $.trim(vl) || $.trim(sv[1]) === $.trim(vl))) { ov.selected ="selected"; }
							if (msl && ($.inArray($.trim(sv[1]), ovm)>-1 || $.inArray($.trim(sv[0]), ovm)>-1)) {ov.selected ="selected";}
						}
					} else if (typeof options.value === 'object') {
						var oSv = options.value, key;
						for (key in oSv) {
							if (oSv.hasOwnProperty(key ) ){
								ov = document.createElement("option");
								ov.setAttribute("role","option");
								ov.value = key; ov.innerHTML = oSv[key];
								elem.appendChild(ov);
								if (!msl &&  ( $.trim(key) === $.trim(vl) || $.trim(oSv[key]) === $.trim(vl)) ) { ov.selected ="selected"; }
								if (msl && ($.inArray($.trim(oSv[key]),ovm)>-1 || $.inArray($.trim(key),ovm)>-1)) { ov.selected ="selected"; }
							}
						}
					}
					setAttributes(elem, options, ['value']);
				}
			break;
			case "text" :
			case "password" :
			case "button" :
				var role;
				if(eltype==="button") { role = "button"; }
				else { role = "textbox"; }
				elem = document.createElement("input");
				elem.type = eltype;
				elem.value = vl;
				setAttributes(elem, options);
				if(eltype !== "button"){
					if(autowidth) {
						if(!options.size) { $(elem).css({width:"98%"}); }
					} else if (!options.size) { options.size = 20; }
				}
				$(elem).attr("role",role);
			break;
			case "image" :
			case "file" :
				elem = document.createElement("input");
				elem.type = eltype;
				setAttributes(elem, options);
				break;
			case "custom" :
				elem = document.createElement("span");
				try {
					if($.isFunction(options.custom_element)) {
						var celm = options.custom_element.call($t,vl,options);
						if(celm) {
							celm = $(celm).addClass("customelement").attr({id:options.id,name:options.name});
							$(elem).empty().append(celm);
						} else {
							throw "e2";
						}
					} else {
						throw "e1";
					}
				} catch (e) {
					if (e==="e1") { $.jgrid.info_dialog($.jgrid.errors.errcap,"function 'custom_element' "+$.jgrid.edit.msg.nodefined, $.jgrid.edit.bClose);}
					if (e==="e2") { $.jgrid.info_dialog($.jgrid.errors.errcap,"function 'custom_element' "+$.jgrid.edit.msg.novalue,$.jgrid.edit.bClose);}
					else { $.jgrid.info_dialog($.jgrid.errors.errcap,typeof e==="string"?e:e.message,$.jgrid.edit.bClose); }
				}
			break;
		}
		return elem;
	},
// Date Validation Javascript
	checkDate : function (format, date) {
		var daysInFebruary = function(year){
		// February has 29 days in any year evenly divisible by four,
		// EXCEPT for centurial years which are not also divisible by 400.
			return (((year % 4 === 0) && ( year % 100 !== 0 || (year % 400 === 0))) ? 29 : 28 );
		},
		tsp = {}, sep;
		format = format.toLowerCase();
		//we search for /,-,. for the date separator
		if(format.indexOf("/") !== -1) {
			sep = "/";
		} else if(format.indexOf("-") !== -1) {
			sep = "-";
		} else if(format.indexOf(".") !== -1) {
			sep = ".";
		} else {
			sep = "/";
		}
		format = format.split(sep);
		date = date.split(sep);
		if (date.length !== 3) { return false; }
		var j=-1,yln, dln=-1, mln=-1, i;
		for(i=0;i<format.length;i++){
			var dv =  isNaN(date[i]) ? 0 : parseInt(date[i],10);
			tsp[format[i]] = dv;
			yln = format[i];
			if(yln.indexOf("y") !== -1) { j=i; }
			if(yln.indexOf("m") !== -1) { mln=i; }
			if(yln.indexOf("d") !== -1) { dln=i; }
		}
		if (format[j] === "y" || format[j] === "yyyy") {
			yln=4;
		} else if(format[j] ==="yy"){
			yln = 2;
		} else {
			yln = -1;
		}
		var daysInMonth = [0,31,29,31,30,31,30,31,31,30,31,30,31],
		strDate;
		if (j === -1) {
			return false;
		}
			strDate = tsp[format[j]].toString();
			if(yln === 2 && strDate.length === 1) {yln = 1;}
			if (strDate.length !== yln || (tsp[format[j]]===0 && date[j]!=="00")){
				return false;
			}
		if(mln === -1) {
			return false;
		}
			strDate = tsp[format[mln]].toString();
			if (strDate.length<1 || tsp[format[mln]]<1 || tsp[format[mln]]>12){
				return false;
			}
		if(dln === -1) {
			return false;
		}
			strDate = tsp[format[dln]].toString();
			if (strDate.length<1 || tsp[format[dln]]<1 || tsp[format[dln]]>31 || (tsp[format[mln]]===2 && tsp[format[dln]]>daysInFebruary(tsp[format[j]])) || tsp[format[dln]] > daysInMonth[tsp[format[mln]]]){
				return false;
			}
		return true;
	},
	isEmpty : function(val)
	{
		if (val.match(/^\s+$/) || val === "")	{
			return true;
		}
			return false;
	},
	checkTime : function(time){
	// checks only hh:ss (and optional am/pm)
		var re = /^(\d{1,2}):(\d{2})([apAP][Mm])?$/,regs;
		if(!$.jgrid.isEmpty(time))
		{
			regs = time.match(re);
			if(regs) {
				if(regs[3]) {
					if(regs[1] < 1 || regs[1] > 12) { return false; }
				} else {
					if(regs[1] > 23) { return false; }
				}
				if(regs[2] > 59) {
					return false;
				}
			} else {
				return false;
			}
		}
		return true;
	},
	checkValues : function(val, valref, customobject, nam) {
		var edtrul,i, nm, dft, len, g = this, cm = g.p.colModel;
		if(customobject === undefined) {
			if(typeof valref==='string'){
				for( i =0, len=cm.length;i<len; i++){
					if(cm[i].name===valref) {
						edtrul = cm[i].editrules;
						valref = i;
						if(cm[i].formoptions != null) { nm = cm[i].formoptions.label; }
						break;
					}
				}
			} else if(valref >=0) {
				edtrul = cm[valref].editrules;
			}
		} else {
			edtrul = customobject;
			nm = nam===undefined ? "_" : nam;
		}
		if(edtrul) {
			if(!nm) { nm = g.p.colNames != null ? g.p.colNames[valref] : cm[valref].label; }
			if(edtrul.required === true) {
				if( $.jgrid.isEmpty(val) )  { return [false,nm+": "+$.jgrid.edit.msg.required,""]; }
			}
			// force required
			var rqfield = edtrul.required === false ? false : true;
			if(edtrul.number === true) {
				if( !(rqfield === false && $.jgrid.isEmpty(val)) ) {
					if(isNaN(val)) { return [false,nm+": "+$.jgrid.edit.msg.number,""]; }
				}
			}
			if(edtrul.minValue !== undefined && !isNaN(edtrul.minValue)) {
				if (parseFloat(val) < parseFloat(edtrul.minValue) ) { return [false,nm+": "+$.jgrid.edit.msg.minValue+" "+edtrul.minValue,""];}
			}
			if(edtrul.maxValue !== undefined && !isNaN(edtrul.maxValue)) {
				if (parseFloat(val) > parseFloat(edtrul.maxValue) ) { return [false,nm+": "+$.jgrid.edit.msg.maxValue+" "+edtrul.maxValue,""];}
			}
			var filter;
			if(edtrul.email === true) {
				if( !(rqfield === false && $.jgrid.isEmpty(val)) ) {
				// taken from $ Validate plugin
					filter = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
					if(!filter.test(val)) {return [false,nm+": "+$.jgrid.edit.msg.email,""];}
				}
			}
			if(edtrul.integer === true) {
				if( !(rqfield === false && $.jgrid.isEmpty(val)) ) {
					if(isNaN(val)) { return [false,nm+": "+$.jgrid.edit.msg.integer,""]; }
					if ((val % 1 !== 0) || (val.indexOf('.') !== -1)) { return [false,nm+": "+$.jgrid.edit.msg.integer,""];}
				}
			}
			if(edtrul.date === true) {
				if( !(rqfield === false && $.jgrid.isEmpty(val)) ) {
					if(cm[valref].formatoptions && cm[valref].formatoptions.newformat) {
						dft = cm[valref].formatoptions.newformat;
						if( $.jgrid.formatter.date.masks.hasOwnProperty(dft) ) {
							dft = $.jgrid.formatter.date.masks[dft];
						}
					} else {
						dft = cm[valref].datefmt || "Y-m-d";
					}
					if(!$.jgrid.checkDate (dft, val)) { return [false,nm+": "+$.jgrid.edit.msg.date+" - "+dft,""]; }
				}
			}
			if(edtrul.time === true) {
				if( !(rqfield === false && $.jgrid.isEmpty(val)) ) {
					if(!$.jgrid.checkTime (val)) { return [false,nm+": "+$.jgrid.edit.msg.date+" - hh:mm (am/pm)",""]; }
				}
			}
			if(edtrul.url === true) {
				if( !(rqfield === false && $.jgrid.isEmpty(val)) ) {
					filter = /^(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;
					if(!filter.test(val)) {return [false,nm+": "+$.jgrid.edit.msg.url,""];}
				}
			}
			if(edtrul.custom === true) {
				if( !(rqfield === false && $.jgrid.isEmpty(val)) ) {
					if($.isFunction(edtrul.custom_func)) {
						var ret = edtrul.custom_func.call(g,val,nm,valref);
						return $.isArray(ret) ? ret : [false,$.jgrid.edit.msg.customarray,""];
					}
					return [false,$.jgrid.edit.msg.customfcheck,""];
				}
			}
		}
		return [true,"",""];
	}
});
})(jQuery);
/*
 * jqFilter  jQuery jqGrid filter addon.
 * Copyright (c) 2011, Tony Tomov, tony@trirand.com
 * Dual licensed under the MIT and GPL licenses
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 * 
 * The work is inspired from this Stefan Pirvu
 * http://www.codeproject.com/KB/scripting/json-filtering.aspx
 *
 * The filter uses JSON entities to hold filter rules and groups. Here is an example of a filter:

{ "groupOp": "AND",
      "groups" : [ 
        { "groupOp": "OR",
            "rules": [
                { "field": "name", "op": "eq", "data": "England" }, 
                { "field": "id", "op": "le", "data": "5"}
             ]
        } 
      ],
      "rules": [
        { "field": "name", "op": "eq", "data": "Romania" }, 
        { "field": "id", "op": "le", "data": "1"}
      ]
}
*/
/*jshint eqeqeq:false, eqnull:true, devel:true */
/*global jQuery */

(function ($) {
"use strict";

$.fn.jqFilter = function( arg ) {
	if (typeof arg === 'string') {
		
		var fn = $.fn.jqFilter[arg];
		if (!fn) {
			throw ("jqFilter - No such method: " + arg);
		}
		var args = $.makeArray(arguments).slice(1);
		return fn.apply(this,args);
	}

	var p = $.extend(true,{
		filter: null,
		columns: [],
		onChange : null,
		afterRedraw : null,
		checkValues : null,
		error: false,
		errmsg : "",
		errorcheck : true,
		showQuery : true,
		sopt : null,
		ops : [],
		operands : null,
		numopts : ['eq','ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn', 'in', 'ni'],
		stropts : ['eq', 'ne', 'bw', 'bn', 'ew', 'en', 'cn', 'nc', 'nu', 'nn', 'in', 'ni'],
		strarr : ['text', 'string', 'blob'],
		groupOps : [{ op: "AND", text: "AND" },	{ op: "OR",  text: "OR" }],
		groupButton : true,
		ruleButtons : true,
		direction : "ltr"
	}, $.jgrid.filter, arg || {});
	return this.each( function() {
		if (this.filter) {return;}
		this.p = p;
		// setup filter in case if they is not defined
		if (this.p.filter === null || this.p.filter === undefined) {
			this.p.filter = {
				groupOp: this.p.groupOps[0].op,
				rules: [],
				groups: []
			};
		}
		var i, len = this.p.columns.length, cl,
		isIE = /msie/i.test(navigator.userAgent) && !window.opera;

		// translating the options
		this.p.initFilter = $.extend(true,{},this.p.filter);

		// set default values for the columns if they are not set
		if( !len ) {return;}
		for(i=0; i < len; i++) {
			cl = this.p.columns[i];
			if( cl.stype ) {
				// grid compatibility
				cl.inputtype = cl.stype;
			} else if(!cl.inputtype) {
				cl.inputtype = 'text';
			}
			if( cl.sorttype ) {
				// grid compatibility
				cl.searchtype = cl.sorttype;
			} else if (!cl.searchtype) {
				cl.searchtype = 'string';
			}
			if(cl.hidden === undefined) {
				// jqGrid compatibility
				cl.hidden = false;
			}
			if(!cl.label) {
				cl.label = cl.name;
			}
			if(cl.index) {
				cl.name = cl.index;
			}
			if(!cl.hasOwnProperty('searchoptions')) {
				cl.searchoptions = {};
			}
			if(!cl.hasOwnProperty('searchrules')) {
				cl.searchrules = {};
			}

		}
		if(this.p.showQuery) {
			$(this).append("<table class='queryresult ui-widget ui-widget-content' style='display:block;max-width:440px;border:0px none;' dir='"+this.p.direction+"'><tbody><tr><td class='query'></td></tr></tbody></table>");
		}
		var getGrid = function () {
			return $("#" + $.jgrid.jqID(p.id))[0] || null;
		};
		/*
		 *Perform checking.
		 *
		*/
		var checkData = function(val, colModelItem) {
			var ret = [true,""], $t = getGrid();
			if($.isFunction(colModelItem.searchrules)) {
				ret = colModelItem.searchrules.call($t, val, colModelItem);
			} else if($.jgrid && $.jgrid.checkValues) {
				try {
					ret = $.jgrid.checkValues.call($t, val, -1, colModelItem.searchrules, colModelItem.label);
				} catch (e) {}
			}
			if(ret && ret.length && ret[0] === false) {
				p.error = !ret[0];
				p.errmsg = ret[1];
			}
		};
		/* moving to common
		randId = function() {
			return Math.floor(Math.random()*10000).toString();
		};
		*/

		this.onchange = function (  ){
			// clear any error 
			this.p.error = false;
			this.p.errmsg="";
			return $.isFunction(this.p.onChange) ? this.p.onChange.call( this, this.p ) : false;
		};
		/*
		 * Redraw the filter every time when new field is added/deleted
		 * and field is  changed
		 */
		this.reDraw = function() {
			$("table.group:first",this).remove();
			var t = this.createTableForGroup(p.filter, null);
			$(this).append(t);
			if($.isFunction(this.p.afterRedraw) ) {
				this.p.afterRedraw.call(this, this.p);
			}
		};
		/*
		 * Creates a grouping data for the filter
		 * @param group - object
		 * @param parentgroup - object
		 */
		this.createTableForGroup = function(group, parentgroup) {
			var that = this,  i;
			// this table will hold all the group (tables) and rules (rows)
			var table = $("<table class='group ui-widget ui-widget-content' style='border:0px none;'><tbody></tbody></table>"),
			// create error message row
			align = "left";
			if(this.p.direction === "rtl") {
				align = "right";
				table.attr("dir","rtl");
			}
			if(parentgroup === null) {
				table.append("<tr class='error' style='display:none;'><th colspan='5' class='ui-state-error' align='"+align+"'></th></tr>");
			}

			var tr = $("<tr></tr>");
			table.append(tr);
			// this header will hold the group operator type and group action buttons for
			// creating subgroup "+ {}", creating rule "+" or deleting the group "-"
			var th = $("<th colspan='5' align='"+align+"'></th>");
			tr.append(th);

			if(this.p.ruleButtons === true) {
			// dropdown for: choosing group operator type
			var groupOpSelect = $("<select class='opsel'></select>");
			th.append(groupOpSelect);
			// populate dropdown with all posible group operators: or, and
			var str= "", selected;
			for (i = 0; i < p.groupOps.length; i++) {
				selected =  group.groupOp === that.p.groupOps[i].op ? " selected='selected'" :"";
				str += "<option value='"+that.p.groupOps[i].op+"'" + selected+">"+that.p.groupOps[i].text+"</option>";
			}

			groupOpSelect
			.append(str)
			.bind('change',function() {
				group.groupOp = $(groupOpSelect).val();
				that.onchange(); // signals that the filter has changed
			});
			}
			// button for adding a new subgroup
			var inputAddSubgroup ="<span></span>";
			if(this.p.groupButton) {
				inputAddSubgroup = $("<input type='button' value='+ {}' title='Add subgroup' class='add-group'/>");
				inputAddSubgroup.bind('click',function() {
					if (group.groups === undefined ) {
						group.groups = [];
					}

					group.groups.push({
						groupOp: p.groupOps[0].op,
						rules: [],
						groups: []
					}); // adding a new group

					that.reDraw(); // the html has changed, force reDraw

					that.onchange(); // signals that the filter has changed
					return false;
				});
			}
			th.append(inputAddSubgroup);
			if(this.p.ruleButtons === true) {
			// button for adding a new rule
			var inputAddRule = $("<input type='button' value='+' title='Добавить правило' class='add-rule ui-add'/>"), cm;
			inputAddRule.bind('click',function() {
				//if(!group) { group = {};}
				if (group.rules === undefined) {
					group.rules = [];
				}
				for (i = 0; i < that.p.columns.length; i++) {
				// but show only serchable and serchhidden = true fields
					var searchable = (that.p.columns[i].search === undefined) ?  true: that.p.columns[i].search,
					hidden = (that.p.columns[i].hidden === true),
					ignoreHiding = (that.p.columns[i].searchoptions.searchhidden === true);
					if ((ignoreHiding && searchable) || (searchable && !hidden)) {
						cm = that.p.columns[i];
						break;
					}
				}
				
				var opr;
				if( cm.searchoptions.sopt ) {opr = cm.searchoptions.sopt;}
				else if(that.p.sopt) { opr= that.p.sopt; }
				else if  ( $.inArray(cm.searchtype, that.p.strarr) !== -1 ) {opr = that.p.stropts;}
				else {opr = that.p.numopts;}

				group.rules.push({
					field: cm.name,
					op: opr[0],
					data: ""
				}); // adding a new rule

				that.reDraw(); // the html has changed, force reDraw
				// for the moment no change have been made to the rule, so
				// this will not trigger onchange event
				return false;
			});
			th.append(inputAddRule);
			}

			// button for delete the group
			if (parentgroup !== null) { // ignore the first group
				var inputDeleteGroup = $("<input type='button' value='-' title='Delete group' class='delete-group'/>");
				th.append(inputDeleteGroup);
				inputDeleteGroup.bind('click',function() {
				// remove group from parent
					for (i = 0; i < parentgroup.groups.length; i++) {
						if (parentgroup.groups[i] === group) {
							parentgroup.groups.splice(i, 1);
							break;
						}
					}

					that.reDraw(); // the html has changed, force reDraw

					that.onchange(); // signals that the filter has changed
					return false;
				});
			}

			// append subgroup rows
			if (group.groups !== undefined) {
				for (i = 0; i < group.groups.length; i++) {
					var trHolderForSubgroup = $("<tr></tr>");
					table.append(trHolderForSubgroup);

					var tdFirstHolderForSubgroup = $("<td class='first'></td>");
					trHolderForSubgroup.append(tdFirstHolderForSubgroup);

					var tdMainHolderForSubgroup = $("<td colspan='4'></td>");
					tdMainHolderForSubgroup.append(this.createTableForGroup(group.groups[i], group));
					trHolderForSubgroup.append(tdMainHolderForSubgroup);
				}
			}
			if(group.groupOp === undefined) {
				group.groupOp = that.p.groupOps[0].op;
			}

			// append rules rows
			if (group.rules !== undefined) {
				for (i = 0; i < group.rules.length; i++) {
					table.append(
                       this.createTableRowForRule(group.rules[i], group)
					);
				}
			}

			return table;
		};
		/*
		 * Create the rule data for the filter
		 */
		this.createTableRowForRule = function(rule, group ) {
			// save current entity in a variable so that it could
			// be referenced in anonimous method calls

			var that=this, $t = getGrid(), tr = $("<tr></tr>"),
			//document.createElement("tr"),

			// first column used for padding
			//tdFirstHolderForRule = document.createElement("td"),
			i, op, trpar, cm, str="", selected;
			//tdFirstHolderForRule.setAttribute("class", "first");
			tr.append("<td class='first'></td>");


			// create field container
			var ruleFieldTd = $("<td class='columns'></td>");
			tr.append(ruleFieldTd);


			// dropdown for: choosing field
			var ruleFieldSelect = $("<select></select>"), ina, aoprs = [];
			ruleFieldTd.append(ruleFieldSelect);
			ruleFieldSelect.bind('change',function() {
				rule.field = $(ruleFieldSelect).val();

				trpar = $(this).parents("tr:first");
				for (i=0;i<that.p.columns.length;i++) {
					if(that.p.columns[i].name ===  rule.field) {
						cm = that.p.columns[i];
						break;
					}
				}
				if(!cm) {return;}
				cm.searchoptions.id = $.jgrid.randId();
				if(isIE && cm.inputtype === "text") {
					if(!cm.searchoptions.size) {
						cm.searchoptions.size = 10;
					}
				}
				var elm = $.jgrid.createEl.call($t, cm.inputtype,cm.searchoptions, "", true, that.p.ajaxSelectOptions || {}, true);
				$(elm).addClass("input-elm");
				//that.createElement(rule, "");

				if( cm.searchoptions.sopt ) {op = cm.searchoptions.sopt;}
				else if(that.p.sopt) { op= that.p.sopt; }
				else if  ($.inArray(cm.searchtype, that.p.strarr) !== -1) {op = that.p.stropts;}
				else {op = that.p.numopts;}
				// operators
				var s ="", so = 0;
				aoprs = [];
				$.each(that.p.ops, function() { aoprs.push(this.oper); });
				for ( i = 0 ; i < op.length; i++) {
					ina = $.inArray(op[i],aoprs);
					if(ina !== -1) {
						if(so===0) {
							rule.op = that.p.ops[ina].oper;
						}
						s += "<option value='"+that.p.ops[ina].oper+"'>"+that.p.ops[ina].text+"</option>";
						so++;
					}
				}
				$(".selectopts",trpar).empty().append( s );
				$(".selectopts",trpar)[0].selectedIndex = 0;
				if( $.jgrid.msie && $.jgrid.msiever() < 9) {
					var sw = parseInt($("select.selectopts",trpar)[0].offsetWidth, 10) + 1;
					$(".selectopts",trpar).width( sw );
					$(".selectopts",trpar).css("width","auto");
				}
				// data
				$(".data",trpar).empty().append( elm );
				$.jgrid.bindEv.call($t, elm, cm.searchoptions);
				$(".input-elm",trpar).bind('change',function( e ) {
					var tmo = $(this).hasClass("ui-autocomplete-input") ? 200 :0;
					setTimeout(function(){
						var elem = e.target;
						rule.data = elem.nodeName.toUpperCase() === "SPAN" && cm.searchoptions && $.isFunction(cm.searchoptions.custom_value) ?
							cm.searchoptions.custom_value.call($t, $(elem).children(".customelement:first"), 'get') : elem.value;
						that.onchange(); // signals that the filter has changed
					}, tmo);
				});
				setTimeout(function(){ //IE, Opera, Chrome
				rule.data = $(elm).val();
				that.onchange();  // signals that the filter has changed
				}, 0);
			});

			// populate drop down with user provided column definitions
			var j=0;
			for (i = 0; i < that.p.columns.length; i++) {
				// but show only serchable and serchhidden = true fields
				var searchable = (that.p.columns[i].search === undefined) ? true: that.p.columns[i].search,
				hidden = (that.p.columns[i].hidden === true),
				ignoreHiding = (that.p.columns[i].searchoptions.searchhidden === true);
				if ((ignoreHiding && searchable) || (searchable && !hidden)) {
					selected = "";
					if(rule.field === that.p.columns[i].name) {
						selected = " selected='selected'";
						j=i;
					}
					str += "<option value='"+that.p.columns[i].name+"'" +selected+">"+that.p.columns[i].label+"</option>";
				}
			}
			ruleFieldSelect.append( str );


			// create operator container
			var ruleOperatorTd = $("<td class='operators'></td>");
			tr.append(ruleOperatorTd);
			cm = p.columns[j];
			// create it here so it can be referentiated in the onchange event
			//var RD = that.createElement(rule, rule.data);
			cm.searchoptions.id = $.jgrid.randId();
			if(isIE && cm.inputtype === "text") {
				if(!cm.searchoptions.size) {
					cm.searchoptions.size = 10;
				}
			}
			var ruleDataInput = $.jgrid.createEl.call($t, cm.inputtype,cm.searchoptions, rule.data, true, that.p.ajaxSelectOptions || {}, true);
			if(rule.op === 'nu' || rule.op === 'nn') {
				$(ruleDataInput).attr('readonly','true');
				$(ruleDataInput).attr('disabled','true');
			} //retain the state of disabled text fields in case of null ops
			// dropdown for: choosing operator
			var ruleOperatorSelect = $("<select class='selectopts'></select>");
			ruleOperatorTd.append(ruleOperatorSelect);
			ruleOperatorSelect.bind('change',function() {
				rule.op = $(ruleOperatorSelect).val();
				trpar = $(this).parents("tr:first");
				var rd = $(".input-elm",trpar)[0];
				if (rule.op === "nu" || rule.op === "nn") { // disable for operator "is null" and "is not null"
					rule.data = "";
					if(rd.tagName.toUpperCase() !== 'SELECT') rd.value = "";
					rd.setAttribute("readonly", "true");
					rd.setAttribute("disabled", "true");
				} else {
					if(rd.tagName.toUpperCase() === 'SELECT') rule.data = rd.value;
					rd.removeAttribute("readonly");
					rd.removeAttribute("disabled");
				}

				that.onchange();  // signals that the filter has changed
			});

			// populate drop down with all available operators
			if( cm.searchoptions.sopt ) {op = cm.searchoptions.sopt;}
			else if(that.p.sopt) { op= that.p.sopt; }
			else if  ($.inArray(cm.searchtype, that.p.strarr) !== -1) {op = that.p.stropts;}
			else {op = that.p.numopts;}
			str="";
			$.each(that.p.ops, function() { aoprs.push(this.oper); });
			for ( i = 0; i < op.length; i++) {
				ina = $.inArray(op[i],aoprs);
				if(ina !== -1) {
					selected = rule.op === that.p.ops[ina].oper ? " selected='selected'" : "";
					str += "<option value='"+that.p.ops[ina].oper+"'"+selected+">"+that.p.ops[ina].text+"</option>";
				}
			}
			ruleOperatorSelect.append( str );
			// create data container
			var ruleDataTd = $("<td class='data'></td>");
			tr.append(ruleDataTd);

			// textbox for: data
			// is created previously
			//ruleDataInput.setAttribute("type", "text");
			ruleDataTd.append(ruleDataInput);
			$.jgrid.bindEv.call($t, ruleDataInput, cm.searchoptions);
			$(ruleDataInput)
			.addClass("input-elm")
			.bind('change', function() {
				rule.data = cm.inputtype === 'custom' ? cm.searchoptions.custom_value.call($t, $(this).children(".customelement:first"),'get') : $(this).val();
				that.onchange(); // signals that the filter has changed
			});

			// create action container
			var ruleDeleteTd = $("<td></td>");
			tr.append(ruleDeleteTd);

			// create button for: delete rule
			if(this.p.ruleButtons === true) {
			var ruleDeleteInput = $("<input type='button' value='-' title='Удалить правило' class='delete-rule ui-del'/>");
			ruleDeleteTd.append(ruleDeleteInput);
			//$(ruleDeleteInput).html("").height(20).width(30).button({icons: {  primary: "ui-icon-minus", text:false}});
			ruleDeleteInput.bind('click',function() {
				// remove rule from group
				for (i = 0; i < group.rules.length; i++) {
					if (group.rules[i] === rule) {
						group.rules.splice(i, 1);
						break;
					}
				}

				that.reDraw(); // the html has changed, force reDraw

				that.onchange(); // signals that the filter has changed
				return false;
			});
			}
			return tr;
		};

		this.getStringForGroup = function(group) {
			var s = "(", index;
			if (group.groups !== undefined) {
				for (index = 0; index < group.groups.length; index++) {
					if (s.length > 1) {
						s += " " + group.groupOp + " ";
					}
					try {
						s += this.getStringForGroup(group.groups[index]);
					} catch (eg) {alert(eg);}
				}
			}

			if (group.rules !== undefined) {
				try{
					for (index = 0; index < group.rules.length; index++) {
						if (s.length > 1) {
							s += " " + group.groupOp + " ";
						}
						s += this.getStringForRule(group.rules[index]);
					}
				} catch (e) {alert(e);}
			}

			s += ")";

			if (s === "()") {
				return ""; // ignore groups that don't have rules
			}
			return s;
		};
		this.getStringForRule = function(rule) {
			var opUF = "",opC="", i, cm, ret, val,
			numtypes = ['int', 'integer', 'float', 'number', 'currency']; // jqGrid
			for (i = 0; i < this.p.ops.length; i++) {
				if (this.p.ops[i].oper === rule.op) {
					opUF = this.p.operands.hasOwnProperty(rule.op) ? this.p.operands[rule.op] : "";
					opC = this.p.ops[i].oper;
					break;
				}
			}
			for (i=0; i<this.p.columns.length; i++) {
				if(this.p.columns[i].name === rule.field) {
					cm = this.p.columns[i];
					break;
				}
			}
			if (cm === undefined) { return ""; }
			val = rule.data;
			if(opC === 'bw' || opC === 'bn') { val = val+"%"; }
			if(opC === 'ew' || opC === 'en') { val = "%"+val; }
			if(opC === 'cn' || opC === 'nc') { val = "%"+val+"%"; }
			if(opC === 'in' || opC === 'ni') { val = " ("+val+")"; }
			if(p.errorcheck) { checkData(rule.data, cm); }
			if($.inArray(cm.searchtype, numtypes) !== -1 || opC === 'nn' || opC === 'nu') { ret = rule.field + " " + opUF + " " + val; }
			else { ret = rule.field + " " + opUF + " \"" + val + "\""; }
			return ret;
		};
		this.resetFilter = function () {
			this.p.filter = $.extend(true,{},this.p.initFilter);
			this.reDraw();
			this.onchange();
		};
		this.hideError = function() {
			$("th.ui-state-error", this).html("");
			$("tr.error", this).hide();
		};
		this.showError = function() {
			$("th.ui-state-error", this).html(this.p.errmsg);
			$("tr.error", this).show();
		};
		this.toUserFriendlyString = function() {
			return this.getStringForGroup(p.filter);
		};
		this.toString = function() {
			// this will obtain a string that can be used to match an item.
			var that = this;
			function getStringRule(rule) {
				if(that.p.errorcheck) {
					var i, cm;
					for (i=0; i<that.p.columns.length; i++) {
						if(that.p.columns[i].name === rule.field) {
							cm = that.p.columns[i];
							break;
						}
					}
					if(cm) {checkData(rule.data, cm);}
				}
				return rule.op + "(item." + rule.field + ",'" + rule.data + "')";
			}

			function getStringForGroup(group) {
				var s = "(", index;

				if (group.groups !== undefined) {
					for (index = 0; index < group.groups.length; index++) {
						if (s.length > 1) {
							if (group.groupOp === "OR") {
								s += " || ";
							}
							else {
								s += " && ";
							}
						}
						s += getStringForGroup(group.groups[index]);
					}
				}

				if (group.rules !== undefined) {
					for (index = 0; index < group.rules.length; index++) {
						if (s.length > 1) {
							if (group.groupOp === "OR") {
								s += " || ";
							}
							else  {
								s += " && ";
							}
						}
						s += getStringRule(group.rules[index]);
					}
				}

				s += ")";

				if (s === "()") {
					return ""; // ignore groups that don't have rules
				}
				return s;
			}

			return getStringForGroup(this.p.filter);
		};

		// Here we init the filter
		this.reDraw();

		if(this.p.showQuery) {
			this.onchange();
		}
		// mark is as created so that it will not be created twice on this element
		this.filter = true;
	});
};
$.extend($.fn.jqFilter,{
	/*
	 * Return SQL like string. Can be used directly
	 */
	toSQLString : function()
	{
		var s ="";
		this.each(function(){
			s = this.toUserFriendlyString();
		});
		return s;
	},
	/*
	 * Return filter data as object.
	 */
	filterData : function()
	{
		var s;
		this.each(function(){
			s = this.p.filter;
		});
		return s;

	},
	getParameter : function (param) {
		if(param !== undefined) {
			if (this.p.hasOwnProperty(param) ) {
				return this.p[param];
			}
		}
		return this.p;
	},
	resetFilter: function() {
		return this.each(function(){
			this.resetFilter();
		});
	},
	addFilter: function (pfilter) {
		if (typeof pfilter === "string") {
			pfilter = $.jgrid.parse( pfilter );
	}
		this.each(function(){
			this.p.filter = pfilter;
			this.reDraw();
			this.onchange();
		});
	}

});
})(jQuery);
/*jshint eqeqeq:false, eqnull:true, devel:true */
/*global xmlJsonClass, jQuery */
(function($){
/**
 * jqGrid extension for form editing Grid Data
 * Tony Tomov tony@trirand.com
 * http://trirand.com/blog/
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
**/
"use strict";
var rp_ge = {};
$.jgrid.extend({
	searchGrid : function (p) {
		p = $.extend(true, {
			recreateFilter: false,
			drag: true,
			sField:'searchField',
			sValue:'searchString',
			sOper: 'searchOper',
			sFilter: 'filters',
			loadDefaults: true, // this options activates loading of default filters from grid's postData for Multipe Search only.
			beforeShowSearch: null,
			afterShowSearch : null,
			onInitializeSearch: null,
			afterRedraw : null,
			afterChange: null,
			closeAfterSearch : false,
			closeAfterReset: false,
			closeOnEscape : false,
			searchOnEnter : false,
			multipleSearch : false,
			multipleGroup : false,
			//cloneSearchRowOnAdd: true,
			top : 0,
			left: 0,
			jqModal : true,
			modal: false,
			resize : true,
			width: 450,
			height: 'auto',
			dataheight: 'auto',
			showQuery: false,
			errorcheck : true,
			sopt: null,
			stringResult: undefined,
			onClose : null,
			onSearch : null,
			onReset : null,
			toTop : true,
			overlay : 30,
			columns : [],
			tmplNames : null,
			tmplFilters : null,
			tmplLabel : ' Template: ',
			showOnLoad: false,
			layer: null,
			operands : { "eq" :"=", "ne":"<>","lt":"<","le":"<=","gt":">","ge":">=","bw":"LIKE","bn":"NOT LIKE","in":"IN","ni":"NOT IN","ew":"LIKE","en":"NOT LIKE","cn":"LIKE","nc":"NOT LIKE","nu":"IS NULL","nn":"ISNOT NULL"}
		}, $.jgrid.search, p || {});
		return this.each(function() {
			var $t = this;
			if(!$t.grid) {return;}
			var fid = "fbox_"+$t.p.id,
			showFrm = true,
			mustReload = true,
			IDs = {themodal:'searchmod'+fid,modalhead:'searchhd'+fid,modalcontent:'searchcnt'+fid, scrollelm : fid},
			defaultFilters  = $t.p.postData[p.sFilter];
			if(typeof defaultFilters === "string") {
				defaultFilters = $.jgrid.parse( defaultFilters );
			}
			if(p.recreateFilter === true) {
				$("#"+$.jgrid.jqID(IDs.themodal)).remove();
			}
			function showFilter(_filter) {
				showFrm = $($t).triggerHandler("jqGridFilterBeforeShow", [_filter]);
				if(showFrm === undefined) {
					showFrm = true;
				}
				if(showFrm && $.isFunction(p.beforeShowSearch)) {
					showFrm = p.beforeShowSearch.call($t,_filter);
				}
				if(showFrm) {
					$.jgrid.viewModal("#"+$.jgrid.jqID(IDs.themodal),{gbox:"#gbox_"+$.jgrid.jqID(fid),jqm:p.jqModal, modal:p.modal, overlay: p.overlay, toTop: p.toTop});
					$($t).triggerHandler("jqGridFilterAfterShow", [_filter]);
					if($.isFunction(p.afterShowSearch)) {
						p.afterShowSearch.call($t, _filter);
					}
				}
			}
			if ( $("#"+$.jgrid.jqID(IDs.themodal))[0] !== undefined ) {
				showFilter($("#fbox_"+$.jgrid.jqID(+$t.p.id)));
			} else {
				var fil = $("<div><div id='"+fid+"' class='searchFilter' style='overflow:auto'></div></div>").insertBefore("#gview_"+$.jgrid.jqID($t.p.id)),
				align = "left", butleft =""; 
				if($t.p.direction === "rtl") {
					align = "right";
					butleft = " style='text-align:left'";
					fil.attr("dir","rtl");
				}
				var columns = $.extend([],$t.p.colModel),
				bS  ="<a id='"+fid+"_search' class='fm-button ui-state-default ui-corner-all fm-button-icon-right ui-reset'><span class='ui-icon ui-icon-search'></span>"+p.Find+"</a>",
				bC  ="<a id='"+fid+"_reset' class='fm-button ui-state-default ui-corner-all fm-button-icon-left ui-search'><span class='ui-icon ui-icon-arrowreturnthick-1-w'></span>"+p.Reset+"</a>",
				bQ = "", tmpl="", colnm, found = false, bt, cmi=-1;
				if(p.showQuery) {
					bQ ="<a id='"+fid+"_query' class='fm-button ui-state-default ui-corner-all fm-button-icon-left'><span class='ui-icon ui-icon-comment'></span>Query</a>";
				}
				if(!p.columns.length) {
					$.each(columns, function(i,n){
						if(!n.label) {
							n.label = $t.p.colNames[i];
						}
						// find first searchable column and set it if no default filter
						if(!found) {
							var searchable = (n.search === undefined) ?  true: n.search ,
							hidden = (n.hidden === true),
							ignoreHiding = (n.searchoptions && n.searchoptions.searchhidden === true);
							if ((ignoreHiding && searchable) || (searchable && !hidden)) {
								found = true;
								colnm = n.index || n.name;
								cmi =i;
							}
						}
					});
				} else {
					columns = p.columns;
					cmi = 0;
					colnm = columns[0].index || columns[0].name;
				}
				// old behaviour
				if( (!defaultFilters && colnm) || p.multipleSearch === false  ) {
					var cmop = "eq";
					if(cmi >=0 && columns[cmi].searchoptions && columns[cmi].searchoptions.sopt) {
						cmop = columns[cmi].searchoptions.sopt[0];
					} else if(p.sopt && p.sopt.length) {
						cmop = p.sopt[0];
					}
					defaultFilters = {groupOp: "AND", rules: [{field: colnm, op: cmop, data: ""}]};
				}
				found = false;
				if(p.tmplNames && p.tmplNames.length) {
					found = true;
					tmpl = p.tmplLabel;
					tmpl += "<select class='ui-template'>";
					tmpl += "<option value='default'>Default</option>";
					$.each(p.tmplNames, function(i,n){
						tmpl += "<option value='"+i+"'>"+n+"</option>";
					});
					tmpl += "</select>";
				}

				bt = "<table class='EditTable' style='border:0px none;margin-top:5px' id='"+fid+"_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='EditButton' style='text-align:"+align+"'>"+bC+tmpl+"</td><td class='EditButton' "+butleft+">"+bQ+bS+"</td></tr></tbody></table>";
				fid = $.jgrid.jqID( fid);
				$("#"+fid).jqFilter({
					columns : columns,
					filter: p.loadDefaults ? defaultFilters : null,
					showQuery: p.showQuery,
					errorcheck : p.errorcheck,
					sopt: p.sopt,
					groupButton : p.multipleGroup,
					ruleButtons : p.multipleSearch,
					afterRedraw : p.afterRedraw,
					ops : p.odata,
					operands : p.operands,
					ajaxSelectOptions: $t.p.ajaxSelectOptions,
					groupOps: p.groupOps,
					onChange : function() {
						if(this.p.showQuery) {
							$('.query',this).html(this.toUserFriendlyString());
						}
						if ($.isFunction(p.afterChange)) {
							p.afterChange.call($t, $("#"+fid), p);
						}
					},
					direction : $t.p.direction,
					id: $t.p.id
				});
				fil.append( bt );
				if(found && p.tmplFilters && p.tmplFilters.length) {
					$(".ui-template", fil).bind('change', function(){
						var curtempl = $(this).val();
						if(curtempl==="default") {
							$("#"+fid).jqFilter('addFilter', defaultFilters);
						} else {
							$("#"+fid).jqFilter('addFilter', p.tmplFilters[parseInt(curtempl,10)]);
						}
						return false;
					});
				}
				if(p.multipleGroup === true) {p.multipleSearch = true;}
				$($t).triggerHandler("jqGridFilterInitialize", [$("#"+fid)]);
				if($.isFunction(p.onInitializeSearch) ) {
					p.onInitializeSearch.call($t, $("#"+fid));
				}
				p.gbox = "#gbox_"+fid;
				if (p.layer) {
					$.jgrid.createModal(IDs ,fil,p,"#gview_"+$.jgrid.jqID($t.p.id),$("#gbox_"+$.jgrid.jqID($t.p.id))[0], "#"+$.jgrid.jqID(p.layer), {position: "relative"});
				} else {
					$.jgrid.createModal(IDs ,fil,p,"#gview_"+$.jgrid.jqID($t.p.id),$("#gbox_"+$.jgrid.jqID($t.p.id))[0]);
				}
				if (p.searchOnEnter || p.closeOnEscape) {
					$("#"+$.jgrid.jqID(IDs.themodal)).keydown(function (e) {
						var $target = $(e.target);
						if (p.searchOnEnter && e.which === 13 && // 13 === $.ui.keyCode.ENTER
								!$target.hasClass('add-group') && !$target.hasClass('add-rule') &&
								!$target.hasClass('delete-group') && !$target.hasClass('delete-rule') &&
								(!$target.hasClass("fm-button") || !$target.is("[id$=_query]"))) {
							$("#"+fid+"_search").focus().click();
							return false;
						}
						if (p.closeOnEscape && e.which === 27) { // 27 === $.ui.keyCode.ESCAPE
							$("#"+$.jgrid.jqID(IDs.modalhead)).find(".ui-jqdialog-titlebar-close").focus().click();
							return false;
						}
					});
				}
				if(bQ) {
					$("#"+fid+"_query").bind('click', function(){
						$(".queryresult", fil).toggle();
						return false;
					});
				}
				if (p.stringResult===undefined) {
					// to provide backward compatibility, inferring stringResult value from multipleSearch
					p.stringResult = p.multipleSearch;
				}
				$("#"+fid+"_search").bind('click', function(){
					var fl = $("#"+fid),
					sdata={}, res,
					filters = fl.jqFilter('filterData');
					if(p.errorcheck) {
						fl[0].hideError();
						if(!p.showQuery) {fl.jqFilter('toSQLString');}
						if(fl[0].p.error) {
							fl[0].showError();
							return false;
						}
					}

					if(p.stringResult) {
						try {
							// xmlJsonClass or JSON.stringify
							res = xmlJsonClass.toJson(filters, '', '', false);
						} catch (e) {
							try {
								res = JSON.stringify(filters);
							} catch (e2) { }
						}
						if(typeof res==="string") {
							sdata[p.sFilter] = res;
							$.each([p.sField,p.sValue, p.sOper], function() {sdata[this] = "";});
						}
					} else {
						if(p.multipleSearch) {
							sdata[p.sFilter] = filters;
							$.each([p.sField,p.sValue, p.sOper], function() {sdata[this] = "";});
						} else {
							sdata[p.sField] = filters.rules[0].field;
							sdata[p.sValue] = filters.rules[0].data;
							sdata[p.sOper] = filters.rules[0].op;
							sdata[p.sFilter] = "";
						}
					}
					$t.p.search = true;
					$.extend($t.p.postData,sdata);
					mustReload = $($t).triggerHandler("jqGridFilterSearch");
					if( mustReload === undefined) {
						mustReload = true;
					}
					if(mustReload && $.isFunction(p.onSearch) ) {
						mustReload = p.onSearch.call($t, $t.p.filters);
					}
					if (mustReload !== false) {
						$($t).trigger("reloadGrid",[{page:1}]);
					}
					if(p.closeAfterSearch) {
						$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID($t.p.id),jqm:p.jqModal,onClose: p.onClose});
					}
					return false;
				});
				$("#"+fid+"_reset").bind('click', function(){
					var sdata={},
					fl = $("#"+fid);
					$t.p.search = false;
					if(p.multipleSearch===false) {
						sdata[p.sField] = sdata[p.sValue] = sdata[p.sOper] = "";
					} else {
						sdata[p.sFilter] = "";
					}
					fl[0].resetFilter();
					if(found) {
						$(".ui-template", fil).val("default");
					}
					$.extend($t.p.postData,sdata);
					mustReload = $($t).triggerHandler("jqGridFilterReset");
					if(mustReload === undefined) {
						mustReload = true;
					}
					if(mustReload && $.isFunction(p.onReset) ) {
						mustReload = p.onReset.call($t);
					}
					if(mustReload !== false) {
						$($t).trigger("reloadGrid",[{page:1}]);
					}
					if (p.closeAfterReset) {
						$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID($t.p.id),jqm:p.jqModal,onClose: p.onClose});
					}
					return false;
				});
				showFilter($("#"+fid));
				$(".fm-button:not(.ui-state-disabled)",fil).hover(
					function(){$(this).addClass('ui-state-hover');},
					function(){$(this).removeClass('ui-state-hover');}
				);
			}
		});
	},
	editGridRow : function(rowid, p){
		p = $.extend(true, {
			top : 0,
			left: 0,
			width: 300,
			datawidth: 'auto',
			height: 'auto',
			dataheight: 'auto',
			modal: false,
			overlay : 30,
			drag: true,
			resize: true,
			url: null,
			mtype : "POST",
			clearAfterAdd :true,
			closeAfterEdit : false,
			reloadAfterSubmit : true,
			onInitializeForm: null,
			beforeInitData: null,
			beforeShowForm: null,
			afterShowForm: null,
			beforeSubmit: null,
			afterSubmit: null,
			onclickSubmit: null,
			afterComplete: null,
			onclickPgButtons : null,
			afterclickPgButtons: null,
			editData : {},
			recreateForm : false,
			jqModal : true,
			closeOnEscape : false,
			addedrow : "first",
			topinfo : '',
			bottominfo: '',
			saveicon : [],
			closeicon : [],
			savekey: [false,13],
			navkeys: [false,38,40],
			checkOnSubmit : false,
			checkOnUpdate : false,
			_savedData : {},
			processing : false,
			onClose : null,
			ajaxEditOptions : {},
			serializeEditData : null,
			viewPagerButtons : true,
			overlayClass : 'ui-widget-overlay'
		}, $.jgrid.edit, p || {});
		rp_ge[$(this)[0].p.id] = p;
		return this.each(function(){
			var $t = this;
			if (!$t.grid || !rowid) {return;}
			var gID = $t.p.id,
			frmgr = "FrmGrid_"+gID, frmtborg = "TblGrid_"+gID, frmtb = "#"+$.jgrid.jqID(frmtborg), 
			IDs = {themodal:'editmod'+gID,modalhead:'edithd'+gID,modalcontent:'editcnt'+gID, scrollelm : frmgr},
			onBeforeShow = $.isFunction(rp_ge[$t.p.id].beforeShowForm) ? rp_ge[$t.p.id].beforeShowForm : false,
			onAfterShow = $.isFunction(rp_ge[$t.p.id].afterShowForm) ? rp_ge[$t.p.id].afterShowForm : false,
			onBeforeInit = $.isFunction(rp_ge[$t.p.id].beforeInitData) ? rp_ge[$t.p.id].beforeInitData : false,
			onInitializeForm = $.isFunction(rp_ge[$t.p.id].onInitializeForm) ? rp_ge[$t.p.id].onInitializeForm : false,
			showFrm = true,
			maxCols = 1, maxRows=0,	postdata, diff, frmoper;
			frmgr = $.jgrid.jqID(frmgr);
			if (rowid === "new") {
				rowid = "_empty";
				frmoper = "add";
				p.caption=rp_ge[$t.p.id].addCaption;
			} else {
				p.caption=rp_ge[$t.p.id].editCaption;
				frmoper = "edit";
			}
			if(p.recreateForm===true && $("#"+$.jgrid.jqID(IDs.themodal))[0] !== undefined) {
				$("#"+$.jgrid.jqID(IDs.themodal)).remove();
			}
			var closeovrl = true;
			if(p.checkOnUpdate && p.jqModal && !p.modal) {
				closeovrl = false;
			}
			function getFormData(){
				$(frmtb+" > tbody > tr > td > .FormElement").each(function() {
					var celm = $(".customelement", this);
					if (celm.length) {
						var  elem = celm[0], nm = $(elem).attr('name');
						$.each($t.p.colModel, function(){
							if(this.name === nm && this.editoptions && $.isFunction(this.editoptions.custom_value)) {
								try {
									postdata[nm] = this.editoptions.custom_value.call($t, $("#"+$.jgrid.jqID(nm),frmtb),'get');
									if (postdata[nm] === undefined) {throw "e1";}
								} catch (e) {
									if (e==="e1") {$.jgrid.info_dialog($.jgrid.errors.errcap,"function 'custom_value' "+$.jgrid.edit.msg.novalue,$.jgrid.edit.bClose);}
									else {$.jgrid.info_dialog($.jgrid.errors.errcap,e.message,$.jgrid.edit.bClose);}
								}
								return true;
							}
						});
					} else {
					switch ($(this).get(0).type) {
						case "checkbox":
							if($(this).is(":checked")) {
								postdata[this.name]= $(this).val();
							}else {
								var ofv = $(this).attr("offval");
								postdata[this.name]= ofv;
							}
						break;
						case "select-one":
							postdata[this.name]= $("option:selected",this).val();
						break;
						case "select-multiple":
							postdata[this.name]= $(this).val();
							if(postdata[this.name]) {postdata[this.name] = postdata[this.name].join(",");}
							else {postdata[this.name] ="";}
							var selectedText = [];
							$("option:selected",this).each(
								function(i,selected){
									selectedText[i] = $(selected).text();
								}
							);
						break;
						case "password":
						case "text":
						case "textarea":
						case "button":
							postdata[this.name] = $(this).val();

						break;
					}
					if($t.p.autoencode) {postdata[this.name] = $.jgrid.htmlEncode(postdata[this.name]);}
					}
				});
				return true;
			}
			function createData(rowid,obj,tb,maxcols){
				var nm, hc,trdata, cnt=0,tmp, dc,elc, retpos=[], ind=false,
				tdtmpl = "<td class='CaptionTD'>&#160;</td><td class='DataTD'>&#160;</td>", tmpl="", i; //*2
				for (i =1; i<=maxcols;i++) {
					tmpl += tdtmpl;
				}
				if(rowid !== '_empty') {
					ind = $(obj).jqGrid("getInd",rowid);
				}
				$(obj.p.colModel).each( function(i) {
					nm = this.name;
					// hidden fields are included in the form
					if(this.editrules && this.editrules.edithidden === true) {
						hc = false;
					} else {
						hc = this.hidden === true ? true : false;
					}
					dc = hc ? "style='display:none'" : "";
					if ( nm !== 'cb' && nm !== 'subgrid' && this.editable===true && nm !== 'rn') {
						if(ind === false) {
							tmp = "";
						} else {
							if(nm === obj.p.ExpandColumn && obj.p.treeGrid === true) {
								tmp = $("td[role='gridcell']:eq("+i+")",obj.rows[ind]).text();
							} else {
								try {
									tmp =  $.unformat.call(obj, $("td[role='gridcell']:eq("+i+")",obj.rows[ind]),{rowId:rowid, colModel:this},i);
								} catch (_) {
									tmp =  (this.edittype && this.edittype === "textarea") ? $("td[role='gridcell']:eq("+i+")",obj.rows[ind]).text() : $("td[role='gridcell']:eq("+i+")",obj.rows[ind]).html();
								}
								if(!tmp || tmp === "&nbsp;" || tmp === "&#160;" || (tmp.length===1 && tmp.charCodeAt(0)===160) ) {tmp='';}
							}
						}
						var opt = $.extend({}, this.editoptions || {} ,{id:nm,name:nm}),
						frmopt = $.extend({}, {elmprefix:'',elmsuffix:'',rowabove:false,rowcontent:''}, this.formoptions || {}),
						rp = parseInt(frmopt.rowpos,10) || cnt+1,
						cp = parseInt((parseInt(frmopt.colpos,10) || 1)*2,10);
						if(rowid === "_empty" && opt.defaultValue ) {
							tmp = $.isFunction(opt.defaultValue) ? opt.defaultValue.call($t) : opt.defaultValue;
						}
						if(!this.edittype) {this.edittype = "text";}
						if($t.p.autoencode) {tmp = $.jgrid.htmlDecode(tmp);}
						elc = $.jgrid.createEl.call($t,this.edittype,opt,tmp,false,$.extend({},$.jgrid.ajaxOptions,obj.p.ajaxSelectOptions || {}));
						//if(tmp === "" && this.edittype == "checkbox") {tmp = $(elc).attr("offval");}
						//if(tmp === "" && this.edittype == "select") {tmp = $("option:eq(0)",elc).text();}
						if(rp_ge[$t.p.id].checkOnSubmit || rp_ge[$t.p.id].checkOnUpdate) {rp_ge[$t.p.id]._savedData[nm] = tmp;}
						$(elc).addClass("FormElement");
						if( $.inArray(this.edittype, ['text','textarea','password','select']) > -1) {
							$(elc).addClass("ui-widget-content ui-corner-all");
						}
						trdata = $(tb).find("tr[rowpos="+rp+"]");
						if(frmopt.rowabove) {
							var newdata = $("<tr><td class='contentinfo' colspan='"+(maxcols*2)+"'>"+frmopt.rowcontent+"</td></tr>");
							$(tb).append(newdata);
							newdata[0].rp = rp;
						}
						if ( trdata.length===0 ) {
							trdata = $("<tr "+dc+" rowpos='"+rp+"'></tr>").addClass("FormData").attr("id","tr_"+nm);
							$(trdata).append(tmpl);
							$(tb).append(trdata);
							trdata[0].rp = rp;
						}
						$("td:eq("+(cp-2)+")",trdata[0]).html(frmopt.label === undefined ? obj.p.colNames[i]: frmopt.label);
						$("td:eq("+(cp-1)+")",trdata[0]).append(frmopt.elmprefix).append(elc).append(frmopt.elmsuffix);
						if(this.edittype==='custom' && $.isFunction(opt.custom_value) ) {
							opt.custom_value.call($t, $("#"+nm,"#"+frmgr),'set',tmp);
						}
						$.jgrid.bindEv.call($t, elc, opt);
						retpos[cnt] = i;
						cnt++;
					}
				});
				if( cnt > 0) {
					var idrow = $("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='"+ (maxcols*2-1)+"' class='DataTD'><input class='FormElement' id='id_g' type='text' name='"+obj.p.id+"_id' value='"+rowid+"'/></td></tr>");
					idrow[0].rp = cnt+999;
					$(tb).append(idrow);
					if(rp_ge[$t.p.id].checkOnSubmit || rp_ge[$t.p.id].checkOnUpdate) {rp_ge[$t.p.id]._savedData[obj.p.id+"_id"] = rowid;}
				}
				return retpos;
			}
			function fillData(rowid,obj,fmid){
				var nm,cnt=0,tmp, fld,opt,vl,vlc;
				if(rp_ge[$t.p.id].checkOnSubmit || rp_ge[$t.p.id].checkOnUpdate) {rp_ge[$t.p.id]._savedData = {};rp_ge[$t.p.id]._savedData[obj.p.id+"_id"]=rowid;}
				var cm = obj.p.colModel;
				if(rowid === '_empty') {
					$(cm).each(function(){
						nm = this.name;
						opt = $.extend({}, this.editoptions || {} );
						fld = $("#"+$.jgrid.jqID(nm),"#"+fmid);
						if(fld && fld.length && fld[0] !== null) {
							vl = "";
							if(this.edittype === 'custom' && $.isFunction(opt.custom_value)) {
								opt.custom_value.call($t, $("#"+nm,"#"+fmid),'set',vl);
							} else if(opt.defaultValue ) {
								vl = $.isFunction(opt.defaultValue) ? opt.defaultValue.call($t) : opt.defaultValue;
								if(fld[0].type==='checkbox') {
									vlc = vl.toLowerCase();
									if(vlc.search(/(false|f|0|no|n|off|undefined)/i)<0 && vlc!=="") {
										fld[0].checked = true;
										fld[0].defaultChecked = true;
										fld[0].value = vl;
									} else {
										fld[0].checked = false;
										fld[0].defaultChecked = false;
									}
								} else {fld.val(vl);}
							} else {
								if( fld[0].type==='checkbox' ) {
									fld[0].checked = false;
									fld[0].defaultChecked = false;
									vl = $(fld).attr("offval");
								} else if (fld[0].type && fld[0].type.substr(0,6)==='select') {
									fld[0].selectedIndex = 0;
								} else {
									fld.val(vl);
								}
							}
							if(rp_ge[$t.p.id].checkOnSubmit===true || rp_ge[$t.p.id].checkOnUpdate) {rp_ge[$t.p.id]._savedData[nm] = vl;}
						}
					});
					$("#id_g","#"+fmid).val(rowid);
					return;
				}
				var tre = $(obj).jqGrid("getInd",rowid,true);
				if(!tre) {return;}
				$('td[role="gridcell"]',tre).each( function(i) {
					nm = cm[i].name;
					// hidden fields are included in the form
					if ( nm !== 'cb' && nm !== 'subgrid' && nm !== 'rn' && cm[i].editable===true) {
						if(nm === obj.p.ExpandColumn && obj.p.treeGrid === true) {
							tmp = $(this).text();
						} else {
							try {
								tmp =  $.unformat.call(obj, $(this),{rowId:rowid, colModel:cm[i]},i);
							} catch (_) {
								tmp = cm[i].edittype==="textarea" ? $(this).text() : $(this).html();
							}
						}
						if($t.p.autoencode) {tmp = $.jgrid.htmlDecode(tmp);}
						if(rp_ge[$t.p.id].checkOnSubmit===true || rp_ge[$t.p.id].checkOnUpdate) {rp_ge[$t.p.id]._savedData[nm] = tmp;}
						nm = $.jgrid.jqID(nm);
						switch (cm[i].edittype) {
							case "password":
							case "text":
							case "button" :
							case "image":
							case "textarea":
								if(tmp === "&nbsp;" || tmp === "&#160;" || (tmp.length===1 && tmp.charCodeAt(0)===160) ) {tmp='';}
								$("#"+nm,"#"+fmid).val(tmp);
								break;
							case "select":
								var opv = tmp.split(",");
								opv = $.map(opv,function(n){return $.trim(n);});
								$("#"+nm+" option","#"+fmid).each(function(){
									if (!cm[i].editoptions.multiple && ($.trim(tmp) === $.trim($(this).text()) || opv[0] === $.trim($(this).text()) || opv[0] === $.trim($(this).val())) ){
										this.selected= true;
									} else if (cm[i].editoptions.multiple){
										if(  $.inArray($.trim($(this).text()), opv ) > -1 || $.inArray($.trim($(this).val()), opv ) > -1  ){
											this.selected = true;
										}else{
											this.selected = false;
										}
									} else {
										this.selected = false;
									}
								});
								break;
							case "checkbox":
								tmp = String(tmp);
								if(cm[i].editoptions && cm[i].editoptions.value) {
									var cb = cm[i].editoptions.value.split(":");
									if(cb[0] === tmp) {
										$("#"+nm,"#"+fmid)[$t.p.useProp ? 'prop': 'attr']({"checked":true, "defaultChecked" : true});
									} else {
										$("#"+nm,"#"+fmid)[$t.p.useProp ? 'prop': 'attr']({"checked":false, "defaultChecked" : false});
									}
								} else {
									tmp = tmp.toLowerCase();
									if(tmp.search(/(false|f|0|no|n|off|undefined)/i)<0 && tmp!=="") {
										$("#"+nm,"#"+fmid)[$t.p.useProp ? 'prop': 'attr']("checked",true);
										$("#"+nm,"#"+fmid)[$t.p.useProp ? 'prop': 'attr']("defaultChecked",true); //ie
									} else {
										$("#"+nm,"#"+fmid)[$t.p.useProp ? 'prop': 'attr']("checked", false);
										$("#"+nm,"#"+fmid)[$t.p.useProp ? 'prop': 'attr']("defaultChecked", false); //ie
									}
								}
								break;
							case 'custom' :
								try {
									if(cm[i].editoptions && $.isFunction(cm[i].editoptions.custom_value)) {
										cm[i].editoptions.custom_value.call($t, $("#"+nm,"#"+fmid),'set',tmp);
									} else {throw "e1";}
								} catch (e) {
									if (e==="e1") {$.jgrid.info_dialog($.jgrid.errors.errcap,"function 'custom_value' "+$.jgrid.edit.msg.nodefined,$.jgrid.edit.bClose);}
									else {$.jgrid.info_dialog($.jgrid.errors.errcap,e.message,$.jgrid.edit.bClose);}
								}
								break;
						}
						cnt++;
					}
				});
				if(cnt>0) {$("#id_g",frmtb).val(rowid);}
			}
			function setNulls() {
				$.each($t.p.colModel, function(i,n){
					if(n.editoptions && n.editoptions.NullIfEmpty === true) {
						if(postdata.hasOwnProperty(n.name) && postdata[n.name] === "") {
							postdata[n.name] = 'null';
						}
					}
				});
			}
			function postIt() {
				var copydata, ret=[true,"",""], onCS = {}, opers = $t.p.prmNames, idname, oper, key, selr, i;
				
				var retvals = $($t).triggerHandler("jqGridAddEditBeforeCheckValues", [$("#"+frmgr), frmoper]);
				if(retvals && typeof retvals === 'object') {postdata = retvals;}
				
				if($.isFunction(rp_ge[$t.p.id].beforeCheckValues)) {
					retvals = rp_ge[$t.p.id].beforeCheckValues.call($t, postdata,$("#"+frmgr),frmoper);
					if(retvals && typeof retvals === 'object') {postdata = retvals;}
				}
				for( key in postdata ){
					if(postdata.hasOwnProperty(key)) {
						ret = $.jgrid.checkValues.call($t,postdata[key],key);
						if(ret[0] === false) {break;}
					}
				}
				setNulls();
				if(ret[0]) {
					onCS = $($t).triggerHandler("jqGridAddEditClickSubmit", [rp_ge[$t.p.id], postdata, frmoper]);
					if( onCS === undefined && $.isFunction( rp_ge[$t.p.id].onclickSubmit)) { 
						onCS = rp_ge[$t.p.id].onclickSubmit.call($t, rp_ge[$t.p.id], postdata, frmoper) || {}; 
					}
					ret = $($t).triggerHandler("jqGridAddEditBeforeSubmit", [postdata, $("#"+frmgr), frmoper]);
					if(ret === undefined) {
						ret = [true,"",""];
					}
					if( ret[0] && $.isFunction(rp_ge[$t.p.id].beforeSubmit))  {
						ret = rp_ge[$t.p.id].beforeSubmit.call($t,postdata,$("#"+frmgr), frmoper);
					}
				}

				if(ret[0] && !rp_ge[$t.p.id].processing) {
					rp_ge[$t.p.id].processing = true;
					$("#sData", frmtb+"_2").addClass('ui-state-active');
					oper = opers.oper;
					idname = opers.id;
					// we add to pos data array the action - the name is oper
					postdata[oper] = ($.trim(postdata[$t.p.id+"_id"]) === "_empty") ? opers.addoper : opers.editoper;
					if(postdata[oper] !== opers.addoper) {
						postdata[idname] = postdata[$t.p.id+"_id"];
					} else {
						// check to see if we have allredy this field in the form and if yes lieve it
						if( postdata[idname] === undefined ) {postdata[idname] = postdata[$t.p.id+"_id"];}
					}
					delete postdata[$t.p.id+"_id"];
					postdata = $.extend(postdata,rp_ge[$t.p.id].editData,onCS);
					if($t.p.treeGrid === true)  {
						if(postdata[oper] === opers.addoper) {
						selr = $($t).jqGrid("getGridParam", 'selrow');
							var tr_par_id = $t.p.treeGridModel === 'adjacency' ? $t.p.treeReader.parent_id_field : 'parent_id';
							postdata[tr_par_id] = selr;
						}
						for(i in $t.p.treeReader){
							if($t.p.treeReader.hasOwnProperty(i)) {
								var itm = $t.p.treeReader[i];
								if(postdata.hasOwnProperty(itm)) {
									if(postdata[oper] === opers.addoper && i === 'parent_id_field') {continue;}
									delete postdata[itm];
								}
							}
						}
					}
					
					postdata[idname] = $.jgrid.stripPref($t.p.idPrefix, postdata[idname]);
					var ajaxOptions = $.extend({
						url: rp_ge[$t.p.id].url || $($t).jqGrid('getGridParam','editurl'),
						type: rp_ge[$t.p.id].mtype,
						data: $.isFunction(rp_ge[$t.p.id].serializeEditData) ? rp_ge[$t.p.id].serializeEditData.call($t,postdata) :  postdata,
						complete:function(data,status){
							var key;
							postdata[idname] = $t.p.idPrefix + postdata[idname];
							if(data.status >= 300 && data.status !== 304) {
								ret[0] = false;
								ret[1] = $($t).triggerHandler("jqGridAddEditErrorTextFormat", [data, frmoper]);
								if ($.isFunction(rp_ge[$t.p.id].errorTextFormat)) {
									ret[1] = rp_ge[$t.p.id].errorTextFormat.call($t, data, frmoper);
								} else {
									ret[1] = status + " Status: '" + data.statusText + "'. Error code: " + data.status;
								}
							} else {
								// data is posted successful
								// execute aftersubmit with the returned data from server
								ret = $($t).triggerHandler("jqGridAddEditAfterSubmit", [data, postdata, frmoper]);
								if(ret === undefined) {
									ret = [true,"",""];
								}
								if( ret[0] && $.isFunction(rp_ge[$t.p.id].afterSubmit) ) {
									ret = rp_ge[$t.p.id].afterSubmit.call($t, data,postdata, frmoper);
								}
							}
							if(ret[0] === false) {
								$("#FormError>td",frmtb).html(ret[1]);
								$("#FormError",frmtb).show();
							} else {
								if($t.p.autoencode) {
									$.each(postdata,function(n,v){
										postdata[n] = $.jgrid.htmlDecode(v);
									});
								}
								//rp_ge[$t.p.id].reloadAfterSubmit = rp_ge[$t.p.id].reloadAfterSubmit && $t.p.datatype != "local";
								// the action is add
								if(postdata[oper] === opers.addoper ) {
									//id processing
									// user not set the id ret[2]
									if(!ret[2]) {ret[2] = $.jgrid.randId();}
									postdata[idname] = ret[2];
									if(rp_ge[$t.p.id].reloadAfterSubmit) {
										$($t).trigger("reloadGrid");
									} else {
										if($t.p.treeGrid === true){
											$($t).jqGrid("addChildNode",ret[2],selr,postdata );
										} else {
											$($t).jqGrid("addRowData",ret[2],postdata,p.addedrow);
										}
									}
									if(rp_ge[$t.p.id].closeAfterAdd) {
										if($t.p.treeGrid !== true){
											$($t).jqGrid("setSelection",ret[2]);
										}
										$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose});
									} else if (rp_ge[$t.p.id].clearAfterAdd) {
										fillData("_empty",$t,frmgr);
									}
								} else {
									// the action is update
									if(rp_ge[$t.p.id].reloadAfterSubmit) {
										$($t).trigger("reloadGrid");
										if( !rp_ge[$t.p.id].closeAfterEdit ) {setTimeout(function(){$($t).jqGrid("setSelection",postdata[idname]);},1000);}
									} else {
										if($t.p.treeGrid === true) {
											$($t).jqGrid("setTreeRow", postdata[idname],postdata);
										} else {
											$($t).jqGrid("setRowData", postdata[idname],postdata);
										}
									}
									if(rp_ge[$t.p.id].closeAfterEdit) {$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose});}
								}
								if($.isFunction(rp_ge[$t.p.id].afterComplete)) {
									copydata = data;
									setTimeout(function(){
										$($t).triggerHandler("jqGridAddEditAfterComplete", [copydata, postdata, $("#"+frmgr), frmoper]);
										rp_ge[$t.p.id].afterComplete.call($t, copydata, postdata, $("#"+frmgr), frmoper);
										copydata=null;
									},500);
								}
								if(rp_ge[$t.p.id].checkOnSubmit || rp_ge[$t.p.id].checkOnUpdate) {
									$("#"+frmgr).data("disabled",false);
									if(rp_ge[$t.p.id]._savedData[$t.p.id+"_id"] !== "_empty"){
										for(key in rp_ge[$t.p.id]._savedData) {
											if(rp_ge[$t.p.id]._savedData.hasOwnProperty(key) && postdata[key]) {
												rp_ge[$t.p.id]._savedData[key] = postdata[key];
											}
										}
									}
								}
							}
							rp_ge[$t.p.id].processing=false;
							$("#sData", frmtb+"_2").removeClass('ui-state-active');
							try{$(':input:visible',"#"+frmgr)[0].focus();} catch (e){}
						}
					}, $.jgrid.ajaxOptions, rp_ge[$t.p.id].ajaxEditOptions );

					if (!ajaxOptions.url && !rp_ge[$t.p.id].useDataProxy) {
						if ($.isFunction($t.p.dataProxy)) {
							rp_ge[$t.p.id].useDataProxy = true;
						} else {
							ret[0]=false;ret[1] += " "+$.jgrid.errors.nourl;
						}
					}
					if (ret[0]) {
						if (rp_ge[$t.p.id].useDataProxy) {
							var dpret = $t.p.dataProxy.call($t, ajaxOptions, "set_"+$t.p.id); 
							if(dpret === undefined) {
								dpret = [true, ""];
							}
							if(dpret[0] === false ) {
								ret[0] = false;
								ret[1] = dpret[1] || "Error deleting the selected row!" ;
							} else {
								if(ajaxOptions.data.oper === opers.addoper && rp_ge[$t.p.id].closeAfterAdd ) {
									$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, onClose: rp_ge[$t.p.id].onClose});
								}
								if(ajaxOptions.data.oper === opers.editoper && rp_ge[$t.p.id].closeAfterEdit ) {
									$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, onClose: rp_ge[$t.p.id].onClose});
								}
							}
						} else {
							$.ajax(ajaxOptions); 
						}
					}
				}
				if(ret[0] === false) {
					$("#FormError>td",frmtb).html(ret[1]);
					$("#FormError",frmtb).show();
					// return;
				}
			}
			function compareData(nObj, oObj ) {
				var ret = false,key;
				for (key in nObj) {
					if(nObj.hasOwnProperty(key) && nObj[key] != oObj[key]) {
						ret = true;
						break;
					}
				}
				return ret;
			}
			function checkUpdates () {
				var stat = true;
				$("#FormError",frmtb).hide();
				if(rp_ge[$t.p.id].checkOnUpdate) {
					postdata = {};
					getFormData();
					diff = compareData(postdata,rp_ge[$t.p.id]._savedData);
					if(diff) {
						$("#"+frmgr).data("disabled",true);
						$(".confirm","#"+IDs.themodal).show();
						stat = false;
					}
				}
				return stat;
			}
			function restoreInline()
			{
				var i;
				if (rowid !== "_empty" && $t.p.savedRow !== undefined && $t.p.savedRow.length > 0 && $.isFunction($.fn.jqGrid.restoreRow)) {
					for (i=0;i<$t.p.savedRow.length;i++) {
						if ($t.p.savedRow[i].id == rowid) {
							$($t).jqGrid('restoreRow',rowid);
							break;
						}
					}
				}
			}
			function updateNav(cr, posarr){
				var totr = posarr[1].length-1;
				if (cr===0) {
					$("#pData",frmtb+"_2").addClass('ui-state-disabled');
				} else if( posarr[1][cr-1] !== undefined && $("#"+$.jgrid.jqID(posarr[1][cr-1])).hasClass('ui-state-disabled')) {
						$("#pData",frmtb+"_2").addClass('ui-state-disabled');
				} else {
					$("#pData",frmtb+"_2").removeClass('ui-state-disabled');
				}
				
				if (cr===totr) {
					$("#nData",frmtb+"_2").addClass('ui-state-disabled');
				} else if( posarr[1][cr+1] !== undefined && $("#"+$.jgrid.jqID(posarr[1][cr+1])).hasClass('ui-state-disabled')) {
					$("#nData",frmtb+"_2").addClass('ui-state-disabled');
				} else {
					$("#nData",frmtb+"_2").removeClass('ui-state-disabled');
				}
			}
			function getCurrPos() {
				var rowsInGrid = $($t).jqGrid("getDataIDs"),
				selrow = $("#id_g",frmtb).val(),
				pos = $.inArray(selrow,rowsInGrid);
				return [pos,rowsInGrid];
			}

			if ( $("#"+$.jgrid.jqID(IDs.themodal))[0] !== undefined ) {
				showFrm = $($t).triggerHandler("jqGridAddEditBeforeInitData", [$("#"+$.jgrid.jqID(frmgr)), frmoper]);
				if(showFrm === undefined) {
					showFrm = true;
				}
				if(showFrm && onBeforeInit) {
					showFrm = onBeforeInit.call($t,$("#"+frmgr), frmoper);
				}
				if(showFrm === false) {return;}
				restoreInline();
				$(".ui-jqdialog-title","#"+$.jgrid.jqID(IDs.modalhead)).html(p.caption);
				$("#FormError",frmtb).hide();
				if(rp_ge[$t.p.id].topinfo) {
					$(".topinfo",frmtb).html(rp_ge[$t.p.id].topinfo);
					$(".tinfo",frmtb).show();
				} else {
					$(".tinfo",frmtb).hide();
				}
				if(rp_ge[$t.p.id].bottominfo) {
					$(".bottominfo",frmtb+"_2").html(rp_ge[$t.p.id].bottominfo);
					$(".binfo",frmtb+"_2").show();
				} else {
					$(".binfo",frmtb+"_2").hide();
				}
				// filldata
				fillData(rowid,$t,frmgr);
				///
				if(rowid==="_empty" || !rp_ge[$t.p.id].viewPagerButtons) {
					$("#pData, #nData",frmtb+"_2").hide();
				} else {
					$("#pData, #nData",frmtb+"_2").show();
				}
				if(rp_ge[$t.p.id].processing===true) {
					rp_ge[$t.p.id].processing=false;
					$("#sData", frmtb+"_2").removeClass('ui-state-active');
				}
				if($("#"+frmgr).data("disabled")===true) {
					$(".confirm","#"+$.jgrid.jqID(IDs.themodal)).hide();
					$("#"+frmgr).data("disabled",false);
				}
				$($t).triggerHandler("jqGridAddEditBeforeShowForm", [$("#"+frmgr), frmoper]);
				if(onBeforeShow) { onBeforeShow.call($t, $("#"+frmgr), frmoper); }
				$("#"+$.jgrid.jqID(IDs.themodal)).data("onClose",rp_ge[$t.p.id].onClose);
				$.jgrid.viewModal("#"+$.jgrid.jqID(IDs.themodal),{gbox:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, jqM: false, overlay: p.overlay, modal:p.modal, overlayClass : p.overlayClass});
				if(!closeovrl) {
					$("." + $.jgrid.jqID(p.overlayClass)).click(function(){
						if(!checkUpdates()) {return false;}
						$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, onClose: rp_ge[$t.p.id].onClose});
						return false;
					});
				}
				$($t).triggerHandler("jqGridAddEditAfterShowForm", [$("#"+frmgr), frmoper]);
				if(onAfterShow) { onAfterShow.call($t, $("#"+frmgr), frmoper); }
			} else {
				var dh = isNaN(p.dataheight) ? p.dataheight : p.dataheight+"px",
				dw = isNaN(p.datawidth) ? p.datawidth : p.datawidth+"px",
				frm = $("<form name='FormPost' id='"+frmgr+"' class='FormGrid' onSubmit='return false;' style='width:"+dw+";overflow:auto;position:relative;height:"+dh+";'></form>").data("disabled",false),
				tbl = $("<table id='"+frmtborg+"' class='EditTable' cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>");
				showFrm = $($t).triggerHandler("jqGridAddEditBeforeInitData", [$("#"+frmgr), frmoper]);
				if(showFrm === undefined) {
					showFrm = true;
				}
				if(showFrm && onBeforeInit) {
					showFrm = onBeforeInit.call($t,$("#"+frmgr),frmoper);
				}
				if(showFrm === false) {return;}
				restoreInline();
				$($t.p.colModel).each( function() {
					var fmto = this.formoptions;
					maxCols = Math.max(maxCols, fmto ? fmto.colpos || 0 : 0 );
					maxRows = Math.max(maxRows, fmto ? fmto.rowpos || 0 : 0 );
				});
				$(frm).append(tbl);
				var flr = $("<tr id='FormError' style='display:none'><td class='ui-state-error' colspan='"+(maxCols*2)+"'></td></tr>");
				flr[0].rp = 0;
				$(tbl).append(flr);
				//topinfo
				flr = $("<tr style='display:none' class='tinfo'><td class='topinfo' colspan='"+(maxCols*2)+"'>"+rp_ge[$t.p.id].topinfo+"</td></tr>");
				flr[0].rp = 0;
				$(tbl).append(flr);
				// set the id.
				// use carefull only to change here colproperties.
				// create data
				var rtlb = $t.p.direction === "rtl" ? true :false,
				bp = rtlb ? "nData" : "pData",
				bn = rtlb ? "pData" : "nData";
				createData(rowid,$t,tbl,maxCols);
				// buttons at footer
				var bP = "<a id='"+bp+"' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>",
				bN = "<a id='"+bn+"' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>",
				bS  ="<a id='sData' class='fm-button ui-state-default ui-corner-all'>"+p.bSubmit+"</a>",
				bC  ="<a id='cData' class='fm-button ui-state-default ui-corner-all'>"+p.bCancel+"</a>";
				var bt = "<table border='0' cellspacing='0' cellpadding='0' class='EditTable' id='"+frmtborg+"_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr id='Act_Buttons'><td class='navButton'>"+(rtlb ? bN+bP : bP+bN)+"</td><td class='EditButton'>"+bS+bC+"</td></tr>";
				bt += "<tr style='display:none' class='binfo'><td class='bottominfo' colspan='2'>"+rp_ge[$t.p.id].bottominfo+"</td></tr>";
				bt += "</tbody></table>";
				if(maxRows >  0) {
					var sd=[];
					$.each($(tbl)[0].rows,function(i,r){
						sd[i] = r;
					});
					sd.sort(function(a,b){
						if(a.rp > b.rp) {return 1;}
						if(a.rp < b.rp) {return -1;}
						return 0;
					});
					$.each(sd, function(index, row) {
						$('tbody',tbl).append(row);
					});
				}
				p.gbox = "#gbox_"+$.jgrid.jqID(gID);
				var cle = false;
				if(p.closeOnEscape===true){
					p.closeOnEscape = false;
					cle = true;
				}
				var tms = $("<div></div>").append(frm).append(bt);
				$.jgrid.createModal(IDs,tms,p,"#gview_"+$.jgrid.jqID($t.p.id),$("#gbox_"+$.jgrid.jqID($t.p.id))[0]);
				if(rtlb) {
					$("#pData, #nData",frmtb+"_2").css("float","right");
					$(".EditButton",frmtb+"_2").css("text-align","left");
				}
				if(rp_ge[$t.p.id].topinfo) {$(".tinfo",frmtb).show();}
				if(rp_ge[$t.p.id].bottominfo) {$(".binfo",frmtb+"_2").show();}
				tms = null;bt=null;
				$("#"+$.jgrid.jqID(IDs.themodal)).keydown( function( e ) {
					var wkey = e.target;
					if ($("#"+frmgr).data("disabled")===true ) {return false;}//??
					if(rp_ge[$t.p.id].savekey[0] === true && e.which === rp_ge[$t.p.id].savekey[1]) { // save
						if(wkey.tagName !== "TEXTAREA") {
							$("#sData", frmtb+"_2").trigger("click");
							return false;
						}
					}
					if(e.which === 27) {
						if(!checkUpdates()) {return false;}
						if(cle)	{$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:p.gbox,jqm:p.jqModal, onClose: rp_ge[$t.p.id].onClose});}
						return false;
					}
					if(rp_ge[$t.p.id].navkeys[0]===true) {
						if($("#id_g",frmtb).val() === "_empty") {return true;}
						if(e.which === rp_ge[$t.p.id].navkeys[1]){ //up
							$("#pData", frmtb+"_2").trigger("click");
							return false;
						}
						if(e.which === rp_ge[$t.p.id].navkeys[2]){ //down
							$("#nData", frmtb+"_2").trigger("click");
							return false;
						}
					}
				});
				if(p.checkOnUpdate) {
					$("a.ui-jqdialog-titlebar-close span","#"+$.jgrid.jqID(IDs.themodal)).removeClass("jqmClose");
					$("a.ui-jqdialog-titlebar-close","#"+$.jgrid.jqID(IDs.themodal)).unbind("click")
					.click(function(){
						if(!checkUpdates()) {return false;}
						$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose});
						return false;
					});
				}
				p.saveicon = $.extend([true,"left","ui-icon-disk"],p.saveicon);
				p.closeicon = $.extend([true,"left","ui-icon-close"],p.closeicon);
				// beforeinitdata after creation of the form
				if(p.saveicon[0]===true) {
					$("#sData",frmtb+"_2").addClass(p.saveicon[1] === "right" ? 'fm-button-icon-right' : 'fm-button-icon-left')
					.append("<span class='ui-icon "+p.saveicon[2]+"'></span>");
				}
				if(p.closeicon[0]===true) {
					$("#cData",frmtb+"_2").addClass(p.closeicon[1] === "right" ? 'fm-button-icon-right' : 'fm-button-icon-left')
					.append("<span class='ui-icon "+p.closeicon[2]+"'></span>");
				}
				if(rp_ge[$t.p.id].checkOnSubmit || rp_ge[$t.p.id].checkOnUpdate) {
					bS  ="<a id='sNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>"+p.bYes+"</a>";
					bN  ="<a id='nNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>"+p.bNo+"</a>";
					bC  ="<a id='cNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>"+p.bExit+"</a>";
					var zI = p.zIndex  || 999;zI ++;
					$("<div class='"+ p.overlayClass+" jqgrid-overlay confirm' style='z-index:"+zI+";display:none;'>&#160;"+"</div><div class='confirm ui-widget-content ui-jqconfirm' style='z-index:"+(zI+1)+"'>"+p.saveData+"<br/><br/>"+bS+bN+bC+"</div>").insertAfter("#"+frmgr);
					$("#sNew","#"+$.jgrid.jqID(IDs.themodal)).click(function(){
						postIt();
						$("#"+frmgr).data("disabled",false);
						$(".confirm","#"+$.jgrid.jqID(IDs.themodal)).hide();
						return false;
					});
					$("#nNew","#"+$.jgrid.jqID(IDs.themodal)).click(function(){
						$(".confirm","#"+$.jgrid.jqID(IDs.themodal)).hide();
						$("#"+frmgr).data("disabled",false);
						setTimeout(function(){$(":input:visible","#"+frmgr)[0].focus();},0);
						return false;
					});
					$("#cNew","#"+$.jgrid.jqID(IDs.themodal)).click(function(){
						$(".confirm","#"+$.jgrid.jqID(IDs.themodal)).hide();
						$("#"+frmgr).data("disabled",false);
						$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose});
						return false;
					});
				}
				// here initform - only once
				$($t).triggerHandler("jqGridAddEditInitializeForm", [$("#"+frmgr), frmoper]);
				if(onInitializeForm) {onInitializeForm.call($t,$("#"+frmgr), frmoper);}
				if(rowid==="_empty" || !rp_ge[$t.p.id].viewPagerButtons) {$("#pData,#nData",frmtb+"_2").hide();} else {$("#pData,#nData",frmtb+"_2").show();}
				$($t).triggerHandler("jqGridAddEditBeforeShowForm", [$("#"+frmgr), frmoper]);
				if(onBeforeShow) { onBeforeShow.call($t, $("#"+frmgr), frmoper);}
				$("#"+$.jgrid.jqID(IDs.themodal)).data("onClose",rp_ge[$t.p.id].onClose);
				$.jgrid.viewModal("#"+$.jgrid.jqID(IDs.themodal),{gbox:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, overlay: p.overlay,modal:p.modal, overlayClass: p.overlayClass});
				if(!closeovrl) {
					$("." + $.jgrid.jqID(p.overlayClass)).click(function(){
						if(!checkUpdates()) {return false;}
						$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, onClose: rp_ge[$t.p.id].onClose});
						return false;
					});
				}
				$($t).triggerHandler("jqGridAddEditAfterShowForm", [$("#"+frmgr), frmoper]);
				if(onAfterShow) { onAfterShow.call($t, $("#"+frmgr), frmoper); }
				$(".fm-button","#"+$.jgrid.jqID(IDs.themodal)).hover(
					function(){$(this).addClass('ui-state-hover');},
					function(){$(this).removeClass('ui-state-hover');}
				);
				$("#sData", frmtb+"_2").click(function(){
					postdata = {};
					$("#FormError",frmtb).hide();
					// all depend on ret array
					//ret[0] - succes
					//ret[1] - msg if not succes
					//ret[2] - the id  that will be set if reload after submit false
					getFormData();
					if(postdata[$t.p.id+"_id"] === "_empty")	{postIt();}
					else if(p.checkOnSubmit===true ) {
						diff = compareData(postdata,rp_ge[$t.p.id]._savedData);
						if(diff) {
							$("#"+frmgr).data("disabled",true);
							$(".confirm","#"+$.jgrid.jqID(IDs.themodal)).show();
						} else {
							postIt();
						}
					} else {
						postIt();
					}
					return false;
				});
				$("#cData", frmtb+"_2").click(function(){
					if(!checkUpdates()) {return false;}
					$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal,onClose: rp_ge[$t.p.id].onClose});
					return false;
				});
				$("#nData", frmtb+"_2").click(function(){
					if(!checkUpdates()) {return false;}
					$("#FormError",frmtb).hide();
					var npos = getCurrPos();
					npos[0] = parseInt(npos[0],10);
					if(npos[0] !== -1 && npos[1][npos[0]+1]) {
						$($t).triggerHandler("jqGridAddEditClickPgButtons", ['next',$("#"+frmgr),npos[1][npos[0]]]);
						var nposret;
						if($.isFunction(p.onclickPgButtons)) {
							nposret = p.onclickPgButtons.call($t, 'next',$("#"+frmgr),npos[1][npos[0]]);
							if( nposret !== undefined && nposret === false ) {return false;}
						}
						if( $("#"+$.jgrid.jqID(npos[1][npos[0]+1])).hasClass('ui-state-disabled')) {return false;}
						fillData(npos[1][npos[0]+1],$t,frmgr);
						$($t).jqGrid("setSelection",npos[1][npos[0]+1]);
						$($t).triggerHandler("jqGridAddEditAfterClickPgButtons", ['next',$("#"+frmgr),npos[1][npos[0]]]);
						if($.isFunction(p.afterclickPgButtons)) {
							p.afterclickPgButtons.call($t, 'next',$("#"+frmgr),npos[1][npos[0]+1]);
						}
						updateNav(npos[0]+1,npos);
					}
					return false;
				});
				$("#pData", frmtb+"_2").click(function(){
					if(!checkUpdates()) {return false;}
					$("#FormError",frmtb).hide();
					var ppos = getCurrPos();
					if(ppos[0] !== -1 && ppos[1][ppos[0]-1]) {
						$($t).triggerHandler("jqGridAddEditClickPgButtons", ['prev',$("#"+frmgr),ppos[1][ppos[0]]]);
						var pposret;
						if($.isFunction(p.onclickPgButtons)) {
							pposret = p.onclickPgButtons.call($t, 'prev',$("#"+frmgr),ppos[1][ppos[0]]);
							if( pposret !== undefined && pposret === false ) {return false;}
						}
						if( $("#"+$.jgrid.jqID(ppos[1][ppos[0]-1])).hasClass('ui-state-disabled')) {return false;}
						fillData(ppos[1][ppos[0]-1],$t,frmgr);
						$($t).jqGrid("setSelection",ppos[1][ppos[0]-1]);
						$($t).triggerHandler("jqGridAddEditAfterClickPgButtons", ['prev',$("#"+frmgr),ppos[1][ppos[0]]]);
						if($.isFunction(p.afterclickPgButtons)) {
							p.afterclickPgButtons.call($t, 'prev',$("#"+frmgr),ppos[1][ppos[0]-1]);
						}
						updateNav(ppos[0]-1,ppos);
					}
					return false;
				});
			}
			var posInit =getCurrPos();
			updateNav(posInit[0],posInit);

		});
	},
	viewGridRow : function(rowid, p){
		p = $.extend(true, {
			top : 0,
			left: 0,
			width: 0,
			datawidth: 'auto',
			height: 'auto',
			dataheight: 'auto',
			modal: false,
			overlay: 30,
			drag: true,
			resize: true,
			jqModal: true,
			closeOnEscape : false,
			labelswidth: '30%',
			closeicon: [],
			navkeys: [false,38,40],
			onClose: null,
			beforeShowForm : null,
			beforeInitData : null,
			viewPagerButtons : true,
			recreateForm : false
		}, $.jgrid.view, p || {});
		rp_ge[$(this)[0].p.id] = p;
		return this.each(function(){
			var $t = this;
			if (!$t.grid || !rowid) {return;}
			var gID = $t.p.id,
			frmgr = "ViewGrid_"+$.jgrid.jqID( gID  ), frmtb = "ViewTbl_" + $.jgrid.jqID( gID ),
			frmgr_id = "ViewGrid_"+gID, frmtb_id = "ViewTbl_"+gID,
			IDs = {themodal:'viewmod'+gID,modalhead:'viewhd'+gID,modalcontent:'viewcnt'+gID, scrollelm : frmgr},
			onBeforeInit = $.isFunction(rp_ge[$t.p.id].beforeInitData) ? rp_ge[$t.p.id].beforeInitData : false,
			showFrm = true,
			maxCols = 1, maxRows=0;
			if(p.recreateForm===true && $("#"+$.jgrid.jqID(IDs.themodal))[0] !== undefined) {
				$("#"+$.jgrid.jqID(IDs.themodal)).remove();
			}
			function focusaref(){ //Sfari 3 issues
				if(rp_ge[$t.p.id].closeOnEscape===true || rp_ge[$t.p.id].navkeys[0]===true) {
					setTimeout(function(){$(".ui-jqdialog-titlebar-close","#"+$.jgrid.jqID(IDs.modalhead)).focus();},0);
				}
			}
			function createData(rowid,obj,tb,maxcols){
				var nm, hc,trdata, cnt=0,tmp, dc, retpos=[], ind=false, i,
				tdtmpl = "<td class='CaptionTD form-view-label ui-widget-content' width='"+p.labelswidth+"'>&#160;</td><td class='DataTD form-view-data ui-helper-reset ui-widget-content'>&#160;</td>", tmpl="",
				tdtmpl2 = "<td class='CaptionTD form-view-label ui-widget-content'>&#160;</td><td class='DataTD form-view-data ui-widget-content'>&#160;</td>",
				fmtnum = ['integer','number','currency'],max1 =0, max2=0 ,maxw,setme, viewfld;
				for (i=1;i<=maxcols;i++) {
					tmpl += i === 1 ? tdtmpl : tdtmpl2;
				}
				// find max number align rigth with property formatter
				$(obj.p.colModel).each( function() {
					if(this.editrules && this.editrules.edithidden === true) {
						hc = false;
					} else {
						hc = this.hidden === true ? true : false;
					}
					if(!hc && this.align==='right') {
						if(this.formatter && $.inArray(this.formatter,fmtnum) !== -1 ) {
							max1 = Math.max(max1,parseInt(this.width,10));
						} else {
							max2 = Math.max(max2,parseInt(this.width,10));
						}
					}
				});
				maxw  = max1 !==0 ? max1 : max2 !==0 ? max2 : 0;
				ind = $(obj).jqGrid("getInd",rowid);
				$(obj.p.colModel).each( function(i) {
					nm = this.name;
					setme = false;
					// hidden fields are included in the form
					if(this.editrules && this.editrules.edithidden === true) {
						hc = false;
					} else {
						hc = this.hidden === true ? true : false;
					}
					dc = hc ? "style='display:none'" : "";
					viewfld = (typeof this.viewable !== 'boolean') ? true : this.viewable;
					if ( nm !== 'cb' && nm !== 'subgrid' && nm !== 'rn' && viewfld) {
						if(ind === false) {
							tmp = "";
						} else {
							if(nm === obj.p.ExpandColumn && obj.p.treeGrid === true) {
								tmp = $("td:eq("+i+")",obj.rows[ind]).text();
							} else {
								tmp = $("td:eq("+i+")",obj.rows[ind]).html();
							}
						}
						setme = this.align === 'right' && maxw !==0 ? true : false;
						var frmopt = $.extend({},{rowabove:false,rowcontent:''}, this.formoptions || {}),
						rp = parseInt(frmopt.rowpos,10) || cnt+1,
						cp = parseInt((parseInt(frmopt.colpos,10) || 1)*2,10);
						if(frmopt.rowabove) {
							var newdata = $("<tr><td class='contentinfo' colspan='"+(maxcols*2)+"'>"+frmopt.rowcontent+"</td></tr>");
							$(tb).append(newdata);
							newdata[0].rp = rp;
						}
						trdata = $(tb).find("tr[rowpos="+rp+"]");
						if ( trdata.length===0 ) {
							trdata = $("<tr "+dc+" rowpos='"+rp+"'></tr>").addClass("FormData").attr("id","trv_"+nm);
							$(trdata).append(tmpl);
							$(tb).append(trdata);
							trdata[0].rp = rp;
						}
						$("td:eq("+(cp-2)+")",trdata[0]).html('<b>'+ (frmopt.label === undefined ? obj.p.colNames[i]: frmopt.label)+'</b>');
						$("td:eq("+(cp-1)+")",trdata[0]).append("<span>"+tmp+"</span>").attr("id","v_"+nm);
						if(setme){
							$("td:eq("+(cp-1)+") span",trdata[0]).css({'text-align':'right',width:maxw+"px"});
						}
						retpos[cnt] = i;
						cnt++;
					}
				});
				if( cnt > 0) {
					var idrow = $("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='"+ (maxcols*2-1)+"' class='DataTD'><input class='FormElement' id='id_g' type='text' name='id' value='"+rowid+"'/></td></tr>");
					idrow[0].rp = cnt+99;
					$(tb).append(idrow);
				}
				return retpos;
			}
			function fillData(rowid,obj){
				var nm, hc,cnt=0,tmp,trv;
				trv = $(obj).jqGrid("getInd",rowid,true);
				if(!trv) {return;}
				$('td',trv).each( function(i) {
					nm = obj.p.colModel[i].name;
					// hidden fields are included in the form
					if(obj.p.colModel[i].editrules && obj.p.colModel[i].editrules.edithidden === true) {
						hc = false;
					} else {
						hc = obj.p.colModel[i].hidden === true ? true : false;
					}
					if ( nm !== 'cb' && nm !== 'subgrid' && nm !== 'rn') {
						if(nm === obj.p.ExpandColumn && obj.p.treeGrid === true) {
							tmp = $(this).text();
						} else {
							tmp = $(this).html();
						}
						nm = $.jgrid.jqID("v_"+nm);
						$("#"+nm+" span","#"+frmtb).html(tmp);
						if (hc) {$("#"+nm,"#"+frmtb).parents("tr:first").hide();}
						cnt++;
					}
				});
				if(cnt>0) {$("#id_g","#"+frmtb).val(rowid);}
			}
			function updateNav(cr,posarr){
				var totr = posarr[1].length-1;
				if (cr===0) {
					$("#pData","#"+frmtb+"_2").addClass('ui-state-disabled');
				} else if( posarr[1][cr-1] !== undefined && $("#"+$.jgrid.jqID(posarr[1][cr-1])).hasClass('ui-state-disabled')) {
					$("#pData",frmtb+"_2").addClass('ui-state-disabled');
				} else {
					$("#pData","#"+frmtb+"_2").removeClass('ui-state-disabled');
				}
				if (cr===totr) {
					$("#nData","#"+frmtb+"_2").addClass('ui-state-disabled');
				} else if( posarr[1][cr+1] !== undefined && $("#"+$.jgrid.jqID(posarr[1][cr+1])).hasClass('ui-state-disabled')) {
					$("#nData",frmtb+"_2").addClass('ui-state-disabled');
				} else {
					$("#nData","#"+frmtb+"_2").removeClass('ui-state-disabled');
				}
			}
			function getCurrPos() {
				var rowsInGrid = $($t).jqGrid("getDataIDs"),
				selrow = $("#id_g","#"+frmtb).val(),
				pos = $.inArray(selrow,rowsInGrid);
				return [pos,rowsInGrid];
			}

			if ( $("#"+$.jgrid.jqID(IDs.themodal))[0] !== undefined ) {
				if(onBeforeInit) {
					showFrm = onBeforeInit.call($t,$("#"+frmgr));
					if(showFrm === undefined) {
						showFrm = true;
					}
				}
				if(showFrm === false) {return;}
				$(".ui-jqdialog-title","#"+$.jgrid.jqID(IDs.modalhead)).html(p.caption);
				$("#FormError","#"+frmtb).hide();
				fillData(rowid,$t);
				if($.isFunction(rp_ge[$t.p.id].beforeShowForm)) {rp_ge[$t.p.id].beforeShowForm.call($t,$("#"+frmgr));}
				$.jgrid.viewModal("#"+$.jgrid.jqID(IDs.themodal),{gbox:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, jqM: false, overlay: p.overlay, modal:p.modal});
				focusaref();
			} else {
				var dh = isNaN(p.dataheight) ? p.dataheight : p.dataheight+"px",
				dw = isNaN(p.datawidth) ? p.datawidth : p.datawidth+"px",
				frm = $("<form name='FormPost' id='"+frmgr_id+"' class='FormGrid' style='width:"+dw+";overflow:auto;position:relative;height:"+dh+";'></form>"),
				tbl =$("<table id='"+frmtb_id+"' class='EditTable' cellspacing='1' cellpadding='2' border='0' style='table-layout:fixed'><tbody></tbody></table>");
				if(onBeforeInit) {
					showFrm = onBeforeInit.call($t,$("#"+frmgr));
					if(showFrm === undefined) {
						showFrm = true;
					}
				}
				if(showFrm === false) {return;}
				$($t.p.colModel).each( function() {
					var fmto = this.formoptions;
					maxCols = Math.max(maxCols, fmto ? fmto.colpos || 0 : 0 );
					maxRows = Math.max(maxRows, fmto ? fmto.rowpos || 0 : 0 );
				});
				// set the id.
				$(frm).append(tbl);
				createData(rowid, $t, tbl, maxCols);
				var rtlb = $t.p.direction === "rtl" ? true :false,
				bp = rtlb ? "nData" : "pData",
				bn = rtlb ? "pData" : "nData",

				// buttons at footer
				bP = "<a id='"+bp+"' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>",
				bN = "<a id='"+bn+"' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>",
				bC  ="<a id='cData' class='fm-button ui-state-default ui-corner-all'>"+p.bClose+"</a>";
				if(maxRows >  0) {
					var sd=[];
					$.each($(tbl)[0].rows,function(i,r){
						sd[i] = r;
					});
					sd.sort(function(a,b){
						if(a.rp > b.rp) {return 1;}
						if(a.rp < b.rp) {return -1;}
						return 0;
					});
					$.each(sd, function(index, row) {
						$('tbody',tbl).append(row);
					});
				}
				p.gbox = "#gbox_"+$.jgrid.jqID(gID);
				var bt = $("<div></div>").append(frm).append("<table border='0' class='EditTable' id='"+frmtb+"_2'><tbody><tr id='Act_Buttons'><td class='navButton' width='"+p.labelswidth+"'>"+(rtlb ? bN+bP : bP+bN)+"</td><td class='EditButton'>"+bC+"</td></tr></tbody></table>");
				$.jgrid.createModal(IDs,bt,p,"#gview_"+$.jgrid.jqID($t.p.id),$("#gview_"+$.jgrid.jqID($t.p.id))[0]);
				if(rtlb) {
					$("#pData, #nData","#"+frmtb+"_2").css("float","right");
					$(".EditButton","#"+frmtb+"_2").css("text-align","left");
				}
				if(!p.viewPagerButtons) {$("#pData, #nData","#"+frmtb+"_2").hide();}
				bt = null;
				$("#"+IDs.themodal).keydown( function( e ) {
					if(e.which === 27) {
						if(rp_ge[$t.p.id].closeOnEscape) {$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:p.gbox,jqm:p.jqModal, onClose: p.onClose});}
						return false;
					}
					if(p.navkeys[0]===true) {
						if(e.which === p.navkeys[1]){ //up
							$("#pData", "#"+frmtb+"_2").trigger("click");
							return false;
						}
						if(e.which === p.navkeys[2]){ //down
							$("#nData", "#"+frmtb+"_2").trigger("click");
							return false;
						}
					}
				});
				p.closeicon = $.extend([true,"left","ui-icon-close"],p.closeicon);
				if(p.closeicon[0]===true) {
					$("#cData","#"+frmtb+"_2").addClass(p.closeicon[1] === "right" ? 'fm-button-icon-right' : 'fm-button-icon-left')
					.append("<span class='ui-icon "+p.closeicon[2]+"'></span>");
				}
				if($.isFunction(p.beforeShowForm)) {p.beforeShowForm.call($t,$("#"+frmgr));}
				$.jgrid.viewModal("#"+$.jgrid.jqID(IDs.themodal),{gbox:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal,overlay: p.overlay, modal:p.modal});
				$(".fm-button:not(.ui-state-disabled)","#"+frmtb+"_2").hover(
					function(){$(this).addClass('ui-state-hover');},
					function(){$(this).removeClass('ui-state-hover');}
				);
				focusaref();
				$("#cData", "#"+frmtb+"_2").click(function(){
					$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, onClose: p.onClose});
					return false;
				});
				$("#nData", "#"+frmtb+"_2").click(function(){
					$("#FormError","#"+frmtb).hide();
					var npos = getCurrPos();
					npos[0] = parseInt(npos[0],10);
					if(npos[0] !== -1 && npos[1][npos[0]+1]) {
						if($.isFunction(p.onclickPgButtons)) {
							p.onclickPgButtons.call($t,'next',$("#"+frmgr),npos[1][npos[0]]);
						}
						fillData(npos[1][npos[0]+1],$t);
						$($t).jqGrid("setSelection",npos[1][npos[0]+1]);
						if($.isFunction(p.afterclickPgButtons)) {
							p.afterclickPgButtons.call($t,'next',$("#"+frmgr),npos[1][npos[0]+1]);
						}
						updateNav(npos[0]+1,npos);
					}
					focusaref();
					return false;
				});
				$("#pData", "#"+frmtb+"_2").click(function(){
					$("#FormError","#"+frmtb).hide();
					var ppos = getCurrPos();
					if(ppos[0] !== -1 && ppos[1][ppos[0]-1]) {
						if($.isFunction(p.onclickPgButtons)) {
							p.onclickPgButtons.call($t,'prev',$("#"+frmgr),ppos[1][ppos[0]]);
						}
						fillData(ppos[1][ppos[0]-1],$t);
						$($t).jqGrid("setSelection",ppos[1][ppos[0]-1]);
						if($.isFunction(p.afterclickPgButtons)) {
							p.afterclickPgButtons.call($t,'prev',$("#"+frmgr),ppos[1][ppos[0]-1]);
						}
						updateNav(ppos[0]-1,ppos);
					}
					focusaref();
					return false;
				});
			}
			var posInit =getCurrPos();
			updateNav(posInit[0],posInit);
		});
	},
	delGridRow : function(rowids,p) {
		p = $.extend(true, {
			top : 0,
			left: 0,
			width: 240,
			height: 'auto',
			dataheight : 'auto',
			modal: false,
			overlay: 30,
			drag: true,
			resize: true,
			url : '',
			mtype : "POST",
			reloadAfterSubmit: true,
			beforeShowForm: null,
			beforeInitData : null,
			afterShowForm: null,
			beforeSubmit: null,
			onclickSubmit: null,
			afterSubmit: null,
			jqModal : true,
			closeOnEscape : false,
			delData: {},
			delicon : [],
			cancelicon : [],
			onClose : null,
			ajaxDelOptions : {},
			processing : false,
			serializeDelData : null,
			useDataProxy : false
		}, $.jgrid.del, p ||{});
		rp_ge[$(this)[0].p.id] = p;
		return this.each(function(){
			var $t = this;
			if (!$t.grid ) {return;}
			if(!rowids) {return;}
			var onBeforeShow = $.isFunction( rp_ge[$t.p.id].beforeShowForm  ),
			onAfterShow = $.isFunction( rp_ge[$t.p.id].afterShowForm ),
			onBeforeInit = $.isFunction(rp_ge[$t.p.id].beforeInitData) ? rp_ge[$t.p.id].beforeInitData : false,
			gID = $t.p.id, onCS = {},
			showFrm = true,
			dtbl = "DelTbl_"+$.jgrid.jqID(gID),postd, idname, opers, oper,
			dtbl_id = "DelTbl_" + gID,
			IDs = {themodal:'delmod'+gID,modalhead:'delhd'+gID,modalcontent:'delcnt'+gID, scrollelm: dtbl};
			if ($.isArray(rowids)) {rowids = rowids.join();}
			if ( $("#"+$.jgrid.jqID(IDs.themodal))[0] !== undefined ) {
				if(onBeforeInit) {
					showFrm = onBeforeInit.call($t,$("#"+dtbl));
					if(showFrm === undefined) {
						showFrm = true;
					}
				}
				if(showFrm === false) {return;}
				$("#DelData>td","#"+dtbl).text(rowids);
				$("#DelError","#"+dtbl).hide();
				if( rp_ge[$t.p.id].processing === true) {
					rp_ge[$t.p.id].processing=false;
					$("#dData", "#"+dtbl).removeClass('ui-state-active');
				}
				if(onBeforeShow) {rp_ge[$t.p.id].beforeShowForm.call($t,$("#"+dtbl));}
				$.jgrid.viewModal("#"+$.jgrid.jqID(IDs.themodal),{gbox:"#gbox_"+$.jgrid.jqID(gID),jqm:rp_ge[$t.p.id].jqModal,jqM: false, overlay: rp_ge[$t.p.id].overlay, modal:rp_ge[$t.p.id].modal});
				if(onAfterShow) {rp_ge[$t.p.id].afterShowForm.call($t,$("#"+dtbl));}
			} else {
				var dh = isNaN(rp_ge[$t.p.id].dataheight) ? rp_ge[$t.p.id].dataheight : rp_ge[$t.p.id].dataheight+"px",
				dw = isNaN(p.datawidth) ? p.datawidth : p.datawidth+"px",
				tbl = "<div id='"+dtbl_id+"' class='formdata' style='width:"+dw+";overflow:auto;position:relative;height:"+dh+";'>";
				tbl += "<table class='DelTable'><tbody>";
				// error data
				tbl += "<tr id='DelError' style='display:none'><td class='ui-state-error'></td></tr>";
				tbl += "<tr id='DelData' style='display:none'><td >"+rowids+"</td></tr>";
				tbl += "<tr><td class=\"delmsg\" style=\"white-space:pre;\">"+rp_ge[$t.p.id].msg+"</td></tr><tr><td >&#160;</td></tr>";
				// buttons at footer
				tbl += "</tbody></table></div>";
				var bS  = "<a id='dData' class='fm-button ui-state-default ui-corner-all'>"+p.bSubmit+"</a>",
				bC  = "<a id='eData' class='fm-button ui-state-default ui-corner-all'>"+p.bCancel+"</a>";
				tbl += "<table cellspacing='0' cellpadding='0' border='0' class='EditTable' id='"+dtbl+"_2'><tbody><tr><td><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='DelButton EditButton'>"+bS+"&#160;"+bC+"</td></tr></tbody></table>";
				p.gbox = "#gbox_"+$.jgrid.jqID(gID);
				$.jgrid.createModal(IDs,tbl,p,"#gview_"+$.jgrid.jqID($t.p.id),$("#gview_"+$.jgrid.jqID($t.p.id))[0]);

				if(onBeforeInit) {
					showFrm = onBeforeInit.call($t,$("#"+dtbl));
					if(showFrm === undefined) {
						showFrm = true;
					}
				}
				if(showFrm === false) {return;}

				$(".fm-button","#"+dtbl+"_2").hover(
					function(){$(this).addClass('ui-state-hover');},
					function(){$(this).removeClass('ui-state-hover');}
				);
				p.delicon = $.extend([true,"left","ui-icon-scissors"],rp_ge[$t.p.id].delicon);
				p.cancelicon = $.extend([true,"left","ui-icon-cancel"],rp_ge[$t.p.id].cancelicon);
				if(p.delicon[0]===true) {
					$("#dData","#"+dtbl+"_2").addClass(p.delicon[1] === "right" ? 'fm-button-icon-right' : 'fm-button-icon-left')
					.append("<span class='ui-icon "+p.delicon[2]+"'></span>");
				}
				if(p.cancelicon[0]===true) {
					$("#eData","#"+dtbl+"_2").addClass(p.cancelicon[1] === "right" ? 'fm-button-icon-right' : 'fm-button-icon-left')
					.append("<span class='ui-icon "+p.cancelicon[2]+"'></span>");
				}
				$("#dData","#"+dtbl+"_2").click(function(){
					var ret=[true,""], pk,
					postdata = $("#DelData>td","#"+dtbl).text(); //the pair is name=val1,val2,...
					onCS = {};
					if( $.isFunction( rp_ge[$t.p.id].onclickSubmit ) ) {onCS = rp_ge[$t.p.id].onclickSubmit.call($t,rp_ge[$t.p.id], postdata) || {};}
					if( $.isFunction( rp_ge[$t.p.id].beforeSubmit ) ) {ret = rp_ge[$t.p.id].beforeSubmit.call($t,postdata);}
					if(ret[0] && !rp_ge[$t.p.id].processing) {
						rp_ge[$t.p.id].processing = true;
						opers = $t.p.prmNames;
						postd = $.extend({},rp_ge[$t.p.id].delData, onCS);
						oper = opers.oper;
						postd[oper] = opers.deloper;
						idname = opers.id;
						postdata = String(postdata).split(",");
						if(!postdata.length) { return false; }
						for(pk in postdata) {
							if(postdata.hasOwnProperty(pk)) {
								postdata[pk] = $.jgrid.stripPref($t.p.idPrefix, postdata[pk]);
							}
						}
						postd[idname] = postdata.join();
						$(this).addClass('ui-state-active');
						var ajaxOptions = $.extend({
							url: rp_ge[$t.p.id].url || $($t).jqGrid('getGridParam','editurl'),
							type: rp_ge[$t.p.id].mtype,
							data: $.isFunction(rp_ge[$t.p.id].serializeDelData) ? rp_ge[$t.p.id].serializeDelData.call($t,postd) : postd,
							complete:function(data,status){
								var i;
								if(data.status >= 300 && data.status !== 304) {
									ret[0] = false;
									if ($.isFunction(rp_ge[$t.p.id].errorTextFormat)) {
										ret[1] = rp_ge[$t.p.id].errorTextFormat.call($t,data);
									} else {
										ret[1] = status + " Status: '" + data.statusText + "'. Error code: " + data.status;
									}
								} else {
									// data is posted successful
									// execute aftersubmit with the returned data from server
									if( $.isFunction( rp_ge[$t.p.id].afterSubmit ) ) {
										ret = rp_ge[$t.p.id].afterSubmit.call($t,data,postd);
									}
								}
								if(ret[0] === false) {
									$("#DelError>td","#"+dtbl).html(ret[1]);
									$("#DelError","#"+dtbl).show();
								} else {
									if(rp_ge[$t.p.id].reloadAfterSubmit && $t.p.datatype !== "local") {
										$($t).trigger("reloadGrid");
									} else {
										if($t.p.treeGrid===true){
												try {$($t).jqGrid("delTreeNode",$t.p.idPrefix+postdata[0]);} catch(e){}
										} else {
											for(i=0;i<postdata.length;i++) {
												$($t).jqGrid("delRowData",$t.p.idPrefix+ postdata[i]);
											}
										}
										$t.p.selrow = null;
										$t.p.selarrrow = [];
									}
									if($.isFunction(rp_ge[$t.p.id].afterComplete)) {
										setTimeout(function(){rp_ge[$t.p.id].afterComplete.call($t,data,postdata);},500);
									}
								}
								rp_ge[$t.p.id].processing=false;
								$("#dData", "#"+dtbl+"_2").removeClass('ui-state-active');
								if(ret[0]) {$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, onClose: rp_ge[$t.p.id].onClose});}
							}
						}, $.jgrid.ajaxOptions, rp_ge[$t.p.id].ajaxDelOptions);


						if (!ajaxOptions.url && !rp_ge[$t.p.id].useDataProxy) {
							if ($.isFunction($t.p.dataProxy)) {
								rp_ge[$t.p.id].useDataProxy = true;
							} else {
								ret[0]=false;ret[1] += " "+$.jgrid.errors.nourl;
							}
						}
						if (ret[0]) {
							if (rp_ge[$t.p.id].useDataProxy) {
								var dpret = $t.p.dataProxy.call($t, ajaxOptions, "del_"+$t.p.id); 
								if(dpret === undefined) {
									dpret = [true, ""];
								}
								if(dpret[0] === false ) {
									ret[0] = false;
									ret[1] = dpret[1] || "Error deleting the selected row!" ;
								} else {
									$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:p.jqModal, onClose: rp_ge[$t.p.id].onClose});
								}
							}
							else {$.ajax(ajaxOptions);}
						}
					}

					if(ret[0] === false) {
						$("#DelError>td","#"+dtbl).html(ret[1]);
						$("#DelError","#"+dtbl).show();
					}
					return false;
				});
				$("#eData", "#"+dtbl+"_2").click(function(){
					$.jgrid.hideModal("#"+$.jgrid.jqID(IDs.themodal),{gb:"#gbox_"+$.jgrid.jqID(gID),jqm:rp_ge[$t.p.id].jqModal, onClose: rp_ge[$t.p.id].onClose});
					return false;
				});
				if(onBeforeShow) {rp_ge[$t.p.id].beforeShowForm.call($t,$("#"+dtbl));}
				$.jgrid.viewModal("#"+$.jgrid.jqID(IDs.themodal),{gbox:"#gbox_"+$.jgrid.jqID(gID),jqm:rp_ge[$t.p.id].jqModal, overlay: rp_ge[$t.p.id].overlay, modal:rp_ge[$t.p.id].modal});
				if(onAfterShow) {rp_ge[$t.p.id].afterShowForm.call($t,$("#"+dtbl));}
			}
			if(rp_ge[$t.p.id].closeOnEscape===true) {
				setTimeout(function(){$(".ui-jqdialog-titlebar-close","#"+$.jgrid.jqID(IDs.modalhead)).focus();},0);
			}
		});
	},
	navGrid : function (elem, o, pEdit,pAdd,pDel,pSearch, pView) {
		o = $.extend({
			edit: true,
			editicon: "ui-icon-pencil",
			add: true,
			addicon:"ui-icon-plus",
			del: true,
			delicon:"ui-icon-trash",
			search: true,
			searchicon:"ui-icon-search",
			refresh: true,
			refreshicon:"ui-icon-refresh",
			refreshstate: 'firstpage',
			view: false,
			viewicon : "ui-icon-document",
			position : "left",
			closeOnEscape : true,
			beforeRefresh : null,
			afterRefresh : null,
			cloneToTop : false,
			alertwidth : 200,
			alertheight : 'auto',
			alerttop: null,
			alertleft: null,
			alertzIndex : null
		}, $.jgrid.nav, o ||{});
		return this.each(function() {
			if(this.nav) {return;}
			var alertIDs = {themodal: 'alertmod_' + this.p.id, modalhead: 'alerthd_' + this.p.id,modalcontent: 'alertcnt_' + this.p.id},
			$t = this, twd, tdw;
			if(!$t.grid || typeof elem !== 'string') {return;}
			if ($("#"+alertIDs.themodal)[0] === undefined) {
				if(!o.alerttop && !o.alertleft) {
					if (window.innerWidth !== undefined) {
						o.alertleft = window.innerWidth;
						o.alerttop = window.innerHeight;
					} else if (document.documentElement !== undefined && document.documentElement.clientWidth !== undefined && document.documentElement.clientWidth !== 0) {
						o.alertleft = document.documentElement.clientWidth;
						o.alerttop = document.documentElement.clientHeight;
					} else {
						o.alertleft=1024;
						o.alerttop=768;
					}
					o.alertleft = o.alertleft/2 - parseInt(o.alertwidth,10)/2;
					o.alerttop = o.alerttop/2-25;
				}
				$.jgrid.createModal(alertIDs,
					"<div>"+o.alerttext+"</div><span tabindex='0'><span tabindex='-1' id='jqg_alrt'></span></span>",
					{ 
						gbox:"#gbox_"+$.jgrid.jqID($t.p.id),
						jqModal:true,
						drag:true,
						resize:true,
						caption:o.alertcap,
						top:o.alerttop,
						left:o.alertleft,
						width:o.alertwidth,
						height: o.alertheight,
						closeOnEscape:o.closeOnEscape, 
						zIndex: o.alertzIndex
					},
					"#gview_"+$.jgrid.jqID($t.p.id),
					$("#gbox_"+$.jgrid.jqID($t.p.id))[0],
					true
				);
			}
			var clone = 1, i,
			onHoverIn = function () {
				if (!$(this).hasClass('ui-state-disabled')) {
					$(this).addClass("ui-state-hover");
				}
			},
			onHoverOut = function () {
				$(this).removeClass("ui-state-hover");
			};
			if(o.cloneToTop && $t.p.toppager) {clone = 2;}
			for(i = 0; i<clone; i++) {
				var tbd,
				navtbl = $("<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"),
				sep = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>",
				pgid, elemids;
				if(i===0) {
					pgid = elem;
					elemids = $t.p.id;
					if(pgid === $t.p.toppager) {
						elemids += "_top";
						clone = 1;
					}
				} else {
					pgid = $t.p.toppager;
					elemids = $t.p.id+"_top";
				}
				if($t.p.direction === "rtl") {$(navtbl).attr("dir","rtl").css("float","right");}
				if (o.add) {
					pAdd = pAdd || {};
					tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
					$(tbd).append("<div class='ui-pg-div'><span class='ui-icon "+o.addicon+"'></span>"+o.addtext+"</div>");
					$("tr",navtbl).append(tbd);
					$(tbd,navtbl)
					.attr({"title":o.addtitle || "",id : pAdd.id || "add_"+elemids})
					.click(function(){
						if (!$(this).hasClass('ui-state-disabled')) {
							if ($.isFunction( o.addfunc )) {
								o.addfunc.call($t);
							} else {
								$($t).jqGrid("editGridRow","new",pAdd);
							}
						}
						return false;
					}).hover(onHoverIn, onHoverOut);
					tbd = null;
				}
				if (o.edit) {
					tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
					pEdit = pEdit || {};
					$(tbd).append("<div class='ui-pg-div'><span class='ui-icon "+o.editicon+"'></span>"+o.edittext+"</div>");
					$("tr",navtbl).append(tbd);
					$(tbd,navtbl)
					.attr({"title":o.edittitle || "",id: pEdit.id || "edit_"+elemids})
					.click(function(){
						if (!$(this).hasClass('ui-state-disabled')) {
							var sr = $t.p.selrow;
							if (sr) {
								if($.isFunction( o.editfunc ) ) {
									o.editfunc.call($t, sr);
								} else {
									$($t).jqGrid("editGridRow",sr,pEdit);
								}
							} else {
								$.jgrid.viewModal("#"+alertIDs.themodal,{gbox:"#gbox_"+$.jgrid.jqID($t.p.id),jqm:true});
								$("#jqg_alrt").focus();
							}
						}
						return false;
					}).hover(onHoverIn, onHoverOut);
					tbd = null;
				}
				if (o.view) {
					tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
					pView = pView || {};
					$(tbd).append("<div class='ui-pg-div'><span class='ui-icon "+o.viewicon+"'></span>"+o.viewtext+"</div>");
					$("tr",navtbl).append(tbd);
					$(tbd,navtbl)
					.attr({"title":o.viewtitle || "",id: pView.id || "view_"+elemids})
					.click(function(){
						if (!$(this).hasClass('ui-state-disabled')) {
							var sr = $t.p.selrow;
							if (sr) {
								if($.isFunction( o.viewfunc ) ) {
									o.viewfunc.call($t, sr);
								} else {
									$($t).jqGrid("viewGridRow",sr,pView);
								}
							} else {
								$.jgrid.viewModal("#"+alertIDs.themodal,{gbox:"#gbox_"+$.jgrid.jqID($t.p.id),jqm:true});
								$("#jqg_alrt").focus();
							}
						}
						return false;
					}).hover(onHoverIn, onHoverOut);
					tbd = null;
				}
				if (o.del) {
					tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
					pDel = pDel || {};
					$(tbd).append("<div class='ui-pg-div'><span class='ui-icon "+o.delicon+"'></span>"+o.deltext+"</div>");
					$("tr",navtbl).append(tbd);
					$(tbd,navtbl)
					.attr({"title":o.deltitle || "",id: pDel.id || "del_"+elemids})
					.click(function(){
						if (!$(this).hasClass('ui-state-disabled')) {
							var dr;
							if($t.p.multiselect) {
								dr = $t.p.selarrrow;
								if(dr.length===0) {dr = null;}
							} else {
								dr = $t.p.selrow;
							}
							if(dr){
								if($.isFunction( o.delfunc )){
									o.delfunc.call($t, dr);
								}else{
									$($t).jqGrid("delGridRow",dr,pDel);
								}
							} else  {
								$.jgrid.viewModal("#"+alertIDs.themodal,{gbox:"#gbox_"+$.jgrid.jqID($t.p.id),jqm:true});$("#jqg_alrt").focus();
							}
						}
						return false;
					}).hover(onHoverIn, onHoverOut);
					tbd = null;
				}
				if(o.add || o.edit || o.del || o.view) {$("tr",navtbl).append(sep);}
				if (o.search) {
					tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
					pSearch = pSearch || {};
					$(tbd).append("<div class='ui-pg-div'><span class='ui-icon "+o.searchicon+"'></span>"+o.searchtext+"</div>");
					$("tr",navtbl).append(tbd);
					$(tbd,navtbl)
					.attr({"title":o.searchtitle  || "",id:pSearch.id || "search_"+elemids})
					.click(function(){
						if (!$(this).hasClass('ui-state-disabled')) {
							if($.isFunction( o.searchfunc )) {
								o.searchfunc.call($t, pSearch);
							} else {
								$($t).jqGrid("searchGrid",pSearch);
							}
						}
						return false;
					}).hover(onHoverIn, onHoverOut);
					if (pSearch.showOnLoad && pSearch.showOnLoad === true) {
						$(tbd,navtbl).click();
					}
					tbd = null;
				}
				if (o.refresh) {
					tbd = $("<td class='ui-pg-button ui-corner-all'></td>");
					$(tbd).append("<div class='ui-pg-div'><span class='ui-icon "+o.refreshicon+"'></span>"+o.refreshtext+"</div>");
					$("tr",navtbl).append(tbd);
					$(tbd,navtbl)
					.attr({"title":o.refreshtitle  || "",id: "refresh_"+elemids})
					.click(function(){
						if (!$(this).hasClass('ui-state-disabled')) {
							if($.isFunction(o.beforeRefresh)) {o.beforeRefresh.call($t);}
							$t.p.search = false;
							try {
								var gID = $t.p.id;
								$t.p.postData.filters ="";
								try {
								$("#fbox_"+$.jgrid.jqID(gID)).jqFilter('resetFilter');
								} catch(ef) {}
								if($.isFunction($t.clearToolbar)) {$t.clearToolbar.call($t,false);}
							} catch (e) {}
							switch (o.refreshstate) {
								case 'firstpage':
									$($t).trigger("reloadGrid", [{page:1}]);
									break;
								case 'current':
									$($t).trigger("reloadGrid", [{current:true}]);
									break;
							}
							if($.isFunction(o.afterRefresh)) {o.afterRefresh.call($t);}
						}
						return false;
					}).hover(onHoverIn, onHoverOut);
					tbd = null;
				}
				tdw = $(".ui-jqgrid").css("font-size") || "11px";
				$('body').append("<div id='testpg2' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:"+tdw+";visibility:hidden;' ></div>");
				twd = $(navtbl).clone().appendTo("#testpg2").width();
				$("#testpg2").remove();
				$(pgid+"_"+o.position,pgid).append(navtbl);
				if($t.p._nvtd) {
					if(twd > $t.p._nvtd[0] ) {
						$(pgid+"_"+o.position,pgid).width(twd);
						$t.p._nvtd[0] = twd;
					}
					$t.p._nvtd[1] = twd;
				}
				tdw =null;twd=null;navtbl =null;
				this.nav = true;
			}
		});
	},
	navButtonAdd : function (elem, p) {
		p = $.extend({
			caption : "newButton",
			title: '',
			buttonicon : 'ui-icon-newwin',
			onClickButton: null,
			position : "last",
			cursor : 'pointer'
		}, p ||{});
		return this.each(function() {
			if( !this.grid)  {return;}
			if( typeof elem === "string" && elem.indexOf("#") !== 0) {elem = "#"+$.jgrid.jqID(elem);}
			var findnav = $(".navtable",elem)[0], $t = this;
			if (findnav) {
				if( p.id && $("#"+$.jgrid.jqID(p.id), findnav)[0] !== undefined )  {return;}
				var tbd = $("<td></td>");
				if(p.buttonicon.toString().toUpperCase() === "NONE") {
                    $(tbd).addClass('ui-pg-button ui-corner-all').append("<div class='ui-pg-div'>"+p.caption+"</div>");
				} else	{
					$(tbd).addClass('ui-pg-button ui-corner-all').append("<div class='ui-pg-div'><span class='ui-icon "+p.buttonicon+"'></span>"+p.caption+"</div>");
				}
				if(p.id) {$(tbd).attr("id",p.id);}
				if(p.position==='first'){
					if(findnav.rows[0].cells.length ===0 ) {
						$("tr",findnav).append(tbd);
					} else {
						$("tr td:eq(0)",findnav).before(tbd);
					}
				} else {
					$("tr",findnav).append(tbd);
				}
				$(tbd,findnav)
				.attr("title",p.title  || "")
				.click(function(e){
					if (!$(this).hasClass('ui-state-disabled')) {
						if ($.isFunction(p.onClickButton) ) {p.onClickButton.call($t,e);}
					}
					return false;
				})
				.hover(
					function () {
						if (!$(this).hasClass('ui-state-disabled')) {
							$(this).addClass('ui-state-hover');
						}
					},
					function () {$(this).removeClass("ui-state-hover");}
				);
			}
		});
	},
	navSeparatorAdd:function (elem,p) {
		p = $.extend({
			sepclass : "ui-separator",
			sepcontent: '',
			position : "last"
		}, p ||{});
		return this.each(function() {
			if( !this.grid)  {return;}
			if( typeof elem === "string" && elem.indexOf("#") !== 0) {elem = "#"+$.jgrid.jqID(elem);}
			var findnav = $(".navtable",elem)[0];
			if(findnav) {
				var sep = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='"+p.sepclass+"'></span>"+p.sepcontent+"</td>";
				if (p.position === 'first') {
					if (findnav.rows[0].cells.length === 0) {
						$("tr", findnav).append(sep);
					} else {
						$("tr td:eq(0)", findnav).before(sep);
					}
				} else {
					$("tr", findnav).append(sep);
				}
			}
		});
	},
	GridToForm : function( rowid, formid ) {
		return this.each(function(){
			var $t = this, i;
			if (!$t.grid) {return;}
			var rowdata = $($t).jqGrid("getRowData",rowid);
			if (rowdata) {
				for(i in rowdata) {
					if(rowdata.hasOwnProperty(i)) {
					if ( $("[name="+$.jgrid.jqID(i)+"]",formid).is("input:radio") || $("[name="+$.jgrid.jqID(i)+"]",formid).is("input:checkbox"))  {
						$("[name="+$.jgrid.jqID(i)+"]",formid).each( function() {
							if( $(this).val() == rowdata[i] ) {
								$(this)[$t.p.useProp ? 'prop': 'attr']("checked",true);
							} else {
								$(this)[$t.p.useProp ? 'prop': 'attr']("checked", false);
							}
						});
					} else {
					// this is very slow on big table and form.
						$("[name="+$.jgrid.jqID(i)+"]",formid).val(rowdata[i]);
					}
				}
			}
			}
		});
	},
	FormToGrid : function(rowid, formid, mode, position){
		return this.each(function() {
			var $t = this;
			if(!$t.grid) {return;}
			if(!mode) {mode = 'set';}
			if(!position) {position = 'first';}
			var fields = $(formid).serializeArray();
			var griddata = {};
			$.each(fields, function(i, field){
				griddata[field.name] = field.value;
			});
			if(mode==='add') {$($t).jqGrid("addRowData",rowid,griddata, position);}
			else if(mode==='set') {$($t).jqGrid("setRowData",rowid,griddata);}
		});
	}
});
})(jQuery);
/*jshint eqeqeq:false, eqnull:true, devel:true */
/*global jQuery */
(function($){
/**
 * jqGrid extension for manipulating Grid Data
 * Tony Tomov tony@trirand.com
 * http://trirand.com/blog/ 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
**/ 
"use strict";
$.jgrid.inlineEdit = $.jgrid.inlineEdit || {};
$.jgrid.extend({
//Editing
	editRow : function(rowid,keys,oneditfunc,successfunc, url, extraparam, aftersavefunc,errorfunc, afterrestorefunc) {
		// Compatible mode old versions
		var o={}, args = $.makeArray(arguments).slice(1);

		if( $.type(args[0]) === "object" ) {
			o = args[0];
		} else {
			if (keys !== undefined) { o.keys = keys; }
			if ($.isFunction(oneditfunc)) { o.oneditfunc = oneditfunc; }
			if ($.isFunction(successfunc)) { o.successfunc = successfunc; }
			if (url !== undefined) { o.url = url; }
			if (extraparam !== undefined) { o.extraparam = extraparam; }
			if ($.isFunction(aftersavefunc)) { o.aftersavefunc = aftersavefunc; }
			if ($.isFunction(errorfunc)) { o.errorfunc = errorfunc; }
			if ($.isFunction(afterrestorefunc)) { o.afterrestorefunc = afterrestorefunc; }
			// last two not as param, but as object (sorry)
			//if (restoreAfterError !== undefined) { o.restoreAfterError = restoreAfterError; }
			//if (mtype !== undefined) { o.mtype = mtype || "POST"; }			
		}
		o = $.extend(true, {
			keys : false,
			oneditfunc: null,
			successfunc: null,
			url: null,
			extraparam: {},
			aftersavefunc: null,
			errorfunc: null,
			afterrestorefunc: null,
			restoreAfterError: true,
			mtype: "POST"
		}, $.jgrid.inlineEdit, o );

		// End compatible
		return this.each(function(){
			var $t = this, nm, tmp, editable, cnt=0, focus=null, svr={}, ind,cm, bfer;
			if (!$t.grid ) { return; }
			ind = $($t).jqGrid("getInd",rowid,true);
			if( ind === false ) {return;}
			bfer = $.isFunction( o.beforeEditRow ) ? o.beforeEditRow.call($t,o, rowid) :  undefined;
			if( bfer === undefined ) {
				bfer = true;
			}
			if(!bfer) { return; }
			editable = $(ind).attr("editable") || "0";
			if (editable === "0" && !$(ind).hasClass("not-editable-row")) {
				cm = $t.p.colModel;
				$('td[role="gridcell"]',ind).each( function(i) {
					nm = cm[i].name;
					var treeg = $t.p.treeGrid===true && nm === $t.p.ExpandColumn;
					if(treeg) { tmp = $("span:first",this).html();}
					else {
						try {
							tmp = $.unformat.call($t,this,{rowId:rowid, colModel:cm[i]},i);
						} catch (_) {
							tmp =  ( cm[i].edittype && cm[i].edittype === 'textarea' ) ? $(this).text() : $(this).html();
						}
					}
					if ( nm !== 'cb' && nm !== 'subgrid' && nm !== 'rn') {
						if($t.p.autoencode) { tmp = $.jgrid.htmlDecode(tmp); }
						svr[nm]=tmp;
						if(cm[i].editable===true) {
							if(focus===null) { focus = i; }
							if (treeg) { $("span:first",this).html(""); }
							else { $(this).html(""); }
							var opt = $.extend({},cm[i].editoptions || {},{id:rowid+"_"+nm,name:nm});
							if(!cm[i].edittype) { cm[i].edittype = "text"; }
							if(tmp === "&nbsp;" || tmp === "&#160;" || (tmp.length===1 && tmp.charCodeAt(0)===160) ) {tmp='';}
							var elc = $.jgrid.createEl.call($t,cm[i].edittype,opt,tmp,true,$.extend({},$.jgrid.ajaxOptions,$t.p.ajaxSelectOptions || {}));
							$(elc).addClass("editable");
							if(treeg) { $("span:first",this).append(elc); }
							else { $(this).append(elc); }
							$.jgrid.bindEv.call($t, elc, opt);
							//Again IE
							if(cm[i].edittype === "select" && cm[i].editoptions!==undefined && cm[i].editoptions.multiple===true  && cm[i].editoptions.dataUrl===undefined && $.jgrid.msie) {
								$(elc).width($(elc).width());
							}
							cnt++;
						}
					}
				});
				if(cnt > 0) {
					svr.id = rowid; $t.p.savedRow.push(svr);
					$(ind).attr("editable","1");
					$("td:eq("+focus+") input",ind).focus();
					if(o.keys===true) {
						$(ind).bind("keydown",function(e) {
							if (e.keyCode === 27) {
								$($t).jqGrid("restoreRow",rowid, o.afterrestorefunc);
								if($t.p._inlinenav) {
									try {
										$($t).jqGrid('showAddEditButtons');
									} catch (eer1) {}
								}
								return false;
							}
							if (e.keyCode === 13) {
								var ta = e.target;
								if(ta.tagName === 'TEXTAREA') { return true; }
								if( $($t).jqGrid("saveRow", rowid, o ) ) {
									if($t.p._inlinenav) {
										try {
											$($t).jqGrid('showAddEditButtons');
										} catch (eer2) {}
									}
								}
								return false;
							}
						});
					}
					$($t).triggerHandler("jqGridInlineEditRow", [rowid, o]);
					if( $.isFunction(o.oneditfunc)) { o.oneditfunc.call($t, rowid); }
				}
			}
		});
	},
	saveRow : function(rowid, successfunc, url, extraparam, aftersavefunc,errorfunc, afterrestorefunc) {
		// Compatible mode old versions
		var args = $.makeArray(arguments).slice(1), o = {};

		if( $.type(args[0]) === "object" ) {
			o = args[0];
		} else {
			if ($.isFunction(successfunc)) { o.successfunc = successfunc; }
			if (url !== undefined) { o.url = url; }
			if (extraparam !== undefined) { o.extraparam = extraparam; }
			if ($.isFunction(aftersavefunc)) { o.aftersavefunc = aftersavefunc; }
			if ($.isFunction(errorfunc)) { o.errorfunc = errorfunc; }
			if ($.isFunction(afterrestorefunc)) { o.afterrestorefunc = afterrestorefunc; }
		}
		o = $.extend(true, {
			successfunc: null,
			url: null,
			extraparam: {},
			aftersavefunc: null,
			errorfunc: null,
			afterrestorefunc: null,
			restoreAfterError: true,
			mtype: "POST"
		}, $.jgrid.inlineEdit, o );
		// End compatible

		var success = false;
		var $t = this[0], nm, tmp={}, tmp2={}, tmp3= {}, editable, fr, cv, ind;
		if (!$t.grid ) { return success; }
		ind = $($t).jqGrid("getInd",rowid,true);
		if(ind === false) {return success;}
		var bfsr = $.isFunction( o.beforeSaveRow ) ?	o.beforeSaveRow.call($t,o, rowid) :  undefined;
		if( bfsr === undefined ) {
			bfsr = true;
		}
		if(!bfsr) { return; }
		editable = $(ind).attr("editable");
		o.url = o.url || $t.p.editurl;
		if (editable==="1") {
			var cm;
			$('td[role="gridcell"]',ind).each(function(i) {
				cm = $t.p.colModel[i];
				nm = cm.name;
				if ( nm !== 'cb' && nm !== 'subgrid' && cm.editable===true && nm !== 'rn' && !$(this).hasClass('not-editable-cell')) {
					switch (cm.edittype) {
						case "checkbox":
							var cbv = ["Yes","No"];
							if(cm.editoptions ) {
								cbv = cm.editoptions.value.split(":");
							}
							tmp[nm]=  $("input",this).is(":checked") ? cbv[0] : cbv[1]; 
							break;
						case 'text':
						case 'password':
						case 'textarea':
						case "button" :
							tmp[nm]=$("input, textarea",this).val();
							break;
						case 'select':
							if(!cm.editoptions.multiple) {
								tmp[nm] = $("select option:selected",this).val();
								tmp2[nm] = $("select option:selected", this).text();
							} else {
								var sel = $("select",this), selectedText = [];
								tmp[nm] = $(sel).val();
								if(tmp[nm]) { tmp[nm]= tmp[nm].join(","); } else { tmp[nm] =""; }
								$("select option:selected",this).each(
									function(i,selected){
										selectedText[i] = $(selected).text();
									}
								);
								tmp2[nm] = selectedText.join(",");
							}
							if(cm.formatter && cm.formatter === 'select') { tmp2={}; }
							break;
						case 'custom' :
							try {
								if(cm.editoptions && $.isFunction(cm.editoptions.custom_value)) {
									tmp[nm] = cm.editoptions.custom_value.call($t, $(".customelement",this),'get');
									if (tmp[nm] === undefined) { throw "e2"; }
								} else { throw "e1"; }
							} catch (e) {
								if (e==="e1") { $.jgrid.info_dialog($.jgrid.errors.errcap,"function 'custom_value' "+$.jgrid.edit.msg.nodefined,$.jgrid.edit.bClose); }
								if (e==="e2") { $.jgrid.info_dialog($.jgrid.errors.errcap,"function 'custom_value' "+$.jgrid.edit.msg.novalue,$.jgrid.edit.bClose); }
								else { $.jgrid.info_dialog($.jgrid.errors.errcap,e.message,$.jgrid.edit.bClose); }
							}
							break;
					}
					cv = $.jgrid.checkValues.call($t,tmp[nm],i);
					if(cv[0] === false) {
						return false;
					}
					if($t.p.autoencode) { tmp[nm] = $.jgrid.htmlEncode(tmp[nm]); }
					if(o.url !== 'clientArray' && cm.editoptions && cm.editoptions.NullIfEmpty === true) {
						if(tmp[nm] === "") {
							tmp3[nm] = 'null';
						}
					}
				}
			});
			if (cv[0] === false){
				try {
					var tr = $($t).jqGrid('getGridRowById', rowid), positions = $.jgrid.findPos(tr);
					$.jgrid.info_dialog($.jgrid.errors.errcap,cv[1],$.jgrid.edit.bClose,{left:positions[0],top:positions[1]+$(tr).outerHeight()});
				} catch (e) {
					alert(cv[1]);
				}
				return success;
			}
			var idname, opers = $t.p.prmNames, oldRowId = rowid;
			if ($t.p.keyIndex === false) {
				idname = opers.id;
			} else {
				idname = $t.p.colModel[$t.p.keyIndex +
					($t.p.rownumbers === true ? 1 : 0) +
					($t.p.multiselect === true ? 1 : 0) +
					($t.p.subGrid === true ? 1 : 0)].name;
			}
			if(tmp) {
				tmp[opers.oper] = opers.editoper;
				if (tmp[idname] === undefined || tmp[idname]==="") {
					tmp[idname] = rowid;
				} else if (ind.id !== $t.p.idPrefix + tmp[idname]) {
					// rename rowid
					var oldid = $.jgrid.stripPref($t.p.idPrefix, rowid);
					if ($t.p._index[oldid] !== undefined) {
						$t.p._index[tmp[idname]] = $t.p._index[oldid];
						delete $t.p._index[oldid];
					}
					rowid = $t.p.idPrefix + tmp[idname];
					$(ind).attr("id", rowid);
					if ($t.p.selrow === oldRowId) {
						$t.p.selrow = rowid;
					}
					if ($.isArray($t.p.selarrrow)) {
						var i = $.inArray(oldRowId, $t.p.selarrrow);
						if (i>=0) {
							$t.p.selarrrow[i] = rowid;
						}
					}
					if ($t.p.multiselect) {
						var newCboxId = "jqg_" + $t.p.id + "_" + rowid;
						$("input.cbox",ind)
							.attr("id", newCboxId)
							.attr("name", newCboxId);
					}
					// TODO: to test the case of frozen columns
				}
				if($t.p.inlineData === undefined) { $t.p.inlineData ={}; }
				tmp = $.extend({},tmp,$t.p.inlineData,o.extraparam);
			}
			if (o.url === 'clientArray') {
				tmp = $.extend({},tmp, tmp2);
				if($t.p.autoencode) {
					$.each(tmp,function(n,v){
						tmp[n] = $.jgrid.htmlDecode(v);
					});
				}
				var k, resp = $($t).jqGrid("setRowData",rowid,tmp);
				$(ind).attr("editable","0");
				for(k=0;k<$t.p.savedRow.length;k++) {
					if( String($t.p.savedRow[k].id) === String(oldRowId)) {fr = k; break;}
				}
				if(fr >= 0) { $t.p.savedRow.splice(fr,1); }
				$($t).triggerHandler("jqGridInlineAfterSaveRow", [rowid, resp, tmp, o]);
				if( $.isFunction(o.aftersavefunc) ) { o.aftersavefunc.call($t, rowid,resp, o); }
				success = true;
				$(ind).removeClass("jqgrid-new-row").unbind("keydown");
			} else {
				$("#lui_"+$.jgrid.jqID($t.p.id)).show();
				tmp3 = $.extend({},tmp,tmp3);
				tmp3[idname] = $.jgrid.stripPref($t.p.idPrefix, tmp3[idname]);
				$.ajax($.extend({
					url:o.url,
					data: $.isFunction($t.p.serializeRowData) ? $t.p.serializeRowData.call($t, tmp3) : tmp3,
					type: o.mtype,
					async : false, //?!?
					complete: function(res,stat){
						$("#lui_"+$.jgrid.jqID($t.p.id)).hide();
						if (stat === "success"){
							var ret = true, sucret, k;
							sucret = $($t).triggerHandler("jqGridInlineSuccessSaveRow", [res, rowid, o]);
							if (!$.isArray(sucret)) {sucret = [true, tmp];}
							if (sucret[0] && $.isFunction(o.successfunc)) {sucret = o.successfunc.call($t, res);}							
							if($.isArray(sucret)) {
								// expect array - status, data, rowid
								ret = sucret[0];
								tmp = sucret[1] || tmp;
							} else {
								ret = sucret;
							}
							if (ret===true) {
								if($t.p.autoencode) {
									$.each(tmp,function(n,v){
										tmp[n] = $.jgrid.htmlDecode(v);
									});
								}
								tmp = $.extend({},tmp, tmp2);
								$($t).jqGrid("setRowData",rowid,tmp);
								$(ind).attr("editable","0");
								for(k=0;k<$t.p.savedRow.length;k++) {
									if( String($t.p.savedRow[k].id) === String(rowid)) {fr = k; break;}
								}
								if(fr >= 0) { $t.p.savedRow.splice(fr,1); }
								$($t).triggerHandler("jqGridInlineAfterSaveRow", [rowid, res, tmp, o]);
								if( $.isFunction(o.aftersavefunc) ) { o.aftersavefunc.call($t, rowid,res); }
								success = true;
								$(ind).removeClass("jqgrid-new-row").unbind("keydown");
							} else {
								$($t).triggerHandler("jqGridInlineErrorSaveRow", [rowid, res, stat, null, o]);
								if($.isFunction(o.errorfunc) ) {
									o.errorfunc.call($t, rowid, res, stat, null);
								}
								if(o.restoreAfterError === true) {
									$($t).jqGrid("restoreRow",rowid, o.afterrestorefunc);
								}
							}
						}
					},
					error:function(res,stat,err){
						$("#lui_"+$.jgrid.jqID($t.p.id)).hide();
						$($t).triggerHandler("jqGridInlineErrorSaveRow", [rowid, res, stat, err, o]);
						if($.isFunction(o.errorfunc) ) {
							o.errorfunc.call($t, rowid, res, stat, err);
						} else {
							var rT = res.responseText || res.statusText;
							try {
								$.jgrid.info_dialog($.jgrid.errors.errcap,'<div class="ui-state-error">'+ rT +'</div>', $.jgrid.edit.bClose,{buttonalign:'right'});
							} catch(e) {
								alert(rT);
							}
						}
						if(o.restoreAfterError === true) {
							$($t).jqGrid("restoreRow",rowid, o.afterrestorefunc);
						}
					}
				}, $.jgrid.ajaxOptions, $t.p.ajaxRowOptions || {}));
			}
		}
		return success;
	},
	restoreRow : function(rowid, afterrestorefunc) {
		// Compatible mode old versions
		var args = $.makeArray(arguments).slice(1), o={};

		if( $.type(args[0]) === "object" ) {
			o = args[0];
		} else {
			if ($.isFunction(afterrestorefunc)) { o.afterrestorefunc = afterrestorefunc; }
		}
		o = $.extend(true, {}, $.jgrid.inlineEdit, o );

		// End compatible

		return this.each(function(){
			var $t= this, fr, ind, ares={}, k;
			if (!$t.grid ) { return; }
			ind = $($t).jqGrid("getInd",rowid,true);
			if(ind === false) {return;}
			var bfcr = $.isFunction( o.beforeCancelRow ) ?	o.beforeCancelRow.call($t,cancelPrm, sr) :  undefined;
			if( bfcr === undefined ) {
				bfcr = true;
			}
			if(!bfcr) { return; }
			for(k=0;k<$t.p.savedRow.length;k++) {
				if( String($t.p.savedRow[k].id) === String(rowid)) {fr = k; break;}
			}
			if(fr >= 0) {
				if($.isFunction($.fn.datepicker)) {
					try {
						$("input.hasDatepicker","#"+$.jgrid.jqID(ind.id)).datepicker('hide');
					} catch (e) {}
				}
				$.each($t.p.colModel, function(){
					if(this.editable === true && $t.p.savedRow[fr].hasOwnProperty(this.name)) {
						ares[this.name] = $t.p.savedRow[fr][this.name];
					}
				});
				$($t).jqGrid("setRowData",rowid,ares);
				$(ind).attr("editable","0").unbind("keydown");
				$t.p.savedRow.splice(fr,1);
				if($("#"+$.jgrid.jqID(rowid), "#"+$.jgrid.jqID($t.p.id)).hasClass("jqgrid-new-row")){
					setTimeout(function(){
						$($t).jqGrid("delRowData",rowid);
						$($t).jqGrid('showAddEditButtons');
					},0);
				}
			}
			$($t).triggerHandler("jqGridInlineAfterRestoreRow", [rowid]);
			if ($.isFunction(o.afterrestorefunc))
			{
				o.afterrestorefunc.call($t, rowid);
			}
		});
	},
	addRow : function ( p ) {
		p = $.extend(true, {
			rowID : null,
			initdata : {},
			position :"first",
			useDefValues : true,
			useFormatter : false,
			addRowParams : {extraparam:{}}
		},p  || {});
		return this.each(function(){
			if (!this.grid ) { return; }
			var $t = this;
			var bfar = $.isFunction( p.beforeAddRow ) ?	p.beforeAddRow.call($t,p.addRowParams) :  undefined;
			if( bfar === undefined ) {
				bfar = true;
			}
			if(!bfar) { return; }
			p.rowID = $.isFunction(p.rowID) ? p.rowID.call($t, p) : ( (p.rowID != null) ? p.rowID : $.jgrid.randId());
			if(p.useDefValues === true) {
				$($t.p.colModel).each(function(){
					if( this.editoptions && this.editoptions.defaultValue ) {
						var opt = this.editoptions.defaultValue,
						tmp = $.isFunction(opt) ? opt.call($t) : opt;
						p.initdata[this.name] = tmp;
					}
				});
			}
			$($t).jqGrid('addRowData', p.rowID, p.initdata, p.position);
			p.rowID = $t.p.idPrefix + p.rowID;
			$("#"+$.jgrid.jqID(p.rowID), "#"+$.jgrid.jqID($t.p.id)).addClass("jqgrid-new-row");
			if(p.useFormatter) {
				$("#"+$.jgrid.jqID(p.rowID)+" .ui-inline-edit", "#"+$.jgrid.jqID($t.p.id)).click();
			} else {
				var opers = $t.p.prmNames,
				oper = opers.oper;
				p.addRowParams.extraparam[oper] = opers.addoper;
				$($t).jqGrid('editRow', p.rowID, p.addRowParams);
				$($t).jqGrid('setSelection', p.rowID);
			}
		});
	},
	inlineNav : function (elem, o) {
		o = $.extend(true,{
			edit: true,
			editicon: "ui-icon-pencil",
			add: true,
			addicon:"ui-icon-plus",
			save: true,
			saveicon:"ui-icon-disk",
			cancel: true,
			cancelicon:"ui-icon-cancel",
			addParams : {addRowParams: {extraparam: {}}},
			editParams : {},
			restoreAfterSelect : true
		}, $.jgrid.nav, o ||{});
		return this.each(function(){
			if (!this.grid ) { return; }
			var $t = this, onSelect, gID = $.jgrid.jqID($t.p.id);
			$t.p._inlinenav = true;
			// detect the formatactions column
			if(o.addParams.useFormatter === true) {
				var cm = $t.p.colModel,i;
				for (i = 0; i<cm.length; i++) {
					if(cm[i].formatter && cm[i].formatter === "actions" ) {
						if(cm[i].formatoptions) {
							var defaults =  {
								keys:false,
								onEdit : null,
								onSuccess: null,
								afterSave:null,
								onError: null,
								afterRestore: null,
								extraparam: {},
								url: null
							},
							ap = $.extend( defaults, cm[i].formatoptions );
							o.addParams.addRowParams = {
								"keys" : ap.keys,
								"oneditfunc" : ap.onEdit,
								"successfunc" : ap.onSuccess,
								"url" : ap.url,
								"extraparam" : ap.extraparam,
								"aftersavefunc" : ap.afterSave,
								"errorfunc": ap.onError,
								"afterrestorefunc" : ap.afterRestore
							};
						}
						break;
					}
				}
			}
			if(o.add) {
				$($t).jqGrid('navButtonAdd', elem,{
					caption : o.addtext,
					title : o.addtitle,
					buttonicon : o.addicon,
					id : $t.p.id+"_iladd",
					onClickButton : function () {
						$($t).jqGrid('addRow', o.addParams);
						if(!o.addParams.useFormatter) {
							$("#"+gID+"_ilsave").removeClass('ui-state-disabled');
							$("#"+gID+"_ilcancel").removeClass('ui-state-disabled');
							$("#"+gID+"_iladd").addClass('ui-state-disabled');
							$("#"+gID+"_iledit").addClass('ui-state-disabled');
						}
					}
				});
			}
			if(o.edit) {
				$($t).jqGrid('navButtonAdd', elem,{
					caption : o.edittext,
					title : o.edittitle,
					buttonicon : o.editicon,
					id : $t.p.id+"_iledit",
					onClickButton : function () {
						var sr = $($t).jqGrid('getGridParam','selrow');
						if(sr) {
							$($t).jqGrid('editRow', sr, o.editParams);
							$("#"+gID+"_ilsave").removeClass('ui-state-disabled');
							$("#"+gID+"_ilcancel").removeClass('ui-state-disabled');
							$("#"+gID+"_iladd").addClass('ui-state-disabled');
							$("#"+gID+"_iledit").addClass('ui-state-disabled');
						} else {
							$.jgrid.viewModal("#alertmod",{gbox:"#gbox_"+gID,jqm:true});$("#jqg_alrt").focus();							
						}
					}
				});
			}
			if(o.save) {
				$($t).jqGrid('navButtonAdd', elem,{
					caption : o.savetext || '',
					title : o.savetitle || 'Save row',
					buttonicon : o.saveicon,
					id : $t.p.id+"_ilsave",
					onClickButton : function () {
						var sr = $t.p.savedRow[0].id;
						if(sr) {
							var opers = $t.p.prmNames,
							oper = opers.oper, tmpParams = {};
							if($("#"+$.jgrid.jqID(sr), "#"+gID ).hasClass("jqgrid-new-row")) {
								o.addParams.addRowParams.extraparam[oper] = opers.addoper;
								tmpParams = o.addParams.addRowParams;
							} else {
								if(!o.editParams.extraparam) {
									o.editParams.extraparam = {};
								}
								o.editParams.extraparam[oper] = opers.editoper;
								tmpParams = o.editParams;
							}
							if( $($t).jqGrid('saveRow', sr, tmpParams) ) {
								$($t).jqGrid('showAddEditButtons');
							}
						} else {
							$.jgrid.viewModal("#alertmod",{gbox:"#gbox_"+gID,jqm:true});$("#jqg_alrt").focus();							
						}
					}
				});
				$("#"+gID+"_ilsave").addClass('ui-state-disabled');
			}
			if(o.cancel) {
				$($t).jqGrid('navButtonAdd', elem,{
					caption : o.canceltext || '',
					title : o.canceltitle || 'Cancel row editing',
					buttonicon : o.cancelicon,
					id : $t.p.id+"_ilcancel",
					onClickButton : function () {
						var sr = $t.p.savedRow[0].id, cancelPrm = {};
						if(sr) {
							if($("#"+$.jgrid.jqID(sr), "#"+gID ).hasClass("jqgrid-new-row")) {
								cancelPrm = o.addParams.addRowParams;
							} else {
								cancelPrm = o.editParams;
							}
							$($t).jqGrid('restoreRow', sr, cancelPrm);
							$($t).jqGrid('showAddEditButtons');
						} else {
							$.jgrid.viewModal("#alertmod",{gbox:"#gbox_"+gID,jqm:true});$("#jqg_alrt").focus();							
						}
					}
				});
				$("#"+gID+"_ilcancel").addClass('ui-state-disabled');
			}
			if(o.restoreAfterSelect === true) {
				if($.isFunction($t.p.beforeSelectRow)) {
					onSelect = $t.p.beforeSelectRow;
				} else {
					onSelect =  false;
				}
				$t.p.beforeSelectRow = function(id, stat) {
					var ret = true;
					if($t.p.savedRow.length > 0 && $t.p._inlinenav===true && ( id !== $t.p.selrow && $t.p.selrow !==null) ) {
						if($t.p.selrow === o.addParams.rowID ) {
							$($t).jqGrid('delRowData', $t.p.selrow);
						} else {
							$($t).jqGrid('restoreRow', $t.p.selrow, o.editParams);
						}
						$($t).jqGrid('showAddEditButtons');
					}
					if(onSelect) {
						ret = onSelect.call($t, id, stat);
					}
					return ret;
				};
			}

		});
	},
	showAddEditButtons : function()  {
		return this.each(function(){
			if (!this.grid ) { return; }
			var gID = $.jgrid.jqID(this.p.id);
			$("#"+gID+"_ilsave").addClass('ui-state-disabled');
			$("#"+gID+"_ilcancel").addClass('ui-state-disabled');
			$("#"+gID+"_iladd").removeClass('ui-state-disabled');
			$("#"+gID+"_iledit").removeClass('ui-state-disabled');
		});
	}
//end inline edit
});
})(jQuery);
/*jshint eqeqeq:false */
/*global jQuery */
(function($){
/*
**
 * jqGrid extension for cellediting Grid Data
 * Tony Tomov tony@trirand.com
 * http://trirand.com/blog/ 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
**/ 
/**
 * all events and options here are aded anonynous and not in the base grid
 * since the array is to big. Here is the order of execution.
 * From this point we use jQuery isFunction
 * formatCell
 * beforeEditCell,
 * onSelectCell (used only for noneditable cels)
 * afterEditCell,
 * beforeSaveCell, (called before validation of values if any)
 * beforeSubmitCell (if cellsubmit remote (ajax))
 * afterSubmitCell(if cellsubmit remote (ajax)),
 * afterSaveCell,
 * errorCell,
 * serializeCellData - new
 * Options
 * cellsubmit (remote,clientArray) (added in grid options)
 * cellurl
 * ajaxCellOptions
* */
"use strict";
$.jgrid.extend({
	editCell : function (iRow,iCol, ed){
		return this.each(function (){
			var $t = this, nm, tmp,cc, cm;
			if (!$t.grid || $t.p.cellEdit !== true) {return;}
			iCol = parseInt(iCol,10);
			// select the row that can be used for other methods
			$t.p.selrow = $t.rows[iRow].id;
			if (!$t.p.knv) {$($t).jqGrid("GridNav");}
			// check to see if we have already edited cell
			if ($t.p.savedRow.length>0) {
				// prevent second click on that field and enable selects
				if (ed===true ) {
					if(iRow == $t.p.iRow && iCol == $t.p.iCol){
						return;
					}
				}
				// save the cell
				$($t).jqGrid("saveCell",$t.p.savedRow[0].id,$t.p.savedRow[0].ic);
			} else {
				window.setTimeout(function () { $("#"+$.jgrid.jqID($t.p.knv)).attr("tabindex","-1").focus();},0);
			}
			cm = $t.p.colModel[iCol];
			nm = cm.name;
			if (nm==='subgrid' || nm==='cb' || nm==='rn') {return;}
			cc = $("td:eq("+iCol+")",$t.rows[iRow]);
			if (cm.editable===true && ed===true && !cc.hasClass("not-editable-cell")) {
				if(parseInt($t.p.iCol,10)>=0  && parseInt($t.p.iRow,10)>=0) {
					$("td:eq("+$t.p.iCol+")",$t.rows[$t.p.iRow]).removeClass("edit-cell ui-state-highlight");
					$($t.rows[$t.p.iRow]).removeClass("selected-row ui-state-hover");
				}
				$(cc).addClass("edit-cell ui-state-highlight");
				$($t.rows[iRow]).addClass("selected-row ui-state-hover");
				try {
					tmp =  $.unformat.call($t,cc,{rowId: $t.rows[iRow].id, colModel:cm},iCol);
				} catch (_) {
					tmp = ( cm.edittype && cm.edittype === 'textarea' ) ? $(cc).text() : $(cc).html();
				}
				if($t.p.autoencode) { tmp = $.jgrid.htmlDecode(tmp); }
				if (!cm.edittype) {cm.edittype = "text";}
				$t.p.savedRow.push({id:iRow,ic:iCol,name:nm,v:tmp});
				if(tmp === "&nbsp;" || tmp === "&#160;" || (tmp.length===1 && tmp.charCodeAt(0)===160) ) {tmp='';}
				if($.isFunction($t.p.formatCell)) {
					var tmp2 = $t.p.formatCell.call($t, $t.rows[iRow].id,nm,tmp,iRow,iCol);
					if(tmp2 !== undefined ) {tmp = tmp2;}
				}
				$($t).triggerHandler("jqGridBeforeEditCell", [$t.rows[iRow].id, nm, tmp, iRow, iCol]);
				if ($.isFunction($t.p.beforeEditCell)) {
					$t.p.beforeEditCell.call($t, $t.rows[iRow].id,nm,tmp,iRow,iCol);
				}
				var opt = $.extend({}, cm.editoptions || {} ,{id:iRow+"_"+nm,name:nm});
				var elc = $.jgrid.createEl.call($t,cm.edittype,opt,tmp,true,$.extend({},$.jgrid.ajaxOptions,$t.p.ajaxSelectOptions || {}));
				$(cc).html("").append(elc).attr("tabindex","0");
				$.jgrid.bindEv.call($t, elc, opt);
				window.setTimeout(function () { $(elc).focus();},0);
				$("input, select, textarea",cc).bind("keydown",function(e) {
					if (e.keyCode === 27) {
						if($("input.hasDatepicker",cc).length >0) {
							if( $(".ui-datepicker").is(":hidden") )  { $($t).jqGrid("restoreCell",iRow,iCol); }
							else { $("input.hasDatepicker",cc).datepicker('hide'); }
						} else {
							$($t).jqGrid("restoreCell",iRow,iCol);
						}
					} //ESC
					if (e.keyCode === 13) {
						$($t).jqGrid("saveCell",iRow,iCol);
						// Prevent default action
						return false;
					} //Enter
					if (e.keyCode === 9)  {
						if(!$t.grid.hDiv.loading ) {
							if (e.shiftKey) {$($t).jqGrid("prevCell",iRow,iCol);} //Shift TAb
							else {$($t).jqGrid("nextCell",iRow,iCol);} //Tab
						} else {
							return false;
						}
					}
					e.stopPropagation();
				});
				$($t).triggerHandler("jqGridAfterEditCell", [$t.rows[iRow].id, nm, tmp, iRow, iCol]);
				if ($.isFunction($t.p.afterEditCell)) {
					$t.p.afterEditCell.call($t, $t.rows[iRow].id,nm,tmp,iRow,iCol);
				}
			} else {
				if (parseInt($t.p.iCol,10)>=0  && parseInt($t.p.iRow,10)>=0) {
					$("td:eq("+$t.p.iCol+")",$t.rows[$t.p.iRow]).removeClass("edit-cell ui-state-highlight");
					$($t.rows[$t.p.iRow]).removeClass("selected-row ui-state-hover");
				}
				cc.addClass("edit-cell ui-state-highlight");
				$($t.rows[iRow]).addClass("selected-row ui-state-hover");
				tmp = cc.html().replace(/\&#160\;/ig,'');
				$($t).triggerHandler("jqGridSelectCell", [$t.rows[iRow].id, nm, tmp, iRow, iCol]);
				if ($.isFunction($t.p.onSelectCell)) {
					$t.p.onSelectCell.call($t, $t.rows[iRow].id,nm,tmp,iRow,iCol);
				}
			}
			$t.p.iCol = iCol; $t.p.iRow = iRow;
		});
	},
	saveCell : function (iRow, iCol){
		return this.each(function(){
			var $t= this, fr;
			if (!$t.grid || $t.p.cellEdit !== true) {return;}
			if ( $t.p.savedRow.length >= 1) {fr = 0;} else {fr=null;} 
			if(fr !== null) {
				var cc = $("td:eq("+iCol+")",$t.rows[iRow]),v,v2,
				cm = $t.p.colModel[iCol], nm = cm.name, nmjq = $.jgrid.jqID(nm) ;
				switch (cm.edittype) {
					case "select":
						if(!cm.editoptions.multiple) {
							v = $("#"+iRow+"_"+nmjq+" option:selected",$t.rows[iRow]).val();
							v2 = $("#"+iRow+"_"+nmjq+" option:selected",$t.rows[iRow]).text();
						} else {
							var sel = $("#"+iRow+"_"+nmjq,$t.rows[iRow]), selectedText = [];
							v = $(sel).val();
							if(v) { v.join(",");} else { v=""; }
							$("option:selected",sel).each(
								function(i,selected){
									selectedText[i] = $(selected).text();
								}
							);
							v2 = selectedText.join(",");
						}
						if(cm.formatter) { v2 = v; }
						break;
					case "checkbox":
						var cbv  = ["Yes","No"];
						if(cm.editoptions){
							cbv = cm.editoptions.value.split(":");
						}
						v = $("#"+iRow+"_"+nmjq,$t.rows[iRow]).is(":checked") ? cbv[0] : cbv[1];
						v2=v;
						break;
					case "password":
					case "text":
					case "textarea":
					case "button" :
						v = $("#"+iRow+"_"+nmjq,$t.rows[iRow]).val();
						v2=v;
						break;
					case 'custom' :
						try {
							if(cm.editoptions && $.isFunction(cm.editoptions.custom_value)) {
								v = cm.editoptions.custom_value.call($t, $(".customelement",cc),'get');
								if (v===undefined) { throw "e2";} else { v2=v; }
							} else { throw "e1"; }
						} catch (e) {
							if (e==="e1") { $.jgrid.info_dialog($.jgrid.errors.errcap,"function 'custom_value' "+$.jgrid.edit.msg.nodefined,$.jgrid.edit.bClose); }
							if (e==="e2") { $.jgrid.info_dialog($.jgrid.errors.errcap,"function 'custom_value' "+$.jgrid.edit.msg.novalue,$.jgrid.edit.bClose); }
							else {$.jgrid.info_dialog($.jgrid.errors.errcap,e.message,$.jgrid.edit.bClose); }
						}
						break;
				}
				// The common approach is if nothing changed do not do anything
				if (v2 !== $t.p.savedRow[fr].v){
					var vvv = $($t).triggerHandler("jqGridBeforeSaveCell", [$t.rows[iRow].id, nm, v, iRow, iCol]);
					if (vvv) {v = vvv; v2=vvv;}
					if ($.isFunction($t.p.beforeSaveCell)) {
						var vv = $t.p.beforeSaveCell.call($t, $t.rows[iRow].id,nm, v, iRow,iCol);
						if (vv) {v = vv; v2=vv;}
					}
					var cv = $.jgrid.checkValues.call($t,v,iCol);
					if(cv[0] === true) {
						var addpost = $($t).triggerHandler("jqGridBeforeSubmitCell", [$t.rows[iRow].id, nm, v, iRow, iCol]) || {};
						if ($.isFunction($t.p.beforeSubmitCell)) {
							addpost = $t.p.beforeSubmitCell.call($t, $t.rows[iRow].id,nm, v, iRow,iCol);
							if (!addpost) {addpost={};}
						}
						if( $("input.hasDatepicker",cc).length >0) { $("input.hasDatepicker",cc).datepicker('hide'); }
						if ($t.p.cellsubmit === 'remote') {
							if ($t.p.cellurl) {
								var postdata = {};
								if($t.p.autoencode) { v = $.jgrid.htmlEncode(v); }
								postdata[nm] = v;
								var idname,oper, opers;
								opers = $t.p.prmNames;
								idname = opers.id;
								oper = opers.oper;
								postdata[idname] = $.jgrid.stripPref($t.p.idPrefix, $t.rows[iRow].id);
								postdata[oper] = opers.editoper;
								postdata = $.extend(addpost,postdata);
								$("#lui_"+$.jgrid.jqID($t.p.id)).show();
								$t.grid.hDiv.loading = true;
								$.ajax( $.extend( {
									url: $t.p.cellurl,
									data :$.isFunction($t.p.serializeCellData) ? $t.p.serializeCellData.call($t, postdata) : postdata,
									type: "POST",
									complete: function (result, stat) {
										$("#lui_"+$t.p.id).hide();
										$t.grid.hDiv.loading = false;
										if (stat === 'success') {
											var ret = $($t).triggerHandler("jqGridAfterSubmitCell", [$t, result, postdata.id, nm, v, iRow, iCol]) || [true, ''];
											if (ret[0] === true && $.isFunction($t.p.afterSubmitCell)) {
												ret = $t.p.afterSubmitCell.call($t, result,postdata.id,nm,v,iRow,iCol);
											}
											if(ret[0] === true){
												$(cc).empty();
												$($t).jqGrid("setCell",$t.rows[iRow].id, iCol, v2, false, false, true);
												$(cc).addClass("dirty-cell");
												$($t.rows[iRow]).addClass("edited");
												$($t).triggerHandler("jqGridAfterSaveCell", [$t.rows[iRow].id, nm, v, iRow, iCol]);
												if ($.isFunction($t.p.afterSaveCell)) {
													$t.p.afterSaveCell.call($t, $t.rows[iRow].id,nm, v, iRow,iCol);
												}
												$t.p.savedRow.splice(0,1);
											} else {
												$.jgrid.info_dialog($.jgrid.errors.errcap,ret[1],$.jgrid.edit.bClose);
												$($t).jqGrid("restoreCell",iRow,iCol);
											}
										}
									},
									error:function(res,stat,err) {
										$("#lui_"+$.jgrid.jqID($t.p.id)).hide();
										$t.grid.hDiv.loading = false;
										$($t).triggerHandler("jqGridErrorCell", [res, stat, err]);
										if ($.isFunction($t.p.errorCell)) {
											$t.p.errorCell.call($t, res,stat,err);
											$($t).jqGrid("restoreCell",iRow,iCol);
										} else {
											$.jgrid.info_dialog($.jgrid.errors.errcap,res.status+" : "+res.statusText+"<br/>"+stat,$.jgrid.edit.bClose);
											$($t).jqGrid("restoreCell",iRow,iCol);
										}
									}
								}, $.jgrid.ajaxOptions, $t.p.ajaxCellOptions || {}));
							} else {
								try {
									$.jgrid.info_dialog($.jgrid.errors.errcap,$.jgrid.errors.nourl,$.jgrid.edit.bClose);
									$($t).jqGrid("restoreCell",iRow,iCol);
								} catch (e) {}
							}
						}
						if ($t.p.cellsubmit === 'clientArray') {
							$(cc).empty();
							$($t).jqGrid("setCell",$t.rows[iRow].id,iCol, v2, false, false, true);
							$(cc).addClass("dirty-cell");
							$($t.rows[iRow]).addClass("edited");
							$($t).triggerHandler("jqGridAfterSaveCell", [$t.rows[iRow].id, nm, v, iRow, iCol]);
							if ($.isFunction($t.p.afterSaveCell)) {
								$t.p.afterSaveCell.call($t, $t.rows[iRow].id,nm, v, iRow,iCol);
							}
							$t.p.savedRow.splice(0,1);
						}
					} else {
						try {
							window.setTimeout(function(){$.jgrid.info_dialog($.jgrid.errors.errcap,v+" "+cv[1],$.jgrid.edit.bClose);},100);
							$($t).jqGrid("restoreCell",iRow,iCol);
						} catch (e) {}
					}
				} else {
					$($t).jqGrid("restoreCell",iRow,iCol);
				}
			}
			window.setTimeout(function () { $("#"+$.jgrid.jqID($t.p.knv)).attr("tabindex","-1").focus();},0);
		});
	},
	restoreCell : function(iRow, iCol) {
		return this.each(function(){
			var $t= this, fr;
			if (!$t.grid || $t.p.cellEdit !== true ) {return;}
			if ( $t.p.savedRow.length >= 1) {fr = 0;} else {fr=null;}
			if(fr !== null) {
				var cc = $("td:eq("+iCol+")",$t.rows[iRow]);
				// datepicker fix
				if($.isFunction($.fn.datepicker)) {
					try {
						$("input.hasDatepicker",cc).datepicker('hide');
					} catch (e) {}
				}
				$(cc).empty().attr("tabindex","-1");
				$($t).jqGrid("setCell",$t.rows[iRow].id, iCol, $t.p.savedRow[fr].v, false, false, true);
				$($t).triggerHandler("jqGridAfterRestoreCell", [$t.rows[iRow].id, $t.p.savedRow[fr].v, iRow, iCol]);
				if ($.isFunction($t.p.afterRestoreCell)) {
					$t.p.afterRestoreCell.call($t, $t.rows[iRow].id, $t.p.savedRow[fr].v, iRow, iCol);
				}				
				$t.p.savedRow.splice(0,1);
			}
			window.setTimeout(function () { $("#"+$t.p.knv).attr("tabindex","-1").focus();},0);
		});
	},
	nextCell : function (iRow,iCol) {
		return this.each(function (){
			var $t = this, nCol=false, i;
			if (!$t.grid || $t.p.cellEdit !== true) {return;}
			// try to find next editable cell
			for (i=iCol+1; i<$t.p.colModel.length; i++) {
				if ( $t.p.colModel[i].editable ===true) {
					nCol = i; break;
				}
			}
			if(nCol !== false) {
				$($t).jqGrid("editCell",iRow,nCol,true);
			} else {
				if ($t.p.savedRow.length >0) {
					$($t).jqGrid("saveCell",iRow,iCol);
				}
			}
		});
	},
	prevCell : function (iRow,iCol) {
		return this.each(function (){
			var $t = this, nCol=false, i;
			if (!$t.grid || $t.p.cellEdit !== true) {return;}
			// try to find next editable cell
			for (i=iCol-1; i>=0; i--) {
				if ( $t.p.colModel[i].editable ===true) {
					nCol = i; break;
				}
			}
			if(nCol !== false) {
				$($t).jqGrid("editCell",iRow,nCol,true);
			} else {
				if ($t.p.savedRow.length >0) {
					$($t).jqGrid("saveCell",iRow,iCol);
				}
			}
		});
	},
	GridNav : function() {
		return this.each(function () {
			var  $t = this;
			if (!$t.grid || $t.p.cellEdit !== true ) {return;}
			// trick to process keydown on non input elements
			$t.p.knv = $t.p.id + "_kn";
			var selection = $("<div style='position:fixed;top:0px;width:1px;height:1px;' tabindex='0'><div tabindex='-1' style='width:1px;height:1px;' id='"+$t.p.knv+"'></div></div>"),
			i, kdir;
			function scrollGrid(iR, iC, tp){
				if (tp.substr(0,1)==='v') {
					var ch = $($t.grid.bDiv)[0].clientHeight,
					st = $($t.grid.bDiv)[0].scrollTop,
					nROT = $t.rows[iR].offsetTop+$t.rows[iR].clientHeight,
					pROT = $t.rows[iR].offsetTop;
					if(tp === 'vd') {
						if(nROT >= ch) {
							$($t.grid.bDiv)[0].scrollTop = $($t.grid.bDiv)[0].scrollTop + $t.rows[iR].clientHeight;
						}
					}
					if(tp === 'vu'){
						if (pROT < st ) {
							$($t.grid.bDiv)[0].scrollTop = $($t.grid.bDiv)[0].scrollTop - $t.rows[iR].clientHeight;
						}
					}
				}
				if(tp==='h') {
					var cw = $($t.grid.bDiv)[0].clientWidth,
					sl = $($t.grid.bDiv)[0].scrollLeft,
					nCOL = $t.rows[iR].cells[iC].offsetLeft+$t.rows[iR].cells[iC].clientWidth,
					pCOL = $t.rows[iR].cells[iC].offsetLeft;
					if(nCOL >= cw+parseInt(sl,10)) {
						$($t.grid.bDiv)[0].scrollLeft = $($t.grid.bDiv)[0].scrollLeft + $t.rows[iR].cells[iC].clientWidth;
					} else if (pCOL < sl) {
						$($t.grid.bDiv)[0].scrollLeft = $($t.grid.bDiv)[0].scrollLeft - $t.rows[iR].cells[iC].clientWidth;
					}
				}
			}
			function findNextVisible(iC,act){
				var ind, i;
				if(act === 'lft') {
					ind = iC+1;
					for (i=iC;i>=0;i--){
						if ($t.p.colModel[i].hidden !== true) {
							ind = i;
							break;
						}
					}
				}
				if(act === 'rgt') {
					ind = iC-1;
					for (i=iC; i<$t.p.colModel.length;i++){
						if ($t.p.colModel[i].hidden !== true) {
							ind = i;
							break;
						}						
					}
				}
				return ind;
			}

			$(selection).insertBefore($t.grid.cDiv);
			$("#"+$t.p.knv)
			.focus()
			.keydown(function (e){
				kdir = e.keyCode;
				if($t.p.direction === "rtl") {
					if(kdir===37) { kdir = 39;}
					else if (kdir===39) { kdir = 37; }
				}
				switch (kdir) {
					case 38:
						if ($t.p.iRow-1 >0 ) {
							scrollGrid($t.p.iRow-1,$t.p.iCol,'vu');
							$($t).jqGrid("editCell",$t.p.iRow-1,$t.p.iCol,false);
						}
					break;
					case 40 :
						if ($t.p.iRow+1 <=  $t.rows.length-1) {
							scrollGrid($t.p.iRow+1,$t.p.iCol,'vd');
							$($t).jqGrid("editCell",$t.p.iRow+1,$t.p.iCol,false);
						}
					break;
					case 37 :
						if ($t.p.iCol -1 >=  0) {
							i = findNextVisible($t.p.iCol-1,'lft');
							scrollGrid($t.p.iRow, i,'h');
							$($t).jqGrid("editCell",$t.p.iRow, i,false);
						}
					break;
					case 39 :
						if ($t.p.iCol +1 <=  $t.p.colModel.length-1) {
							i = findNextVisible($t.p.iCol+1,'rgt');
							scrollGrid($t.p.iRow,i,'h');
							$($t).jqGrid("editCell",$t.p.iRow,i,false);
						}
					break;
					case 13:
						if (parseInt($t.p.iCol,10)>=0 && parseInt($t.p.iRow,10)>=0) {
							$($t).jqGrid("editCell",$t.p.iRow,$t.p.iCol,true);
						}
					break;
					default :
						return true;
				}
				return false;
			});
		});
	},
	getChangedCells : function (mthd) {
		var ret=[];
		if (!mthd) {mthd='all';}
		this.each(function(){
			var $t= this,nm;
			if (!$t.grid || $t.p.cellEdit !== true ) {return;}
			$($t.rows).each(function(j){
				var res = {};
				if ($(this).hasClass("edited")) {
					$('td',this).each( function(i) {
						nm = $t.p.colModel[i].name;
						if ( nm !== 'cb' && nm !== 'subgrid') {
							if (mthd==='dirty') {
								if ($(this).hasClass('dirty-cell')) {
									try {
										res[nm] = $.unformat.call($t,this,{rowId:$t.rows[j].id, colModel:$t.p.colModel[i]},i);
									} catch (e){
										res[nm] = $.jgrid.htmlDecode($(this).html());
									}
								}
							} else {
								try {
									res[nm] = $.unformat.call($t,this,{rowId:$t.rows[j].id,colModel:$t.p.colModel[i]},i);
								} catch (e) {
									res[nm] = $.jgrid.htmlDecode($(this).html());
								}
							}
						}
					});
					res.id = this.id;
					ret.push(res);
				}
			});
		});
		return ret;
	}
/// end  cell editing
});
})(jQuery);
/*jshint eqeqeq:false */
/*global jQuery */
(function($){
/**
 * jqGrid extension for SubGrid Data
 * Tony Tomov tony@trirand.com
 * http://trirand.com/blog/ 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
**/
"use strict";
$.jgrid.extend({
setSubGrid : function () {
	return this.each(function (){
		var $t = this, cm, i,
		suboptions = {
			plusicon : "ui-icon-plus",
			minusicon : "ui-icon-minus",
			openicon: "ui-icon-carat-1-sw",
			expandOnLoad:  false,
			delayOnLoad : 50,
			selectOnExpand : false,
			selectOnCollapse : false,
			reloadOnExpand : true
		};
		$t.p.subGridOptions = $.extend(suboptions, $t.p.subGridOptions || {});
		$t.p.colNames.unshift("");
		$t.p.colModel.unshift({name:'subgrid',width: $.jgrid.cell_width ?  $t.p.subGridWidth+$t.p.cellLayout : $t.p.subGridWidth,sortable: false,resizable:false,hidedlg:true,search:false,fixed:true});
		cm = $t.p.subGridModel;
		if(cm[0]) {
			cm[0].align = $.extend([],cm[0].align || []);
			for(i=0;i<cm[0].name.length;i++) { cm[0].align[i] = cm[0].align[i] || 'left';}
		}
	});
},
addSubGridCell :function (pos,iRow) {
	var prp='',ic,sid;
	this.each(function(){
		prp = this.formatCol(pos,iRow);
		sid= this.p.id;
		ic = this.p.subGridOptions.plusicon;
	});
	return "<td role=\"gridcell\" aria-describedby=\""+sid+"_subgrid\" class=\"ui-sgcollapsed sgcollapsed\" "+prp+"><a style='cursor:pointer;'><span class='ui-icon "+ic+"'></span></a></td>";
},
addSubGrid : function( pos, sind ) {
	return this.each(function(){
		var ts = this;
		if (!ts.grid ) { return; }
		//-------------------------
		var subGridCell = function(trdiv,cell,pos)
		{
			var tddiv = $("<td align='"+ts.p.subGridModel[0].align[pos]+"'></td>").html(cell);
			$(trdiv).append(tddiv);
		};
		var subGridXml = function(sjxml, sbid){
			var tddiv, i,  sgmap,
			dummy = $("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
			trdiv = $("<tr></tr>");
			for (i = 0; i<ts.p.subGridModel[0].name.length; i++) {
				tddiv = $("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-"+ts.p.direction+"'></th>");
				$(tddiv).html(ts.p.subGridModel[0].name[i]);
				$(tddiv).width( ts.p.subGridModel[0].width[i]);
				$(trdiv).append(tddiv);
			}
			$(dummy).append(trdiv);
			if (sjxml){
				sgmap = ts.p.xmlReader.subgrid;
				$(sgmap.root+" "+sgmap.row, sjxml).each( function(){
					trdiv = $("<tr class='ui-widget-content ui-subtblcell'></tr>");
					if(sgmap.repeatitems === true) {
						$(sgmap.cell,this).each( function(i) {
							subGridCell(trdiv, $(this).text() || '&#160;',i);
						});
					} else {
						var f = ts.p.subGridModel[0].mapping || ts.p.subGridModel[0].name;
						if (f) {
							for (i=0;i<f.length;i++) {
								subGridCell(trdiv, $(f[i],this).text() || '&#160;',i);
							}
						}
					}
					$(dummy).append(trdiv);
				});
			}
			var pID = $("table:first",ts.grid.bDiv).attr("id")+"_";
			$("#"+$.jgrid.jqID(pID+sbid)).append(dummy);
			ts.grid.hDiv.loading = false;
			$("#load_"+$.jgrid.jqID(ts.p.id)).hide();
			return false;
		};
		var subGridJson = function(sjxml, sbid){
			var tddiv,result,i,cur, sgmap,j,
			dummy = $("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
			trdiv = $("<tr></tr>");
			for (i = 0; i<ts.p.subGridModel[0].name.length; i++) {
				tddiv = $("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-"+ts.p.direction+"'></th>");
				$(tddiv).html(ts.p.subGridModel[0].name[i]);
				$(tddiv).width( ts.p.subGridModel[0].width[i]);
				$(trdiv).append(tddiv);
			}
			$(dummy).append(trdiv);
			if (sjxml){
				sgmap = ts.p.jsonReader.subgrid;
				result = $.jgrid.getAccessor(sjxml, sgmap.root);
				if ( result !== undefined ) {
					for (i=0;i<result.length;i++) {
						cur = result[i];
						trdiv = $("<tr class='ui-widget-content ui-subtblcell'></tr>");
						if(sgmap.repeatitems === true) {
							if(sgmap.cell) { cur=cur[sgmap.cell]; }
							for (j=0;j<cur.length;j++) {
								subGridCell(trdiv, cur[j] || '&#160;',j);
							}
						} else {
							var f = ts.p.subGridModel[0].mapping || ts.p.subGridModel[0].name;
							if(f.length) {
								for (j=0;j<f.length;j++) {
									subGridCell(trdiv, cur[f[j]] || '&#160;',j);
								}
							}
						}
						$(dummy).append(trdiv);
					}
				}
			}
			var pID = $("table:first",ts.grid.bDiv).attr("id")+"_";
			$("#"+$.jgrid.jqID(pID+sbid)).append(dummy);
			ts.grid.hDiv.loading = false;
			$("#load_"+$.jgrid.jqID(ts.p.id)).hide();
			return false;
		};
		var populatesubgrid = function( rd )
		{
			var sid,dp, i, j;
			sid = $(rd).attr("id");
			dp = {nd_: (new Date().getTime())};
			dp[ts.p.prmNames.subgridid]=sid;
			if(!ts.p.subGridModel[0]) { return false; }
			if(ts.p.subGridModel[0].params) {
				for(j=0; j < ts.p.subGridModel[0].params.length; j++) {
					for(i=0; i<ts.p.colModel.length; i++) {
						if(ts.p.colModel[i].name === ts.p.subGridModel[0].params[j]) {
							dp[ts.p.colModel[i].name]= $("td:eq("+i+")",rd).text().replace(/\&#160\;/ig,'');
						}
					}
				}
			}
			if(!ts.grid.hDiv.loading) {
				ts.grid.hDiv.loading = true;
				$("#load_"+$.jgrid.jqID(ts.p.id)).show();
				if(!ts.p.subgridtype) { ts.p.subgridtype = ts.p.datatype; }
				if($.isFunction(ts.p.subgridtype)) {
					ts.p.subgridtype.call(ts, dp);
				} else {
					ts.p.subgridtype = ts.p.subgridtype.toLowerCase();
				}
				switch(ts.p.subgridtype) {
					case "xml":
					case "json":
					$.ajax($.extend({
						type:ts.p.mtype,
						url: ts.p.subGridUrl,
						dataType:ts.p.subgridtype,
						data: $.isFunction(ts.p.serializeSubGridData)? ts.p.serializeSubGridData.call(ts, dp) : dp,
						complete: function(sxml) {
							if(ts.p.subgridtype === "xml") {
								subGridXml(sxml.responseXML, sid);
							} else {
								subGridJson($.jgrid.parse(sxml.responseText),sid);
							}
							sxml=null;
						}
					}, $.jgrid.ajaxOptions, ts.p.ajaxSubgridOptions || {}));
					break;
				}
			}
			return false;
		};
		var _id, pID,atd, nhc=0, bfsc, r;
		$.each(ts.p.colModel,function(){
			if(this.hidden === true || this.name === 'rn' || this.name === 'cb') {
				nhc++;
			}
		});
		var len = ts.rows.length, i=1;
		if( sind !== undefined && sind > 0) {
			i = sind;
			len = sind+1;
		}
		while(i < len) {
			if($(ts.rows[i]).hasClass('jqgrow')) {
				$(ts.rows[i].cells[pos]).bind('click', function() {
					var tr = $(this).parent("tr")[0];
					r = tr.nextSibling;
					if($(this).hasClass("sgcollapsed")) {
						pID = ts.p.id;
						_id = tr.id;
						if(ts.p.subGridOptions.reloadOnExpand === true || ( ts.p.subGridOptions.reloadOnExpand === false && !$(r).hasClass('ui-subgrid') ) ) {
							atd = pos >=1 ? "<td colspan='"+pos+"'>&#160;</td>":"";
							bfsc = $(ts).triggerHandler("jqGridSubGridBeforeExpand", [pID + "_" + _id, _id]);
							bfsc = (bfsc === false || bfsc === 'stop') ? false : true;
							if(bfsc && $.isFunction(ts.p.subGridBeforeExpand)) {
								bfsc = ts.p.subGridBeforeExpand.call(ts, pID+"_"+_id,_id);
							}
							if(bfsc === false) {return false;}
							$(tr).after( "<tr role='row' class='ui-subgrid'>"+atd+"<td class='ui-widget-content subgrid-cell'><span class='ui-icon "+ts.p.subGridOptions.openicon+"'></span></td><td colspan='"+parseInt(ts.p.colNames.length-1-nhc,10)+"' class='ui-widget-content subgrid-data'><div id="+pID+"_"+_id+" class='tablediv'></div></td></tr>" );
							$(ts).triggerHandler("jqGridSubGridRowExpanded", [pID + "_" + _id, _id]);
							if( $.isFunction(ts.p.subGridRowExpanded)) {
								ts.p.subGridRowExpanded.call(ts, pID+"_"+ _id,_id);
							} else {
								populatesubgrid(tr);
							}
						} else {
							$(r).show();
						}
						$(this).html("<a style='cursor:pointer;'><span class='ui-icon "+ts.p.subGridOptions.minusicon+"'></span></a>").removeClass("sgcollapsed").addClass("sgexpanded");
						if(ts.p.subGridOptions.selectOnExpand) {
							$(ts).jqGrid('setSelection',_id);
						}
					} else if($(this).hasClass("sgexpanded")) {
						bfsc = $(ts).triggerHandler("jqGridSubGridRowColapsed", [pID + "_" + _id, _id]);
						bfsc = (bfsc === false || bfsc === 'stop') ? false : true;
						_id = tr.id;
						if( bfsc &&  $.isFunction(ts.p.subGridRowColapsed)) {
							bfsc = ts.p.subGridRowColapsed.call(ts, pID+"_"+_id,_id );
						}
						if(bfsc===false) {return false;}
						if(ts.p.subGridOptions.reloadOnExpand === true) {
							$(r).remove(".ui-subgrid");
						} else if($(r).hasClass('ui-subgrid')) { // incase of dynamic deleting
							$(r).hide();
						}
						$(this).html("<a style='cursor:pointer;'><span class='ui-icon "+ts.p.subGridOptions.plusicon+"'></span></a>").removeClass("sgexpanded").addClass("sgcollapsed");
						if(ts.p.subGridOptions.selectOnCollapse) {
							$(ts).jqGrid('setSelection',_id);
						}
					}
					return false;
				});
			}
			i++;
		}
		if(ts.p.subGridOptions.expandOnLoad === true) {
			$(ts.rows).filter('.jqgrow').each(function(index,row){
				$(row.cells[0]).click();
			});
		}
		ts.subGridXml = function(xml,sid) {subGridXml(xml,sid);};
		ts.subGridJson = function(json,sid) {subGridJson(json,sid);};
	});
},
expandSubGridRow : function(rowid) {
	return this.each(function () {
		var $t = this;
		if(!$t.grid && !rowid) {return;}
		if($t.p.subGrid===true) {
			var rc = $(this).jqGrid("getInd",rowid,true);
			if(rc) {
				var sgc = $("td.sgcollapsed",rc)[0];
				if(sgc) {
					$(sgc).trigger("click");
				}
			}
		}
	});
},
collapseSubGridRow : function(rowid) {
	return this.each(function () {
		var $t = this;
		if(!$t.grid && !rowid) {return;}
		if($t.p.subGrid===true) {
			var rc = $(this).jqGrid("getInd",rowid,true);
			if(rc) {
				var sgc = $("td.sgexpanded",rc)[0];
				if(sgc) {
					$(sgc).trigger("click");
				}
			}
		}
	});
},
toggleSubGridRow : function(rowid) {
	return this.each(function () {
		var $t = this;
		if(!$t.grid && !rowid) {return;}
		if($t.p.subGrid===true) {
			var rc = $(this).jqGrid("getInd",rowid,true);
			if(rc) {
				var sgc = $("td.sgcollapsed",rc)[0];
				if(sgc) {
					$(sgc).trigger("click");
				} else {
					sgc = $("td.sgexpanded",rc)[0];
					if(sgc) {
						$(sgc).trigger("click");
					}
				}
			}
		}
	});
}
});
})(jQuery);
/**
 * jqGrid extension - Tree Grid
 * Tony Tomov tony@trirand.com
 * http://trirand.com/blog/
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
**/

/*jshint eqeqeq:false */
/*global jQuery */
(function($) {
"use strict";
$.jgrid.extend({
	setTreeNode : function(i, len){
		return this.each(function(){
			var $t = this;
			if( !$t.grid || !$t.p.treeGrid ) {return;}
			var expCol = $t.p.expColInd,
			expanded = $t.p.treeReader.expanded_field,
			isLeaf = $t.p.treeReader.leaf_field,
			level = $t.p.treeReader.level_field,
			icon = $t.p.treeReader.icon_field,
			loaded = $t.p.treeReader.loaded,  lft, rgt, curLevel, ident,lftpos, twrap,
			ldat, lf;
			while(i<len) {
				var ind = $.jgrid.stripPref($t.p.idPrefix, $t.rows[i].id), dind = $t.p._index[ind], expan;
				ldat = $t.p.data[dind];
				//$t.rows[i].level = ldat[level];
				if($t.p.treeGridModel === 'nested') {
					if(!ldat[isLeaf]) {
					lft = parseInt(ldat[$t.p.treeReader.left_field],10);
					rgt = parseInt(ldat[$t.p.treeReader.right_field],10);
					// NS Model
						ldat[isLeaf] = (rgt === lft+1) ? 'true' : 'false';
						$t.rows[i].cells[$t.p._treeleafpos].innerHTML = ldat[isLeaf];
					}
				}
				//else {
					//row.parent_id = rd[$t.p.treeReader.parent_id_field];
				//}
				curLevel = parseInt(ldat[level],10);
				if($t.p.tree_root_level === 0) {
					ident = curLevel+1;
					lftpos = curLevel;
				} else {
					ident = curLevel;
					lftpos = curLevel -1;
				}
				twrap = "<div class='tree-wrap tree-wrap-"+$t.p.direction+"' style='width:"+(ident*18)+"px;'>";
				twrap += "<div style='"+($t.p.direction==="rtl" ? "right:" : "left:")+(lftpos*18)+"px;' class='ui-icon ";


				if(ldat[loaded] !== undefined) {
					if(ldat[loaded]==="true" || ldat[loaded]===true) {
						ldat[loaded] = true;
					} else {
						ldat[loaded] = false;
					}
				}
				if(ldat[isLeaf] === "true" || ldat[isLeaf] === true) {
					twrap += ((ldat[icon] !== undefined && ldat[icon] !== "") ? ldat[icon] : $t.p.treeIcons.leaf)+" tree-leaf treeclick";
					ldat[isLeaf] = true;
					lf="leaf";
				} else {
					ldat[isLeaf] = false;
					lf="";
				}
				ldat[expanded] = ((ldat[expanded] === "true" || ldat[expanded] === true) ? true : false) && (ldat[loaded] || ldat[loaded] === undefined);
				if(ldat[expanded] === false) {
					twrap += ((ldat[isLeaf] === true) ? "'" : $t.p.treeIcons.plus+" tree-plus treeclick'");
				} else {
					twrap += ((ldat[isLeaf] === true) ? "'" : $t.p.treeIcons.minus+" tree-minus treeclick'");
				}
				
				twrap += "></div></div>";
				$($t.rows[i].cells[expCol]).wrapInner("<span class='cell-wrapper"+lf+"'></span>").prepend(twrap);

				if(curLevel !== parseInt($t.p.tree_root_level,10)) {
					var pn = $($t).jqGrid('getNodeParent',ldat);
					expan = pn && pn.hasOwnProperty(expanded) ? pn[expanded] : true;
					if( !expan ){
						$($t.rows[i]).css("display","none");
					}
				}
				$($t.rows[i].cells[expCol])
					.find("div.treeclick")
					.bind("click",function(e){
						var target = e.target || e.srcElement,
						ind2 =$.jgrid.stripPref($t.p.idPrefix,$(target,$t.rows).closest("tr.jqgrow")[0].id),
						pos = $t.p._index[ind2];
						if(!$t.p.data[pos][isLeaf]){
							if($t.p.data[pos][expanded]){
								$($t).jqGrid("collapseRow",$t.p.data[pos]);
								$($t).jqGrid("collapseNode",$t.p.data[pos]);
							} else {
								$($t).jqGrid("expandRow",$t.p.data[pos]);
								$($t).jqGrid("expandNode",$t.p.data[pos]);
							}
						}
						return false;
					});
				if($t.p.ExpandColClick === true) {
					$($t.rows[i].cells[expCol])
						.find("span.cell-wrapper")
						.css("cursor","pointer")
						.bind("click",function(e) {
							var target = e.target || e.srcElement,
							ind2 =$.jgrid.stripPref($t.p.idPrefix,$(target,$t.rows).closest("tr.jqgrow")[0].id),
							pos = $t.p._index[ind2];
							if(!$t.p.data[pos][isLeaf]){
								if($t.p.data[pos][expanded]){
									$($t).jqGrid("collapseRow",$t.p.data[pos]);
									$($t).jqGrid("collapseNode",$t.p.data[pos]);
								} else {
									$($t).jqGrid("expandRow",$t.p.data[pos]);
									$($t).jqGrid("expandNode",$t.p.data[pos]);
								}
							}
							$($t).jqGrid("setSelection",ind2);
							return false;
						});
				}
				i++;
			}

		});
	},
	setTreeGrid : function() {
		return this.each(function (){
			var $t = this, i=0, pico, ecol = false, nm, key, tkey, dupcols=[];
			if(!$t.p.treeGrid) {return;}
			if(!$t.p.treedatatype ) {$.extend($t.p,{treedatatype: $t.p.datatype});}
			$t.p.subGrid = false;$t.p.altRows =false;
			$t.p.pgbuttons = false;$t.p.pginput = false;
			$t.p.gridview =  true;
			if($t.p.rowTotal === null ) { $t.p.rowNum = 10000; }
			$t.p.multiselect = false;$t.p.rowList = [];
			$t.p.expColInd = 0;
			pico = 'ui-icon-triangle-1-' + ($t.p.direction==="rtl" ? 'w' : 'e');
			$t.p.treeIcons = $.extend({plus:pico,minus:'ui-icon-triangle-1-s',leaf:'ui-icon-radio-off'},$t.p.treeIcons || {});
			if($t.p.treeGridModel === 'nested') {
				$t.p.treeReader = $.extend({
					level_field: "level",
					left_field:"lft",
					right_field: "rgt",
					leaf_field: "isLeaf",
					expanded_field: "expanded",
					loaded: "loaded",
					icon_field: "icon"
				},$t.p.treeReader);
			} else if($t.p.treeGridModel === 'adjacency') {
				$t.p.treeReader = $.extend({
						level_field: "level",
						parent_id_field: "parent",
						leaf_field: "isLeaf",
						expanded_field: "expanded",
						loaded: "loaded",
						icon_field: "icon"
				},$t.p.treeReader );
			}
			for ( key in $t.p.colModel){
				if($t.p.colModel.hasOwnProperty(key)) {
					nm = $t.p.colModel[key].name;
					if( nm === $t.p.ExpandColumn && !ecol ) {
						ecol = true;
						$t.p.expColInd = i;
					}
					i++;
					//
					for(tkey in $t.p.treeReader) {
						if($t.p.treeReader.hasOwnProperty(tkey) && $t.p.treeReader[tkey] === nm) {
							dupcols.push(nm);
						}
					}
				}
			}
			$.each($t.p.treeReader,function(j,n){
				if(n && $.inArray(n, dupcols) === -1){
					if(j==='leaf_field') { $t.p._treeleafpos= i; }
				i++;
					$t.p.colNames.push(n);
					$t.p.colModel.push({name:n,width:1,hidden:true,sortable:false,resizable:false,hidedlg:true,editable:true,search:false});
				}
			});			
		});
	},
	expandRow: function (record){
		this.each(function(){
			var $t = this;
			if(!$t.grid || !$t.p.treeGrid) {return;}
			var childern = $($t).jqGrid("getNodeChildren",record),
			//if ($($t).jqGrid("isVisibleNode",record)) {
			expanded = $t.p.treeReader.expanded_field;
			$(childern).each(function(){
				var id  = $t.p.idPrefix + $.jgrid.getAccessor(this,$t.p.localReader.id);
				$($($t).jqGrid('getGridRowById', id)).css("display","");
				if(this[expanded]) {
					$($t).jqGrid("expandRow",this);
				}
			});
			//}
		});
	},
	collapseRow : function (record) {
		this.each(function(){
			var $t = this;
			if(!$t.grid || !$t.p.treeGrid) {return;}
			var childern = $($t).jqGrid("getNodeChildren",record),
			expanded = $t.p.treeReader.expanded_field;
			$(childern).each(function(){
				var id  = $t.p.idPrefix + $.jgrid.getAccessor(this,$t.p.localReader.id);
				$($($t).jqGrid('getGridRowById', id)).css("display","none");
				if(this[expanded]){
					$($t).jqGrid("collapseRow",this);
				}
			});
		});
	},
	// NS ,adjacency models
	getRootNodes : function() {
		var result = [];
		this.each(function(){
			var $t = this;
			if(!$t.grid || !$t.p.treeGrid) {return;}
			switch ($t.p.treeGridModel) {
				case 'nested' :
					var level = $t.p.treeReader.level_field;
					$($t.p.data).each(function(){
						if(parseInt(this[level],10) === parseInt($t.p.tree_root_level,10)) {
							result.push(this);
						}
					});
					break;
				case 'adjacency' :
					var parent_id = $t.p.treeReader.parent_id_field;
					$($t.p.data).each(function(){
						if(this[parent_id] === null || String(this[parent_id]).toLowerCase() === "null") {
							result.push(this);
						}
					});
					break;
			}
		});
		return result;
	},
	getNodeDepth : function(rc) {
		var ret = null;
		this.each(function(){
			if(!this.grid || !this.p.treeGrid) {return;}
			var $t = this;
			switch ($t.p.treeGridModel) {
				case 'nested' :
					var level = $t.p.treeReader.level_field;
					ret = parseInt(rc[level],10) - parseInt($t.p.tree_root_level,10);
					break;
				case 'adjacency' :
					ret = $($t).jqGrid("getNodeAncestors",rc).length;
					break;
			}
		});
		return ret;
	},
	getNodeParent : function(rc) {
		var result = null;
		this.each(function(){
			var $t = this;
			if(!$t.grid || !$t.p.treeGrid) {return;}
			switch ($t.p.treeGridModel) {
				case 'nested' :
					var lftc = $t.p.treeReader.left_field,
					rgtc = $t.p.treeReader.right_field,
					levelc = $t.p.treeReader.level_field,
					lft = parseInt(rc[lftc],10), rgt = parseInt(rc[rgtc],10), level = parseInt(rc[levelc],10);
					$(this.p.data).each(function(){
						if(parseInt(this[levelc],10) === level-1 && parseInt(this[lftc],10) < lft && parseInt(this[rgtc],10) > rgt) {
							result = this;
							return false;
						}
					});
					break;
				case 'adjacency' :
					var parent_id = $t.p.treeReader.parent_id_field,
					dtid = $t.p.localReader.id;
					$(this.p.data).each(function(){
						if(this[dtid] === $.jgrid.stripPref($t.p.idPrefix, rc[parent_id]) ) {
							result = this;
							return false;
						}
					});
					break;
			}
		});
		return result;
	},
	getNodeChildren : function(rc) {
		var result = [];
		this.each(function(){
			var $t = this;
			if(!$t.grid || !$t.p.treeGrid) {return;}
			switch ($t.p.treeGridModel) {
				case 'nested' :
					var lftc = $t.p.treeReader.left_field,
					rgtc = $t.p.treeReader.right_field,
					levelc = $t.p.treeReader.level_field,
					lft = parseInt(rc[lftc],10), rgt = parseInt(rc[rgtc],10), level = parseInt(rc[levelc],10);
					$(this.p.data).each(function(){
						if(parseInt(this[levelc],10) === level+1 && parseInt(this[lftc],10) > lft && parseInt(this[rgtc],10) < rgt) {
							result.push(this);
						}
					});
					break;
				case 'adjacency' :
					var parent_id = $t.p.treeReader.parent_id_field,
					dtid = $t.p.localReader.id;
					$(this.p.data).each(function(){
						if(this[parent_id] == $.jgrid.stripPref($t.p.idPrefix, rc[dtid])) {
							result.push(this);
						}
					});
					break;
			}
		});
		return result;
	},
	getFullTreeNode : function(rc) {
		var result = [];
		this.each(function(){
			var $t = this, len;
			if(!$t.grid || !$t.p.treeGrid) {return;}
			switch ($t.p.treeGridModel) {
				case 'nested' :
					var lftc = $t.p.treeReader.left_field,
					rgtc = $t.p.treeReader.right_field,
					levelc = $t.p.treeReader.level_field,
					lft = parseInt(rc[lftc],10), rgt = parseInt(rc[rgtc],10), level = parseInt(rc[levelc],10);
					$(this.p.data).each(function(){
						if(parseInt(this[levelc],10) >= level && parseInt(this[lftc],10) >= lft && parseInt(this[lftc],10) <= rgt) {
							result.push(this);
						}
					});
					break;
				case 'adjacency' :
					if(rc) {
					result.push(rc);
					var parent_id = $t.p.treeReader.parent_id_field,
					dtid = $t.p.localReader.id;
					$(this.p.data).each(function(i){
						len = result.length;
						for (i = 0; i < len; i++) {
							if ($.jgrid.stripPref($t.p.idPrefix, result[i][dtid]) === this[parent_id]) {
								result.push(this);
								break;
							}
						}
					});
					}
					break;
			}
		});
		return result;
	},	
	// End NS, adjacency Model
	getNodeAncestors : function(rc) {
		var ancestors = [];
		this.each(function(){
			if(!this.grid || !this.p.treeGrid) {return;}
			var parent = $(this).jqGrid("getNodeParent",rc);
			while (parent) {
				ancestors.push(parent);
				parent = $(this).jqGrid("getNodeParent",parent);	
			}
		});
		return ancestors;
	},
	isVisibleNode : function(rc) {
		var result = true;
		this.each(function(){
			var $t = this;
			if(!$t.grid || !$t.p.treeGrid) {return;}
			var ancestors = $($t).jqGrid("getNodeAncestors",rc),
			expanded = $t.p.treeReader.expanded_field;
			$(ancestors).each(function(){
				result = result && this[expanded];
				if(!result) {return false;}
			});
		});
		return result;
	},
	isNodeLoaded : function(rc) {
		var result;
		this.each(function(){
			var $t = this;
			if(!$t.grid || !$t.p.treeGrid) {return;}
			var isLeaf = $t.p.treeReader.leaf_field,
			loaded = $t.p.treeReader.loaded;
			if(rc !== undefined ) {
				if(rc[loaded] !== undefined) {
					result = rc[loaded];
				} else if( rc[isLeaf] || $($t).jqGrid("getNodeChildren",rc).length > 0){
					result = true;
				} else {
					result = false;
				}
			} else {
				result = false;
			}
		});
		return result;
	},
	expandNode : function(rc) {
		return this.each(function(){
			if(!this.grid || !this.p.treeGrid) {return;}
			var expanded = this.p.treeReader.expanded_field,
			parent = this.p.treeReader.parent_id_field,
			loaded = this.p.treeReader.loaded,
			level = this.p.treeReader.level_field,
			lft = this.p.treeReader.left_field,
			rgt = this.p.treeReader.right_field;

			if(!rc[expanded]) {
				var id = $.jgrid.getAccessor(rc,this.p.localReader.id);
				var rc1 = $("#" + this.p.idPrefix + $.jgrid.jqID(id),this.grid.bDiv)[0];
				var position = this.p._index[id];
				if( $(this).jqGrid("isNodeLoaded",this.p.data[position]) ) {
					rc[expanded] = true;
					$("div.treeclick",rc1).removeClass(this.p.treeIcons.plus+" tree-plus").addClass(this.p.treeIcons.minus+" tree-minus");
				} else if (!this.grid.hDiv.loading) {
					rc[expanded] = true;
					$("div.treeclick",rc1).removeClass(this.p.treeIcons.plus+" tree-plus").addClass(this.p.treeIcons.minus+" tree-minus");
					this.p.treeANode = rc1.rowIndex;
					this.p.datatype = this.p.treedatatype;
					if(this.p.treeGridModel === 'nested') {
						$(this).jqGrid("setGridParam",{postData:{nodeid:id,n_left:rc[lft],n_right:rc[rgt],n_level:rc[level]}});
					} else {
						$(this).jqGrid("setGridParam",{postData:{nodeid:id,parentid:rc[parent],n_level:rc[level]}} );
					}
					$(this).trigger("reloadGrid");
					rc[loaded] = true;
					if(this.p.treeGridModel === 'nested') {
						$(this).jqGrid("setGridParam",{postData:{nodeid:'',n_left:'',n_right:'',n_level:''}});
					} else {
						$(this).jqGrid("setGridParam",{postData:{nodeid:'',parentid:'',n_level:''}}); 
					}
				}
			}
		});
	},
	collapseNode : function(rc) {
		return this.each(function(){
			if(!this.grid || !this.p.treeGrid) {return;}
			var expanded = this.p.treeReader.expanded_field;
			if(rc[expanded]) {
				rc[expanded] = false;
				var id = $.jgrid.getAccessor(rc,this.p.localReader.id);
				var rc1 = $("#" + this.p.idPrefix + $.jgrid.jqID(id),this.grid.bDiv)[0];
				$("div.treeclick",rc1).removeClass(this.p.treeIcons.minus+" tree-minus").addClass(this.p.treeIcons.plus+" tree-plus");
			}
		});
	},
	SortTree : function( sortname, newDir, st, datefmt) {
		return this.each(function(){
			if(!this.grid || !this.p.treeGrid) {return;}
			var i, len,
			rec, records = [], $t = this, query, roots,
			rt = $(this).jqGrid("getRootNodes");
			// Sorting roots
			query = $.jgrid.from(rt);
			query.orderBy(sortname,newDir,st, datefmt);
			roots = query.select();

			// Sorting children
			for (i = 0, len = roots.length; i < len; i++) {
				rec = roots[i];
				records.push(rec);
				$(this).jqGrid("collectChildrenSortTree",records, rec, sortname, newDir,st, datefmt);
			}
			$.each(records, function(index) {
				var id  = $.jgrid.getAccessor(this,$t.p.localReader.id);
				$('#'+$.jgrid.jqID($t.p.id)+ ' tbody tr:eq('+index+')').after($('tr#'+$.jgrid.jqID(id),$t.grid.bDiv));
			});
			query = null;roots=null;records=null;
		});
	},
	collectChildrenSortTree : function(records, rec, sortname, newDir,st, datefmt) {
		return this.each(function(){
			if(!this.grid || !this.p.treeGrid) {return;}
			var i, len,
			child, ch, query, children;
			ch = $(this).jqGrid("getNodeChildren",rec);
			query = $.jgrid.from(ch);
			query.orderBy(sortname, newDir, st, datefmt);
			children = query.select();
			for (i = 0, len = children.length; i < len; i++) {
				child = children[i];
				records.push(child);
				$(this).jqGrid("collectChildrenSortTree",records, child, sortname, newDir, st, datefmt); 
			}
		});
	},
	// experimental 
	setTreeRow : function(rowid, data) {
		var success=false;
		this.each(function(){
			var t = this;
			if(!t.grid || !t.p.treeGrid) {return;}
			success = $(t).jqGrid("setRowData",rowid,data);
		});
		return success;
	},
	delTreeNode : function (rowid) {
		return this.each(function () {
			var $t = this, rid = $t.p.localReader.id, i,
			left = $t.p.treeReader.left_field,
			right = $t.p.treeReader.right_field, myright, width, res, key;
			if(!$t.grid || !$t.p.treeGrid) {return;}
			var rc = $t.p._index[rowid];
			if (rc !== undefined) {
				// nested
				myright = parseInt($t.p.data[rc][right],10);
				width = myright -  parseInt($t.p.data[rc][left],10) + 1;
				var dr = $($t).jqGrid("getFullTreeNode",$t.p.data[rc]);
				if(dr.length>0){
					for (i=0;i<dr.length;i++){
						$($t).jqGrid("delRowData",dr[i][rid]);
					}
				}
				if( $t.p.treeGridModel === "nested") {
					// ToDo - update grid data
					res = $.jgrid.from($t.p.data)
						.greater(left,myright,{stype:'integer'})
						.select();
					if(res.length) {
						for( key in res) {
							if(res.hasOwnProperty(key)) {
								res[key][left] = parseInt(res[key][left],10) - width ;
							}
						}
					}
					res = $.jgrid.from($t.p.data)
						.greater(right,myright,{stype:'integer'})
						.select();
					if(res.length) {
						for( key in res) {
							if(res.hasOwnProperty(key)) {
								res[key][right] = parseInt(res[key][right],10) - width ;
							}
						}
					}
				}
			}
		});
	},
	addChildNode : function( nodeid, parentid, data, expandData ) {
		//return this.each(function(){
		var $t = this[0];
		if(data) {
			// we suppose tha the id is autoincremet and
			var expanded = $t.p.treeReader.expanded_field,
			isLeaf = $t.p.treeReader.leaf_field,
			level = $t.p.treeReader.level_field,
			//icon = $t.p.treeReader.icon_field,
			parent = $t.p.treeReader.parent_id_field,
			left = $t.p.treeReader.left_field,
			right = $t.p.treeReader.right_field,
			loaded = $t.p.treeReader.loaded,
			method, parentindex, parentdata, parentlevel, i, len, max=0, rowind = parentid, leaf, maxright;
			if(expandData===undefined) {expandData = false;}
			if ( nodeid === undefined || nodeid === null ) {
				i = $t.p.data.length-1;
				if(	i>= 0 ) {
					while(i>=0){max = Math.max(max, parseInt($t.p.data[i][$t.p.localReader.id],10)); i--;}
				}
				nodeid = max+1;
			}
			var prow = $($t).jqGrid('getInd', parentid);
			leaf = false;
			// if not a parent we assume root
			if ( parentid === undefined  || parentid === null || parentid==="") {
				parentid = null;
				rowind = null;
				method = 'last';
				parentlevel = $t.p.tree_root_level;
				i = $t.p.data.length+1;
			} else {
				method = 'after';
				parentindex = $t.p._index[parentid];
				parentdata = $t.p.data[parentindex];
				parentid = parentdata[$t.p.localReader.id];
				parentlevel = parseInt(parentdata[level],10)+1;
				var childs = $($t).jqGrid('getFullTreeNode', parentdata);
				// if there are child nodes get the last index of it
				if(childs.length) {
					i = childs[childs.length-1][$t.p.localReader.id];
					rowind = i;
					i = $($t).jqGrid('getInd',rowind)+1;
				} else {
					i = $($t).jqGrid('getInd', parentid)+1;
				}
				// if the node is leaf
				if(parentdata[isLeaf]) {
					leaf = true;
					parentdata[expanded] = true;
					//var prow = $($t).jqGrid('getInd', parentid);
					$($t.rows[prow])
						.find("span.cell-wrapperleaf").removeClass("cell-wrapperleaf").addClass("cell-wrapper")
						.end()
						.find("div.tree-leaf").removeClass($t.p.treeIcons.leaf+" tree-leaf").addClass($t.p.treeIcons.minus+" tree-minus");
					$t.p.data[parentindex][isLeaf] = false;
					parentdata[loaded] = true;
				}
			}
			len = i+1;

			if( data[expanded]===undefined)  {data[expanded]= false;}
			if( data[loaded]===undefined )  { data[loaded] = false;}
			data[level] = parentlevel;
			if( data[isLeaf]===undefined) {data[isLeaf]= true;}
			if( $t.p.treeGridModel === "adjacency") {
				data[parent] = parentid;
			}
			if( $t.p.treeGridModel === "nested") {
				// this method requiere more attention
				var query, res, key;
				//maxright = parseInt(maxright,10);
				// ToDo - update grid data
				if(parentid !== null) {
					maxright = parseInt(parentdata[right],10);
					query = $.jgrid.from($t.p.data);
					query = query.greaterOrEquals(right,maxright,{stype:'integer'});
					res = query.select();
					if(res.length) {
						for( key in res) {
							if(res.hasOwnProperty(key)) {
								res[key][left] = res[key][left] > maxright ? parseInt(res[key][left],10) +2 : res[key][left];
								res[key][right] = res[key][right] >= maxright ? parseInt(res[key][right],10) +2 : res[key][right];
							}
						}
					}
					data[left] = maxright;
					data[right]= maxright+1;
				} else {
					maxright = parseInt( $($t).jqGrid('getCol', right, false, 'max'), 10);
					res = $.jgrid.from($t.p.data)
						.greater(left,maxright,{stype:'integer'})
						.select();
					if(res.length) {
						for( key in res) {
							if(res.hasOwnProperty(key)) {
								res[key][left] = parseInt(res[key][left],10) +2 ;
							}
						}
					}
					res = $.jgrid.from($t.p.data)
						.greater(right,maxright,{stype:'integer'})
						.select();
					if(res.length) {
						for( key in res) {
							if(res.hasOwnProperty(key)) {
								res[key][right] = parseInt(res[key][right],10) +2 ;
							}
						}
					}
					data[left] = maxright+1;
					data[right] = maxright + 2;
				}
			}
			if( parentid === null || $($t).jqGrid("isNodeLoaded",parentdata) || leaf ) {
					$($t).jqGrid('addRowData', nodeid, data, method, rowind);
					$($t).jqGrid('setTreeNode', i, len);
			}
			if(parentdata && !parentdata[expanded] && expandData) {
				$($t.rows[prow])
					.find("div.treeclick")
					.click();
			}
		}
		//});
	}
});
})(jQuery);
/*jshint eqeqeq:false, eqnull:true */
/*global jQuery */
// Grouping module
(function($){
"use strict";
$.extend($.jgrid,{
	template : function(format){ //jqgformat
		var args = $.makeArray(arguments).slice(1), j, al = args.length;
		if(format==null) { format = ""; }
		return format.replace(/\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g, function(m,i){
			if(!isNaN(parseInt(i,10))) {
				return args[parseInt(i,10)];
			}
			for(j=0; j < al;j++) {
				if($.isArray(args[j])) {
					var nmarr = args[ j ],
					k = nmarr.length;
					while(k--) {
						if(i===nmarr[k].nm) {
							return nmarr[k].v;
						}
					}
				}
			}
		});
	}
});
$.jgrid.extend({
	groupingSetup : function () {
		return this.each(function (){
			var $t = this, i, j, cml, cm = $t.p.colModel, grp = $t.p.groupingView;
			if(grp !== null && ( (typeof grp === 'object') || $.isFunction(grp) ) ) {
				if(!grp.groupField.length) {
					$t.p.grouping = false;
				} else {
					if (grp.visibiltyOnNextGrouping === undefined) {
						grp.visibiltyOnNextGrouping = [];
					}

					grp.lastvalues=[];
					grp.groups =[];
					grp.counters =[];
					for(i=0;i<grp.groupField.length;i++) {
						if(!grp.groupOrder[i]) {
							grp.groupOrder[i] = 'asc';
						}
						if(!grp.groupText[i]) {
							grp.groupText[i] = '{0}';
						}
						if( typeof grp.groupColumnShow[i] !== 'boolean') {
							grp.groupColumnShow[i] = true;
						}
						if( typeof grp.groupSummary[i] !== 'boolean') {
							grp.groupSummary[i] = false;
						}
						if(grp.groupColumnShow[i] === true) {
							grp.visibiltyOnNextGrouping[i] = true;
							$($t).jqGrid('showCol',grp.groupField[i]);
						} else {
							grp.visibiltyOnNextGrouping[i] = $("#"+$.jgrid.jqID($t.p.id+"_"+grp.groupField[i])).is(":visible");
							$($t).jqGrid('hideCol',grp.groupField[i]);
						}
					}
					grp.summary =[];
					for(j=0, cml = cm.length; j < cml; j++) {
						if(cm[j].summaryType ) {
							if(cm[j].summaryDivider) {
								grp.summary.push({nm:cm[j].name,st:cm[j].summaryType, v: '', sd:cm[j].summaryDivider, vd:'', sr: cm[j].summaryRound, srt: cm[j].summaryRoundType || 'round'});
							} else {
								grp.summary.push({nm:cm[j].name,st:cm[j].summaryType, v: '', sr: cm[j].summaryRound, srt: cm[j].summaryRoundType || 'round'});
							}
						}
					}
				}
			} else {
				$t.p.grouping = false;
			}
		});
	},
	groupingPrepare : function (rData, gdata, record, irow) {
		this.each(function(){
			var grp = this.p.groupingView, $t= this, i,
			grlen = grp.groupField.length, 
			fieldName,
			v,
			displayName,
			displayValue,
			changed = 0;
			for(i=0;i<grlen;i++) {
				fieldName = grp.groupField[i];
				displayName = grp.displayField[i];
				v = record[fieldName];
				displayValue = displayName == null ? null : record[displayName];

				if( displayValue == null ) {
					displayValue = v;
				}
				if( v !== undefined ) {
					if(irow === 0 ) {
						// First record always starts a new group
						grp.groups.push({idx:i,dataIndex:fieldName,value:v, displayValue: displayValue, startRow: irow, cnt:1, summary : [] } );
						grp.lastvalues[i] = v;
						grp.counters[i] = {cnt:1, pos:grp.groups.length-1, summary: $.extend(true,[],grp.summary)};
						$.each(grp.counters[i].summary,function() {
							if ($.isFunction(this.st)) {
								this.v = this.st.call($t, this.v, this.nm, record);
							} else {
								this.v = $($t).jqGrid('groupingCalculations.handler',this.st, this.v, this.nm, this.sr, this.srt, record);
								if(this.st.toLowerCase() === 'avg' && this.sd) {
									this.vd = $($t).jqGrid('groupingCalculations.handler',this.st, this.vd, this.sd, this.sr, this.srt, record);
								}
							}
						});
						grp.groups[grp.counters[i].pos].summary = grp.counters[i].summary;
					} else {
						if (typeof v !== "object" && ($.isArray(grp.isInTheSameGroup) && $.isFunction(grp.isInTheSameGroup[i]) ? ! grp.isInTheSameGroup[i].call($t, grp.lastvalues[i], v, i, grp): grp.lastvalues[i] !== v)) {
							// This record is not in same group as previous one
							grp.groups.push({idx:i,dataIndex:fieldName,value:v, displayValue: displayValue, startRow: irow, cnt:1, summary : [] } );
							grp.lastvalues[i] = v;
							changed = 1;
							grp.counters[i] = {cnt:1, pos:grp.groups.length-1, summary: $.extend(true,[],grp.summary)};
							$.each(grp.counters[i].summary,function() {
								if ($.isFunction(this.st)) {
									this.v = this.st.call($t, this.v, this.nm, record);
								} else {
									this.v = $($t).jqGrid('groupingCalculations.handler',this.st, this.v, this.nm, this.sr, this.srt, record);
									if(this.st.toLowerCase() === 'avg' && this.sd) {
										this.vd = $($t).jqGrid('groupingCalculations.handler',this.st, this.vd, this.sd, this.sr, this.srt, record);
									}
								}
							});
							grp.groups[grp.counters[i].pos].summary = grp.counters[i].summary;
						} else {
							if (changed === 1) {
								// This group has changed because an earlier group changed.
								grp.groups.push({idx:i,dataIndex:fieldName,value:v, displayValue: displayValue, startRow: irow, cnt:1, summary : [] } );
								grp.lastvalues[i] = v;
								grp.counters[i] = {cnt:1, pos:grp.groups.length-1, summary: $.extend(true,[],grp.summary)};
								$.each(grp.counters[i].summary,function() {
									if ($.isFunction(this.st)) {
										this.v = this.st.call($t, this.v, this.nm, record);
									} else {
										this.v = $($t).jqGrid('groupingCalculations.handler',this.st, this.v, this.nm, this.sr, this.srt, record);
										if(this.st.toLowerCase() === 'avg' && this.sd) {
											this.vd = $($t).jqGrid('groupingCalculations.handler',this.st, this.vd, this.sd, this.sr, this.srt, record);
										}
									}
								});
								grp.groups[grp.counters[i].pos].summary = grp.counters[i].summary;
							} else {
								grp.counters[i].cnt += 1;
								grp.groups[grp.counters[i].pos].cnt = grp.counters[i].cnt;
								$.each(grp.counters[i].summary,function() {
									if ($.isFunction(this.st)) {
										this.v = this.st.call($t, this.v, this.nm, record);
									} else {
										this.v = $($t).jqGrid('groupingCalculations.handler',this.st, this.v, this.nm, this.sr, this.srt, record);
										if(this.st.toLowerCase() === 'avg' && this.sd) {
											this.vd = $($t).jqGrid('groupingCalculations.handler',this.st, this.vd, this.sd, this.sr, this.srt, record);
										}
									}
								});
								grp.groups[grp.counters[i].pos].summary = grp.counters[i].summary;
							}
						}
					}
				}
			}
			gdata.push( rData );
		});
		return gdata;
	},
	groupingToggle : function(hid){
		this.each(function(){
			var $t = this,
			grp = $t.p.groupingView,
			strpos = hid.split('_'),
			num = parseInt(strpos[strpos.length-2], 10);
			strpos.splice(strpos.length-2,2);
			var uid = strpos.join("_"),
			minus = grp.minusicon,
			plus = grp.plusicon,
			tar = $("#"+$.jgrid.jqID(hid)),
			r = tar.length ? tar[0].nextSibling : null,
			tarspan = $("#"+$.jgrid.jqID(hid)+" span."+"tree-wrap-"+$t.p.direction),
			getGroupingLevelFromClass = function (className) {
				var nums = $.map(className.split(" "), function (item) {
					if (item.substring(0, uid.length + 1) === uid + "_") {
						return parseInt(item.substring(uid.length + 1), 10);
					}
				});
				return nums.length > 0 ? nums[0] : undefined;
			},
			itemGroupingLevel,
			showData,
			collapsed = false;
			if( tarspan.hasClass(minus) ) {
				if(grp.showSummaryOnHide) {
					if(r){
						while(r) {
							if($(r).hasClass('jqfoot') ) {
								var lv = parseInt($(r).attr("jqfootlevel"),10);
								if(  lv <= num) {
									break;
								}
							}
							$(r).hide();
							r = r.nextSibling;
						}
					}
				} else  {
					if(r){
						while(r) {
							itemGroupingLevel = getGroupingLevelFromClass(r.className);
							if (itemGroupingLevel !== undefined && itemGroupingLevel <= num) {
								break;
							}
							$(r).hide();
							r = r.nextSibling;
						}
					}
				}
				tarspan.removeClass(minus).addClass(plus);
				collapsed = true;
			} else {
				if(r){
					showData = undefined;
					while(r) {
						itemGroupingLevel = getGroupingLevelFromClass(r.className);
						if (showData === undefined) {
							showData = itemGroupingLevel === undefined; // if the first row after the opening group is data row then show the data rows
						}
						if (itemGroupingLevel !== undefined) {
							if (itemGroupingLevel <= num) {
								break;// next item of the same lever are found
							}
							if (itemGroupingLevel === num + 1) {
								$(r).show().find(">td>span."+"tree-wrap-"+$t.p.direction).removeClass(minus).addClass(plus);
							}
						} else if (showData) {
							$(r).show();
						}
						r = r.nextSibling;
					}
				}
				tarspan.removeClass(plus).addClass(minus);
			}
			$($t).triggerHandler("jqGridGroupingClickGroup", [hid , collapsed]);
			if( $.isFunction($t.p.onClickGroup)) { $t.p.onClickGroup.call($t, hid , collapsed); }

		});
		return false;
	},
	groupingRender : function (grdata, colspans ) {
		return this.each(function(){
			var $t = this,
			grp = $t.p.groupingView,
			str = "", icon = "", hid, clid, pmrtl = grp.groupCollapse ? grp.plusicon : grp.minusicon, gv, cp=[], len =grp.groupField.length;
			pmrtl += " tree-wrap-"+$t.p.direction; 
			$.each($t.p.colModel, function (i,n){
				var ii;
				for(ii=0;ii<len;ii++) {
					if(grp.groupField[ii] === n.name ) {
						cp[ii] = i;
						break;
					}
				}
			});
			var toEnd = 0;
			function findGroupIdx( ind , offset, grp) {
				var ret = false, i;
				if(offset===0) {
					ret = grp[ind];
				} else {
					var id = grp[ind].idx;
					if(id===0) { 
						ret = grp[ind]; 
					}  else {
						for(i=ind;i >= 0; i--) {
							if(grp[i].idx === id-offset) {
								ret = grp[i];
								break;
							}
						}
					}
				}
				return ret;
			}
			var sumreverse = $.makeArray(grp.groupSummary);
			sumreverse.reverse();
			$.each(grp.groups,function(i,n){
				toEnd++;
				clid = $t.p.id+"ghead_"+n.idx;
				hid = clid+"_"+i;
				icon = "<span style='cursor:pointer;' class='ui-icon "+pmrtl+"' onclick=\"jQuery('#"+$.jgrid.jqID($t.p.id)+"').jqGrid('groupingToggle','"+hid+"');return false;\"></span>";
				try {
					if ($.isArray(grp.formatDisplayField) && $.isFunction(grp.formatDisplayField[n.idx])) {
						n.displayValue = grp.formatDisplayField[n.idx].call($t, n.displayValue, n.value, $t.p.colModel[cp[n.idx]], n.idx, grp);
						gv = n.displayValue;
					} else {
						gv = $t.formatter(hid, n.displayValue, cp[n.idx], n.value );
					}
				} catch (egv) {
					gv = n.displayValue;
				}
				str += "<tr id=\""+hid+"\"" +(grp.groupCollapse && n.idx>0 ? " style=\"display:none;\" " : " ") + "role=\"row\" class= \"ui-widget-content jqgroup ui-row-"+$t.p.direction+" "+clid+"\"><td style=\"padding-left:"+(n.idx * 12) + "px;"+"\" colspan=\""+colspans+"\">"+icon+$.jgrid.template(grp.groupText[n.idx], gv, n.cnt, n.summary)+"</td></tr>";
				var leaf = len-1 === n.idx; 
				if( leaf ) {
					var gg = grp.groups[i+1], k, kk, ik;
					var end = gg !== undefined ?  grp.groups[i+1].startRow : grdata.length;
					for(kk=n.startRow;kk<end;kk++) {
						str += grdata[kk].join('');
					}
					var jj;
					if (gg !== undefined) {
						for (jj = 0; jj < grp.groupField.length; jj++) {
							if (gg.dataIndex === grp.groupField[jj]) {
								break;
							}
						}
						toEnd = grp.groupField.length - jj;
					}
					for (ik = 0; ik < toEnd; ik++) {
						if(!sumreverse[ik]) { continue; }
						var hhdr = "";
						if(grp.groupCollapse && !grp.showSummaryOnHide) {
							hhdr = " style=\"display:none;\"";
						}
						str += "<tr"+hhdr+" jqfootlevel=\""+(n.idx-ik)+"\" role=\"row\" class=\"ui-widget-content jqfoot ui-row-"+$t.p.direction+"\">";
						var fdata = findGroupIdx(i, ik, grp.groups),
						cm = $t.p.colModel,
						vv, grlen = fdata.cnt;
						for(k=0; k<colspans;k++) {
							var tmpdata = "<td "+$t.formatCol(k,1,'')+">&#160;</td>",
							tplfld = "{0}";
							$.each(fdata.summary,function(){
								if(this.nm === cm[k].name) {
									if(cm[k].summaryTpl)  {
										tplfld = cm[k].summaryTpl;
									}
									if(typeof this.st === 'string' && this.st.toLowerCase() === 'avg') {
										if(this.sd && this.vd) { 
											this.v = (this.v/this.vd);
										} else if(this.v && grlen > 0) {
											this.v = (this.v/grlen);
										}
									}
									try {
										vv = $t.formatter('', this.v, k, this);
									} catch (ef) {
										vv = this.v;
									}
									tmpdata= "<td "+$t.formatCol(k,1,'')+">"+$.jgrid.format(tplfld,vv)+ "</td>";
									return false;
								}
							});
							str += tmpdata;
						}
						str += "</tr>";
					}
					toEnd = jj;
				}
			});
			$("#"+$.jgrid.jqID($t.p.id)+" tbody:first").append(str);
			// free up memory
			str = null;
		});
	},
	groupingGroupBy : function (name, options ) {
		return this.each(function(){
			var $t = this;
			if(typeof name === "string") {
				name = [name];
			}
			var grp = $t.p.groupingView;
			$t.p.grouping = true;

			//Set default, in case visibilityOnNextGrouping is undefined 
			if (grp.visibiltyOnNextGrouping === undefined) {
				grp.visibiltyOnNextGrouping = [];
			}
			var i;
			// show previous hidden groups if they are hidden and weren't removed yet
			for(i=0;i<grp.groupField.length;i++) {
				if(!grp.groupColumnShow[i] && grp.visibiltyOnNextGrouping[i]) {
				$($t).jqGrid('showCol',grp.groupField[i]);
				}
			}
			// set visibility status of current group columns on next grouping
			for(i=0;i<name.length;i++) {
				grp.visibiltyOnNextGrouping[i] = $("#"+$.jgrid.jqID($t.p.id)+"_"+$.jgrid.jqID(name[i])).is(":visible");
			}
			$t.p.groupingView = $.extend($t.p.groupingView, options || {});
			grp.groupField = name;
			$($t).trigger("reloadGrid");
		});
	},
	groupingRemove : function (current) {
		return this.each(function(){
			var $t = this;
			if(current === undefined) {
				current = true;
			}
			$t.p.grouping = false;
			if(current===true) {
				var grp = $t.p.groupingView, i;
				// show previous hidden groups if they are hidden and weren't removed yet
				for(i=0;i<grp.groupField.length;i++) {
				if (!grp.groupColumnShow[i] && grp.visibiltyOnNextGrouping[i]) {
						$($t).jqGrid('showCol', grp.groupField);
					}
				}
				$("tr.jqgroup, tr.jqfoot","#"+$.jgrid.jqID($t.p.id)+" tbody:first").remove();
				$("tr.jqgrow:hidden","#"+$.jgrid.jqID($t.p.id)+" tbody:first").show();
			} else {
				$($t).trigger("reloadGrid");
			}
		});
	},
	groupingCalculations : {
		handler: function(fn, v, field, round, roundType, rc) {
			var funcs = {
				sum: function() {
					return parseFloat(v||0) + parseFloat((rc[field]||0));
				},

				min: function() {
					if(v==="") {
						return parseFloat(rc[field]||0);
					}
					return Math.min(parseFloat(v),parseFloat(rc[field]||0));
				},

				max: function() {
					if(v==="") {
						return parseFloat(rc[field]||0);
					}
					return Math.max(parseFloat(v),parseFloat(rc[field]||0));
				},

				count: function() {
					if(v==="") {v=0;}
					if(rc.hasOwnProperty(field)) {
						return v+1;
					}
					return 0;
				},

				avg: function() {
					// the same as sum, but at end we divide it
					// so use sum instead of duplicating the code (?)
					return funcs.sum();
				}
			};

			if(!funcs[fn]) {
				throw ("jqGrid Grouping No such method: " + fn);
			}
			var res = funcs[fn]();

			if (round != null) {
				if (roundType === 'fixed') {
					res = res.toFixed(round);
				} else {
					var mul = Math.pow(10, round);
					res = Math.round(res * mul) / mul;
				}
			}

			return res;
		}	
	}
});
})(jQuery);
/*jshint eqeqeq:false, eqnull:true, devel:true */
/*global jQuery, xmlJsonClass */
(function($){
/*
 * jqGrid extension for constructing Grid Data from external file
 * Tony Tomov tony@trirand.com
 * http://trirand.com/blog/ 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
**/ 

"use strict";
    $.jgrid.extend({
        jqGridImport : function(o) {
            o = $.extend({
                imptype : "xml", // xml, json, xmlstring, jsonstring
                impstring: "",
                impurl: "",
                mtype: "GET",
                impData : {},
                xmlGrid :{
                    config : "roots>grid",
                    data: "roots>rows"
                },
                jsonGrid :{
                    config : "grid",
                    data: "data"
                },
                ajaxOptions :{}
            }, o || {});
            return this.each(function(){
                var $t = this;
                var xmlConvert = function (xml,o) {
                    var cnfg = $(o.xmlGrid.config,xml)[0];
                    var xmldata = $(o.xmlGrid.data,xml)[0], jstr, jstr1, key;
                    if(xmlJsonClass.xml2json && $.jgrid.parse) {
                        jstr = xmlJsonClass.xml2json(cnfg," ");
                        jstr = $.jgrid.parse(jstr);
                        for(key in jstr) {
                            if(jstr.hasOwnProperty(key)) {
                                jstr1=jstr[key];
                            }
                        }
                        if(xmldata) {
                        // save the datatype
                            var svdatatype = jstr.grid.datatype;
                            jstr.grid.datatype = 'xmlstring';
                            jstr.grid.datastr = xml;
                            $($t).jqGrid( jstr1 ).jqGrid("setGridParam",{datatype:svdatatype});
                        } else {
                            $($t).jqGrid( jstr1 );
                        }
                        jstr = null;jstr1=null;
                    } else {
                        alert("xml2json or parse are not present");
                    }
                };
                var jsonConvert = function (jsonstr,o){
                    if (jsonstr && typeof jsonstr === 'string') {
						var _jsonparse = false;
						if($.jgrid.useJSON) {
							$.jgrid.useJSON = false;
							_jsonparse = true;
						}
                        var json = $.jgrid.parse(jsonstr);
						if(_jsonparse) { $.jgrid.useJSON = true; }
                        var gprm = json[o.jsonGrid.config];
                        var jdata = json[o.jsonGrid.data];
                        if(jdata) {
                            var svdatatype = gprm.datatype;
                            gprm.datatype = 'jsonstring';
                            gprm.datastr = jdata;
                            $($t).jqGrid( gprm ).jqGrid("setGridParam",{datatype:svdatatype});
                        } else {
                            $($t).jqGrid( gprm );
                        }
                    }
                };
                switch (o.imptype){
                    case 'xml':
                        $.ajax($.extend({
                            url:o.impurl,
                            type:o.mtype,
                            data: o.impData,
                            dataType:"xml",
                            complete: function(xml,stat) {
                                if(stat === 'success') {
                                    xmlConvert(xml.responseXML,o);
                                    $($t).triggerHandler("jqGridImportComplete", [xml, o]);
                                    if($.isFunction(o.importComplete)) {
                                        o.importComplete(xml);
                                    }
                                }
                                xml=null;
                            }
                        }, o.ajaxOptions));
                        break;
                    case 'xmlstring' :
                        // we need to make just the conversion and use the same code as xml
                        if(o.impstring && typeof o.impstring === 'string') {
                            var xmld = $.parseXML(o.impstring);
                            if(xmld) {
                                xmlConvert(xmld,o);
                                $($t).triggerHandler("jqGridImportComplete", [xmld, o]);
                                if($.isFunction(o.importComplete)) {
                                    o.importComplete(xmld);
                                }
                                o.impstring = null;
                            }
                            xmld = null;
                        }
                        break;
                    case 'json':
                        $.ajax($.extend({
                            url:o.impurl,
                            type:o.mtype,
                            data: o.impData,
                            dataType:"json",
                            complete: function(json) {
                                try {
                                    jsonConvert(json.responseText,o );
                                    $($t).triggerHandler("jqGridImportComplete", [json, o]);
                                    if($.isFunction(o.importComplete)) {
                                        o.importComplete(json);
                                    }
                                } catch (ee){}
                                json=null;
                            }
                        }, o.ajaxOptions ));
                        break;
                    case 'jsonstring' :
                        if(o.impstring && typeof o.impstring === 'string') {
                            jsonConvert(o.impstring,o );
                            $($t).triggerHandler("jqGridImportComplete", [o.impstring, o]);
                            if($.isFunction(o.importComplete)) {
                                o.importComplete(o.impstring);
                            }
                            o.impstring = null;
                        }
                        break;
                }
            });
        },
        jqGridExport : function(o) {
            o = $.extend({
                exptype : "xmlstring",
                root: "grid",
                ident: "\t"
            }, o || {});
            var ret = null;
            this.each(function () {
                if(!this.grid) { return;}
                var key, gprm = $.extend(true, {},$(this).jqGrid("getGridParam"));
                // we need to check for:
                // 1.multiselect, 2.subgrid  3. treegrid and remove the unneded columns from colNames
                if(gprm.rownumbers) {
                    gprm.colNames.splice(0,1);
                    gprm.colModel.splice(0,1);
                }
                if(gprm.multiselect) {
                    gprm.colNames.splice(0,1);
                    gprm.colModel.splice(0,1);
                }
                if(gprm.subGrid) {
                    gprm.colNames.splice(0,1);
                    gprm.colModel.splice(0,1);
                }
                gprm.knv = null;
                if(gprm.treeGrid) {
                    for (key in gprm.treeReader) {
                        if(gprm.treeReader.hasOwnProperty(key)) {
                            gprm.colNames.splice(gprm.colNames.length-1);
                            gprm.colModel.splice(gprm.colModel.length-1);
                        }
                    }
                }
                switch (o.exptype) {
                    case 'xmlstring' :
                        ret = "<"+o.root+">"+xmlJsonClass.json2xml(gprm,o.ident)+"</"+o.root+">";
                        break;
                    case 'jsonstring' :
                        ret = "{"+ xmlJsonClass.toJson(gprm,o.root,o.ident,false)+"}";
                        if(gprm.postData.filters !== undefined) {
                            ret=ret.replace(/filters":"/,'filters":');
                            ret=ret.replace(/}]}"/,'}]}');
                        }
                        break;
                }
            });
            return ret;
        },
        excelExport : function(o) {
            o = $.extend({
                exptype : "remote",
                url : null,
                oper: "oper",
                tag: "excel",
                exportOptions : {}
            }, o || {});
            return this.each(function(){
                if(!this.grid) { return;}
                var url;
                if(o.exptype === "remote") {
                    var pdata = $.extend({},this.p.postData);
                    pdata[o.oper] = o.tag;
                    var params = jQuery.param(pdata);
                    if(o.url.indexOf("?") !== -1) { url = o.url+"&"+params; }
                    else { url = o.url+"?"+params; }
                    window.location = url;
                }
            });
        }
    });
})(jQuery);
/*jshint evil:true, eqeqeq:false, eqnull:true, devel:true */
/*global jQuery */
(function($){
/*
**
 * jqGrid addons using jQuery UI 
 * Author: Mark Williams
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 * depends on jQuery UI 
**/
"use strict";
if ($.jgrid.msie && $.jgrid.msiever()===8) {
	$.expr[":"].hidden = function(elem) {
		return elem.offsetWidth === 0 || elem.offsetHeight === 0 ||
			elem.style.display === "none";
	};
}
// requiere load multiselect before grid
$.jgrid._multiselect = false;
if($.ui) {
	if ($.ui.multiselect ) {
		if($.ui.multiselect.prototype._setSelected) {
			var setSelected = $.ui.multiselect.prototype._setSelected;
			$.ui.multiselect.prototype._setSelected = function(item,selected) {
				var ret = setSelected.call(this,item,selected);
				if (selected && this.selectedList) {
					var elt = this.element;
					this.selectedList.find('li').each(function() {
						if ($(this).data('optionLink')) {
							$(this).data('optionLink').remove().appendTo(elt);
						}
					});
				}
				return ret;
			};
		}
		if($.ui.multiselect.prototype.destroy) {
			$.ui.multiselect.prototype.destroy = function() {
				this.element.show();
				this.container.remove();
				if ($.Widget === undefined) {
					$.widget.prototype.destroy.apply(this, arguments);
				} else {
					$.Widget.prototype.destroy.apply(this, arguments);
				}
			};
		}
		$.jgrid._multiselect = true;
	}
}
        
$.jgrid.extend({
	sortableColumns : function (tblrow)
	{
		return this.each(function (){
			var ts = this, tid= $.jgrid.jqID( ts.p.id );
			function start() {ts.p.disableClick = true;}
			var sortable_opts = {
				"tolerance" : "pointer",
				"axis" : "x",
				"scrollSensitivity": "1",
				"items": '>th:not(:has(#jqgh_'+tid+'_cb'+',#jqgh_'+tid+'_rn'+',#jqgh_'+tid+'_subgrid),:hidden)',
				"placeholder": {
					element: function(item) {
						var el = $(document.createElement(item[0].nodeName))
						.addClass(item[0].className+" ui-sortable-placeholder ui-state-highlight")
						.removeClass("ui-sortable-helper")[0];
						return el;
					},
					update: function(self, p) {
						p.height(self.currentItem.innerHeight() - parseInt(self.currentItem.css('paddingTop')||0, 10) - parseInt(self.currentItem.css('paddingBottom')||0, 10));
						p.width(self.currentItem.innerWidth() - parseInt(self.currentItem.css('paddingLeft')||0, 10) - parseInt(self.currentItem.css('paddingRight')||0, 10));
					}
				},
				"update": function(event, ui) {
					var p = $(ui.item).parent(),
					th = $(">th", p),
					colModel = ts.p.colModel,
					cmMap = {}, tid= ts.p.id+"_";
					$.each(colModel, function(i) { cmMap[this.name]=i; });
					var permutation = [];
					th.each(function() {
						var id = $(">div", this).get(0).id.replace(/^jqgh_/, "").replace(tid,"");
							if (cmMap.hasOwnProperty(id)) {
								permutation.push(cmMap[id]);
							}
					});
	
					$(ts).jqGrid("remapColumns",permutation, true, true);
					if ($.isFunction(ts.p.sortable.update)) {
						ts.p.sortable.update(permutation);
					}
					setTimeout(function(){ts.p.disableClick=false;}, 50);
				}
			};
			if (ts.p.sortable.options) {
				$.extend(sortable_opts, ts.p.sortable.options);
			} else if ($.isFunction(ts.p.sortable)) {
				ts.p.sortable = { "update" : ts.p.sortable };
			}
			if (sortable_opts.start) {
				var s = sortable_opts.start;
				sortable_opts.start = function(e,ui) {
					start();
					s.call(this,e,ui);
				};
			} else {
				sortable_opts.start = start;
			}
			if (ts.p.sortable.exclude) {
				sortable_opts.items += ":not("+ts.p.sortable.exclude+")";
			}
			tblrow.sortable(sortable_opts).data("sortable").floating = true;
		});
	},
    columnChooser : function(opts) {
        var self = this;
		if($("#colchooser_"+$.jgrid.jqID(self[0].p.id)).length ) { return; }
        var selector = $('<div id="colchooser_'+self[0].p.id+'" style="position:relative;overflow:hidden"><div><select multiple="multiple"></select></div></div>');
        var select = $('select', selector);
		
		function insert(perm,i,v) {
			if(i>=0){
				var a = perm.slice();
				var b = a.splice(i,Math.max(perm.length-i,i));
				if(i>perm.length) { i = perm.length; }
				a[i] = v;
				return a.concat(b);
			}
		}
        opts = $.extend({
            "width" : 420,
            "height" : 240,
            "classname" : null,
            "done" : function(perm) { if (perm) { self.jqGrid("remapColumns", perm, true); } },
            /* msel is either the name of a ui widget class that
               extends a multiselect, or a function that supports
               creating a multiselect object (with no argument,
               or when passed an object), and destroying it (when
               passed the string "destroy"). */
            "msel" : "multiselect",
            /* "msel_opts" : {}, */

            /* dlog is either the name of a ui widget class that 
               behaves in a dialog-like way, or a function, that
               supports creating a dialog (when passed dlog_opts)
               or destroying a dialog (when passed the string
               "destroy")
               */
            "dlog" : "dialog",
			"dialog_opts" : {
				"minWidth": 470
			},
            /* dlog_opts is either an option object to be passed 
               to "dlog", or (more likely) a function that creates
               the options object.
               The default produces a suitable options object for
               ui.dialog */
            "dlog_opts" : function(opts) {
                var buttons = {};
                buttons[opts.bSubmit] = function() {
                    opts.apply_perm();
                    opts.cleanup(false);
                };
                buttons[opts.bCancel] = function() {
                    opts.cleanup(true);
                };
                return $.extend(true, {
                    "buttons": buttons,
                    "close": function() {
                        opts.cleanup(true);
                    },
					"modal" : opts.modal || false,
					"resizable": opts.resizable || true,
                    "width": opts.width+20
                }, opts.dialog_opts || {});
            },
            /* Function to get the permutation array, and pass it to the
               "done" function */
            "apply_perm" : function() {
                $('option',select).each(function() {
                    if (this.selected) {
                        self.jqGrid("showCol", colModel[this.value].name);
                    } else {
                        self.jqGrid("hideCol", colModel[this.value].name);
                    }
                });
                
                var perm = [];
				//fixedCols.slice(0);
                $('option:selected',select).each(function() { perm.push(parseInt(this.value,10)); });
                $.each(perm, function() { delete colMap[colModel[parseInt(this,10)].name]; });
                $.each(colMap, function() {
					var ti = parseInt(this,10);
					perm = insert(perm,ti,ti);
				});
                if (opts.done) {
                    opts.done.call(self, perm);
                }
            },
            /* Function to cleanup the dialog, and select. Also calls the
               done function with no permutation (to indicate that the
               columnChooser was aborted */
            "cleanup" : function(calldone) {
                call(opts.dlog, selector, 'destroy');
                call(opts.msel, select, 'destroy');
                selector.remove();
                if (calldone && opts.done) {
                    opts.done.call(self);
                }
            },
			"msel_opts" : {}
        }, $.jgrid.col, opts || {});
		if($.ui) {
			if ($.ui.multiselect ) {
				if(opts.msel === "multiselect") {
					if(!$.jgrid._multiselect) {
						// should be in language file
						alert("Multiselect plugin loaded after jqGrid. Please load the plugin before the jqGrid!");
						return;
					}
					opts.msel_opts = $.extend($.ui.multiselect.defaults,opts.msel_opts);
				}
			}
		}
        if (opts.caption) {
            selector.attr("title", opts.caption);
        }
        if (opts.classname) {
            selector.addClass(opts.classname);
            select.addClass(opts.classname);
        }
        if (opts.width) {
            $(">div",selector).css({"width": opts.width,"margin":"0 auto"});
            select.css("width", opts.width);
        }
        if (opts.height) {
            $(">div",selector).css("height", opts.height);
            select.css("height", opts.height - 10);
        }
        var colModel = self.jqGrid("getGridParam", "colModel");
        var colNames = self.jqGrid("getGridParam", "colNames");
        var colMap = {}, fixedCols = [];

        select.empty();
        $.each(colModel, function(i) {
            colMap[this.name] = i;
            if (this.hidedlg) {
                if (!this.hidden) {
                    fixedCols.push(i);
                }
                return;
            }

            select.append("<option value='"+i+"' "+
                          (this.hidden?"":"selected='selected'")+">"+$.jgrid.stripHtml(colNames[i])+"</option>");
        });
        function call(fn, obj) {
            if (!fn) { return; }
            if (typeof fn === 'string') {
                if ($.fn[fn]) {
                    $.fn[fn].apply(obj, $.makeArray(arguments).slice(2));
                }
            } else if ($.isFunction(fn)) {
                fn.apply(obj, $.makeArray(arguments).slice(2));
            }
        }

        var dopts = $.isFunction(opts.dlog_opts) ? opts.dlog_opts.call(self, opts) : opts.dlog_opts;
        call(opts.dlog, selector, dopts);
        var mopts = $.isFunction(opts.msel_opts) ? opts.msel_opts.call(self, opts) : opts.msel_opts;
        call(opts.msel, select, mopts);
    },
	sortableRows : function (opts) {
		// Can accept all sortable options and events
		return this.each(function(){
			var $t = this;
			if(!$t.grid) { return; }
			// Currently we disable a treeGrid sortable
			if($t.p.treeGrid) { return; }
			if($.fn.sortable) {
				opts = $.extend({
					"cursor":"move",
					"axis" : "y",
					"items": ".jqgrow"
					},
				opts || {});
				if(opts.start && $.isFunction(opts.start)) {
					opts._start_ = opts.start;
					delete opts.start;
				} else {opts._start_=false;}
				if(opts.update && $.isFunction(opts.update)) {
					opts._update_ = opts.update;
					delete opts.update;
				} else {opts._update_ = false;}
				opts.start = function(ev,ui) {
					$(ui.item).css("border-width","0px");
					$("td",ui.item).each(function(i){
						this.style.width = $t.grid.cols[i].style.width;
					});
					if($t.p.subGrid) {
						var subgid = $(ui.item).attr("id");
						try {
							$($t).jqGrid('collapseSubGridRow',subgid);
						} catch (e) {}
					}
					if(opts._start_) {
						opts._start_.apply(this,[ev,ui]);
					}
				};
				opts.update = function (ev,ui) {
					$(ui.item).css("border-width","");
					if($t.p.rownumbers === true) {
						$("td.jqgrid-rownum",$t.rows).each(function( i ){
							$(this).html( i+1+(parseInt($t.p.page,10)-1)*parseInt($t.p.rowNum,10) );
						});
					}
					if(opts._update_) {
						opts._update_.apply(this,[ev,ui]);
					}
				};
				$("tbody:first",$t).sortable(opts);
				$("tbody:first",$t).disableSelection();
			}
		});
	},
	gridDnD : function(opts) {
		return this.each(function(){
		var $t = this, i, cn;
		if(!$t.grid) { return; }
		// Currently we disable a treeGrid drag and drop
		if($t.p.treeGrid) { return; }
		if(!$.fn.draggable || !$.fn.droppable) { return; }
		function updateDnD ()
		{
			var datadnd = $.data($t,"dnd");
			$("tr.jqgrow:not(.ui-draggable)",$t).draggable($.isFunction(datadnd.drag) ? datadnd.drag.call($($t),datadnd) : datadnd.drag);
		}
		var appender = "<table id='jqgrid_dnd' class='ui-jqgrid-dnd'></table>";
		if($("#jqgrid_dnd")[0] === undefined) {
			$('body').append(appender);
		}

		if(typeof opts === 'string' && opts === 'updateDnD' && $t.p.jqgdnd===true) {
			updateDnD();
			return;
		}
		opts = $.extend({
			"drag" : function (opts) {
				return $.extend({
					start : function (ev, ui) {
						var i, subgid;
						// if we are in subgrid mode try to collapse the node
						if($t.p.subGrid) {
							subgid = $(ui.helper).attr("id");
							try {
								$($t).jqGrid('collapseSubGridRow',subgid);
							} catch (e) {}
						}
						// hack
						// drag and drop does not insert tr in table, when the table has no rows
						// we try to insert new empty row on the target(s)
						for (i=0;i<$.data($t,"dnd").connectWith.length;i++){
							if($($.data($t,"dnd").connectWith[i]).jqGrid('getGridParam','reccount') === 0 ){
								$($.data($t,"dnd").connectWith[i]).jqGrid('addRowData','jqg_empty_row',{});
							}
						}
						ui.helper.addClass("ui-state-highlight");
						$("td",ui.helper).each(function(i) {
							this.style.width = $t.grid.headers[i].width+"px";
						});
						if(opts.onstart && $.isFunction(opts.onstart) ) { opts.onstart.call($($t),ev,ui); }
					},
					stop :function(ev,ui) {
						var i, ids;
						if(ui.helper.dropped && !opts.dragcopy) {
							ids = $(ui.helper).attr("id");
							if(ids === undefined) { ids = $(this).attr("id"); }
							$($t).jqGrid('delRowData',ids );
						}
						// if we have a empty row inserted from start event try to delete it
						for (i=0;i<$.data($t,"dnd").connectWith.length;i++){
							$($.data($t,"dnd").connectWith[i]).jqGrid('delRowData','jqg_empty_row');
						}
						if(opts.onstop && $.isFunction(opts.onstop) ) { opts.onstop.call($($t),ev,ui); }
					}
				},opts.drag_opts || {});
			},
			"drop" : function (opts) {
				return $.extend({
					accept: function(d) {
						if (!$(d).hasClass('jqgrow')) { return d;}
						var tid = $(d).closest("table.ui-jqgrid-btable");
						if(tid.length > 0 && $.data(tid[0],"dnd") !== undefined) {
							var cn = $.data(tid[0],"dnd").connectWith;
							return $.inArray('#'+$.jgrid.jqID(this.id),cn) !== -1 ? true : false;
						}
						return false;
					},
					drop: function(ev, ui) {
						if (!$(ui.draggable).hasClass('jqgrow')) { return; }
						var accept = $(ui.draggable).attr("id");
						var getdata = ui.draggable.parent().parent().jqGrid('getRowData',accept);
						if(!opts.dropbyname) {
							var j =0, tmpdata = {}, nm, key;
							var dropmodel = $("#"+$.jgrid.jqID(this.id)).jqGrid('getGridParam','colModel');
							try {
								for (key in getdata) {
									if (getdata.hasOwnProperty(key)) {
									nm = dropmodel[j].name;
									if( !(nm === 'cb' || nm === 'rn' || nm === 'subgrid' )) {
										if(getdata.hasOwnProperty(key) && dropmodel[j]) {
											tmpdata[nm] = getdata[key];
										}
									}
									j++;
								}
								}
								getdata = tmpdata;
							} catch (e) {}
						}
						ui.helper.dropped = true;
						if(opts.beforedrop && $.isFunction(opts.beforedrop) ) {
							//parameters to this callback - event, element, data to be inserted, sender, reciever
							// should return object which will be inserted into the reciever
							var datatoinsert = opts.beforedrop.call(this,ev,ui,getdata,$('#'+$.jgrid.jqID($t.p.id)),$(this));
							if (datatoinsert !== undefined && datatoinsert !== null && typeof datatoinsert === "object") { getdata = datatoinsert; }
						}
						if(ui.helper.dropped) {
							var grid;
							if(opts.autoid) {
								if($.isFunction(opts.autoid)) {
									grid = opts.autoid.call(this,getdata);
								} else {
									grid = Math.ceil(Math.random()*1000);
									grid = opts.autoidprefix+grid;
								}
							}
							// NULL is interpreted as undefined while null as object
							$("#"+$.jgrid.jqID(this.id)).jqGrid('addRowData',grid,getdata,opts.droppos);
						}
						if(opts.ondrop && $.isFunction(opts.ondrop) ) { opts.ondrop.call(this,ev,ui, getdata); }
					}}, opts.drop_opts || {});
			},
			"onstart" : null,
			"onstop" : null,
			"beforedrop": null,
			"ondrop" : null,
			"drop_opts" : {
				"activeClass": "ui-state-active",
				"hoverClass": "ui-state-hover"
			},
			"drag_opts" : {
				"revert": "invalid",
				"helper": "clone",
				"cursor": "move",
				"appendTo" : "#jqgrid_dnd",
				"zIndex": 5000
			},
			"dragcopy": false,
			"dropbyname" : false,
			"droppos" : "first",
			"autoid" : true,
			"autoidprefix" : "dnd_"
		}, opts || {});
		
		if(!opts.connectWith) { return; }
		opts.connectWith = opts.connectWith.split(",");
		opts.connectWith = $.map(opts.connectWith,function(n){return $.trim(n);});
		$.data($t,"dnd",opts);
		
		if($t.p.reccount !== 0 && !$t.p.jqgdnd) {
			updateDnD();
		}
		$t.p.jqgdnd = true;
		for (i=0;i<opts.connectWith.length;i++){
			cn =opts.connectWith[i];
			$(cn).droppable($.isFunction(opts.drop) ? opts.drop.call($($t),opts) : opts.drop);
		}
		});
	},
	gridResize : function(opts) {
		return this.each(function(){
			var $t = this, gID = $.jgrid.jqID($t.p.id);
			if(!$t.grid || !$.fn.resizable) { return; }
			opts = $.extend({}, opts || {});
			if(opts.alsoResize ) {
				opts._alsoResize_ = opts.alsoResize;
				delete opts.alsoResize;
			} else {
				opts._alsoResize_ = false;
			}
			if(opts.stop && $.isFunction(opts.stop)) {
				opts._stop_ = opts.stop;
				delete opts.stop;
			} else {
				opts._stop_ = false;
			}
			opts.stop = function (ev, ui) {
				$($t).jqGrid('setGridParam',{height:$("#gview_"+gID+" .ui-jqgrid-bdiv").height()});
				$($t).jqGrid('setGridWidth',ui.size.width,opts.shrinkToFit);
				if(opts._stop_) { opts._stop_.call($t,ev,ui); }
			};
			if(opts._alsoResize_) {
				var optstest = "{\'#gview_"+gID+" .ui-jqgrid-bdiv\':true,'" +opts._alsoResize_+"':true}";
				opts.alsoResize = eval('('+optstest+')'); // the only way that I found to do this
			} else {
				opts.alsoResize = $(".ui-jqgrid-bdiv","#gview_"+gID);
			}
			delete opts._alsoResize_;
			$("#gbox_"+gID).resizable(opts);
		});
	}
});
})(jQuery);
/*
 Transform a table to a jqGrid.
 Peter Romianowski <peter.romianowski@optivo.de> 
 If the first column of the table contains checkboxes or
 radiobuttons then the jqGrid is made selectable.
*/
// Addition - selector can be a class or id
function tableToGrid(selector, options) {
jQuery(selector).each(function() {
	if(this.grid) {return;} //Adedd from Tony Tomov
	// This is a small "hack" to make the width of the jqGrid 100%
	jQuery(this).width("99%");
	var w = jQuery(this).width();

	// Text whether we have single or multi select
	var inputCheckbox = jQuery('tr td:first-child input[type=checkbox]:first', jQuery(this));
	var inputRadio = jQuery('tr td:first-child input[type=radio]:first', jQuery(this));
	var selectMultiple = inputCheckbox.length > 0;
	var selectSingle = !selectMultiple && inputRadio.length > 0;
	var selectable = selectMultiple || selectSingle;
	//var inputName = inputCheckbox.attr("name") || inputRadio.attr("name");

	// Build up the columnModel and the data
	var colModel = [];
	var colNames = [];
	jQuery('th', jQuery(this)).each(function() {
		if (colModel.length === 0 && selectable) {
			colModel.push({
				name: '__selection__',
				index: '__selection__',
				width: 0,
				hidden: true
			});
			colNames.push('__selection__');
		} else {
			colModel.push({
				name: jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(' ').join('_'),
				index: jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(' ').join('_'),
				width: jQuery(this).width() || 150
			});
			colNames.push(jQuery(this).html());
		}
	});
	var data = [];
	var rowIds = [];
	var rowChecked = [];
	jQuery('tbody > tr', jQuery(this)).each(function() {
		var row = {};
		var rowPos = 0;
		jQuery('td', jQuery(this)).each(function() {
			if (rowPos === 0 && selectable) {
				var input = jQuery('input', jQuery(this));
				var rowId = input.attr("value");
				rowIds.push(rowId || data.length);
				if (input.is(":checked")) {
					rowChecked.push(rowId);
				}
				row[colModel[rowPos].name] = input.attr("value");
			} else {
				row[colModel[rowPos].name] = jQuery(this).html();
			}
			rowPos++;
		});
		if(rowPos >0) { data.push(row); }
	});

	// Clear the original HTML table
	jQuery(this).empty();

	// Mark it as jqGrid
	jQuery(this).addClass("scroll");

	jQuery(this).jqGrid(jQuery.extend({
		datatype: "local",
		width: w,
		colNames: colNames,
		colModel: colModel,
		multiselect: selectMultiple
		//inputName: inputName,
		//inputValueCol: imputName != null ? "__selection__" : null
	}, options || {}));

	// Add data
	var a;
	for (a = 0; a < data.length; a++) {
		var id = null;
		if (rowIds.length > 0) {
			id = rowIds[a];
			if (id && id.replace) {
				// We have to do this since the value of a checkbox
				// or radio button can be anything 
				id = encodeURIComponent(id).replace(/[.\-%]/g, "_");
			}
		}
		if (id === null) {
			id = a + 1;
		}
		jQuery(this).jqGrid("addRowData",id, data[a]);
	}

	// Set the selection
	for (a = 0; a < rowChecked.length; a++) {
		jQuery(this).jqGrid("setSelection",rowChecked[a]);
	}
});
};
;(function($){
/**
 * jqGrid Russian Translation v1.0 02.07.2009 (based on translation by Alexey Kanaev v1.1 21.01.2009, http://softcore.com.ru)
 * Sergey Dyagovchenko
 * http://d.sumy.ua
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
**/
$.jgrid = $.jgrid || {};
$.extend($.jgrid,{
	defaults : {
		recordtext: "Просмотр {0} - {1} из {2}",
	  emptyrecords: "Нет записей для просмотра",
		loadtext: "Загрузка...",
		pgtext : "Стр. {0} из {1}"
	},
	search : {
    caption: "Поиск...",
    Find: "Найти",
    Reset: "Сброс",
    odata: [{ oper:'eq', text:"равно"},{ oper:'ne', text:"не равно"},{ oper:'lt', text:"меньше"},{ oper:'le', text:"меньше или равно"},{ oper:'gt', text:"больше"},{ oper:'ge', text:"больше или равно"},{ oper:'bw', text:"начинается с"},{ oper:'bn', text:"не начинается с"},{ oper:'in', text:"находится в"},{ oper:'ni', text:"не находится в"},{ oper:'ew', text:"заканчивается на"},{ oper:'en', text:"не заканчивается на"},{ oper:'cn', text:"содержит"},{ oper:'nc', text:"не содержит"}],
    groupOps: [	{ op: "AND", text: "И" },	{ op: "OR",  text: "ИЛИ" }	]
	},
	edit : {
    addCaption: "Добавить запись",
    editCaption: "Редактировать запись",
    bSubmit: "Сохранить",
    bCancel: "Отмена",
		bClose: "Закрыть",
		saveData: "Данные были измененны! Сохранить изменения?",
		bYes : "Да",
		bNo : "Нет",
		bExit : "Отмена",
	    msg: {
        required:"Поле является обязательным",
        number:"Пожалуйста, введите правильное число",
        minValue:"значение должно быть больше либо равно",
        maxValue:"значение должно быть меньше либо равно",
        email: "некорректное значение e-mail",
        integer: "Пожалуйста, введите целое число",
        date: "Пожалуйста, введите правильную дату",
        url: "неверная ссылка. Необходимо ввести префикс ('http://' или 'https://')",
		nodefined : " не определено!",
		novalue : " возвращаемое значение обязательно!",
		customarray : "Пользовательская функция должна возвращать массив!",
		customfcheck : "Пользовательская функция должна присутствовать в случаи пользовательской проверки!"
		}
	},
	view : {
	    caption: "Просмотр записи",
	    bClose: "Закрыть"
	},
	del : {
	    caption: "Удалить",
	    msg: "Удалить выбранную запись(и)?",
	    bSubmit: "Удалить",
	    bCancel: "Отмена"
	},
	nav : {
  		edittext: " ",
	    edittitle: "Редактировать выбранную запись",
  		addtext:" ",
	    addtitle: "Добавить новую запись",
	    deltext: " ",
	    deltitle: "Удалить выбранную запись",
	    searchtext: " ",
	    searchtitle: "Найти записи",
	    refreshtext: "",
	    refreshtitle: "Обновить таблицу",
	    alertcap: "Внимание",
	    alerttext: "Пожалуйста, выберите запись",
  		viewtext: "",
  		viewtitle: "Просмотреть выбранную запись"
	},
	col : {
	    caption: "Показать/скрыть столбцы",
	    bSubmit: "Сохранить",
	    bCancel: "Отмена"	
	},
	errors : {
		errcap : "Ошибка",
		nourl : "URL не установлен",
		norecords: "Нет записей для обработки",
    model : "Число полей не соответствует числу столбцов таблицы!"
	},
	formatter : {
		integer : {thousandsSeparator: " ", defaultValue: '0'},
		number : {decimalSeparator:",", thousandsSeparator: " ", decimalPlaces: 2, defaultValue: '0,00'},
		currency : {decimalSeparator:",", thousandsSeparator: " ", decimalPlaces: 2, prefix: "", suffix:"", defaultValue: '0,00'},
		date : {
			dayNames:   [
				"Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб",
				"Воскресение", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"
			],
			monthNames: [
				"Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек",
				"Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
			],
			AmPm : ["am","pm","AM","PM"],
			S: function (j) {return j < 11 || j > 13 ? ['st', 'nd', 'rd', 'th'][Math.min((j - 1) % 10, 3)] : 'th'},
			srcformat: 'Y-m-d',
			newformat: 'd.m.Y',
			parseRe : /[Tt\\\/:_;.,\t\s-]/,
			masks : {
	            ISO8601Long:"Y-m-d H:i:s",
	            ISO8601Short:"Y-m-d",
	            ShortDate: "n.j.Y",
	            LongDate: "l, F d, Y",
	            FullDateTime: "l, F d, Y G:i:s",
	            MonthDay: "F d",
	            ShortTime: "G:i",
	            LongTime: "G:i:s",
	            SortableDateTime: "Y-m-d\\TH:i:s",
	            UniversalSortableDateTime: "Y-m-d H:i:sO",
	            YearMonth: "F, Y"
	        },
	        reformatAfterEdit : false
		},
		baseLinkUrl: '',
		showAction: '',
	  target: '',
	  checkbox : {disabled:true},
		idName : 'id'
	}
});
})(jQuery);
