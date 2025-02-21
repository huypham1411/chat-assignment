import axios from 'axios';

const productionUrl = 'https://chat-assignment-i4ar.onrender.com/api';
export const axiosClient = axios.create({
  baseURL:
    window.location.hostname === 'localhost'
      ? `http://localhost:4000/api`
      : productionUrl,
});
