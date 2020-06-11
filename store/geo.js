//在这里我们返回的是一个state对象，箭头函数返回对象多加个括号
//项目中使用vuex的方式是模块方式，将vuex划分为多个模块
const state = () => ({
    position: {}
})
const mutations = {
    setPosition(state, val) {
        state.position = val
    }
}
const actions = {
    setPosition: ({ commit }, position) => {
        commit('setPosition', position)
    }
}
export default {
    //该方法是为了避免各个vuex模块发生匿名冲突引入的
    //需要注意的是后面引用各个模块中的数据需要前缀加上模块名
    namespaced: true,
    state,
    mutations,
    actions
}