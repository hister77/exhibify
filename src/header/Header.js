import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../App'

export default function Header() {

    const { params, setParams, viewCount, showHistory, setShowHistory, favorites, artCount  } = useContext(AppContext)
    const [tempParams, setTempParams] = useState({ medium: 'Paintings', hasImages: true, q: '*' })
    const [filterMode, setFilterMode] = useState('Filter')
    const refFilter = useRef('*')

    const handleSwitchMode = () => showHistory ? setShowHistory(false) : setShowHistory(true)

    const handleSubmitSettings = (e) => {
      if(tempParams.q !== params.params.q) {
        setParams(values => ( { params: {...values.params, ...tempParams } } ))
      }
      else {
        setParams({ params: { medium: 'Paintings', hasImages: true, q: '*' } })
      }
        e.preventDefault();
    }
  
    const handleChangeSettings = (e) => {
      const name = e.target.name;
      let value = (name === 'q' && e.target.value !== '') ? e.target.value : '*';
      setTempParams(values => ({...values, [name]: value})) 
    }
  
    const handleFocus = (e) => {
      e.target.value = params.params.q
    }
    const handleBlur = (e) => {
      e.target.value = params.params.q === '*' ? '' : params.params.q
    }
  
    useEffect(() => {
        refFilter.current.value = params.params.q
    },[params.params.q])

    useEffect(() => {
      if(refFilter.current.value !== params.params.q || refFilter.current.value === '*') setFilterMode('Filter')
      else setFilterMode('Clear')
      return () => { setFilterMode('Filter') }
    })
  
    useEffect(() => {
      localStorage.setItem('liked', JSON.stringify(favorites))
    },[favorites])
  
    const mainHeader = (showHistory, n) => {
      const string = showHistory ? 'History' : `Exhibits viewed: ${n}`
      return <h1>{string}</h1>
    }

    return (
    <header className='header-wrapper'>
        <div className='header-left'>
            <span>{`${artCount} exhibits`}</span>
            <form onSubmit={handleSubmitSettings} className='filter-form'>
                <input type="text" id='filter' name='q'
                       onChange={handleChangeSettings}
                       onFocus={handleFocus}
                       onBlur={handleBlur}
                       ref={refFilter}
                />
                <input type="submit" value={filterMode} />
            </form>
        </div>
        <div className='header-middle'>{mainHeader(showHistory, viewCount)}</div>
        <div className='header-right'>
            <button className="mode-button" onClick={handleSwitchMode}>{showHistory ? 'Favorites': 'Explore Mode'}</button>
        </div>
    </header>
  )
}