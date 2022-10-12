import React, { useEffect, useState } from "react";

const groupedLikes = (favs, n=6) => {
    const columns = Array.from(Array(n), () => []);
    let j = 0
    for (let i = 0; i < favs.length; i++) {
        columns[j].push(favs[i])
        j < 3 ? j++ : j=0
    }
    return columns
}

const History = ({ favorites, setArtID, setShowHistory }) => {

    const [lastFavs, setLastFavs] = useState([])
    const [n, setN] = useState(6)

    useEffect(() => {
        const likedArtObjects = [...favorites]
        let items = n < likedArtObjects.length ? n : likedArtObjects.length
        Array.isArray(likedArtObjects) && setLastFavs(likedArtObjects.slice(likedArtObjects.length-items).reverse())
    }, [favorites, n])

    function handleClick(e) {
        const id = e.target.id.replace(/^piece_+/, '')
        setArtID(id)
        setShowHistory(false)
    }

    const handleMore = () => setN(l => l + 4)
    const handleLess = () => setN((l) => (l - 4 < 1 ? 0 : l - 4) )

    const artBox = (art) => {
        return (
        <img key={art.id}
             id={`piece_${art.id}`}
             className="art-box"
             onClick={handleClick}
             src={art.url}
             alt={art.title}
             decoding="async"
             fetchpriority="low"/>
        )
    }

    return (
        <div className="history-wrapper">
            {groupedLikes(lastFavs).map((col, i) => {
                return (
                <div key={i} className="column">
                    {col.map((art) => artBox(art))}
                </div>
                )
            })}
        <button onClick={handleMore}>more...</button>
        <button onClick={handleLess}>less...</button>
        </div>
    )
}

export default History