import Router from 'koa-router';
import axios from './utils/axios'
import Cart from '../dbs/models/cart'
import md5 from 'crypto-js/md5'
import { async } from 'q';
let router = new Router({ prefix: '/cart' })
    /* 先创建购物车，然后将生成的id返回给前端 */
router.post('/create', async ctx => {
    if (!ctx.isAuthenticated()) {
        console.log(ctx.isAuthenticated());
        ctx.body = {
            code: -1,
            msg: 'please login'
        }
    } else {
        let time = Date()
        let cartNo = md5(Math.random() * 1000 + time).toString()
        let {
            params: {
                id,
                detail
            }
        } = ctx.request.body
        let cart = new Cart({ id, cartNo, time, user: ctx.session.passport.user, detail })

        /* 保存成功后这里的返回结果是保存在数据库的那部分数据 */
        let result = await cart.save()

        if (result) {
            ctx.body = {
                code: 0,
                msg: '',
                id: cartNo
            }
        } else {
            ctx.body = {
                code: -1,
                msg: 'fail'
            }
        }
    }
})
router.post('/getCart', async(ctx) => {
    let { id } = ctx.request.body;
    try {
        let result = await Cart.findOne({ cartNo: id })
        ctx.body = {
            code: 0,
            data: result ? result.detail[0] : {}
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            data: {}
        }
    }
})
export default router