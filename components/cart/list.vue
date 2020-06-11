<template>
  <el-table :data="cartData" style="width: 1080px">
      <!-- label为表头名字，prop是在data数据中数组里面对应的数据值 -->
    <el-table-column prop="name" label="项目" width="380px"></el-table-column>
    <el-table-column prop="price" label="单价" width="180"></el-table-column>

    <el-table-column prop="count" label="数量" width="250px">
      <template slot-scope="scope">
        <el-input-number
        
          v-model="scope.row.count"
          :min="1"
          :max="10"
          label="描述文字"
        ></el-input-number>
      </template>
    </el-table-column>

    <el-table-column prop="date" label="总价" width="180">
        <!-- slot—scope属性可以实现双向绑定，scope.row.price是同行中的price属性 -->
         <template slot-scope="scope">
           {{scope.row.price*scope.row.count}}
      </template>
       
    </el-table-column>
  </el-table>
</template>

<script>
export default {
   props:{
       cartData:{
           type:Array,
           default:()=>{
               return [];
           }
       }
   }
    
};
</script>

<style lang='scss'>
</style>