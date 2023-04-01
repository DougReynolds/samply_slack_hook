/**
 * @author Douglas Reynolds
 * @version 0.0.1
 **/
require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const { IncomingWebhook } = require('@slack/webhook');
const url = process.env.SLACK_URL;
const webhook = new IncomingWebhook(url);
const app = express()
const PORT = 3000

app.use(bodyParser.json())
app.listen(PORT, () =>
    console.log('Server running on port: ' + PORT)
)

/**
 * @description Takes the incoming webhook request from Samply and forwards it to Slack
 * @param {RequestHandler} req available request.body keys include: type, title, body, url
 *  creator.displayName, creator.email, creator.photoURL, creator.uid, acknowledged
**/
app.post("/", (req, resp) =>
    {
        (async () => {
            await webhook.send({
                "text": req.body.title,
                "blocks": [
                    {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": req.body.creator.displayName + '\n' + req.body.body + '\n' + '<' + req.body.url + '>',
                    }
                }]
            });
          })();
        
        resp.status(200).end()
    }
)