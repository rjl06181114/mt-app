import Router from 'koa-router';
import axios from './utils/axios'
import { async } from 'q';
let router = new Router({ prefix: '/search' });
router.get('/top', async(ctx) => {
    let {
        status,
        data: {
            top
        }
    } = await axios.get(`http://cp-tools.cn/search/top`, {
        params: {
            input: ctx.query.input,
            city: ctx.query.city,

        }
    })
    ctx.body = {
        top: status === 200 ?
            top : []
    }
})
router.get('/hotPlace', async(ctx) => {
    let { status, data: { result } } = await axios.get('http://cp-tools.cn/search/hotPlace', {
        params: {
            city: ctx.store ? ctx.store.state.geo.position.city : ctx.query.city
        }
    })
    ctx.body = {
        result: status === 200 ? result : []
    }
})
router.get('/products', async(ctx) => {
    let { status, data: { product, more } } = await axios.get('http://cp-tools.cn/search/products', {
        params: {
            keyword: ctx.query.keyword,
            city: /* ctx.store.state.geo.position.city */ '西安'
        }
    });
    if (status === 200) {
        ctx.body = {
            product,
            more: ctx.isAuthenticated() ? more : [],
            login: ctx.isAuthenticated()
        }
    } else {
        ctx.body = {
            product: {},
            more: ctx.isAuthenticated() ? more : [],
            login: ctx.isAuthenticated()
        }
    }
})
router.get('/resultsByKeywords', async(ctx) => {
    const { city, keyword } = ctx.query;
    let { status, data: { count, pois } } = await axios.get('http://cp-tools.cn/search/resultsByKeywords', {
        params: {
            city,
            keyword
        }

    })
    ctx.body = {
        count: status === 200 ? count : 0,
        pois: status === 200 ? pois : []
    }
})
export default router