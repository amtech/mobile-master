function _AJAX(){
  var fetching = 0;
  return function(pathURL, options){
    options = options || {};
    if(options.lock && fetching>0)  return;
    options.async = options.async===undefined ? true : !!options.async;
    options.method = options.method || 'GET';
    var params = options.params || {};
    var body = options.body || {};
    var queryString = '';
    var bosyString = undefined;
    var keys = Object.keys(params);
    if(keys.length>0){
      queryString = pathURL.indexOf("?")!=-1 ? "&" : "?";
      queryString += keys.map(function(k){
        return k+'='+encodeURIComponent(params[k])
      }).join('&');
    }
    var bodyKeys = Object.keys(body);
    if(bodyKeys.length>0){
      bosyString = JSON.stringify(body);
    }

    var apiURL = process.env.REACT_APP_GATEWAY + 'v1.0.0' +pathURL+queryString;
    if(/^(http|https)/.test(pathURL)){
      apiURL = pathURL+queryString;
    }

    var xhr = new XMLHttpRequest();
    xhr.open(options.method, apiURL, options.async);
    if (options.contentType) {
      xhr.setRequestHeader('Content-Type', options.contentType);
    }
    // xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', sessionStorage.getItem('token'));

    return function(callback){
      if(options.async){
        xhr.onreadystatechange = function(){
          if(this.readyState===4){
            fetching--;
            if(this.status===200){
              callback(JSON.parse(this.responseText));
            }
          }
        };
      }
      fetching++;
      xhr.send(body);
      if(!options.async){
        fetching--;
        callback(JSON.parse(xhr.responseText));
      }
    };
  };
};

export default _AJAX()