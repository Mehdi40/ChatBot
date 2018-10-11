// @flow

// Importing needed modules
const rp = require('request-promise');

// Importing needed files
const helpers = require('./helpers');

// Get the last album of an artist/band by his Spotify ID
// and return the formatted fulfillment text
module.exports.getLastAlbum = (id: string, res) => {
  rp.get(helpers.constructOptions(`/artists/${id}/albums?include_groups=single&market=FR&limit=1`))
    .then((body) => {
      res.json({ fulfillmentText: `Le dernier ${body.items[0].type} en date est ${body.items[0].name}, sorti le ${body.items[0].release_date} !` });
    });
};

// Get the best track of an artist/band by his Spotify ID
// and return the formatted fulfillment text
module.exports.getBestTrack = (id: string, res) => {
  rp.get(helpers.constructOptions(`/artists/${id}/top-tracks?country=FR`))
    .then((body) => {
      res.json({ fulfillmentText: `Le meilleur morceau est ${body.tracks[0].name}, de l'album ${body.tracks[0].album.name} !` });
    });
};

// Get the related artists linked to an artist/band by his Spotify ID
// and return the formatted fulfillment text
module.exports.getSameArtists = (id: string, res) => {
  rp.get(helpers.constructOptions(`/artists/${id}/related-artists`))
    .then((body) => {
      const sameArtist = helpers.pickRandomElement(body.artists);
      res.json({ fulfillmentText: `De mon côté, j'adore ${sameArtist.name} !` });
    });
};

// Get a Spotify Artist object by his Spotify ID
// and return a Promise
module.exports.getArtist = (artistName: string) => rp.get(helpers.constructOptions(`/search?q=${artistName}&type=artist`));
