import axios from "axios";
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const createPerson = personObject => {
    const request = axios.post(baseUrl, personObject)
    return request.then(response => response.data)
}

const deletePerson = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(()=>true)
}

const updateContact = (newContact) => {
    const request = axios.put(`${baseUrl}/${newContact.id}`, newContact)
    return request.then(response => response.data)
}

export default { getAll, createPerson, deletePerson, updateContact }