<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col :span="3" class="left">
        <img src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/logo.png" alt="美团" />
      </el-col>
      <!-- 在这里我们采用的是element的栅栏布局，:span共分为24栏，:gutter为左右外边距 -->
      <el-col :span="15" class="center">
        <div class="wrapper">
          <el-input v-model="search" @focus="focus" @blur="blur" @input="input" placeholder="搜索商家或地点" />
          <button class="el-button el-button--primary">
            <i class="el-icon-search" />
          </button>
          <dl class="hotPlace" v-if="ishotPlace">
            <dt>热门搜索</dt>
            <!-- vue通过key值判断数据是否被修改，此时不写key值vue直接报错！ -->
            <dd v-for="(item,idex) in hotPlace" :key=idex><a :href="'/products?keyword='+encodeURIComponent(item.name)">{{item.name}}</a></dd>
          </dl>
          <dl class="searchList" v-if="issearchList">
          <dd v-for="(item,idex) in searchList" :key=idex><a :href="'/products?keyword='+encodeURIComponent(item)">{{ item }}</a></dd>
          </dl>
        </div>
        <p class="suggest">
         
        </p>
        <ul class="nav">
          <li>
            <nuxt-link to="/" class="takeout">美团外卖</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="movie">猫眼电影</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="hotel">美团酒店</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="apartment">民宿/公寓</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="business">商家入驻</nuxt-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="6" class="right">
        <ul class="security">
          <li>
            <i class="refund" />
            <p class="txt">随时退</p>
          </li>
          <li>
            <i class="single" />
            <p class="txt">不满意免单</p>
          </li>
          <li>
            <i class="overdue" />
            <p class="txt">过期退</p>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      search: "",
      isFocus: false,
      hotPlace: this.$store.state.home.hotPlace.slice(0,5),
      searchList:[]
    };
  },
  computed: {
    //判断是否聚焦并且里面是否有内容
    ishotPlace: function() {
      return this.isFocus && !this.search;
    },
    issearchList: function() {
      return this.isFocus && this.search;
    }
  },
  methods: {
    focus: function() {
      this.isFocus = true;
    },
    blur: function() {
      //失去焦点时之前的链接依然起作用
      setTimeout(() => {
        this.isFocus = false;
      }, 200);
    },
    input:_.debounce(async function(){
      let self=this;
      let city=self.$store.state.geo.position.city.toString();
      city.replace('市','');
      self.searchList=[]
      let {status,data:{top}}=await self.$axios.get('/search/top',{
        params:{
          input:self.search,
          city:'西安'
        }
      })
     /*  self.searchList=top.slice(0,10) */
    let searchListObj=top.slice(0,10);
    self.searchList=searchListObj.map(x=>x.name);
    },300)
  }
};
</script>

<style lang="css">
</style>
