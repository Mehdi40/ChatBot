const { expect } = require('chai');
const nock = require('nock');

const spotifyService = require('../flow-functions/spotify-service');


describe('SpotifyService', () => {
  describe('#getLastAlbum()', () => {
    it('should get the last album from the Spotify Web API', (done) => {
      nock('https://api.spotify.com/v1')
        .get('/artists/12345/albums?include_groups=single&market=FR&limit=1')
        .reply(200, {
          items: [
            {
              type: 'album',
              name: 'Hastings 1066',
              release_date: '2018-01-01',
            },
          ],
        });

      spotifyService.getLastAlbum(12345, {
        json: (res) => {
          expect(res.fulfillmentText).to.eql('Le dernier album en date est Hastings 1066, sorti le 2018-01-01 !');
          done();
        },
      });
    });
  });

  describe('#getBestTrack()', () => {
    it('should get the best tracks from the Spotify Web API', (done) => {
      nock('https://api.spotify.com/v1')
        .get('/artists/12345/top-tracks?country=FR')
        .reply(200, {
          tracks: [
            {
              name: 'Rex Regi Rebellis',
              album: { name: 'Battle Metal' },
            },
          ],
        });

      spotifyService.getBestTrack(12345, {
        json: (res) => {
          expect(res.fulfillmentText).to.eql('Le meilleur morceau est Rex Regi Rebellis, de l\'album Battle Metal !');
          done();
        },
      });
    });
  });

  describe('#getSameArtists()', () => {
    it('should get related artists from the Spotify Web API', (done) => {
      nock('https://api.spotify.com/v1')
        .get('/artists/12345/related-artists')
        .reply(200, {
          artists: [
            {
              name: 'Turisas',
            }, {
              name: 'Carpenter Brut',
            }, {
              name: 'Teki Latex',
            },
          ],
        });

      spotifyService.getSameArtists(12345, {
        json: (res) => {
          expect(res.fulfillmentText).to.contain('De mon côté, j\'adore');
          expect(res.fulfillmentText).to.match(/Turisas|Carpenter Brut|Teki Latex/);
          done();
        },
      });
    });
  });

  describe('#getArtist', () => {
    it('should get an artist object from the Spotify Web API', (done) => {
      nock('https://api.spotify.com/v1')
        .get('/artists/12345/related-artists')
        .reply(200, {
          artists: [
            {
              items: { name: 'Tryo' },
            },
          ],
        });

      spotifyService.getArtist('Tryo').then((body) => {
        expect(body.artists[0].items.name).to.eql('Tryo');
      });
      done();
    });
  });
});
