const API_KEY = process.env.REACT_APP_MARVEL_API_KEY;

// Get all the Characters
export const getCharacters = () =>{
    const URL = `https://gateway.marvel.com/v1/public/characters?limit=100&apikey=${API_KEY}`
    return fetch(URL)
    .then((response) =>response.json())
    .catch((error) => console.log("ERROR : ", error))
} 