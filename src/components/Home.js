import React, {Fragment, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useScrollTrigger, Fab, Zoom, Toolbar} from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles, createMuiTheme,ThemeProvider } from '@material-ui/core/styles';


import Search from "./Search"
import CardSection from "./CardSection"
import Pagination from "./Pagination"
import {getCharacters} from "../api/Api"

// Scroll to Top Fucntion(START)
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#fdb82f",
      },
    //   secondary: {
    //     main: '#11cb5f',
    //   },
    },
  })

function ScrollTop(props) {
  const { children, window } = props;
  const classes = useStyles();
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}

ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
  };
// Scroll to Top Function(END)

const Home = (props) => {
  const [characterSelected, setCharacterSelected] = useState('');
  const [characters, setCharacters] = useState([])
  const [charactersRef, setCharactersRef] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const [charactersPerPage] = useState(15);

  // Get Current Characters
  const indexOfLastCharacter = currentPage * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  const currentCharacters = characters.slice(indexOfFirstCharacter, indexOfLastCharacter);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Search Filter Function(START)
  const updateHeroes = (characterSelected) => {
    const filtered = charactersRef.filter(hero => {
      console.log(characterSelected)
      return hero.name.toLowerCase().includes(characterSelected.toLowerCase())
     })
     setCharacterSelected(characterSelected);
     setCharacters(filtered);
  }
  // Search Filter Function(END)

  useEffect(()=>{
      getCharacters()
      .then((output)=>{
          setCharacters(output.data.results)
          setCharactersRef(output.data.results)
          setLoading(false)
          console.log(output.data.results)
      })
  },[])

  return (
      <Fragment>
          <Toolbar id="back-to-top-anchor" style={{marginTop: "-60px"}}/>
          <Search characters={characters} setCharacter={updateHeroes}/>
          <CardSection heroes={currentCharacters} loading={loading}/>
          <Pagination totalcharacters={characters.length} charactersPerPage={charactersPerPage}  paginate={paginate}/>
          <ThemeProvider theme={theme}>
              <ScrollTop {...props}>
                  <Fab color="primary" size="small" aria-label="scroll back to top">
                  <KeyboardArrowUpIcon />
                  </Fab>
              </ScrollTop>
          </ThemeProvider>    
      </Fragment>
  )
}

export default Home
