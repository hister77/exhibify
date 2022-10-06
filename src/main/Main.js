import React, { useState, useEffect, useContext } from "react";
import History from '../components/history'
import { AppContext } from '../App'

const Like = ({ artObject, setLastLiked }) => {

    const handleLike = () => {
        const likedArtObjects = JSON.parse(localStorage.getItem('liked')) || []
        let likedArt = {}
        Object.assign(likedArt, { id: artObject.objectID,
                               url: artObject.primaryImage,
                               title: artObject.title,
                               author: artObject.artistDisplayName,
                               date: artObject.objectDate })
        if(likedArtObjects.length > 0) {
            if(!likedArtObjects.find(v=>v.id===likedArt.id)) {
                likedArtObjects.push(likedArt)
                localStorage.setItem('liked', JSON.stringify(likedArtObjects))
                
            }
            setLastLiked(likedArtObjects.slice(likedArtObjects.length-10))
        }
        else {
            localStorage.setItem('liked', JSON.stringify([likedArt]))
            setLastLiked([likedArt])
        }
    }
    return <button onClick={handleLike}>Like</button>

}

const Content = ({ artObject, rollID, setLastLiked }) => {

    const displayImage = () => {
        return <img src={artObject.primaryImage} alt={artObject.title}/>
    }
    let { artistDisplayName, objectDate } = artObject
    objectDate = objectDate && "(" + objectDate + ")"

    return (
    <>
        <div className="content">
            <h3>{artObject.title}</h3>
            {artObject.primaryImage ? displayImage() : <p>{artObject.title}</p>}
            <p>{`${artistDisplayName} ${objectDate}`}</p>
        </div>
        <div className="action-box">
            <button onClick={rollID}>Next</button>
            <Like artObject={artObject} setLastLiked={setLastLiked}/>
        </div>
    </>
    )
}

export default function Main() {

    // const {artCount, countCount, setArtCount, setcountCount} = useContext(AppContext)
    const {req, viewCount, setViewCount, showHistory, setShowHistory, setArtCount} = useContext(AppContext)
    const [data, setData] = useState([437041])
    const [params, setParams] = useState({ params: { medium: 'Paintings', hasImages: true, q: '*' } })
    const [artObject, setArtObject] = useState({})
    const [prevArtObject, setPrevArtObject] = useState({})
    const [randArtID, setRandArtID] = useState(0)
    const [artID, setArtID] = useState(27)
    const [lastLiked, setLastLiked] = useState([])
    const [n, setN] = useState(6)

    useEffect(() => {
        const pullObjects = async () => {
            const response = await req.get('/search', params)
            return response.data.objectIDs
        }
        pullObjects()
            .then(art_objects => {
                setData(art_objects)
                setArtCount(art_objects.length)
            })
            .catch(err => console.log(err))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params])

    useEffect(() => {
        pullObject(data.at(randArtID))
            .then((art_object) => {
                if(art_object.primaryImage !== "") {
                    setArtObject(art_object)
                    setViewCount(viewCount => viewCount + 1)
                }
                else rollID()
            })
            .catch(err => console.log(err))
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [randArtID])

    useEffect(() => {
        if (viewCount < 1) return
        pullObject(artID)
            .then((art_object) => {
                setArtObject(art_object)
                setViewCount(countCount => countCount + 1)
            })
            .catch(err => console.log(err))
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [artID])

    const pullObject = async function (id) {
        const response = await req.get(`/objects/${id}`)
        return response.data
    }

    const rollID = () => {
        setRandArtID(Math.floor(Math.random() * data.length))
    }
    
    return (
        <div className="art-wrapper">
            {showHistory
                ? <History
                    lastLiked={lastLiked}
                    setLastLiked={setLastLiked}
                    setArtID={setArtID}
                    setShowHistory={setShowHistory}
                    n={n}
                    setN={setN}
                    />
                : <Content artObject={artObject} rollID={rollID} setLastLiked={setLastLiked} />
            }
        </div>
    )
}