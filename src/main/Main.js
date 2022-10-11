import React, { useState, useEffect, useContext } from "react";
import History from '../components/history'
import { AppContext } from '../App'
import req from '../api/request'
import Exhibit from '../components/content'

export default function Main() {

    const { data, setData, viewCount, setViewCount, showHistory, setShowHistory, favorites, setFavorites } = useContext(AppContext)
    const [params, setParams] = useState({ params: { medium: 'Paintings', hasImages: true, q: '*' } })
    const [artObject, setArtObject] = useState({})
    const [artID, setArtID] = useState(null)

    const drawID = () => {
        setArtID(data.at(Math.floor(Math.random() * data.length)))
    }

    useEffect(() => {
        const fetchObjects = async () => {
            const response = await req.get('/search', params)
            return response.data.objectIDs
        }
        fetchObjects()
            .then(art_objects => {
                setData(art_objects)
                return Promise.resolve(art_objects)
            })
            .then((art_objects) => {
                if(viewCount < 1) setArtID(art_objects.at(Math.floor(Math.random() * art_objects.length)))
                return Promise.resolve()
            })
            .catch(err => console.log(err))
    }, [params])

    useEffect(() => {
        const fetchObject = async function (id) {
            const response = await req.get(`/objects/${id}`)
            return response
        }
        if (data.length > 0) {
            fetchObject(artID)
                .then((res) => {
                    if(res.data.primaryImage !== "") {
                        setArtObject(res.data)
                        setViewCount(viewCount => viewCount + 1)
                    }
                    else drawID()
                    return Promise.resolve()
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [artID])
    
    return (
        <div className="art-wrapper">
            {showHistory
                ? <History
                    favorites={favorites}
                    setArtID={setArtID}
                    setShowHistory={setShowHistory}
                  />
                : <Exhibit artObject={artObject} drawID={drawID} favorites={favorites} setFavorites={setFavorites} />
            }
        </div>
    )
}