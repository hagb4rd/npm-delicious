var argv = require('minimist')(process.argv);

process.on('uncaughtException', function(err) {
  console.log('Uncaught exception: ' + err.stack);
});

//var es5shim = require('es5-shim');
//var es6shim = require('es6-shim');
//var _ = require('underscore');
var util = require('util');
//var uri = require('uri');
//var url = require('url');
var fs = require("fs");
var json = require("json");
var parseXML = require('xml2js').parseString;
var request = require('request');
var beautify = require('js-beautify').js_beautify

var client_id = process.env['DELICIOUS_CLIENT_ID'];
var client_secret = process.env['DELICIOUS_CLIENT_SECRET'];
var user = process.env['DELICIOUS_USER'];
var pass = process.env['DELICIOUS_PASS'];
var accessToken;


console.dir = console.dir || function(obj) {
  console.log(util.inspect(obj));
}

var str = {};
str.dump = function (obj, wrapstart, wrapend) {
    wrapend = wrapend || "";

    //var result = "(" + typeof(obj) + ") {";
    var result = "";
    var quotation_marks;

    if (typeof (obj) != "object") {
        if (typeof (obj) == "string") {
            //quotation_marks = '';
			quotation_marks = '"';
        } else {
            quotation_marks = '';
        }

        result += quotation_marks + obj + quotation_marks;
    } else if (Array.isArray(obj)) {
        var more = false;
        result += "[ ";
        obj.forEach(function (elem, i) {
            if (more)
                result += ", ";
            result += str.dump(elem);
            more = true;
        });
        result += " ]";


    } else {
        var more = false;
        result += "{ ";
        for (var prop in obj) {
            if (more)
                result += ", "
            result += '"' + prop + '": ' + str.dump(obj[prop]);
            more = true;
        }
        result += " }";
    }

    if (wrapstart) {
        result = beautify(wrapstart + result + wrapend);
    }

    return result;
}

var Delicious = function(client_id, client_secret, user, pass) {
  self = this;
  self.client_id = client_id;
  self.client_secret = client_secret;
  self.user = user;
  self.pass = pass;
  self.accessToken = null;
  self.baseURL = "https://api.del.icio.us";

  self.getAccessToken = function() {
    return new Promise(function(resolve, reject) {
      if (self.accessToken) {
        resolve(self.accessToken);
      } else {
        var postdata = {
          client_id: self.client_id,
          client_secret: self.client_secret,
          grant_type: "credentials",
          username: self.user,
          password: self.pass
        }
        request.post({
          url: 'https://avosapi.delicious.com/api/v1/oauth/token',
          //url: self.baseURL + '/v1/oauth/token',
          form: postdata
        }, function(err, httpResponse, body) {
          /* ... */
          if (err) {
            reject(err);
          } else {
            //console.dir(httpResponse);
            //console.dir(body);
            var resp = JSON.parse(body);
            if (resp.status == 'success') {
              self.accessToken = resp.access_token;
              resolve(self.accessToken);
            } else {
              reject('ERROR:' + resp.status);
            }
          }
        });
      }
    });
  }

  self.getAll = function(tags) {

    return new Promise(function(resolve, reject) {
      self.getAccessToken().then(function(token) {

        var options = {
          //url: 'https://api.del.icio.us/v1/posts/all',
          url: self.baseURL + '/v1/posts/all?tag=' + tags,
          form: {
            tag: tags
          },
          headers: {
            'Authorization': 'Bearer ' + token
          }
        };
        request.get(options, function(err, httpResponse, body) {
          /* ... */
          if (err) {
            reject(err);
          } else {
            //console.dir(httpResponse);
            //console.dir(body);

            parseXML(body, function(err, result) {
              if (err) {
                reject(err);
              } else {
                //console.dir(body);
                resolve(result);
              }

            });

          }
        });

      });

    });

  }
}



function formatAll(json, verbose) {
  var verbose = false || verbose;
  var text = "";
  json.posts.post.forEach(function(elem, i) {
    text += elem.$.description;
    if(verbose)
     text += "\t(" + elem.$.time.substring(0,10) + ")"
    text += "\r\n";
    text += "==============================================================\r\n";
    text += elem.$.href + "\r\n";
    text += "==============================================================\r\n"; 
    //text += "--------------------------------------------------------------\r\n";
    
    if(elem.$.extended != "")
      text += elem.$.extended + "\r\n";
    text += "TAGS: #" + elem.$.tag.split(' ').join(' #') + "\r\n";
    
    text += "\r\n";
    text += "\r\n";
  })
  return text;
}


//RUNTIME
var api = new Delicious(client_id, client_secret, user, pass);
api.getAll(argv.tags).then(function(json) { console.log(formatAll(json)); }).catch(console.dir);
