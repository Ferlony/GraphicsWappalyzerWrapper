const http = require("http");
const fs = require('fs').promises;
const whois = require('whois-json');

const port = 8000;
const wapPort = 3000;
const wapHost = process.env.wapHost
const host = "0.0.0.0";

const server = http.createServer(httpHandler);

server.listen(port, host, () => {
    console.log(`HTTP server running at http://${wapHost}:${port}`);
});


function httpHandler(req, res) {
    
    if (req.method == 'POST') {
        console.log('POST');
        var body = '';
        
        req.on('data', function(data) {
            body += data;
            console.log('Partial body: ' + body);
        })

        req.on('end', async function() {
            res.writeHead(200, {'Content-Type': 'text/html'});

            try {
                console.log('Body: ' + body);
                var reqUrl = JSON.parse(body)["reqUrl"].toString();
                console.log("reqUrl: ", reqUrl);
                
                var resWhois = await reqForWhois(reqUrl);
                var resWap = await reqForWap(reqUrl);

                console.log(resWhois);
                console.log(resWap);

                var retJSON = JSON.stringify({"whois": resWhois, "wap": resWap});

                res.end(retJSON);
            }
            catch (e) {
                console.log(e);
                res.end(JSON.stringify({"error": e}));
            }

        })
    } 
    else {
        console.log('GET')
        fs.readFile("resources" + "/index.html")
            .then(contents => {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end(contents);
            })
            .catch(err => {
                res.writeHead(500);
                res.end(err);
                return;
            });
    }
}


async function reqForWap(reqUrl) {
  var wapurl = "http://" + wapHost + ":" + wapPort + "/extract?url="
  const response = await fetch(wapurl + reqUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())

  return JSON.stringify(response);
}


async function reqForWhois(reqUrl) {
	var results = await whois(reqUrl);
    var out = JSON.stringify(results, null, 2);
    return out;
}

