import React from "react";

const History = () => {
    const likedArtObjects = JSON.parse(localStorage.getItem('liked'))
    const lastLiked = likedArtObjects.slice(likedArtObjects.length-10)
    return (
        <div className="history-wrapper>">
            <ul>
                {lastLiked.map((liked) => {
                    return (
                    <React.Fragment key={liked.id.toString()}>
                        <li><a href={`https://www.metmuseum.org/art/collection/search/${liked.id}`}>{liked.title}</a></li>
                    </React.Fragment>
                    )
                })}
            </ul>
        </div>
    )
}

export default History