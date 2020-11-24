const API_KEY = process.env.REACT_APP_MARVEL_API_KEY;
const API_HASH = process.env.REACT_APP_MARVEL_API_HASH;

// Get all the Characters
export const getCharacters = () =>{
    const URL = `https://gateway.marvel.com/v1/public/characters?ts=1&apikey=${API_KEY}&hash=${API_HASH}&limit=100`
    return fetch(URL)
    .then((response) =>response.json())
    .catch((error) => console.log("ERROR : ", error))
} 