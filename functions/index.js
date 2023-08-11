const {onCall} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Required to allow deployment
setGlobalOptions({maxInstances: 10});

// Firestore related code
admin.initializeApp();
const db = admin.firestore();
const usersRef = db.collection('users');
const usernameRef = db.collection('usernames');

// Function used for checking if the username already exists
// (Register account screen)
exports.checkUsernameValid = onCall(async (request) => {

  // Check if document exist with id of the new username
  try{
    const isValid = await usernameRef.doc(request.data.name).get();
    if(!isValid.exists){
      return {
        status: true,
      }
    }else{
      return{
        status: false,
        error: "Username already exists."
      }
    }

  }catch(error){
    return {
      status: false,
      error: "There was an error processing the username. Please contact support."};
  }

});

// Function used for updating the firestore with information of a newly reigstered user
exports.updateFireStoreUsername = onCall(async (credentials) => {
  try{
    await usersRef.doc(credentials.data.uid).set(credentials.data);
    await usernameRef.doc(credentials.data.name).set(credentials.data);
    return{
      status:true
    }
  }catch(err){
    console.log(err);
    return{
      status:false,
      error:"Error when registering the username with the system"
    }
  }
})

// Function used for getting the username of the user that just logged in
exports.getUsername = onCall(async (credentials) => {
  try{
    const username = await usersRef.doc(credentials.data.uid).get();
    // Check if the username exist
    if(username.exists){
      // Send the username to the user
      return (username.data().name);
    }else{
      // Inform that the username does not exist
      return("Username does not exist");
    }
  }catch(err){
    console.log("Error: ", err)
    return("Internal error within the server");
  }
})
