/*
 delicious-api DOKU
=============================== =============================== ===============================
https: //github.com/SciDevs/delicious-api/blob/master/api/posts.md#v1postsall
=============================== =============================== ===============================
/* */

process.on('uncaughtException', function(err) {
  console.log('Uncaught exception: ' + err.stack);
});


//var es5shim = require('es5-shim');
//var es6shim = require('es6-shim');
//var _ = require('underscore');
var util = require('util');
var qs = require('querystring')
  //var uri = require('uri');
  //var url = require('url');
var fs = require("fs");
//var json = require("json");
var parseXML = require('xml2js').parseString;
var request = require('request');
//var beautify = require('js-beautify').js_beautify


//------------------------------- //------------------------------- //-------------------------------
// https: //github.com/SciDevs/delicious-api/blob/master/api/posts.md#v1postsall
//------------------------------- //------------------------------- //-------------------------------

var Delicious = function(client_id, client_secret, user, pass) {
  self = this;
  self.client_id = client_id;
  self.client_secret = client_secret;
  self.user = user;
  self.pass = pass;
  self.accessToken = null;

  self.config = {};
  self.config.replace = "no";
  self.config.shared = "no";
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


  self.request = function(url, options) {

    return new Promise(function(resolve, reject) {

      self.getAccessToken().then(function(token) {

        //API URI build
        var target = {
          url: self.baseURL + url + '?' + qs.stringify(options),
          headers: {
            'Authorization': 'Bearer ' + token
          }
        };

        request.get(target, function(err, httpResponse, body) {
          if (err) {
            reject(err);
          } else {
            parseXML(body, function(err, json) {
              if (err) {
                reject(err);
              } else {
                resolve(json);
              }
            });
          }
        });

      });
    });

  }


  self.addLink = function(url, tags, description, shared, extended, replace) {
    /*
    /v1/posts/add
    ===============================
    Add a new post to Delicious.
    Arguments.
      url={URL} (required) — The url of the item.
      description={...} (required) — The description of the item.
      extended={...} (optional) — Notes for the item.
      tags={...} (optional) — Tags for the item (comma delimited).
      dt={CCYY-MM-DDThh:mm:ssZ} (optional) — Datestamp of the item (format “CCYY-MM-DDThh:mm:ssZ”). Requires a LITERAL “T” and “Z” like in ISO8601 at http://www.cl.cam.ac.uk/~mgk25/iso-time.html for Example: 1984-09-01T14:21:31Z.
      replace=no (optional) — Don’t replace post if given url has already been posted.
      shared=no (optional) — Make the item private.
    /* */
    var api = '/v1/posts/add';

    var opt = {
      url: url,
      description: url,
      replace: "no",
      shared: "no",
      tags: "imported"
    };
    if (!url)
      throw new Error("Delicious.add() requires first parameter to be a valid URL");
    if (tags)
      opt["tags"] = tags;
    if (description)
      opt["description"] = description;
    if (shared)
      opt["shared"] = shared;
    if (extended)
      opt["extended"] = extended;
    if(replace)
      opt["replace"] = replace;

    return self.request(api, opt);
  }

  self.getAll = function(tag, start, results, fromdt, todt, meta) {
    /*
    /v1/posts/all
    ================

      Fetch all bookmarks by date or index range. Please use sparingly. Call the update function to see if you need to fetch this at all.
      Arguments

        &tag_separator=comma (optional) - (Recommended) Returns tags separated by a comma, instead of a space character. A space separator is currently used by default to avoid breaking existing clients - these default may change in future API revisions.
        &tag={TAG} (optional) — Filter by this tag.
        &start={xx} (optional) — Start returning posts this many results into the set.
        &results={xx} (optional) — Return up to this many results. By default, up to 1000 bookmarks are returned, and a maximum of 100000 bookmarks is supported via this API.
        &fromdt={CCYY-MM-DDThh:mm:ssZ} (optional) — Filter for posts on this date or later.
        &todt={CCYY-MM-DDThh:mm:ssZ} (optional) — Filter for posts on this date or earlier.
        &meta=yes (optional) — Include change detection signatures on each item in a ‘meta’ attribute. Clients wishing to maintain a synchronized local store of bookmarks should retain the value of this attribute - its value will change when any significant field of the bookmark changes.

    /* */
    var api = '/v1/posts/all';
    //Parameter
    //var opt = { tag_separator: 'comma' };
    var opt = {};
    if (tag)
      opt["tag"] = tag;
    if (start)
      opt["start"] = start;
    if (results)
      opt["results"] = results;
    if (fromdt)
      opt["fromdt"] = fromdt;
    if (todt)
      opt["todt"] = todt;
    if (meta)
      opt["meta"] = "yes";

    return self.request(api, opt);

  }
}

module.exports = Delicious;
