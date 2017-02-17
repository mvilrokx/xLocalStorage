var xLocalStorage =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./iFrameFactory'), require('./requestFactory'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.iFrameFactory, global.requestFactory);
    global.clientFactory = mod.exports;
  }
})(this, function (exports, _iFrameFactory, _requestFactory) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _iFrameFactory2 = _interopRequireDefault(_iFrameFactory);

  var _requestFactory2 = _interopRequireDefault(_requestFactory);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var clientFactory = function clientFactory(options) {
    // PRIVATE
    var targetOrigin = '*';
    var iframe = void 0;
    var server = void 0;
    var connected = false;
    var connectPromiseResolve = void 0;
    var connectedEvent = new Event('connected');
    var disconnectedEvent = new Event('disconnected');
    var requests = [];

    var defaultOptions = {
      timeout: 5000 };

    var config = Object.assign({}, defaultOptions, options);

    var messageListener = function messageListener(messageEvent) {
      if (messageEvent.data === 'x-local-storage-ready') {
        connected = true;
        document.dispatchEvent(connectedEvent);
        connectPromiseResolve();
      } else if (requests[messageEvent.data.id]) {
        // Fullfil promise created on request
        requests[messageEvent.data.id](messageEvent.data.error, messageEvent.data.response);
      }
    };

    var request = function request(params) {
      var req = (0, _requestFactory2.default)(params);

      return new Promise(function (resolve, reject) {
        // This will reject the request if it takes to long to fullfill
        var timeout = setTimeout(function () {
          if (!requests[req.id]) return;
          delete requests[req.id];
          reject(new Error('Timeout: could not perform your request.'));
        }, config.timeout);

        // This will get called when receiving the response from the postMessage,
        // fullfilling the promise and removing the timeout set above to avoid reject
        requests[req.id] = function (err, result) {
          /* eslint consistent-return: 0 */
          clearTimeout(timeout);
          delete requests[req.id];
          if (err) return reject(new Error(err));
          resolve(result);
        };

        server.postMessage(req, targetOrigin);
      });
    };

    // PUBLIC
    var connect = function connect(url) {
      return new Promise(function (resolve, reject) {
        try {
          targetOrigin = url;
          iframe = (0, _iFrameFactory2.default)({ src: url });
          // Note that this might error out with a net::ERR_CONNECTION_REFUSED
          // when the url of the iFrame is unreachable.  This error DOES NOT
          // get caught by the catch block unfortunately (this is by design as per browser specs)
          // This is why we check manually if the connection works, by having the
          // iframe send a postMessage to this page and only if we receive that message
          // do we set connected = true
          document.body.appendChild(iframe); // Side Effect!!! ¯\_(ツ)_/¯

          server = iframe.contentWindow;

          window.addEventListener('message', messageListener, false);
          connectPromiseResolve = resolve;
        } catch (err) {
          reject(err);
        }
      });
    };

    var disconnect = function disconnect() {
      iframe.parentNode.removeChild(iframe); // This works on ALL platforms
      window.removeEventListener('message', messageListener, false);
      connected = false;
      document.dispatchEvent(disconnectedEvent);
    };

    var isConnected = function isConnected() {
      return connected;
    };

    var on = function on(event, cb) {
      return document.addEventListener(event, cb, false);
    };

    var clear = function clear() {
      return request();
    };

    var getItem = function getItem(key) {
      return request(key);
    };

    var setItem = function setItem(dataObject) {
      return request(dataObject);
    };

    var removeItem = function removeItem(key) {
      return request({ x_delete: key });
    };

    var getItems = function getItems(keys) {
      return request(keys);
    };

    var setItems = function setItems(dataObjects) {
      return request(dataObjects);
    };

    var removeItems = function removeItems(keys) {
      return request({ x_delete: keys });
    };

    return {
      connect: connect,
      disconnect: disconnect,
      isConnected: isConnected,
      on: on,
      getItem: getItem,
      getItems: getItems,
      setItem: setItem,
      setItems: setItems,
      removeItem: removeItem,
      removeItems: removeItems,
      clear: clear
    };
  };

  exports.default = clientFactory;
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.server = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var server = function server() {
    // PRIVATE
    var targetOrigin = '*';

    var clear = function clear() {
      return localStorage.clear();
    };
    var getItem = function getItem(key) {
      return localStorage.getItem(key);
    };
    var removeItem = function removeItem(key) {
      return localStorage.removeItem(key);
    };
    var setItem = function setItem(key, value) {
      return localStorage.setItem(key, value);
    };

    var getItems = function getItems(keys) {
      return keys.map(getItem);
    };
    var removeItems = function removeItems(keys) {
      return keys.forEach(removeItem);
    };
    var setItems = function setItems(data) {
      data.map(function (dataObject) {
        return Object.keys(dataObject).forEach(function (key) {
          setItem(key, dataObject[key]);
        });
      });
    };

    var messageListener = function messageListener(messageEvent) {
      var error = void 0;
      if (messageEvent.data === 'x-local-storage-ready') return;
      var requestData = messageEvent.data.params;
      var responseData = {
        id: messageEvent.data.id,
        error: error,
        response: []
      };

      // Dispatch the request
      if (!requestData || requestData === null) {
        clear();
      } else if ((typeof requestData === 'undefined' ? 'undefined' : _typeof(requestData)) !== 'object') {
        var _responseData$respons;

        (_responseData$respons = responseData.response).push.apply(_responseData$respons, _toConsumableArray(getItems([requestData])));
      } else if (requestData.x_delete) {
        if (Array.isArray(requestData.x_delete)) {
          removeItems(requestData.x_delete);
        } else {
          removeItem([requestData.x_delete]);
        }
      } else if (Array.isArray(requestData)) {
        if (_typeof(requestData[0]) === 'object') {
          setItems(requestData);
        } else {
          var _responseData$respons2;

          (_responseData$respons2 = responseData.response).push.apply(_responseData$respons2, _toConsumableArray(getItems(requestData)));
        }
      } else {
        setItems([requestData]);
      }

      if (responseData.response.length > 1) {
        responseData.response = responseData.response;
      } else {
        responseData.response = responseData.response[0];
      }
      window.parent.postMessage(responseData, targetOrigin);
    };

    window.addEventListener('message', messageListener, false);
    // Announce readiness to client
    window.parent.postMessage('x-local-storage-ready', targetOrigin);
  };

  exports.default = server;
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.iFrameFactory = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var iFrameFactory = function iFrameFactory(options) {
    var defaultOptions = {
      id: 'x-local-storage',
      loadEventListener: function loadEventListener() {
        return function () {
          // TODO: Put something usefull here
        };
      }
    };

    var defaultStyles = {
      display: 'none',
      position: 'absolute',
      top: '-999px',
      left: '-999px'
    };

    var defaultLoadEventListener = function defaultLoadEventListener() {
      var iFrameReadyEvent = new Event('x-local-storage-ready');
      parent.document.dispatchEvent(iFrameReadyEvent);
    };

    var config = Object.assign({}, defaultOptions, options);
    var styles = Object.assign({}, defaultStyles, options.styles);

    var iFrame = document.createElement('iframe');

    iFrame.id = config.id;
    iFrame.addEventListener('load', defaultLoadEventListener);
    iFrame.addEventListener('load', config.loadEventListener(iFrame));

    iFrame.src = config.src;
    Object.assign(iFrame.style, styles);

    return iFrame;
  };

  exports.default = iFrameFactory;
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.requestFactory = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var uniqueId = 0;

  var requestFactory = function requestFactory(params) {
    uniqueId += 1;

    var request = {
      id: uniqueId,
      params: params
    };

    return request;
  };

  exports.default = requestFactory;
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(0), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./lib/clientFactory'), require('./lib/server'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.clientFactory, global.server);
    global.index = mod.exports;
  }
})(this, function (exports, _clientFactory, _server) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.server = exports.clientFactory = undefined;

  var _clientFactory2 = _interopRequireDefault(_clientFactory);

  var _server2 = _interopRequireDefault(_server);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.clientFactory = _clientFactory2.default;
  exports.server = _server2.default;
});

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNGMxNTkxYWQyZmQyN2FjMzM2NDgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9jbGllbnRGYWN0b3J5LmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvc2VydmVyLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvaUZyYW1lRmFjdG9yeS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL3JlcXVlc3RGYWN0b3J5LmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjbGllbnRGYWN0b3J5Iiwib3B0aW9ucyIsInRhcmdldE9yaWdpbiIsImlmcmFtZSIsInNlcnZlciIsImNvbm5lY3RlZCIsImNvbm5lY3RQcm9taXNlUmVzb2x2ZSIsImNvbm5lY3RlZEV2ZW50IiwiRXZlbnQiLCJkaXNjb25uZWN0ZWRFdmVudCIsInJlcXVlc3RzIiwiZGVmYXVsdE9wdGlvbnMiLCJ0aW1lb3V0IiwiY29uZmlnIiwiT2JqZWN0IiwiYXNzaWduIiwibWVzc2FnZUxpc3RlbmVyIiwibWVzc2FnZUV2ZW50IiwiZGF0YSIsImRvY3VtZW50IiwiZGlzcGF0Y2hFdmVudCIsImlkIiwiZXJyb3IiLCJyZXNwb25zZSIsInJlcXVlc3QiLCJwYXJhbXMiLCJyZXEiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInNldFRpbWVvdXQiLCJFcnJvciIsImVyciIsInJlc3VsdCIsImNsZWFyVGltZW91dCIsInBvc3RNZXNzYWdlIiwiY29ubmVjdCIsInVybCIsInNyYyIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNvbnRlbnRXaW5kb3ciLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZGlzY29ubmVjdCIsInBhcmVudE5vZGUiLCJyZW1vdmVDaGlsZCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJpc0Nvbm5lY3RlZCIsIm9uIiwiZXZlbnQiLCJjYiIsImNsZWFyIiwiZ2V0SXRlbSIsImtleSIsInNldEl0ZW0iLCJkYXRhT2JqZWN0IiwicmVtb3ZlSXRlbSIsInhfZGVsZXRlIiwiZ2V0SXRlbXMiLCJrZXlzIiwic2V0SXRlbXMiLCJkYXRhT2JqZWN0cyIsInJlbW92ZUl0ZW1zIiwibG9jYWxTdG9yYWdlIiwidmFsdWUiLCJtYXAiLCJmb3JFYWNoIiwicmVxdWVzdERhdGEiLCJyZXNwb25zZURhdGEiLCJwdXNoIiwiQXJyYXkiLCJpc0FycmF5IiwibGVuZ3RoIiwicGFyZW50IiwiaUZyYW1lRmFjdG9yeSIsImxvYWRFdmVudExpc3RlbmVyIiwiZGVmYXVsdFN0eWxlcyIsImRpc3BsYXkiLCJwb3NpdGlvbiIsInRvcCIsImxlZnQiLCJkZWZhdWx0TG9hZEV2ZW50TGlzdGVuZXIiLCJpRnJhbWVSZWFkeUV2ZW50Iiwic3R5bGVzIiwiaUZyYW1lIiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwidW5pcXVlSWQiLCJyZXF1ZXN0RmFjdG9yeSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REEsTUFBTUEsZ0JBQWdCLFNBQVNBLGFBQVQsQ0FBdUJDLE9BQXZCLEVBQWdDO0FBQ3BEO0FBQ0EsUUFBSUMsZUFBZSxHQUFuQjtBQUNBLFFBQUlDLGVBQUo7QUFDQSxRQUFJQyxlQUFKO0FBQ0EsUUFBSUMsWUFBWSxLQUFoQjtBQUNBLFFBQUlDLDhCQUFKO0FBQ0EsUUFBTUMsaUJBQWlCLElBQUlDLEtBQUosQ0FBVSxXQUFWLENBQXZCO0FBQ0EsUUFBTUMsb0JBQW9CLElBQUlELEtBQUosQ0FBVSxjQUFWLENBQTFCO0FBQ0EsUUFBTUUsV0FBVyxFQUFqQjs7QUFFQSxRQUFNQyxpQkFBaUI7QUFDckJDLGVBQVMsSUFEWSxFQUF2Qjs7QUFJQSxRQUFNQyxTQUFTQyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkosY0FBbEIsRUFBa0NWLE9BQWxDLENBQWY7O0FBRUEsUUFBTWUsa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDQyxZQUFELEVBQWtCO0FBQ3hDLFVBQUlBLGFBQWFDLElBQWIsS0FBc0IsdUJBQTFCLEVBQW1EO0FBQ2pEYixvQkFBWSxJQUFaO0FBQ0FjLGlCQUFTQyxhQUFULENBQXVCYixjQUF2QjtBQUNBRDtBQUNELE9BSkQsTUFJTyxJQUFJSSxTQUFTTyxhQUFhQyxJQUFiLENBQWtCRyxFQUEzQixDQUFKLEVBQW9DO0FBQ3pDO0FBQ0FYLGlCQUFTTyxhQUFhQyxJQUFiLENBQWtCRyxFQUEzQixFQUErQkosYUFBYUMsSUFBYixDQUFrQkksS0FBakQsRUFBd0RMLGFBQWFDLElBQWIsQ0FBa0JLLFFBQTFFO0FBQ0Q7QUFDRixLQVREOztBQVdBLFFBQU1DLFVBQVUsU0FBVkEsT0FBVSxDQUFDQyxNQUFELEVBQVk7QUFDMUIsVUFBTUMsTUFBTSw4QkFBZUQsTUFBZixDQUFaOztBQUVBLGFBQU8sSUFBSUUsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QztBQUNBLFlBQU1qQixVQUFVa0IsV0FBVyxZQUFNO0FBQy9CLGNBQUksQ0FBQ3BCLFNBQVNnQixJQUFJTCxFQUFiLENBQUwsRUFBdUI7QUFDdkIsaUJBQU9YLFNBQVNnQixJQUFJTCxFQUFiLENBQVA7QUFDQVEsaUJBQU8sSUFBSUUsS0FBSixDQUFVLDBDQUFWLENBQVA7QUFDRCxTQUplLEVBSWJsQixPQUFPRCxPQUpNLENBQWhCOztBQU1BO0FBQ0E7QUFDQUYsaUJBQVNnQixJQUFJTCxFQUFiLElBQW1CLFVBQUNXLEdBQUQsRUFBTUMsTUFBTixFQUFpQjtBQUNsQztBQUNBQyx1QkFBYXRCLE9BQWI7QUFDQSxpQkFBT0YsU0FBU2dCLElBQUlMLEVBQWIsQ0FBUDtBQUNBLGNBQUlXLEdBQUosRUFBUyxPQUFPSCxPQUFPLElBQUlFLEtBQUosQ0FBVUMsR0FBVixDQUFQLENBQVA7QUFDVEosa0JBQVFLLE1BQVI7QUFDRCxTQU5EOztBQVFBN0IsZUFBTytCLFdBQVAsQ0FBbUJULEdBQW5CLEVBQXdCeEIsWUFBeEI7QUFDRCxPQW5CTSxDQUFQO0FBb0JELEtBdkJEOztBQTBCQTtBQUNBLFFBQU1rQyxVQUFVLFNBQVZBLE9BQVU7QUFBQSxhQUFPLElBQUlULE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEQsWUFBSTtBQUNGM0IseUJBQWVtQyxHQUFmO0FBQ0FsQyxtQkFBUyw2QkFBYyxFQUFFbUMsS0FBS0QsR0FBUCxFQUFkLENBQVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQWxCLG1CQUFTb0IsSUFBVCxDQUFjQyxXQUFkLENBQTBCckMsTUFBMUIsRUFURSxDQVNnQzs7QUFFbENDLG1CQUFTRCxPQUFPc0MsYUFBaEI7O0FBRUFDLGlCQUFPQyxnQkFBUCxDQUF3QixTQUF4QixFQUFtQzNCLGVBQW5DLEVBQW9ELEtBQXBEO0FBQ0FWLGtDQUF3QnNCLE9BQXhCO0FBQ0QsU0FmRCxDQWVFLE9BQU9JLEdBQVAsRUFBWTtBQUNaSCxpQkFBT0csR0FBUDtBQUNEO0FBQ0YsT0FuQnNCLENBQVA7QUFBQSxLQUFoQjs7QUFxQkEsUUFBTVksYUFBYSxTQUFiQSxVQUFhLEdBQU07QUFDdkJ6QyxhQUFPMEMsVUFBUCxDQUFrQkMsV0FBbEIsQ0FBOEIzQyxNQUE5QixFQUR1QixDQUNlO0FBQ3RDdUMsYUFBT0ssbUJBQVAsQ0FBMkIsU0FBM0IsRUFBc0MvQixlQUF0QyxFQUF1RCxLQUF2RDtBQUNBWCxrQkFBWSxLQUFaO0FBQ0FjLGVBQVNDLGFBQVQsQ0FBdUJYLGlCQUF2QjtBQUNELEtBTEQ7O0FBT0EsUUFBTXVDLGNBQWMsU0FBZEEsV0FBYztBQUFBLGFBQU0zQyxTQUFOO0FBQUEsS0FBcEI7O0FBRUEsUUFBTTRDLEtBQUssU0FBTEEsRUFBSyxDQUFDQyxLQUFELEVBQVFDLEVBQVI7QUFBQSxhQUFlaEMsU0FBU3dCLGdCQUFULENBQTBCTyxLQUExQixFQUFpQ0MsRUFBakMsRUFBcUMsS0FBckMsQ0FBZjtBQUFBLEtBQVg7O0FBRUEsUUFBTUMsUUFBUSxTQUFSQSxLQUFRO0FBQUEsYUFBTTVCLFNBQU47QUFBQSxLQUFkOztBQUVBLFFBQU02QixVQUFVLFNBQVZBLE9BQVU7QUFBQSxhQUFPN0IsUUFBUThCLEdBQVIsQ0FBUDtBQUFBLEtBQWhCOztBQUVBLFFBQU1DLFVBQVUsU0FBVkEsT0FBVTtBQUFBLGFBQWMvQixRQUFRZ0MsVUFBUixDQUFkO0FBQUEsS0FBaEI7O0FBRUEsUUFBTUMsYUFBYSxTQUFiQSxVQUFhO0FBQUEsYUFBT2pDLFFBQVEsRUFBRWtDLFVBQVVKLEdBQVosRUFBUixDQUFQO0FBQUEsS0FBbkI7O0FBRUEsUUFBTUssV0FBVyxTQUFYQSxRQUFXO0FBQUEsYUFBUW5DLFFBQVFvQyxJQUFSLENBQVI7QUFBQSxLQUFqQjs7QUFFQSxRQUFNQyxXQUFXLFNBQVhBLFFBQVc7QUFBQSxhQUFlckMsUUFBUXNDLFdBQVIsQ0FBZjtBQUFBLEtBQWpCOztBQUVBLFFBQU1DLGNBQWMsU0FBZEEsV0FBYztBQUFBLGFBQVF2QyxRQUFRLEVBQUVrQyxVQUFVRSxJQUFaLEVBQVIsQ0FBUjtBQUFBLEtBQXBCOztBQUVBLFdBQU87QUFDTHhCLHNCQURLO0FBRUxRLDRCQUZLO0FBR0xJLDhCQUhLO0FBSUxDLFlBSks7QUFLTEksc0JBTEs7QUFNTE0sd0JBTks7QUFPTEosc0JBUEs7QUFRTE0sd0JBUks7QUFTTEosNEJBVEs7QUFVTE0sOEJBVks7QUFXTFg7QUFYSyxLQUFQO0FBYUQsR0FsSEQ7O29CQW9IZXBELGE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkhmLE1BQU1JLFNBQVMsU0FBU0EsTUFBVCxHQUFrQjtBQUMvQjtBQUNBLFFBQU1GLGVBQWUsR0FBckI7O0FBRUEsUUFBTWtELFFBQVEsU0FBUkEsS0FBUTtBQUFBLGFBQU1ZLGFBQWFaLEtBQWIsRUFBTjtBQUFBLEtBQWQ7QUFDQSxRQUFNQyxVQUFVLFNBQVZBLE9BQVU7QUFBQSxhQUFPVyxhQUFhWCxPQUFiLENBQXFCQyxHQUFyQixDQUFQO0FBQUEsS0FBaEI7QUFDQSxRQUFNRyxhQUFhLFNBQWJBLFVBQWE7QUFBQSxhQUFPTyxhQUFhUCxVQUFiLENBQXdCSCxHQUF4QixDQUFQO0FBQUEsS0FBbkI7QUFDQSxRQUFNQyxVQUFVLFNBQVZBLE9BQVUsQ0FBQ0QsR0FBRCxFQUFNVyxLQUFOO0FBQUEsYUFBZ0JELGFBQWFULE9BQWIsQ0FBcUJELEdBQXJCLEVBQTBCVyxLQUExQixDQUFoQjtBQUFBLEtBQWhCOztBQUVBLFFBQU1OLFdBQVcsU0FBWEEsUUFBVztBQUFBLGFBQVFDLEtBQUtNLEdBQUwsQ0FBU2IsT0FBVCxDQUFSO0FBQUEsS0FBakI7QUFDQSxRQUFNVSxjQUFjLFNBQWRBLFdBQWM7QUFBQSxhQUFRSCxLQUFLTyxPQUFMLENBQWFWLFVBQWIsQ0FBUjtBQUFBLEtBQXBCO0FBQ0EsUUFBTUksV0FBVyxTQUFYQSxRQUFXLENBQUMzQyxJQUFELEVBQVU7QUFDekJBLFdBQUtnRCxHQUFMLENBQVM7QUFBQSxlQUNQcEQsT0FBTzhDLElBQVAsQ0FBWUosVUFBWixFQUF3QlcsT0FBeEIsQ0FBZ0MsVUFBQ2IsR0FBRCxFQUFTO0FBQ3ZDQyxrQkFBUUQsR0FBUixFQUFhRSxXQUFXRixHQUFYLENBQWI7QUFDRCxTQUZELENBRE87QUFBQSxPQUFUO0FBS0QsS0FORDs7QUFRQSxRQUFNdEMsa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDQyxZQUFELEVBQWtCO0FBQ3hDLFVBQUlLLGNBQUo7QUFDQSxVQUFJTCxhQUFhQyxJQUFiLEtBQXNCLHVCQUExQixFQUFtRDtBQUNuRCxVQUFNa0QsY0FBY25ELGFBQWFDLElBQWIsQ0FBa0JPLE1BQXRDO0FBQ0EsVUFBTTRDLGVBQWU7QUFDbkJoRCxZQUFJSixhQUFhQyxJQUFiLENBQWtCRyxFQURIO0FBRW5CQyxvQkFGbUI7QUFHbkJDLGtCQUFVO0FBSFMsT0FBckI7O0FBTUE7QUFDQSxVQUFJLENBQUM2QyxXQUFELElBQWdCQSxnQkFBZ0IsSUFBcEMsRUFBMEM7QUFDeENoQjtBQUNELE9BRkQsTUFFTyxJQUFJLFFBQU9nQixXQUFQLHlDQUFPQSxXQUFQLE9BQXVCLFFBQTNCLEVBQXFDO0FBQUE7O0FBQzFDLDhDQUFhN0MsUUFBYixFQUFzQitDLElBQXRCLGlEQUE4QlgsU0FBUyxDQUFDUyxXQUFELENBQVQsQ0FBOUI7QUFDRCxPQUZNLE1BRUEsSUFBSUEsWUFBWVYsUUFBaEIsRUFBMEI7QUFDL0IsWUFBSWEsTUFBTUMsT0FBTixDQUFjSixZQUFZVixRQUExQixDQUFKLEVBQXlDO0FBQ3ZDSyxzQkFBWUssWUFBWVYsUUFBeEI7QUFDRCxTQUZELE1BRU87QUFDTEQscUJBQVcsQ0FBQ1csWUFBWVYsUUFBYixDQUFYO0FBQ0Q7QUFDRixPQU5NLE1BTUEsSUFBSWEsTUFBTUMsT0FBTixDQUFjSixXQUFkLENBQUosRUFBZ0M7QUFDckMsWUFBSSxRQUFPQSxZQUFZLENBQVosQ0FBUCxNQUEwQixRQUE5QixFQUF3QztBQUN0Q1AsbUJBQVNPLFdBQVQ7QUFDRCxTQUZELE1BRU87QUFBQTs7QUFDTCxpREFBYTdDLFFBQWIsRUFBc0IrQyxJQUF0QixrREFBOEJYLFNBQVNTLFdBQVQsQ0FBOUI7QUFDRDtBQUNGLE9BTk0sTUFNQTtBQUNMUCxpQkFBUyxDQUFDTyxXQUFELENBQVQ7QUFDRDs7QUFFRCxVQUFJQyxhQUFhOUMsUUFBYixDQUFzQmtELE1BQXRCLEdBQStCLENBQW5DLEVBQXNDO0FBQ3BDSixxQkFBYTlDLFFBQWIsR0FBd0I4QyxhQUFhOUMsUUFBckM7QUFDRCxPQUZELE1BRU87QUFDTDhDLHFCQUFhOUMsUUFBYixHQUF3QjhDLGFBQWE5QyxRQUFiLENBQXNCLENBQXRCLENBQXhCO0FBQ0Q7QUFDRG1CLGFBQU9nQyxNQUFQLENBQWN2QyxXQUFkLENBQTBCa0MsWUFBMUIsRUFBd0NuRSxZQUF4QztBQUNELEtBckNEOztBQXVDQXdDLFdBQU9DLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DM0IsZUFBbkMsRUFBb0QsS0FBcEQ7QUFDQTtBQUNBMEIsV0FBT2dDLE1BQVAsQ0FBY3ZDLFdBQWQsQ0FBMEIsdUJBQTFCLEVBQW1EakMsWUFBbkQ7QUFDRCxHQTdERDs7b0JBK0RlRSxNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0RmLE1BQU11RSxnQkFBZ0IsU0FBU0EsYUFBVCxDQUF1QjFFLE9BQXZCLEVBQWdDO0FBQ3BELFFBQU1VLGlCQUFpQjtBQUNyQlUsVUFBSSxpQkFEaUI7QUFFckJ1RCx1QkFGcUIsK0JBRUQ7QUFDbEIsZUFBTyxZQUFNO0FBQ1g7QUFDRCxTQUZEO0FBR0Q7QUFOb0IsS0FBdkI7O0FBU0EsUUFBTUMsZ0JBQWdCO0FBQ3BCQyxlQUFTLE1BRFc7QUFFcEJDLGdCQUFVLFVBRlU7QUFHcEJDLFdBQUssUUFIZTtBQUlwQkMsWUFBTTtBQUpjLEtBQXRCOztBQU9BLFFBQU1DLDJCQUEyQixTQUEzQkEsd0JBQTJCLEdBQU07QUFDckMsVUFBTUMsbUJBQW1CLElBQUkzRSxLQUFKLENBQVUsdUJBQVYsQ0FBekI7QUFDQWtFLGFBQU92RCxRQUFQLENBQWdCQyxhQUFoQixDQUE4QitELGdCQUE5QjtBQUNELEtBSEQ7O0FBS0EsUUFBTXRFLFNBQVNDLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSixjQUFsQixFQUFrQ1YsT0FBbEMsQ0FBZjtBQUNBLFFBQU1tRixTQUFTdEUsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0I4RCxhQUFsQixFQUFpQzVFLFFBQVFtRixNQUF6QyxDQUFmOztBQUVBLFFBQU1DLFNBQVNsRSxTQUFTbUUsYUFBVCxDQUF1QixRQUF2QixDQUFmOztBQUVBRCxXQUFPaEUsRUFBUCxHQUFZUixPQUFPUSxFQUFuQjtBQUNBZ0UsV0FBTzFDLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDdUMsd0JBQWhDO0FBQ0FHLFdBQU8xQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQzlCLE9BQU8rRCxpQkFBUCxDQUF5QlMsTUFBekIsQ0FBaEM7O0FBRUFBLFdBQU8vQyxHQUFQLEdBQWF6QixPQUFPeUIsR0FBcEI7QUFDQXhCLFdBQU9DLE1BQVAsQ0FBY3NFLE9BQU9FLEtBQXJCLEVBQTRCSCxNQUE1Qjs7QUFFQSxXQUFPQyxNQUFQO0FBQ0QsR0FuQ0Q7O29CQXFDZVYsYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JDZixNQUFJYSxXQUFXLENBQWY7O0FBRUEsTUFBTUMsaUJBQWlCLFNBQVNBLGNBQVQsQ0FBd0JoRSxNQUF4QixFQUFnQztBQUNyRCtELGdCQUFZLENBQVo7O0FBRUEsUUFBTWhFLFVBQVU7QUFDZEgsVUFBSW1FLFFBRFU7QUFFZC9EO0FBRmMsS0FBaEI7O0FBS0EsV0FBT0QsT0FBUDtBQUNELEdBVEQ7O29CQVdlaUUsYzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztVQ1RiekYsYTtVQUNBSSxNIiwiZmlsZSI6InhMb2NhbFN0b3JhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA0KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0YzE1OTFhZDJmZDI3YWMzMzY0OCIsImltcG9ydCBpRnJhbWVGYWN0b3J5IGZyb20gJy4vaUZyYW1lRmFjdG9yeSdcbmltcG9ydCByZXF1ZXN0RmFjdG9yeSBmcm9tICcuL3JlcXVlc3RGYWN0b3J5J1xuXG5jb25zdCBjbGllbnRGYWN0b3J5ID0gZnVuY3Rpb24gY2xpZW50RmFjdG9yeShvcHRpb25zKSB7XG4gIC8vIFBSSVZBVEVcbiAgbGV0IHRhcmdldE9yaWdpbiA9ICcqJ1xuICBsZXQgaWZyYW1lXG4gIGxldCBzZXJ2ZXJcbiAgbGV0IGNvbm5lY3RlZCA9IGZhbHNlXG4gIGxldCBjb25uZWN0UHJvbWlzZVJlc29sdmVcbiAgY29uc3QgY29ubmVjdGVkRXZlbnQgPSBuZXcgRXZlbnQoJ2Nvbm5lY3RlZCcpXG4gIGNvbnN0IGRpc2Nvbm5lY3RlZEV2ZW50ID0gbmV3IEV2ZW50KCdkaXNjb25uZWN0ZWQnKVxuICBjb25zdCByZXF1ZXN0cyA9IFtdXG5cbiAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgdGltZW91dDogNTAwMCwgLy8gbXNcbiAgfVxuXG4gIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKVxuXG4gIGNvbnN0IG1lc3NhZ2VMaXN0ZW5lciA9IChtZXNzYWdlRXZlbnQpID0+IHtcbiAgICBpZiAobWVzc2FnZUV2ZW50LmRhdGEgPT09ICd4LWxvY2FsLXN0b3JhZ2UtcmVhZHknKSB7XG4gICAgICBjb25uZWN0ZWQgPSB0cnVlXG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGNvbm5lY3RlZEV2ZW50KVxuICAgICAgY29ubmVjdFByb21pc2VSZXNvbHZlKClcbiAgICB9IGVsc2UgaWYgKHJlcXVlc3RzW21lc3NhZ2VFdmVudC5kYXRhLmlkXSkge1xuICAgICAgLy8gRnVsbGZpbCBwcm9taXNlIGNyZWF0ZWQgb24gcmVxdWVzdFxuICAgICAgcmVxdWVzdHNbbWVzc2FnZUV2ZW50LmRhdGEuaWRdKG1lc3NhZ2VFdmVudC5kYXRhLmVycm9yLCBtZXNzYWdlRXZlbnQuZGF0YS5yZXNwb25zZSlcbiAgICB9XG4gIH1cblxuICBjb25zdCByZXF1ZXN0ID0gKHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHJlcSA9IHJlcXVlc3RGYWN0b3J5KHBhcmFtcylcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBUaGlzIHdpbGwgcmVqZWN0IHRoZSByZXF1ZXN0IGlmIGl0IHRha2VzIHRvIGxvbmcgdG8gZnVsbGZpbGxcbiAgICAgIGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0c1tyZXEuaWRdKSByZXR1cm5cbiAgICAgICAgZGVsZXRlIHJlcXVlc3RzW3JlcS5pZF1cbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignVGltZW91dDogY291bGQgbm90IHBlcmZvcm0geW91ciByZXF1ZXN0LicpKVxuICAgICAgfSwgY29uZmlnLnRpbWVvdXQpXG5cbiAgICAgIC8vIFRoaXMgd2lsbCBnZXQgY2FsbGVkIHdoZW4gcmVjZWl2aW5nIHRoZSByZXNwb25zZSBmcm9tIHRoZSBwb3N0TWVzc2FnZSxcbiAgICAgIC8vIGZ1bGxmaWxsaW5nIHRoZSBwcm9taXNlIGFuZCByZW1vdmluZyB0aGUgdGltZW91dCBzZXQgYWJvdmUgdG8gYXZvaWQgcmVqZWN0XG4gICAgICByZXF1ZXN0c1tyZXEuaWRdID0gKGVyciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIC8qIGVzbGludCBjb25zaXN0ZW50LXJldHVybjogMCAqL1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICAgICAgZGVsZXRlIHJlcXVlc3RzW3JlcS5pZF1cbiAgICAgICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoZXJyKSlcbiAgICAgICAgcmVzb2x2ZShyZXN1bHQpXG4gICAgICB9XG5cbiAgICAgIHNlcnZlci5wb3N0TWVzc2FnZShyZXEsIHRhcmdldE9yaWdpbilcbiAgICB9KVxuICB9XG5cblxuICAvLyBQVUJMSUNcbiAgY29uc3QgY29ubmVjdCA9IHVybCA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHRhcmdldE9yaWdpbiA9IHVybFxuICAgICAgaWZyYW1lID0gaUZyYW1lRmFjdG9yeSh7IHNyYzogdXJsIH0pXG4gICAgICAvLyBOb3RlIHRoYXQgdGhpcyBtaWdodCBlcnJvciBvdXQgd2l0aCBhIG5ldDo6RVJSX0NPTk5FQ1RJT05fUkVGVVNFRFxuICAgICAgLy8gd2hlbiB0aGUgdXJsIG9mIHRoZSBpRnJhbWUgaXMgdW5yZWFjaGFibGUuICBUaGlzIGVycm9yIERPRVMgTk9UXG4gICAgICAvLyBnZXQgY2F1Z2h0IGJ5IHRoZSBjYXRjaCBibG9jayB1bmZvcnR1bmF0ZWx5ICh0aGlzIGlzIGJ5IGRlc2lnbiBhcyBwZXIgYnJvd3NlciBzcGVjcylcbiAgICAgIC8vIFRoaXMgaXMgd2h5IHdlIGNoZWNrIG1hbnVhbGx5IGlmIHRoZSBjb25uZWN0aW9uIHdvcmtzLCBieSBoYXZpbmcgdGhlXG4gICAgICAvLyBpZnJhbWUgc2VuZCBhIHBvc3RNZXNzYWdlIHRvIHRoaXMgcGFnZSBhbmQgb25seSBpZiB3ZSByZWNlaXZlIHRoYXQgbWVzc2FnZVxuICAgICAgLy8gZG8gd2Ugc2V0IGNvbm5lY3RlZCA9IHRydWVcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKSAvLyBTaWRlIEVmZmVjdCEhISDCr1xcXyjjg4QpXy/Cr1xuXG4gICAgICBzZXJ2ZXIgPSBpZnJhbWUuY29udGVudFdpbmRvd1xuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIG1lc3NhZ2VMaXN0ZW5lciwgZmFsc2UpXG4gICAgICBjb25uZWN0UHJvbWlzZVJlc29sdmUgPSByZXNvbHZlXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZWplY3QoZXJyKVxuICAgIH1cbiAgfSlcblxuICBjb25zdCBkaXNjb25uZWN0ID0gKCkgPT4ge1xuICAgIGlmcmFtZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGlmcmFtZSkgLy8gVGhpcyB3b3JrcyBvbiBBTEwgcGxhdGZvcm1zXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBtZXNzYWdlTGlzdGVuZXIsIGZhbHNlKVxuICAgIGNvbm5lY3RlZCA9IGZhbHNlXG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChkaXNjb25uZWN0ZWRFdmVudClcbiAgfVxuXG4gIGNvbnN0IGlzQ29ubmVjdGVkID0gKCkgPT4gY29ubmVjdGVkXG5cbiAgY29uc3Qgb24gPSAoZXZlbnQsIGNiKSA9PiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYiwgZmFsc2UpXG5cbiAgY29uc3QgY2xlYXIgPSAoKSA9PiByZXF1ZXN0KClcblxuICBjb25zdCBnZXRJdGVtID0ga2V5ID0+IHJlcXVlc3Qoa2V5KVxuXG4gIGNvbnN0IHNldEl0ZW0gPSBkYXRhT2JqZWN0ID0+IHJlcXVlc3QoZGF0YU9iamVjdClcblxuICBjb25zdCByZW1vdmVJdGVtID0ga2V5ID0+IHJlcXVlc3QoeyB4X2RlbGV0ZToga2V5IH0pXG5cbiAgY29uc3QgZ2V0SXRlbXMgPSBrZXlzID0+IHJlcXVlc3Qoa2V5cylcblxuICBjb25zdCBzZXRJdGVtcyA9IGRhdGFPYmplY3RzID0+IHJlcXVlc3QoZGF0YU9iamVjdHMpXG5cbiAgY29uc3QgcmVtb3ZlSXRlbXMgPSBrZXlzID0+IHJlcXVlc3QoeyB4X2RlbGV0ZToga2V5cyB9KVxuXG4gIHJldHVybiB7XG4gICAgY29ubmVjdCxcbiAgICBkaXNjb25uZWN0LFxuICAgIGlzQ29ubmVjdGVkLFxuICAgIG9uLFxuICAgIGdldEl0ZW0sXG4gICAgZ2V0SXRlbXMsXG4gICAgc2V0SXRlbSxcbiAgICBzZXRJdGVtcyxcbiAgICByZW1vdmVJdGVtLFxuICAgIHJlbW92ZUl0ZW1zLFxuICAgIGNsZWFyLFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsaWVudEZhY3RvcnlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvY2xpZW50RmFjdG9yeS5qcyIsImNvbnN0IHNlcnZlciA9IGZ1bmN0aW9uIHNlcnZlcigpIHtcbiAgLy8gUFJJVkFURVxuICBjb25zdCB0YXJnZXRPcmlnaW4gPSAnKidcblxuICBjb25zdCBjbGVhciA9ICgpID0+IGxvY2FsU3RvcmFnZS5jbGVhcigpXG4gIGNvbnN0IGdldEl0ZW0gPSBrZXkgPT4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KVxuICBjb25zdCByZW1vdmVJdGVtID0ga2V5ID0+IGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSlcbiAgY29uc3Qgc2V0SXRlbSA9IChrZXksIHZhbHVlKSA9PiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKVxuXG4gIGNvbnN0IGdldEl0ZW1zID0ga2V5cyA9PiBrZXlzLm1hcChnZXRJdGVtKVxuICBjb25zdCByZW1vdmVJdGVtcyA9IGtleXMgPT4ga2V5cy5mb3JFYWNoKHJlbW92ZUl0ZW0pXG4gIGNvbnN0IHNldEl0ZW1zID0gKGRhdGEpID0+IHtcbiAgICBkYXRhLm1hcChkYXRhT2JqZWN0ID0+XG4gICAgICBPYmplY3Qua2V5cyhkYXRhT2JqZWN0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgc2V0SXRlbShrZXksIGRhdGFPYmplY3Rba2V5XSlcbiAgICAgIH0pLFxuICAgIClcbiAgfVxuXG4gIGNvbnN0IG1lc3NhZ2VMaXN0ZW5lciA9IChtZXNzYWdlRXZlbnQpID0+IHtcbiAgICBsZXQgZXJyb3JcbiAgICBpZiAobWVzc2FnZUV2ZW50LmRhdGEgPT09ICd4LWxvY2FsLXN0b3JhZ2UtcmVhZHknKSByZXR1cm5cbiAgICBjb25zdCByZXF1ZXN0RGF0YSA9IG1lc3NhZ2VFdmVudC5kYXRhLnBhcmFtc1xuICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IHtcbiAgICAgIGlkOiBtZXNzYWdlRXZlbnQuZGF0YS5pZCxcbiAgICAgIGVycm9yLFxuICAgICAgcmVzcG9uc2U6IFtdLFxuICAgIH1cblxuICAgIC8vIERpc3BhdGNoIHRoZSByZXF1ZXN0XG4gICAgaWYgKCFyZXF1ZXN0RGF0YSB8fCByZXF1ZXN0RGF0YSA9PT0gbnVsbCkge1xuICAgICAgY2xlYXIoKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlcXVlc3REYXRhICE9PSAnb2JqZWN0Jykge1xuICAgICAgcmVzcG9uc2VEYXRhLnJlc3BvbnNlLnB1c2goLi4uZ2V0SXRlbXMoW3JlcXVlc3REYXRhXSkpXG4gICAgfSBlbHNlIGlmIChyZXF1ZXN0RGF0YS54X2RlbGV0ZSkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVxdWVzdERhdGEueF9kZWxldGUpKSB7XG4gICAgICAgIHJlbW92ZUl0ZW1zKHJlcXVlc3REYXRhLnhfZGVsZXRlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtb3ZlSXRlbShbcmVxdWVzdERhdGEueF9kZWxldGVdKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyZXF1ZXN0RGF0YSkpIHtcbiAgICAgIGlmICh0eXBlb2YgcmVxdWVzdERhdGFbMF0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHNldEl0ZW1zKHJlcXVlc3REYXRhKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzcG9uc2VEYXRhLnJlc3BvbnNlLnB1c2goLi4uZ2V0SXRlbXMocmVxdWVzdERhdGEpKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzZXRJdGVtcyhbcmVxdWVzdERhdGFdKVxuICAgIH1cblxuICAgIGlmIChyZXNwb25zZURhdGEucmVzcG9uc2UubGVuZ3RoID4gMSkge1xuICAgICAgcmVzcG9uc2VEYXRhLnJlc3BvbnNlID0gcmVzcG9uc2VEYXRhLnJlc3BvbnNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3BvbnNlRGF0YS5yZXNwb25zZSA9IHJlc3BvbnNlRGF0YS5yZXNwb25zZVswXVxuICAgIH1cbiAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHJlc3BvbnNlRGF0YSwgdGFyZ2V0T3JpZ2luKVxuICB9XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBtZXNzYWdlTGlzdGVuZXIsIGZhbHNlKVxuICAvLyBBbm5vdW5jZSByZWFkaW5lc3MgdG8gY2xpZW50XG4gIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoJ3gtbG9jYWwtc3RvcmFnZS1yZWFkeScsIHRhcmdldE9yaWdpbilcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2VydmVyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL3NlcnZlci5qcyIsImNvbnN0IGlGcmFtZUZhY3RvcnkgPSBmdW5jdGlvbiBpRnJhbWVGYWN0b3J5KG9wdGlvbnMpIHtcbiAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgaWQ6ICd4LWxvY2FsLXN0b3JhZ2UnLFxuICAgIGxvYWRFdmVudExpc3RlbmVyKCkge1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgLy8gVE9ETzogUHV0IHNvbWV0aGluZyB1c2VmdWxsIGhlcmVcbiAgICAgIH1cbiAgICB9LFxuICB9XG5cbiAgY29uc3QgZGVmYXVsdFN0eWxlcyA9IHtcbiAgICBkaXNwbGF5OiAnbm9uZScsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAnLTk5OXB4JyxcbiAgICBsZWZ0OiAnLTk5OXB4JyxcbiAgfVxuXG4gIGNvbnN0IGRlZmF1bHRMb2FkRXZlbnRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICBjb25zdCBpRnJhbWVSZWFkeUV2ZW50ID0gbmV3IEV2ZW50KCd4LWxvY2FsLXN0b3JhZ2UtcmVhZHknKVxuICAgIHBhcmVudC5kb2N1bWVudC5kaXNwYXRjaEV2ZW50KGlGcmFtZVJlYWR5RXZlbnQpXG4gIH1cblxuICBjb25zdCBjb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucylcbiAgY29uc3Qgc3R5bGVzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFN0eWxlcywgb3B0aW9ucy5zdHlsZXMpXG5cbiAgY29uc3QgaUZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJylcblxuICBpRnJhbWUuaWQgPSBjb25maWcuaWRcbiAgaUZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBkZWZhdWx0TG9hZEV2ZW50TGlzdGVuZXIpXG4gIGlGcmFtZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgY29uZmlnLmxvYWRFdmVudExpc3RlbmVyKGlGcmFtZSkpXG5cbiAgaUZyYW1lLnNyYyA9IGNvbmZpZy5zcmNcbiAgT2JqZWN0LmFzc2lnbihpRnJhbWUuc3R5bGUsIHN0eWxlcylcblxuICByZXR1cm4gaUZyYW1lXG59XG5cbmV4cG9ydCBkZWZhdWx0IGlGcmFtZUZhY3RvcnlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvaUZyYW1lRmFjdG9yeS5qcyIsImxldCB1bmlxdWVJZCA9IDBcblxuY29uc3QgcmVxdWVzdEZhY3RvcnkgPSBmdW5jdGlvbiByZXF1ZXN0RmFjdG9yeShwYXJhbXMpIHtcbiAgdW5pcXVlSWQgKz0gMVxuXG4gIGNvbnN0IHJlcXVlc3QgPSB7XG4gICAgaWQ6IHVuaXF1ZUlkLFxuICAgIHBhcmFtcyxcbiAgfVxuXG4gIHJldHVybiByZXF1ZXN0XG59XG5cbmV4cG9ydCBkZWZhdWx0IHJlcXVlc3RGYWN0b3J5XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL3JlcXVlc3RGYWN0b3J5LmpzIiwiaW1wb3J0IGNsaWVudEZhY3RvcnkgZnJvbSAnLi9saWIvY2xpZW50RmFjdG9yeSdcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi9saWIvc2VydmVyJ1xuXG5leHBvcnQge1xuICBjbGllbnRGYWN0b3J5LFxuICBzZXJ2ZXIsXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9