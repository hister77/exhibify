import { useState, useEffect, lazy, Suspense } from 'react'
const LoadingSpinner = lazy(() => import('./loading'))

const Like = ({ artObject, favorites, setFavorites, like, setLike }) => {

    function handleLike () {

        let tempFavs = [...favorites]

        const likedArt = {
            id: artObject.objectID,
            url: artObject.primaryImage,
            title: artObject.title,
            author: artObject.artistDisplayName,
            date: artObject.objectDate }
                               
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

const Exhibit = ({ artObject, drawID, favorites, setFavorites }) => {

    const displayImage = (art, exh) => {
        return <img src={art.primaryImage} alt={exh.title} style={ exh.style } onLoad={imageLoaded} />
    }

    const exhibitTemplate = {
        id: null,
        title: "Loading...",
        artist: '',
        date: '',
        style: {
            display: 'none'
        }
    }
    const [exhibit, setExhibit] = useState(exhibitTemplate)
    const [like, setLike] = useState(false)

    useEffect(() => {
        favorites.find(fav=>fav.id===artObject.objectID) && setLike(true)
        return () => {
            setLike(false)
        };
    },[favorites, artObject.objectID])

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

    const preLoader = () => {
        setExhibit(exhibitTemplate)
        drawID()
    }

    return (
    <Suspense fallback={ <LoadingSpinner />}>
        <div className="content">
            <h3>{exhibit.title}</h3>
            {displayImage(artObject, exhibit, )}
            <p>{`${exhibit.artist} ${exhibit.date}`}</p>
        </div>
        <div className="action-box">
            <button className='random' onClick={preLoader}>Random</button>
            <Like artObject={artObject} favorites={favorites} setFavorites={setFavorites} like={like} setLike={setLike}/>
        </div>
    </Suspense>
    )
}

export default Exhibit