import React, { useState, useEffect, useContext } from "react"
import { AppContext } from '../App'
import History from '../components/history'
import Exhibit from '../components/content'
import req from '../api/request'
import { artShortObj } from "../utils/art"
import { difference } from 'lodash'

export default function Main() {

    const { data, setData,
            params,
            artCount, setArtCount,
            setViewCount,
            showHistory, setShowHistory,
            favorites, setFavorites,
            sessionData, setSessionData,
            banned, setBanned } = useContext(AppContext)
    const [artObject, setArtObject] = useState({})
    const [artID, setArtID] = useState(null)
    const [nav, setNav] = useState( {prev: null}, {next: null} )

    const drawID = () => {
        const sessionIDs = sessionData.reduce((arr,v) => { arr.push(v.id); return arr }, [])
        const IDs = difference(data, banned, sessionIDs)
        const randomID = IDs.at(Math.floor(Math.random() * IDs.length))
        randomID
            ? setArtID(randomID)
            : alert("No exhibits left in the current filter settings\n\nChange the settings, try another filter or clear it")
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
            try {
                const response = await req.get(`/objects/${artID}`)
                const art_object = await response.data
                if(art_object.primaryImage === "") {
                    setBanned(arr => [...arr, art_object.objectID])
                    timer = setTimeout(() => { drawID() }, 2000)
                    return
                }
                setArtObject(art_object);
                setSessionData((art) => {
                    const currentArt = artShortObj(art_object)
                    const arr = [...art]
                    if (!art.find((el) => el.id === currentArt.id)) {
                        setViewCount((viewCount) => viewCount + 1)
                        arr.push(currentArt);
                    }
                    return arr;
                })
            } catch (err) {
                console.log(err.response.status)
                err.response.status === 404 && drawID()
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
                               nav={nav}
                               banned={banned} setBanned={setBanned} />
                }
            </div>
        </main>
    )
}