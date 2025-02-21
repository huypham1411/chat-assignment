import axios from 'axios';
import { productionUrl } from '../constants';
export const axiosClient = axios.create({
  baseURL:
    window.location.hostname === 'localhost'
      ? `http://localhost:4000/api`
      : productionUrl,
});
