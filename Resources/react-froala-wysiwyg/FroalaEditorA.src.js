!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("react"),require("froala-editor")):"function"==typeof define&&define.amd?define(["react","froala-editor"],e):"object"==typeof exports?exports.FroalaEditorA=e(require("react"),require("froala-editor")):t.FroalaEditorA=e(t.React,t["froala-editor"])}(window,(function(t,e){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=5)}([function(e,n){e.exports=t},function(t,e,n){"use strict";n.d(e,"a",(function(){return h}));var r=n(2),o=n.n(r),i=n(0);function c(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function u(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function s(t){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function a(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function l(t,e){return(l=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t})(t,e)}function f(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=d(t);if(e){var o=d(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return p(this,n)}}function p(t,e){if(e&&("object"===s(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var h=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&l(t,e)}(p,t);var e,n,r,i=f(p);function p(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,p),(e=i.call(this,t)).defaultTag="div",e.tag=t.tag||e.defaultTag,e.listeningEvents=[],e.element=null,e.editor=null,e.config={immediateReactModelUpdate:!1,reactIgnoreAttrs:null},e.editorInitialized=!1,e.SPECIAL_TAGS=["img","button","input","a"],e.INNER_HTML_ATTR="innerHTML",e.hasSpecialTag=!1,e.oldModel=null,e}return e=p,(n=[{key:"componentDidMount",value:function(){var t=this.el.tagName.toLowerCase();-1!=this.SPECIAL_TAGS.indexOf(t)&&(this.tag=t,this.hasSpecialTag=!0),this.props.onManualControllerReady?this.generateManualController():this.createEditor()}},{key:"componentWillUnmount",value:function(){this.destroyEditor()}},{key:"componentDidUpdate",value:function(){JSON.stringify(this.oldModel)!=JSON.stringify(this.props.model)&&this.setContent()}},{key:"clone",value:function(t){var e,n=this;if(!t)return t;if([Number,String,Boolean].forEach((function(n){t instanceof n&&(e=n(t))})),void 0===e)if("[object Array]"===Object.prototype.toString.call(t))e=[],t.forEach((function(t,r,o){e[r]=n.clone(t)}));else if("object"==s(t))if(t.nodeType&&"function"==typeof t.cloneNode)e=t.cloneNode(!0);else if(t.prototype)e=t;else if(t instanceof Date)e=new Date(t);else for(var r in e={},t)e[r]=n.clone(t[r]);else e=t;return e}},{key:"createEditor",value:function(){var t=this;this.editorInitialized||(this.config=this.clone(this.props.config||this.config),this.config=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?c(Object(n),!0).forEach((function(e){u(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}({},this.config),this.element=this.el,this.setContent(!0),this.registerEvent("initialized",this.config.events&&this.config.events.initialized),this.config.events||(this.config.events={}),this.config.events.initialized=function(){return t.initListeners()},this.editor=new o.a(this.element,this.config))}},{key:"setContent",value:function(t){(this.props.model||""==this.props.model)&&(this.oldModel=this.props.model,this.hasSpecialTag?this.setSpecialTagContent():this.setNormalTagContent(t))}},{key:"setNormalTagContent",value:function(t){var e=this,n=this;function r(){n.editor.html&&n.editor.html.set(n.props.model||""),n.editorInitialized&&n.editor.undo&&(n.props.skipReset||n.editor.undo.reset(),n.editor.undo.saveStep())}t?this.config.initOnClick?(this.registerEvent("initializationDelayed",(function(){r()})),this.registerEvent("initialized",(function(){e.editorInitialized=!0}))):this.registerEvent("initialized",(function(){e.editorInitialized=!0,r()})):r()}},{key:"setSpecialTagContent",value:function(){var t=this.props.model;if(t){for(var e in t)t.hasOwnProperty(e)&&e!=this.INNER_HTML_ATTR&&this.element.setAttribute(e,t[e]);t.hasOwnProperty(this.INNER_HTML_ATTR)&&(this.element.innerHTML=t[this.INNER_HTML_ATTR])}}},{key:"destroyEditor",value:function(){if(this.element){this.editor.destroy&&this.editor.destroy(),this.listeningEvents.length=0,this.element=null,this.editorInitialized=!1,this.config={immediateReactModelUpdate:!1,reactIgnoreAttrs:null};var t=this.el.tagName.toLowerCase();-1==this.SPECIAL_TAGS.indexOf(t)&&this.editor&&this.editor.destrying&&!this.props.onManualControllerReady&&"textarea"==this.tag&&this.editor.$box.remove(),"textarea"!=this.tag&&(this.editor.$wp="")}}},{key:"getEditor",value:function(){return this.element?this.editor:null}},{key:"generateManualController",value:function(){var t=this,e={initialize:function(){return t.createEditor.call(t)},destroy:function(){return t.destroyEditor.call(t)},getEditor:function(){return t.getEditor.call(t)}};this.props.onManualControllerReady(e)}},{key:"updateModel",value:function(){if(this.props.onModelChange){var t="";if(this.hasSpecialTag){for(var e=this.element.attributes,n={},r=0;r<e.length;r++){var o=e[r].name;this.config.reactIgnoreAttrs&&-1!=this.config.reactIgnoreAttrs.indexOf(o)||(n[o]=e[r].value)}this.element.innerHTML&&(n[this.INNER_HTML_ATTR]=this.element.innerHTML),t=n}else{var i=this.editor.html.get();"string"==typeof i&&(t=i)}this.oldModel=t,this.props.onModelChange(t)}}},{key:"initListeners",value:function(){var t=this;if(this.editor&&this.editor.events&&this.editor.events.on("contentChanged",(function(){t.updateModel()})),this.config.immediateReactModelUpdate&&this.editor.events.on("keyup",(function(){t.updateModel()})),this._initEvents)for(var e=0;e<this._initEvents.length;e++)this._initEvents[e].call(this.editor)}},{key:"registerEvent",value:function(t,e){t&&e&&("initialized"==t?(this._initEvents||(this._initEvents=[]),this._initEvents.push(e)):(this.config.events||(this.config.events={}),this.config.events[t]=e))}}])&&a(e.prototype,n),r&&a(e,r),Object.defineProperty(e,"prototype",{writable:!1}),p}(n.n(i).a.Component)},function(t,n){t.exports=e},,,function(t,e,n){t.exports=n(6)},function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return d}));var r=n(1),o=n(0),i=n.n(o);function c(t){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function u(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function a(t,e){return(a=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t})(t,e)}function l(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=p(t);if(e){var o=p(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return f(this,n)}}function f(t,e){if(e&&("object"===c(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var d=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&a(t,e)}(c,t);var e,n,r,o=l(c);function c(){return u(this,c),o.apply(this,arguments)}return e=c,(n=[{key:"render",value:function(){var t=this;return i.a.createElement("a",{ref:function(e){return t.el=e}},this.props.children)}}])&&s(e.prototype,n),r&&s(e,r),Object.defineProperty(e,"prototype",{writable:!1}),c}(r.a)}])}));