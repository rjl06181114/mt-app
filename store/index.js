 /* const actions = {

                       // Nuxt,js调用它的时候会将页面的context上下文对象作为第2个参数传给它
                       async nuxtServerInit({ commit }, { req, app }) {
                           console.log(1);
                           const { status, data: { province, city } } = await app.$axios.get('/geo/getPositon')
                           commit('geo/setPosition', status === 200 ? { city, province } : { city: '', province: '' })
                           const { status: status2, data: { menu } } = await app.$axios.get('geo/menu')

                           commit('home/setMenu', status2 === 200 ? menu : [])
                       }
                   }
                   export default actions */
 export const actions = {
     //这个方法只能用在index.js文件中，服务端会直接调用该方法！将获取到的数据放在vuex状态中！
     async nuxtServerInit({
         commit
     }, { req, app }) {
         const {
             status,
             data: {
                 province,
                 city
             }
         } = await app.$axios.get('/geo/getPosition')

         commit('geo/setPosition', status === 200 ? { city, province } : { city: '', province: '' })

         const { status: status2, data: { menu } } = await app.$axios.get('/geo/menu')

         commit('home/setMenu', status2 === 200 ? menu : [])
         const { status: status3, data: { result } } = await app.$axios.get('/search/hotPlace', {
             params: {
                 city: '西安' /* app.store.state.geo.position.city.toString().replace('市', '') */
             }
         })

         commit('home/setHotSpace', status3 === 200 ? result : []);
     }
 }