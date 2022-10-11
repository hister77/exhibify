import { useState, useEffect, lazy, Suspense } from 'react'
const LoadingSpinner = lazy(() => import('./loading'))

const Like = ({ artObject, favorites, setFavorites, liked, setLiked }) => {

    function handleLike () {

        let tempFavs = [...favorites]

        const likedArt = {
            id: artObject.objectID,
            url: artObject.primaryImage,
            title: artObject.title,
            author: artObject.artistDisplayName,
            date: artObject.objectDate }
                               
        if(!liked && !tempFavs.find(v=>v.id===likedArt.id)) {
            tempFavs.push(likedArt)
            setFavorites(tempFavs)
            setLiked(true)
            return
        }
        tempFavs = tempFavs.filter(v=>v.id!==likedArt.id)
        setFavorites(tempFavs)
        setLiked(false)
        
        return
    }
    
    return <button className="like" onClick={handleLike}>{liked ? 'Unlike' : 'Like'}</button>

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
        image: '',
        style: {
            display: 'none'
        }
    }
    const [exhibit, setExhibit] = useState(exhibitTemplate)
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        if(favorites.find(fav=>fav.id===artObject.objectID)) setLiked(true)
        return () => {
            setLiked(false)
        };
    },[favorites, artObject.objectID])

    const imageLoaded = (e) => {
        setExhibit({ ...exhibitTemplate,
            id: artObject.objectID,
            title: artObject.title,
            artist: artObject.artistDisplayName,
            date: artObject.objectDate,
            image: artObject.primaryImage,
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
            <Like artObject={artObject} favorites={favorites} setFavorites={setFavorites} liked={liked} setLiked={setLiked}/>
        </div>
    </Suspense>
    )
}

export default Exhibit