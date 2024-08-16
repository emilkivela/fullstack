import axios from 'axios'
const baseURL = '/api/persons'

const getAll = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseURL, newObject)
    return request.then(response => response.data)
}

const deletion = id => {
    const url = `${baseURL}/${id}`
    const request = axios.delete(url)
    return request.then(response => response.data)
}

const changeNumber = (id, changedObject) => {
    const request = axios.put(`${baseURL}/${id}`, changedObject)
    return request.then(response => response.data)
}



export default {getAll, create, deletion, changeNumber}