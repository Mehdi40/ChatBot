// @flow

// Function that return a random element from an arrau
module.exports.pickRandomElement = arr => arr[Math.floor(Math.random() * arr.length)];

// Function that return an options object to make Spotify API call
module.exports.constructOptions = (url: string):
{
  uri: string,
  headers: {
    'User-Agent': string,
    'Content-Type': string,
    Authorization: string
  },
  json: boolean
} => ({
  uri: `https://api.spotify.com/v1${url}`,
  headers: {
    'User-Agent': 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer CLE_SPOTIFY',
  },
  json: true,
});

// Function that return a random sentence
module.exports.randomFirstSentence = (name: string): string => {
  const randomArr: Array<string> = [];
  randomArr.push(`Ah, ça tombe bien, je connais très bien ${name} !`);
  randomArr.push(`Quel bon choix ! J'adore ${name} !`);
  randomArr.push(`Mon artiste préféré est Carpenter Brut, mais mon deuxième favoris est ${name} !`);
  return this.pickRandomElement(randomArr);
};

// Function that return the genre of an artist
module.exports.getGenre = (genres: Array<string>): string => {
  const vowelRegex: string = '^[aieouAIEOU].*';
  let randomGenre: string = this.pickRandomElement(genres);
  const matched = randomGenre.match(vowelRegex);
  randomGenre = matched ? `l'${randomGenre}` : `le ${randomGenre}`;
  return randomGenre;
};

// Function that return a sentence depending the popularity of an artist
module.exports.getPopularity = (popularity: number): string => {
  if (popularity > 85) return 'Tout le monde connaît !';
  if (popularity > 50) return 'Je suis sûr que même tes parents en ont entendu parler !';
  if (popularity > 25) return 'Le programmateur musical de France Inter lui-même n\'en a probablement jamais entendu parler.';
  return 'Personne ne connait !';
};

// Function that return a random sentence populated with more informations
module.exports.randomData = (data): string => {
  const randomArr: Array<string> = [];
  randomArr.push(`Et je suis pas le seul, aux vues des ${data.followers.total} followers sur Spotify !`);
  randomArr.push(`Ceci-dit, niveau popularité : ${this.getPopularity(data.popularity)}`);
  return this.pickRandomElement(randomArr);
};

// Function that return the complete answer to send the user
module.exports.answerConstruction = (artist): string => {
  let answer: string = `${this.randomFirstSentence(artist.items[0].name)}`;
  answer += ` Il faut dire que j'adore ${this.getGenre(artist.items[0].genres)}.`;
  answer += ` ${this.randomData(artist.items[0])}`;
  return answer;
};
