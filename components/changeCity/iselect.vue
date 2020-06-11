<template>
  <div class="m-iselect">
    <!-- v-model的值为当前被选中的el-option的 value 属性值！在项目中的value值是所选省份的区号 -->
    <el-select v-model="pvalue" placeholder="省份">
      <el-option v-for="item in province" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <!-- disabled属性可以控制下拉框的状态，在这里绑定该属性 -->
    <el-select v-model="cvalue" placeholder="城市" :disabled="!city.length">
      <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市中文或拼音"
      @select="handleSelect"
    ></el-autocomplete>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      province: [],
      pvalue: "",
      city: [],
      cvalue: "",
      input: "",
      cities: []
    };
  },
  watch: {
    //newPvalue为选中地区的区号
    pvalue: async function(newPvalue) {
      let self = this;
      let {
        status,
        data: { city }
      } = await self.$axios.get(`/geo/province/${newPvalue}`);
      if (status === 200) {
        self.city = city.map(item => {
          return {
            value: item.id,
            label: item.name
          };
        });
        self.cvalue = "";
      }
    }
  },
  mounted: async function() {
    let self = this;
    let {
      status,
      data: { province }
    } = await self.$axios.get("/geo/province");
    if (status === 200) {
      self.province = province.map(item => {
        return {
          value: item.id,
          label: item.name
        };
      });
    }
  },
  methods: {
    //在elementui中该方法实在聚焦时触发，每次内容的改动该方法都会执行！
    //在这调用debouce方法，也称防抖，如果在200ms内触发函数，则重新计算，并在200ms之后
    //重新调用
    querySearchAsync: _.debounce(async function(query, cb) {
      //第一个参数query是我们输入的内容，cb是回调函数，返回结果！根据ui的要求，以数组形式返回一系列对象
      //对象属性里面的value值是我们的查找的值
      let self = this;
      if (self.cities.length) {
        cb(self.cities.filter(item => item.value.indexOf(query) > -1));
      } else {
        let {
          status,
          data: { city }
        } = await this.$axios.get("/geo/city");
         
        if (status === 200) {
          self.cities = city.map(item => {
            return {
              value: item.name
            };
          });
          
          cb(self.cities.filter(item => item.value.indexOf(query) > -1));
        }
        else{
           cb([]);
        }
      }
    }, 200),
    //该方法是在选中之后触发的!
    handleSelect: function(item) {
      console.log(item.value);
    }
  }
};
</script>

<style lang='scss'>
@import "@/assets/css/changecity/iselect.scss";
</style>