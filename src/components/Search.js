import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const Search = ({ characters, setCharacter }) => {
  return (
    // <form noValidate autoComplete="off" className="container search">
    //   <TextField
    //     id="outlined-basic"
    //     label="Search"
    //     placeholder="Search Heroes..."
    //     variant="outlined"
    //     style={{ width: "100%" }}
    //     onChange={(e) => setCharacter(e.target.textContent)}
    //   />
    // </form>
    <div className="container search">
        <Autocomplete
            id="combo-box-demo"
            options={characters}
            getOptionLabel={(option) => option.name}
            style={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} id="standard-full-width" label="Search" placeholder="Search Heroes..." variant="outlined" />}
            onChange={(e) => setCharacter(e.target.textContent)}
            />
        </div>
  );
};

export default Search;
