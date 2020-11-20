import React from 'react';

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./components/Home"
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}

export default App;
