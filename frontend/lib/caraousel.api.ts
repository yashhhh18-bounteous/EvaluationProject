import axios from "axios"

const API = "http://localhost:5000"

export const getCarousel = () =>
  axios.get(`${API}/carousel`)