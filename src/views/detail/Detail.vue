<template>
    <div id="detail">
    <detail-nav-bar @titleClick="titleClick" class="detail-nav" ref="nav" ></detail-nav-bar>
      <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll"> 
       <!-- 注意top-image这里别忘了s。。。 -->
       <div>{{$store.state.cartList.length}}</div>
       <detail-swiper :top-images="topImages"></detail-swiper>
       <detail-base-info :goods="goods"></detail-base-info>
       <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-params-info ref="param" :param-info="paramInfo"/>
      <detail-comment-info ref="comment"  :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
      </scroll>
      <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>

    <back-top @click.native = "backClick" v-show="isShowBackTop"></back-top>
    <!-- <toast :message="message" :show="show"></toast> -->
    </div>
</template>

<script>
    import DetailNavBar from './childComps/DetailNavBar.vue'
    import DetailSwiper from './childComps/DetailSwiper.vue'
    import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
    import DetailShopInfo from './childComps/DetailShopInfo'
    import DetailGoodsInfo from './childComps/DetailGoodsInfo'
    import DetailCommentInfo from './childComps/DetailCommentInfo'
    import DetailParamsInfo from './childComps/DetailParamsInfo'
    import DetailBottomBar from './childComps/DetailBottomBar'


    import Scroll from 'components/common/scroll/Scroll'
    import GoodsList from 'components/content/goods/GoodsList'
    import BackTop from 'components/content/backTop/BackTop.vue'
    // import Toast from 'components/common/toast/Toast'    


    import {getDetail,Goods,Shop, GoodsParam,getRecommend} from "network/detail.js"
    import {debounce} from "common/utils.js"



    export default {
        name:"Detail",
        components: {
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            Scroll,
            DetailShopInfo,
            DetailGoodsInfo,
            DetailParamsInfo,
            DetailCommentInfo,
            GoodsList,
            DetailBottomBar,
            BackTop,
            // Toast
        },
        data() {
            return {
                iid:null,
                topImages:[],
                goods:{},
                shop: {},
                detailInfo: {},
                paramInfo: {},
                commentInfo:{},//评论
                recommends:[],
                themeTopYs:[],
                getThemeTopY:null,
                currentIndex:0,
                isShowBackTop:false,
                // message:'',
                // show:false
            }
        },
       
        created() {
            //1.保存传入的iid
            this.iid = this.$route.params.iid

            //2.根据iid请求详情数据
            getDetail(this.iid).then(res => {
                // console.log(res);
                //1.获取顶部的图片轮播数据
                const data = res.result;
                this.topImages = data.itemInfo.topImages

                //2.获取商品信息
                this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

                 // 3.创建店铺信息的对象
                this.shop = new Shop(data.shopInfo)

                // 4.保存商品的详情数据
                this.detailInfo = data.detailInfo;

                // 5.获取参数的信息
               this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule || {});

                //6.取出参数的信息
                this.itemParam = data.itemParam

                //7.取出评论的信息
                if(data.rate.cRate !== 0) {
                    this.commentInfo = data.rate.list[0];
                }

                //8.请求推荐数据
                getRecommend().then(res => {
                    // console.log(res);
                    this.recommends = res.data.list
                })
            }) 

                //9.给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
                this.getThemeTopY=debounce(() => {
                this.themeTopYs = [];
                // console.log(this.$refs.params.$el.offsetTop);
                this.themeTopYs.push(0);
                this.themeTopYs.push(this.$refs.param.$el.offsetTop)
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
                this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
                this.themeTopYs.push(Number.MAX_VALUE)
                },100)
        },
              methods: {
                imageLoad() {
                this.$refs.scroll.refresh()
                this.getThemeTopY()
                }, 
                titleClick(index) {
                    // console.log(index);
                    this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
                },
                contentScroll(position) {
                    // console.log(position);
                    const positionY = -position.y;

                    let length = this.themeTopYs.length;
                    for(let i=0;i < length-1;i++) {
                        if(this.currentIndex !==i &&(positionY >= this.themeTopYs[i] &&
                         positionY < this.themeTopYs[i+1])) {
                             this.currentIndex = i;
                             this.$refs.nav.currentIndex = this.currentIndex;
                         }
                    }

                    //3.是否显示回到顶部
                    // this.isShowBackTop = -position.Y > BACK_POSITION 
                    this.isShowBackTop =  -position.y>1000

                },
               backClick() {
                    // this.$refs.scroll.scroll.scrollTo(0,0,500)//500代表毫秒数
                    this.$refs.scroll.scrollTo(0,0,300)//调用Scroll组件内封装的方法
                },
                addToCart() {
                    //1.获取购物车需要展示的信息
                    const product = {};
                    product.image = this.topImages[0];
                    product.title = this.goods.title;
                    product.desc = this.goods.desc;
                    product.price = this.goods.realPrice;
                    product.iid = this.iid;

                    //2.将商品加入到购物车
                    // this.$store.commit('addCart',product)
                    this.$store.dispatch('addCart',product).then(res => {
                        //加入购物车时的悬浮窗效果toast
                        // this.show = true;
                        // this.message = res;

                        // setTimeout(() => {
                        //     this.show = true;
                        //     this.message = res;
                        // },1500)

                        this.$toast.show(res,2000) 
                        // console.log(res);
                    })
                }
            }
    }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 49px);
  }
</style>