import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
import Config from 'react-native-config';

// Use environment variable or default to localhost
const baseURL = Config.API_URL || 'http://localhost:3333';

const api = axios.create({
  baseURL,
  timeout: 10000,
});

// Response interceptor para tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expirado - limpar armazenamento
      // eslint-disable-next-line no-console
      console.log('Token expirado, redirecionando para login');
    }
    return Promise.reject(error);
  },
);

export default api;
