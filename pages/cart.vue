<template>
   <div class="page-cart">
           <el-row >
               <el-col
                class="m-cart"
                v-if="1||cart.length"
               :span="24">
                   <list :cartData="cart"/>
                   <p>
                   应付金额:<em class="money">￥{{total}}</em>
                   </p>
                   <div class="post">
                       <el-button type="primary" @click="submit">
                            提交订单
                       </el-button>
                   </div>
               </el-col>
               <el-col v-else
               class="empty">
                   购物车为空
               </el-col>
           </el-row>
   </div>
</template>

<script>
import List from '@/components/cart/list.vue'
export default {
    data(){
        return{
            cart:[]
        }
    },
    computed:{
      total(){
          let total=0;
           this.cart.forEach(element => {
               total+=element.price*element.count;
          });
          return total;
      }
    },
    components:{
        List
    },
    methods:{
       async submit(){
            const { status, data: { code, id }} = await this.$axios.post('/order/createOrder', {
                id: this.cartNo,
                price: this.cart[0].price,
                count: this.cart[0].count
            })
            // console.log('status');
            // console.log(this.cartNo + "  " + this.cart[0].price+ "  " +this.cart[0].count);
            if (status === 200 && code === 0) {
                this.$alert(`恭喜您，已成功下单，订单号:${id}`, '下单成功', {
                confirmButtonText: '确定',
                callback: action => {
                    location.href = '/order'
                    }
                })
            }
        },
    },
    async asyncData(ctx){
           let{status,data:{code,data:{name,price}}}=await ctx.$axios.post('/cart/getCart',{
               id:ctx.query.id
           })
           if(status===200&&code===0&&name){
               return{
                   cart:[
                       {
                           name,
                           price,
                           count:1
                       }
                   ],
                   cartNo:ctx.query.id
               }
           }
    }
}
</script>

<style lang='scss'>
  @import  '@/assets/css/cart/index.scss'
</style>