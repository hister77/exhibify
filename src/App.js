import React, { useState, useEffect, createContext } from 'react';
import Main from './main/Main'
import './styles/style.css'

const AppContext = createContext(null)

function App() {

  const [data, setData] = useState([])
  const [viewCount, setViewCount] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('liked')) || [])

  function handleSwitch () {
    showHistory ? setShowHistory(false) : setShowHistory(true)
  }

  useEffect(() => {
    localStorage.setItem('liked', JSON.stringify(favorites))
  },[favorites])

  return (
    <>
      <header className='header-wrapper'>
        <div className='header-left'>{data.length} exhibits</div>
        <div className='header-middle'><h1>Exhibit {viewCount}</h1></div>
        <div className='header-right'>
          <button className="switch-button" onClick={handleSwitch}>{showHistory ? 'Favorites': 'Explore Mode'}</button>
        </div>
      </header>
      <main className='main-wrapper'>
        <AppContext.Provider value={{ data, setData, viewCount, setViewCount, showHistory, setShowHistory, favorites, setFavorites }}>
          <Main />
        </AppContext.Provider>
      </main>
      <footer>
        <span></span>
      </footer>
    </>
    )
}

export default App
export { AppContext }