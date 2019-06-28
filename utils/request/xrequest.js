import { GLOBAL_BASE } from './config.js';

var deepCopy = function(o) {
  if (o instanceof Array) {
    var n = [];
    for (var i = 0; i < o.length; ++i) {
      n[i] = deepCopy(o[i]);
    }
    return n;

  } else if (o instanceof Object) {
    var n = {}
    for (var i in o) {
      n[i] = deepCopy(o[i]);
    }
    return n;
  } else {
    return o;
  }
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
  return typeof obj;
} : function(obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};


function isObject(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
}

function sendRequest(url, method, data, headers) {
  let promise = new Promise(function(resolve, reject) {
    // my.showLoading({
    //   content: '加载中...'
    // });
    my.request({
      url: url,
      data: data,
      method: method,
      headers: headers,
      success: resolve,
      fail: reject,
      complete: function() {
        // complete
        // my.hideLoading();; //完成停止加载
        my.stopPullDownRefresh();//停止下拉刷新
      }
    })
  });
  return promise;
};


function extend(obj) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (isObject(obj) && args.length > 0) {
    if (Object.assign) {
      return Object.assign.apply(Object, [obj].concat(args));
    }

    args.forEach(function(arg) {
      if (isObject(arg)) {
        Object.keys(arg).forEach(function(key) {
          obj[key] = arg[key];
        });
      }
    });
  }

  return obj;
}


function MyHttp(defaultParams, method, url, host) {

  let _build_url = GLOBAL_BASE;
  if (host) {
    _build_url = host
  }

  let _params_data = extend({}, defaultParams);
  return sendRequest(_build_url + url, method, _params_data, {
    'content-type': 'application/x-www-form-urlencoded'
  });
}

export default MyHttp;