const artShortObj = (art) => {
    return {
        id: art.objectID,
        url: art.primaryImage,
        title: art.title,
        author: art.artistDisplayName,
        date: art.objectDate
    }
}

export { artShortObj }