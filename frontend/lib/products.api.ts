import axios from "axios"

const API = "http://localhost:5000"

export const getProducts = (params:any) =>
  axios.get(`${API}/products`, { params })

export const getFilters = () =>
  axios.get(`${API}/products/filters`)