import React from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const Search = ({characters}) => {
    return (
        <div className="container search">
            <Autocomplete
                id="combo-box-demo"
                options={characters}
                getOptionLabel={(option) => option.name}
                style={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} id="standard-full-width" label="Search Heroes..." variant="outlined" />}
            />
        </div>
    )
}


export default Search
