import Router from 'koa-router';
import Redis from 'koa-redis'
//使用nodemailer包发送电子邮件
import nodeMailer from 'nodemailer'
//将我们配置好的数据库模型引入
import User from '../dbs/models/users'
import Passport from './utils/passport'

import Email from '../dbs/config'
import axios from './utils/axios'

let router = new Router({ prefix: '/users' })
    // 获取redis的客户端对象，可以在底下方便的操作redit
let Store = new Redis().client

router.post('/signup', async(ctx) => {
    const { username, password, email, code } = ctx.request.body;

    if (code) {
        //取我们存储在redit中的用户的信息进行校验
        const saveCode = await Store.hget(`nodemail:${username}`, 'code')
        const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
        if (code === saveCode) {
            if (new Date().getTime() - saveExpire > 0) {
                ctx.body = {
                    code: -1,
                    msg: '验证码已过期，请重新尝试'
                }
                return false
            }
        } else {
            ctx.body = {
                code: -1,
                msg: '请填写正确的验证码'
            }
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '请填写验证码'
        }
    }
    let user = await User.find({ username })
    if (user.length) {
        ctx.body = {
            code: -1,
            msg: '已被注册'
        }
        return
    }
    //创建库，保存用户信息在users集合下
    let nuser = await User.create({ username, password, email })

    if (nuser) {
        /*   let res = await axios.post('/users/signin', { username, password })
          if (res.data && res.data.code === 0) {
              ctx.body = {
                  code: 0,
                  msg: '注册成功',
                  user: res.data.user
              }
          } else {
              ctx.body = {
                  code: -1,
                  msg: 'error'
              }
          } */

        ctx.body = {
            code: 0,
            msg: '注册成功',

        }
    } else {
        ctx.body = {
            code: -1,
            msg: '注册失败'
        }
    }
})

router.post('/signin', async(ctx, next) => {
    return Passport.authenticate('local', function(err, user, info, status) {
        if (err) {
            ctx.body = {
                code: -1,
                msg: err
            }
        } else {
            if (user) {
                ctx.body = {
                    code: 0,
                    msg: '登录成功',
                    user
                }
                return ctx.login(user)
            } else {
                ctx.body = {
                    code: 1,
                    msg: info
                }
            }
        }
    })(ctx, next)
})


router.post('/verify', async(ctx, next) => {
    let username = ctx.request.body.username
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (saveExpire && new Date().getTime() - saveExpire < 0) {
        ctx.body = {
            code: -1,
            msg: '验证请求过于频繁，1分钟内1次'
        }
        return false
    }
    let transporter = nodeMailer.createTransport({
        service: 'qq',
        auth: {
            user: Email.smtp.user,
            pass: Email.smtp.pass
        }
    })
    let ko = {
            code: Email.smtp.code(),
            expire: Email.smtp.expire(),
            email: ctx.request.body.email,
            user: ctx.request.body.username
        }
        //配置邮件的信息
    let mailOptions = {
        from: `"认证邮件" <${Email.smtp.user}>`,
        to: ko.email,
        subject: '《慕课网高仿美团网全栈实战》注册码',
        html: `您在《慕课网高仿美团网全栈实战》课程中注册，您的邀请码是${ko.code}`
    }
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error)
        } else {
            //将我们发送对象的信息存储在redit中，以便上面进行验证码的比较
            Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
        }
    })
    ctx.body = {
        code: 0,
        msg: '验证码已发送，可能会有延时，有效期1分钟'
    }
})

router.get('/exit', async(ctx, next) => {
    //logout方法可以删除用户的session，不带参数
    await ctx.logout()
    if (!ctx.isAuthenticated()) {
        ctx.body = {
            code: 0
        }
    } else {
        ctx.body = {
            code: -1
        }
    }
})

router.get('/getUser', async(ctx) => {
    if (ctx.isAuthenticated()) {
        // 策略通过done将user存储到了session中, 并将sessionID写入到客户端的cookie上, 
        //将用户信息附加到请求对象req.session.passport.user上
        const { username, email } = ctx.session.passport.user
        ctx.body = {
            user: username,
            email
        }
    } else {
        ctx.body = {
            user: '',
            email: ''
        }
    }
})

export default router