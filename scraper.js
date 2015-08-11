var cheerio = require('cheerio');
var fs = require('fs');

var go = {
  url: "http://substack.net/images/",
  baseUrl: "http://substack.net",
  name: "substack"
};

function writeFile(text) {
  fs.writeFile("./db/" + go.name + ".csv", text, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  });
}

function parseHTML(html) {
  $ = cheerio.load(html);
  var rows = $('tr');
  var filePermission, absoluteUrl, fileType;
  var fullText = "";
  for(var i = 0; i < rows.length; i += 1) {
    filePermission = cheerio(rows[i].children[0]).text();
    absoluteUrl = go.baseUrl + cheerio(rows[i].children[2].children[0]).attr('href');
    fileType = absoluteUrl.split('.');
    fileType = fileType[fileType.length -1]
    if(!fileType.match(/\//))
      fullText += filePermission + "," + absoluteUrl + "," + fileType + '\n';
  }
  writeFile(fullText);
}


function scrape() {
  var request = require('request');
  request(go.url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseHTML(body);
    }
    if(error) {
      console.log(error);
    }
  })
}

scrape();