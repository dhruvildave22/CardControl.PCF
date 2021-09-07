const isDevelopment = process.env.NODE_ENV === 'development';
const protocol = isDevelopment ? 'http://' : 'https://';

export default {
  // baseUrl: 'http://13.127.89.229:5000/api',
  // baseUrl: isDevelopment ? 'http://localhost:3000/api' : 'http://13.127.89.229:5001/api',
  baseUrl: `${protocol}${window.location.hostname}:${window.location.port}`,
};
