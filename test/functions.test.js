const { expect } = require('chai');

const helpers = require('../flow-functions/helpers');

describe('Helpers', () => {
  describe('#pickRandomElement()', () => {
    it('should return a random element from array', (done) => {
      const randomEl = helpers.pickRandomElement(['rock', 'pop', 'baroque', 'grunge', 'new wave néo-classique post-industrielle électroacoustique']);
      // Best way I thought to test for randomness
      expect(randomEl).to.match(/rock|pop|baroque|grunge|new wave néo-classique post-industrielle électroacoustique/);
      done();
    });
  });

  describe('#constructOptions()', () => {
    it('should return a well-structured object', (done) => {
      const options = helpers.constructOptions('/test');
      expect(options.uri).to.eql('https://api.spotify.com/v1/test');
      expect(options.headers['User-Agent']).to.eql('application/json');
      expect(options.headers['Content-Type']).to.eql('application/json');
      expect(options.json).to.eql(true);
      done();
    });
  });

  describe('#randomFirstSentence()', () => {
    it('should return a randomly picked string', (done) => {
      const firstSentence = helpers.randomFirstSentence('Tetsuo');
      expect(firstSentence).to.contain('Tetsuo');
      done();
    });
  });

  describe('#getGenre()', () => {
    it('should return a randomly picked string', (done) => {
      const genre = helpers.getGenre(['Tetsuo', 'Kaneda', 'Akira']);
      expect(genre).to.match(/(l'Akira|le Tetsuo|le Kaneda)/);
      done();
    });
  });

  describe('#getPopularity()', () => {
    it('should return a string depending the popularity : Very popular', (done) => {
      const veryPopular = helpers.getPopularity(100);
      expect(veryPopular).to.eql('Tout le monde connaît !');
      done();
    });

    it('should return a string depending the popularity : Popular', (done) => {
      const popular = helpers.getPopularity(80);
      expect(popular).to.eql('Je suis sûr que même tes parents en ont entendu parler !');
      done();
    });

    it('should return a string depending the popularity : Quite popular', (done) => {
      const quitePopular = helpers.getPopularity(36);
      expect(quitePopular).to.eql('Le programmateur musical de France Inter lui-même n\'en a probablement jamais entendu parler.');
      done();
    });

    it('should return a string depending the popularity : Not popular', (done) => {
      const notPopular = helpers.getPopularity(3);
      expect(notPopular).to.eql('Personne ne connait !');
      done();
    });
  });

  describe('#randomData()', () => {
    it('should return a randomly-picked string', (done) => {
      const randomInfo = helpers.randomData({ followers: { total: 200 }, popularity: 100 });
      expect(randomInfo).to.match(/(Ceci-dit, niveau popularité : Tout le monde connaît !|Et je suis pas le seul, aux vues des 200 followers sur Spotify !)/);
      done();
    });
  });

  describe('#answerConstruction()', () => {
    const artist = {
      items: [{
        name: 'Kaneda',
        genres: ['Ambient'],
        followers: {
          total: 300,
        },
        popularity: 42,
      }],
    };
    it('should return a randomly-constructed string', (done) => {
      const randomInfo = helpers.answerConstruction(artist);
      expect(randomInfo).to.match(/Kaneda|l'Ambient|300|France Inter/);
      done();
    });
  });
});
