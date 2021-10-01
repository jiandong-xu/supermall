<template>
    <div class="cart-list">
        <scroll class="content" ref="scroll">
            <cart-list-item v-for="(item,index) in cartList" :key="index" :item-info="item"></cart-list-item>
        </scroll>
    </div>
</template>

<script>
    import Scroll from '@/components/common/scroll/Scroll.vue' 

    import CartListItem from './CartListItem'

    import { mapGetters } from 'vuex'

    export default {
        name:"CartList",
        computed: {
            ...mapGetters(['cartList']),
        actived() {
            this.$refs.scroll.scrollTo(0,this.saveY,0)
            this.$refs.scroll.refresh()//这里最好刷新一次，不然会出现返回首页时出现在顶部的bug
         },
        },

        activated() {
            this.$refs.scroll.scroll.refresh();
             this.$refs.scroll.refresh();
             this.$refs.scroll.refresh();
             this.$refs.scroll.refresh;
            console.log('购物车刷新');
        },

        components: {
            Scroll,
            CartListItem
        },
       
    }
</script>

<style scoped>
    .cart-list {
        height: calc(100% - 44px - 49px - 40px);
    }

    .content {
        height:100%;
        overflow: hidden;
    }
</style>