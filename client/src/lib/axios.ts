import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: `http://${window.location.hostname}:4000/api`,
});
