import axios from 'axios'

const req = axios.create({
    baseURL: 'https://collectionapi.metmuseum.org/public/collection/v1',
    timeout: 5000
})

export default req