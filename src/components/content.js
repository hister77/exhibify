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
    
    return <button className="like" onClick={handleLike}>{like ? 'Unlike' : 'Like'}</button>

}

const Navigator = ({ sessionData, setArtID, drawID, artObject, setExhibit }) => {
    const [nav, setNav] = useState( {prev: null}, {next: null} )

    const handleOption = (e) => {
        const idx = sessionData.findIndex(el=>el.id===artObject.objectID)

        setExhibit(exhibitTemplate)
        setNav( { prev: sessionData[idx-1], next: sessionData[idx+1] } )

        switch (e.target.id) {
            case 'random': drawID(); break;
            case 'prev': (nav.prev && setArtID(nav.prev.id)); break;
            case 'next': (nav.next && setArtID(nav.next.id)); break;
            default: break;
        }
    }

    return (
    <>
        {['prev', 'next', 'random'].map((el) => {
            return <button key={el} id={el} className='action-button' onClick={handleOption}>{el[0].toUpperCase()+el.slice(1)}</button>
        })}
    </>
    )
}

const Exhibit = ({ artObject, drawID, setArtID, favorites, setFavorites, sessionData }) => {

    const displayImage = (art, exh) => {
        return <img src={art.primaryImage} alt={exh.title} style={ exh.style } onLoad={imageLoaded} />
    }

    const [exhibit, setExhibit] = useState(exhibitTemplate)
    const [like, setLike] = useState(false)

    useEffect(() => {
        favorites.find(fav=>fav.id===artObject.objectID) && setLike(true)
        return () => {
            setLike(false)
        };
    },[favorites, artObject.objectID])

    useEffect(() => {
        sessionStorage.setItem('viewed', JSON.stringify(sessionData))
    }, [sessionData])

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
            <Navigator sessionData={sessionData} setArtID={setArtID} drawID={drawID} artObject={artObject} setExhibit={setExhibit}/>
            <Like artObject={artObject} favorites={favorites} setFavorites={setFavorites} like={like} setLike={setLike}/>
        </div>
    </Suspense>
    )
}



export default Exhibit