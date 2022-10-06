import React, { useState, createContext } from 'react';
import Main from './main/Main'
import Search from './components/search'
import axios from 'axios';
import './styles/style.css'

const AppContext = createContext(null)

const req = axios.create({
  baseURL: 'https://collectionapi.metmuseum.org/public/collection/v1',
  timeout: 5000
})

function App() {

  const [viewCount, setViewCount] = useState(0)
  const [artCount, setArtCount] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  
  const handleSwitch = () => {
    showHistory ? setShowHistory(false) : setShowHistory(true)
  }

  return (
    <>
      <header className='header-wrapper'>
        <div className='header-left'>{artCount} exhibits</div>
        <div className='header-middle'><h1>Exhibit {viewCount}</h1></div>
        <div className='header-right'>
          <button className="switch-button" onClick={handleSwitch}>{showHistory ? 'Favorites': 'Explore Mode'}</button>
        </div>
      </header>
      <main className='main-wrapper'>
        <AppContext.Provider value={{req, viewCount, setViewCount, showHistory, setShowHistory, setArtCount}}>
          <Main/>
        </AppContext.Provider>
      </main>
    </>
    )
}

export default App
export { AppContext }