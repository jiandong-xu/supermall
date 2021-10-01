<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="chenck-button" :is-checked="isSelectAll"></check-button>
      <span>全选</span>
    </div>

    <div class="price">合计{{ totalPrice }}</div>

    <div class="calculate" @click="calcClick">
        去计算: {{checkLength}}
    </div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton.vue";

export default {
  name: "CartButtonBar",
  components: {
    CheckButton,
  },
  computed: {
    totalPrice() {
      const cartList = this.$store.state.cartList;
      return '￥'+cartList.filter((item) => {
          return item.checked;
        }).reduce((preValue, item) => {
          return preValue + item.count * item.price;
        }, 0).toFixed(2);
    },
    checkLength() {
        return this.$store.state.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
        // 如果不选中的有长度，则isChecked为false
        //1.使用filter
        // return !(this.$store.state.cartList.filter(item => !item.checked).length)

        //2.使用find
        if(this.$store.state.cartList.length ===0) return false;
        return !this.$store.state.cartList.find(item => !item.checked);

        //3.普通遍历
        // for(let item of this.cartList) {
        //     if(!item.checked) {
        //         return false;
        //     }
        // }
        // return true;
    }
  },
  methods: {
      checkClick() {
          if(this.isSelectAll) {
              this.$store.state.cartList.forEach(item.checked = false)
          }else {//部分或全部不选中
            this.$store.state.cartList.forEach(item.checked=true)
          }
      },
      calcClick() {
        if(!this.isSelectAll) {
          this.$toast.show('请选择购买的商品',2000)

        }
      }
  }
};
</script>

<style scoped>
.bottom-bar {
  position: relative;
  display: flex;
  height: 40px;
  line-height: 40px;
  background-color: #eee;
  font-size: 14px;
}

.check-content {
  display: flex;
  align-items: center;
  width:60px;
}

.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-left: 5px;
}

.price {
  margin-left: 20px;
  flex:1;
}

.calculate {
    width: 90px;
    color:#fff;
    background-color: red;
    text-align: center;
}
</style>