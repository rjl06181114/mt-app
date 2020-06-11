<template>
  <div class="m-hcity">
    <dl>
        <dt>
            热门城市 :
        </dt>
        <dd v-for="item in list" :key="item.id">
              {{item.name==="市辖区"?item.province:item.name}}
        </dd>
        </dl>    
</div>
</template>

<script>
export default {
  data(){
      return{
          list:[]
      }
  },
  mounted:async function(){
      let {status,data:{hots}}=await this.$axios.get('http://cp-tools.cn/geo/hotCity');
      this.list=hots;
  }
}
</script>

<style lang='scss'>
  @import '@/assets/css/changecity/hot.scss'
</style>