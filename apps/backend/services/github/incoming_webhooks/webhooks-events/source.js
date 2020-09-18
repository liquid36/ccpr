/*
  See https://developer.github.com/webhooks/event-payloads for
  examples of payloads.

  Try running in the console below.
*/

exports = function(payload) {
    const mongodb = context.services.get("mongodb-atlas");
    const webhook = mongodb.db("test").collection("webhook");
    return webhook.insertOne(payload);
      
};