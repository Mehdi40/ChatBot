// @flow

// This function return random sentences. This might not be the more optimized
// method on how to handle that, but that was the quickier I can though of.
// Furthermore, as I didn't find how to keep in memory a parameter from a
// previous intent, I find a hack to make it :
// I'm just going to save an ID on Firebase, and read it later.
// I'm pretty sure it exists a better, quickier, more optimized solution, but I
// couldn't find one using Cloud Functions.
// LASTLY, I might not have chosen the easiest API to use. Spotify Web API needs
// authentication, and, during those 3 days, I couldn't find a way
// to do it serverless. A user has to accept the connection between his account
// and the API through Spotify. In case I haven't find the time to implement it :
// There is a solution (that I find is really bad) which would consist of creating
// a small NodeJS API, with a unique route dedicated to authentication. We could
// get a Refresh Token from this route, that we could pass to the Cloud Function.


// Import needed modules
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Requiring needed files
const helpers = require('./helpers');
const spotifyService = require('./spotify-service');

// Initializing the Firebase admin app
admin.initializeApp({
  databaseURL: 'https://chatbot-c073f.firebaseio.com/',
  storageBucket: 'chatbot-c073f.appspot.com',
  projectId: 'chatbot-c073f',
  credential: {
    getAccessToken: () => ({
      expires_in: 0,
      access_token: '',
    }),
  },
});

// Creating object linked to Firebase admin and Firebase objects
const db = admin.database();
const ref = db.ref('server/saving-data/fireblog');

const questionsRef = ref.child('artistQuestions');

// Main function
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res): void => {
  // From the Spotify Artist object, we can now format the fulfillment
  // with needed data
  const getArtistInfos = (artist): void => {
    const answer = helpers.answerConstruction(artist);
    // We're saving the artist ID to Firebase
    questionsRef.set({ artistId: artist.items[0].id });
    res.json({ fulfillmentText: answer });
  };

  // Redirect the request to the needed function, depending the kind of action
  // Can be : album -> BestAlbum, track -> LastTrack, or related -> RelatedArtists
  const getActions = (action: string): void => {
    // We're reading the artist ID from Firebase
    // and passing it to the different functions
    questionsRef.once('value').then((snapshot) => {
      const id: string = snapshot.val().artistId;

      if (action === 'track') return spotifyService.getBestTrack(id, res);
      if (action === 'album') return spotifyService.getLastAlbum(id, res);
      return spotifyService.getSameArtists(id, res);
    });
  };

  // Main function :
  // We get the paramters, which are artistName, or action
  const actions: string = req.body.queryResult.parameters.moreInfos;
  const artistName: string = req.body.queryResult.parameters.artist;

  // If we've got an artistName, we need to find it on Spotify
  // and return a formatted answer
  if (artistName) {
    spotifyService.getArtist(artistName).then((body) => {
      getArtistInfos(body.artists, res);
    });
  }

  // If we've got an action, we need to run the needed function
  if (actions) getActions(actions, res);
});
