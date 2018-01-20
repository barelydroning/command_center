/* global fetch */

export const API_URL = 'http://localhost:3001'

const formatQuery = params => {
  return '?' + Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&')
}

export const getFromApi = (endpoint, params = {}) => {
  const query = Object.keys(params).length ? formatQuery(params) : ''
  return fetch(
    `${API_URL}${endpoint}${query}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then(response => response.ok ? response.json() : Promise.reject(response.json()))
}

export const postToAPI = (endpoint, params) => {
  return fetch(
    `${API_URL}${endpoint}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }
  )
  .then(response => response.ok ? response.json() : Promise.reject(response.json()))
}

export const putToApi = (endpoint, params) => {
  return fetch(
    `${API_URL}${endpoint}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }
  )
  .then(response => response.ok ? response.json() : Promise.reject(response.json()))
}

export const deleteFromApi = (endpoint, params) => {
  const query = Object.keys(params).length ? formatQuery(params) : ''
  return fetch(
    `${API_URL}${endpoint}${query}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  .then(response => response.ok ? response.json() : Promise.reject(response.json()))
}
