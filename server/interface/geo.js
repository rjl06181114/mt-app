import Router from 'koa-router';
import axios from './utils/axios'
import Province from '../dbs/models/province'
import { async } from 'q';
let router = new Router({ prefix: '/geo' });
router.get('/getPosition', async(ctx) => {
    let {
        status,
        data: {
            province,
            city
        }
    } = await axios.get('http://cp-tools.cn/geo/getPosition')
    if (status == 200) {
        ctx.body = {
            province,
            city
        }
    } else {
        ctx.body = {
            province: '',
            city: ''
        }
    }
})
router.get('/province', async(ctx) => {
    let { status, data: { province } } = await axios.get('http://cp-tools.cn/geo/province')
    ctx.body = {
        province: status === 200 ? province : []
    }
})
router.get('/city', async(ctx) => {
    let { status, data: { city } } = await axios.get('http://cp-tools.cn/geo/city');
    if (status === 200) {
        ctx.body = {
            city
        }
    } else {
        ctx.body = {
            city: []
        }
    }
})
router.get('/province/:id', async(ctx) => {
    // let city = await City.findOne({id: ctx.params.id})
    //
    // ctx.body = {
    //   code: 0,
    //   city: city.value.map(item => {
    //     return {province: item.province, id: item.id, name: item.name}
    //   })
    // }
    //在这个项目中我们采用的是路由的动态传参！传过来的是{id:''}对象！
    let {
        status,
        data: {
            city
        }
    } = await axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}`)
    if (status === 200) {
        ctx.body = {
            city
        }
    } else {
        ctx.body = {
            city: []
        }
    }
})
router.get('/hotCity', async(ctx) => {
    let { status, data: { hots } } = await axios.get('http://cp-tools.cn/geo/hotCity')
    if (status === 200) {
        ctx.body = {
            hots
        }
    } else {
        ctx.body = {
            hots: []
        }
    }
})
router.get('/menu', async(ctx) => {
    let { status, data: { menu } } = await axios.get('http://cp-tools.cn/geo/menu');
    if (status === 200) {
        ctx.body = { menu }
    } else {
        ctx.body = ''
    }
})
export default router