#!/usr/bin/env node
/*
 delicious-api DOKU
=============================== =============================== ===============================
https: //github.com/SciDevs/delicious-api/blob/master/api/posts.md#v1postsall
=============================== =============================== ===============================
/* */
process.on('uncaughtException', function(err) {
  console.log('Uncaught exception: ' + err.stack);
});


var argv = require('minimist')(process.argv);
var delicious = require('./lib/npm-delicious');


var client_id = process.env['DELICIOUS_CLIENT_ID'];
var client_secret = process.env['DELICIOUS_CLIENT_SECRET'];
var user = process.env['DELICIOUS_USER'];
var pass = process.env['DELICIOUS_PASS'];


if(!(client_id && client_secret && user && pass))
{
  console.log();
  console.log('please setup following environment variables:');
  console.log();
  console.log('DELICIOUS_CLIENT_ID');
  console.log('DELICIOUS_CLIENT_SECRET');
  console.log('DELICIOUS_USER');
  console.log('DELICIOUS_PASS');
  console.log();
  console.log('visit https://delicious.com/settings/developer for client_id and client_secret');
  console.log();
}




//RUNTIME
var api = new delicious(client_id, client_secret, user, pass);



if(argv._[2] == "add") {

  api.addLink(argv._[3], argv.tags, argv.description, argv.shared, argv.extended, argv.replace).then(console.dir).catch(console.dir);

} else {
  api.getAll(argv.tags, argv.start, argv.results, argv.fromdt, argv.todt, argv.meta).then(function(json) {
   console.log(formatAll(json));
  }).catch(console.dir);
}







function formatAll(json, verbose) {
  var verbose = false || verbose;
  var text = "";
  if (json.posts.post) {
    json.posts.post.forEach(function(elem, i) {
      text += elem.$.description;
      if (verbose)
        text += "\t(" + elem.$.time.substring(0, 10) + ")"
      text += "\r\n";
      text += "==============================================================\r\n";
      text += elem.$.href + "\r\n";
      text += "==============================================================\r\n";
      //text += "--------------------------------------------------------------\r\n";

      if (elem.$.extended != "")
        text += elem.$.extended + "\r\n";
      text += "TAGS: #" + elem.$.tag.split(' ').join(' #') + "\r\n";

      text += "\r\n";
      text += "\r\n";
    })

  }

  return text;
}
