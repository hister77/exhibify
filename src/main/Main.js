import React, { useState, useEffect, useContext } from "react";
import { AppContext } from '../App'
import History from '../components/history'
import Exhibit from '../components/content'
import req from '../api/request'

export default function Main() {

    const { data, params, setData, artCount, setArtCount, setViewCount, showHistory, setShowHistory, favorites, setFavorites } = useContext(AppContext)
    const [artObject, setArtObject] = useState({})
    const [artID, setArtID] = useState(null)

    const drawID = () => {
        setArtID(data.at(Math.floor(Math.random() * data.length)))
    }

    useEffect(() => {
        (async () => {
            const response = await req.get('/search', params)
            const art_objects = response.data.objectIDs
            setData(art_objects)
            setArtCount(response.data.total)
            if(response.data.total > 0)
                setArtID(art_objects.at(Math.floor(Math.random() * art_objects.length)))
        })()
    }, [params.params.q])

    useEffect(() => {
        let timer;
        if(artCount < 1 || artID < 0) return
        (async () => {
            const response = await req.get(`/objects/${artID}`)
            const art_object = await response.data
            if(art_object.primaryImage !== "") {
                setArtObject(art_object)
                setViewCount(viewCount => viewCount + 1)
            }
            else {
                timer = setTimeout(() => {
                    drawID()
                }, 2000)
            }
        })()
        return () => {
            clearTimeout(timer)
        }
    }, [data, artID])
    
    return (
        <main className='main-wrapper'>
            <div className="art-wrapper">
                {showHistory
                    ? <History favorites={favorites} setArtID={setArtID} setShowHistory={setShowHistory} />
                    : <Exhibit artObject={artObject} drawID={drawID} favorites={favorites} setFavorites={setFavorites} />
                }
            </div>
        </main>
    )
}