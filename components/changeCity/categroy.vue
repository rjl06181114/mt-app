<template>
  <div class="">
      <!-- 使用锚点的时候要注意目标是a标签我们使用name对其设置，其他标签我们使用id对其设置 -->
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd
        v-for="item in list"
        :key="item">
        <a :href="'#city-'+item">{{ item }}</a>
      </dd>
    </dl>
    <dl
    v-for="item in block"
      :key="item.title"
      class="m-categroy-section">
      <dt 
      :id="'city-'+item.title"
      >{{ item.title }}</dt>
      <dd>
        <span
          v-for="c in item.city"
          :key="c">{{ c }}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
import pyjs from  'js-pinyin'
export default {
  data() {
    return {
      list: "ABCDEFGHIJKLMNPQRSTWXYZ".split(""),
      block: []
    };
  },
  mounted:async function(){
        let self=this;
        let p;
        let d={};
        let {status,data:{city}}=await self.$axios.get('http://cp-tools.cn/geo/city');
       
        if(status===200){
           city.forEach(element => {
                //getFullChars()获取汉字的全部拼音，首汉字是大写的，所以我们在这里转为了小写getCamelChars('')获取汉字的首字母拼音。
                p=pyjs.getFullChars(element.name).toLocaleLowerCase().slice(0,1);
                if(!d[p]){
                    d[p]=[];
                }
                d[p].push(element.name)            
           });
        }
        //上面采用了类似于{a,[a开头的城市]}这样的树据结构
        //Object.entries()该方法可以将对象键值对化为数组形式，用for of循环可以对其进行遍历
        for(let [k,v] of Object.entries(d)){
              self.block.push({
                  title:k.toUpperCase(),
                  city:v
              })
        }
        //sort方法将字母排序，按照升序排列了出来。
        self.block.sort((a,b)=>a.title.charCodeAt(0)-b.title.charCodeAt(0));
  }
};
</script>

<style lang='scss'>
@import "@/assets/css/changecity/categroy.scss";
</style>