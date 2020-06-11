<template>
  <div class="m-menu">
    <dl class="nav" @mouseleave="mouseleave">
      <dt>全部分类</dt>
      <dd v-for="(item,idx) in  $store.state.home.menu" :key="idx" @mouseenter="enter">
        <i :class="item.type" />
        {{ item.name }}
        <span class="arrow" />
      </dd>
    </dl>
    <div class="detail" v-if="kind" @mouseleave="sout" @mouseenter="sover">
      <template v-for="(item,idex) in curdetail.child">
        <h4 :key="idex">{{item.title}}</h4>
        <span v-for=' (item) in item.child' :key="item">{{item}}</span>
         
      </template>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      kind: "",
     /*  menu: [
        {
          type: "food",
          name: "美食",
          child: [
            {
              title: "美食",
              child: ["代金券", "甜点饮品", "火锅", "自助餐", "小吃快餐"]
            }
          ]
        },
        {
          type: "takeout",
          name: "外卖",
          child: [
            {
              title: "外卖",
              child: ["美团外卖"]
            }
          ]
        },
        {
          type: "hotel",
          name: "酒店",
          child: [
            {
              title: "酒店星级",
              child: ["经济型", "舒适/三星", "高档/四星", "豪华/五星"]
            }
          ]
        }
      ] */
    };
  },
  methods: {
    mouseleave: function() {
      this.timer = setTimeout(() => {
        this.kind = "";
      }, 250);
    },
    enter: function(e) {
      this.kind = e.target.querySelector("i").className;
    },
    sout: function() {
      this.kind = "";
    },
    sover: function() {
      clearTimeout(this.timer);
    }
  },
  computed: {
    curdetail: function() {
      return this.$store.state.home.menu.filter(item => this.kind === item.type)[0];
    }
  }
};
</script>

<style>
</style>