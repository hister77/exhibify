import React, { useState, useEffect, useContext } from "react";
import { AppContext } from '../App'
import History from '../components/history'
import Exhibit from '../components/content'
import req from '../api/request'
import { artShortObj } from "../utils/art";

export default function Main() {

    const { data, params, setData, artCount, setArtCount, setViewCount, showHistory, setShowHistory, favorites, setFavorites, sessionData, setSessionData } = useContext(AppContext)
    const [artObject, setArtObject] = useState({})
    const [artID, setArtID] = useState(null)
    const [nav, setNav] = useState( {prev: null}, {next: null} )

    const drawID = () => {
        setArtID(data.at(Math.floor(Math.random() * data.length)))
    }

    useEffect(() => {
        (async () => {
            const response = await req.get('/search', params)
            const art_objects = response.data.objectIDs
            setData(art_objects)
            setArtCount(response.data.total)
            if(response.data.total > 0) {
                setArtID(art_objects.at(Math.floor(Math.random() * art_objects.length)))
            }
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
                const currentArt = artShortObj(art_object)
                setSessionData((art) => {
                    let arr = [...art]
                    if(!art.find(el => el.id===currentArt.id)) arr.push(currentArt)
                    return arr
                })
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
    
    useEffect(() => {
        sessionStorage.setItem('viewed', JSON.stringify(sessionData))
        const idx = sessionData.findIndex(el=>el.id===artObject.objectID)
        setNav( { prev: sessionData[idx-1], next: sessionData[idx+1] } )
    }, [sessionData, artObject])

    return (
        <main className='main-wrapper'>
            <div className="art-wrapper">
                {showHistory
                    ? <History favorites={favorites} setArtID={setArtID} setShowHistory={setShowHistory} />
                    : <Exhibit artObject={artObject}
                               drawID={drawID}
                               setArtID={setArtID}
                               favorites={favorites}
                               setFavorites={setFavorites}
                               sessionData={sessionData}
                               nav={nav} />
                }
            </div>
        </main>
    )
}