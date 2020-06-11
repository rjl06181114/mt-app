let axios = require('axios');
let instance = axios.create({
    baseURL: 'http://${process.env.HOST||"localhost"}:${process.env.PORT||3000}',

    timeout: 10000,
    headers: {

    }
})
export default instance;