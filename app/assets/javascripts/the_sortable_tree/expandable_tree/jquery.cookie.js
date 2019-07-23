#!
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// * jQuery Cookie Plugin v1.3.1
// * https://github.com/carhartl/jquery-cookie
// *
// * Copyright 2013 Klaus Hartl
// * Released under the MIT license
// 
(function(factory) {
  if ((typeof define === "function") && define.amd) {
    // AMD. Register as anonymous module.
    return define(["jquery"], factory);
  } else {
    // Browser globals.
    return factory(jQuery);
  }
})(function($) {
  const pluses = /\+/g;

  const raw     = s => s;
  const decoded = s => decodeURIComponent(s.replace(pluses, " "));
  const converted = function(s) {
    // This is a quoted cookie as according to RFC2068, unescape
    if (s.indexOf("\"") === 0) { s = s.slice(1, -1).replace(/\\"/g, "\"").replace(/\\\\/g, "\\"); }
    try {
      return (config.json ? JSON.parse(s) : s);
    } catch (error) {}
  };

  
  var config = ($.cookie = function(key, value, options) {
    // write
    if (value !== undefined) {
      options = $.extend({}, config.defaults, options);
      
      if (typeof options.expires === "number") {
        const days = options.expires;
        const t    = (options.expires = new Date());
        t.setDate(t.getDate() + days);
      }
      
      value = (config.json ? JSON.stringify(value) : String(value));
      
      // use expires attribute, max-age is not supported by IE
      return (document.cookie = [(config.raw ? key : encodeURIComponent(key)), "=", (config.raw ? value : encodeURIComponent(value)), (options.expires ? `; expires=${options.expires.toUTCString()}` : ""), (options.path ? `; path=${options.path}` : ""), (options.domain ? `; domain=${options.domain}` : ""), (options.secure ? "; secure" : "")].join(""));
    }
    
    // read
    const decode  = (config.raw ? raw : decoded);
    const cookies = document.cookie.split("; ");
    let result  = (key ? undefined : {});

    let i = 0;
    const l = cookies.length;

    while (i < l) {
      const parts  = cookies[i].split("=");
      const name   = decode(parts.shift());
      const cookie = decode(parts.join("="));
      if (key && (key === name)) {
        result = converted(cookie);
        break;
      }
      if (!key) { result[name] = converted(cookie); }
      i++;
    }
    return result;
  });

  config.defaults = {};

  return $.removeCookie = function(key, options) {
    if ($.cookie(key) !== undefined) {
      // Must not alter options, thus extending a fresh object...
      $.cookie(key, '', $.extend({}, options, {expires: -1}));
      return true;
    }
    return false;
  };
});