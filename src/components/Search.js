import React, {Fragment} from 'react'

const Search = ({keyword, setKeyword}) => {
    return (
        <Fragment>
            <input 
            class="search"
            key="searchbox"
            value={keyword}
            placeholder={"Search hero"}
            />
        </Fragment>
    )
}

export default Search
