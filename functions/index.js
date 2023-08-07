
const {onCall} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");

// Required to allow deployment
setGlobalOptions({maxInstances: 10});

exports.testFirebase = onCall((request) => {
  return `Hello world!`;
});
