'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = "amzn1.ask.skill.3b996d41-9be1-425e-b069-359c0ce91384";

const handlers = {
  'NumberToDate': function() {
    this.emit(":tell", "November 18")
  }
};

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;

  alexa.registerHandlers(handlers);
  alexa.execute();
};
