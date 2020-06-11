export default {
    //配置数据库，将我们的用户信息存储在students中
    dbs: 'mongodb://127.0.0.1:27017/student',
    redis: {
        get host() {
            return '127.0.0.1'
        },
        get port() {
            return 6379;
        }
    },
    smtp: {
        get host() {
            return 'smtp.qq.com'
        },
        get user() {
            return '782527057@qq.com'
        },
        get pass() {
            return 'yjotqywhbdbdbefh'
        },
        get code() {
            return () => {
                return Math.random().toString(16).slice(2, 6).toUpperCase();
            }
        },
        get expire() {
            return () => {
                return new Date().getTime() + 60 * 1000;
            }
        }
    }
}