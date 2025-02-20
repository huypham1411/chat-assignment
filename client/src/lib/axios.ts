import axios from 'axios';

const protocol = window.location.hostname === 'localhost' ? 'http' : 'https';

export const axiosClient = axios.create({
  baseURL: `${protocol}://${window.location.hostname}:4000/api`,
});
