import { useState, useEffect, lazy, Suspense } from 'react'
import { artShortObj } from '../utils/art'

const LoadingSpinner = lazy(() => import('./loading'))

const exhibitTemplate = {
    id: null,
    title: "Loading...",
    artist: '',
    date: '',
    style: {
        display: 'none'
    }
}

const Like = ({ artObject, favorites, setFavorites, like, setLike }) => {

    function handleLike () {

        let tempFavs = [...favorites]

        const likedArt = artShortObj(artObject)
                               
        if(!like && !tempFavs.find(v=>v.id===likedArt.id)) {
            tempFavs.push(likedArt)
            setFavorites(tempFavs)
            setLike(true)
        }
        else {
            tempFavs = tempFavs.filter(v=>v.id!==likedArt.id)
            setFavorites(tempFavs)
            setLike(false)
        }
    }
    
    return <button className="template-button like" onClick={handleLike}>{like ? 'Unlike' : 'Like'}</button>

}

const Ban = ({ artObject, setBanned, isBanned, drawID, setExhibit }) => {
    const val = isBanned ? 'Unban' : 'Ban' 
    const handleBan = (e) => {
        if(!isBanned) {
            setBanned(arr=> [...arr, artObject.objectID])
            setExhibit(exhibitTemplate)
            drawID()
            return
        }
        setBanned(arr => {
            const idx = arr.findIndex(el=>el===artObject.objectID)
            return [...arr.slice(0,idx), ...arr.slice(idx+1)]
        })
    }

    return <button className="template-button ban" value={val} onClick={handleBan}>{val}</button>
}

const Navigator = ({ artObject, setArtID, drawID, setExhibit, nav, navPanel }) => {

    const handleOption = (e) => {
        
        setExhibit(exhibitTemplate)

        switch (e.target.id) {
            case 'random': drawID(); break;
            case 'prev': (nav.prev && setArtID(nav.prev.id)); break;
            case 'next': (nav.next && setArtID(nav.next.id)); break;
            default: setArtID(artObject.objectID);
        }
    }

    return (
    <>
        {navPanel.map((el) => {
            return <button key={el} id={el} className='template-button action-button' onClick={handleOption}>{el[0].toUpperCase()+el.slice(1)}</button>
        })}
    </>
    )
}

const Exhibit = ({ artObject, drawID, setArtID, favorites, setFavorites, sessionData, nav, banned, setBanned }) => {

    const displayImage = (art, exh) => {
        return <img src={art.primaryImage} alt={exh.title} style={ exh.style } onLoad={imageLoaded} />
    }
  
    const [exhibit, setExhibit] = useState(exhibitTemplate)
    const [like, setLike] = useState(false)
    const [navPanel, setNavPanel] = useState(['random'])
    const [isBanned, setIsBanned] = useState(false)

    useEffect(() => {
        favorites.find(fav=>fav.id===artObject.objectID) && setLike(true)
        return () => {
            setLike(false)
        };
    },[favorites, artObject.objectID])

    useEffect(() => {
        if(nav.next) setNavPanel(panel=>['next', ...panel])
        if(nav.prev) setNavPanel(panel=>['prev', ...panel])
        return () => {
            setNavPanel(['random'])
        }
    }, [nav])

    useEffect(() => {
        localStorage.setItem('banned', JSON.stringify(banned))
        if(banned.includes(artObject.objectID)) setIsBanned(true)
        else setIsBanned(false)
    },[banned, artObject.objectID])

    const imageLoaded = (e) => {
        setExhibit({ ...exhibitTemplate,
            id: artObject.objectID,
            title: artObject.title,
            artist: artObject.artistDisplayName,
            date: artObject.objectDate,
            style: {
                display: 'inline-block'
            }
        })
    }

    return (
    <Suspense fallback={ <LoadingSpinner />}>
        <div className="content">
            <h3>{exhibit.title}</h3>
            {displayImage(artObject, exhibit, )}
            <p>{`${exhibit.artist} ${exhibit.date}`}</p>
        </div>
        <div className="action-box">
            <Navigator sessionData={sessionData} setArtID={setArtID} drawID={drawID} artObject={artObject} setExhibit={setExhibit} nav={nav} navPanel={navPanel}/>
            <Like artObject={artObject} favorites={favorites} setFavorites={setFavorites} like={like} setLike={setLike}/>
            <Ban artObject={artObject} setBanned={setBanned} isBanned={isBanned} drawID={drawID} setExhibit={setExhibit}/>
        </div>
    </Suspense>
    )
}



export default Exhibit