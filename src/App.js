import React, { useState, createContext } from 'react';
import Header from './header/Header';
import Main from './main/Main'
import './styles/style.css'

const AppContext = createContext(null)

function App() {

  const [data, setData] = useState([])
  const [params, setParams] = useState({ params: { medium: 'Paintings', hasImages: true, q: '*' } })
  const [viewCount, setViewCount] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('liked')) || [])

  return (
    <>
      <AppContext.Provider value={{
          data, setData,
          params, setParams,
          viewCount, setViewCount,
          showHistory, setShowHistory,
          favorites, setFavorites }}>
        <Header />
        <Main />
      </AppContext.Provider>
      <footer>
        <span></span>
      </footer>
    </>
    )
}

export default App
export { AppContext }