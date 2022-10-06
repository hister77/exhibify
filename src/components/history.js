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

const History = ({ lastLiked, setLastLiked, setArtID, setShowHistory, n, setN }) => {
    //const likedArtObjects = JSON.parse(localStorage.getItem('liked'))
    //const lastLiked = likedArtObjects !== null ? likedArtObjects.slice(likedArtObjects.length-10) : likedArtObjects;
    // const { liked } = props

    useEffect(() => {
        const likedArtObjects = JSON.parse(localStorage.getItem('liked'))
        Array.isArray(likedArtObjects) && setLastLiked(likedArtObjects.slice(likedArtObjects.length-n).reverse())
    }, [setLastLiked, n])

    function handleClick(e) {
        const id = e.target.id.replace(/^piece_+/, '');
        setArtID(id);
        setShowHistory(false);
    }

    const handleMore = () => setN(n => n + 4)

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
            {groupedLikes(lastLiked).map((col, i) => {
                return (
                <div key={i} className="column">
                    {col.map((art) => artBox(art))}
                </div>
                )
            })}
        <button onClick={handleMore}>more...</button>
        </div>
    )
}

export default History