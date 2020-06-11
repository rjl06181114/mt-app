import Koa from 'koa'
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser'
import session from 'koa-generic-session'
import Redis from 'koa-redis'
import json from 'koa-json'
import dbConfig from './dbs/config.js'
import passport from './interface/utils/passport'
import users from './interface/users'
import geo from './interface/geo'
import search from './interface/search'
import categroy from './interface/categroy'
import cart from './interface/cart'
import order from './interface/order'
const app = new Koa()


const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
    //配置session的加密处理
app.keys = ['mt', 'keyskeys']
app.proxy = true
    //将session存储在redis中，
app.use(session({ key: 'mt', prefix: 'mt:uid', store: new Redis() }))

//配置post请求
app.use(bodyParser({
    extendTypes: ['json', 'form', 'text']
}))
app.use(json())
    //配置mongoose，与数据库进行连接
mongoose.connect(dbConfig.dbs, {
        useNewUrlParser: true
    })
    //开启koa-passport对session的支持，initialzie()函数的作用是为上下文添加passport字段，passport.session()是从session中
    //提取用户信息
app.use(passport.initialize())
    /* app.use(passport.session()) */

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
    // Instantiate nuxt.js
    const nuxt = new Nuxt(config)

    // Build in development
    if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
    }
    //官方推荐的启动路由的方法，allowedMethods方法可以根据响应设置响应头部信息！
    app.use(users.routes()).use(users.allowedMethods())
    app.use(geo.routes()).use(geo.allowedMethods())
    app.use(search.routes()).use(search.allowedMethods())
    app.use(categroy.routes()).use(categroy.allowedMethods())
    app.use(cart.routes()).use(cart.allowedMethods())
    app.use(order.routes()).use(order.allowedMethods())
    app.use(ctx => {
        ctx.status = 200 // koa defaults to 404 when it sees that status is unset

        return new Promise((resolve, reject) => {
            ctx.res.on('close', resolve)
            ctx.res.on('finish', resolve)
            nuxt.render(ctx.req, ctx.res, promise => {
                // nuxt.render passes a rejected promise into callback on error.
                promise.then(resolve).catch(reject)
            })
        })
    })

    app.listen(port, host)
    consola.ready({ message: `Server listening on http://${host}:${port}`, badge: true })
}

start()