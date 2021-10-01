<template>
  <div id="home">
    <nav-bar class="home-nav" ><div slot="center">购物街</div></nav-bar>
  <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl1"
        class="tab-control"
        v-show="isTabFixed"
      />

    <scroll class="content" 
    ref="scroll" 
    :probe-type="3" 
    @scroll="contentScroll" 
    :pull-up-load="true" 
    @pullingUp="loadMore">
    
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      >
      <!-- :class="{fixed: isTabFixed}" -->
      </tab-control>
      <goods-list :goods="showGoods"></goods-list>
    
    </scroll>
    
  <back-top @click.native = "backClick" v-show="isShowBackTop"></back-top>

  </div>
</template>

<script>
//子组件
import HomeSwiper from "./childComps/HomeSwiper.vue";
import RecommendView from "./childComps/RecommendView.vue";
import FeatureView from "./childComps/FeatureView.vue";

//公共组件
import NavBar from "components/common/navbar/NavBar.vue";
import TabControl from "components/content/tabControl/TabControl.vue";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll.vue";
import BackTop from 'components/content/backTop/BackTop.vue';

//方法和额外数据
import { getHomeMultidata, getHomeGoods } from "network/home.js";
import {debounce} from "common/utils.js"

// import BScroll from "better-scroll";//在这里直接引用依赖性太强，不利于后期维护，所以注释掉封装一层

export default {
  name: "Home",
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      isShowBackTop:false,
      tabOffsetTop: 0,
      isTabFixed:false,//用于判断上拉的标题是否显示
      saveY:0
    };
  },
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    getHomeGoods,
    GoodsList,
    Scroll,
    BackTop,
  },
  created() {
    //1.请求多个数据
    this.getHomeMultidata();

    //2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");

    
  },

  mounted() {
    //1.调用防抖函数,,图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh,500)//传入scroll组件中封装的refresh函数
    //监听item中图片加载完成
    this.$bus.$on('itemImageLoad',() => {
      refresh()
    })

    //2.获取tabControl的offsetTop
    //所有的组件都有一个属性$el,用于获取组件中的元素
    //这里拿到的offsetTop是不准确的，因为图片还没有加载完成
    // console.log(this.$refs.tabControl.$el.offsetTop);
  },
  methods: {
    /**
     * 事件监听相关的方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;

    },
    backClick() {
      // this.$refs.scroll.scroll.scrollTo(0,0,500)//500代表毫秒数
      this.$refs.scroll.scrollTo(0,0,300)//调用Scroll组件内封装的方法
    },
    contentScroll(position) {
      //1.决定BackTop是否显示
     this.isShowBackTop =  -position.y>1000

     //2.决定tabControl是否吸顶(position,Fixed)
     this.isTabFixed = (-position.y)>this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)

      this.$refs.scroll.scroll.refresh()//解决上拉时卡顿的bug，重新计算图片异步请求后的高度

      // console.log(this.currentType);
    },
    swiperImageLoad() {
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    
    
    /**
     * 网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
   
        this.$refs.scroll&&this.$refs.scroll.finishPullUp();
        // this.$refs.scroll.scroll.finishPullUp();//每次触发 pullingUp 钩子后，
        //你应该主动调用 finishPullUp() 告诉 BetterScroll 准备好下一次的 pullingUp 钩子。
      });
    },
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
    actived() {
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()//这里最好刷新一次，不然会出现返回首页时出现在顶部的bug
    },
    deactived() {
      this.saveY = this.$refs.scroll.scroll.y;
    }
  },
};
</script>

<style scoped>
#home {
  position:relative;
  /* padding-top: 44px; */

  height:100vh;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

/* 使用butter-scroll后就没效果了 */
/* .tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
} */

/* .fixed {
  position: fixed;
  left: 0;
  right: 0;
  top: 44px;
} */

.tab-control {
  position:relative;
  z-index:9;
}

.content {
    /* height:300px; */
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
}
 /* .content {
        height:calc(100%-93px);
        overflow:hidden;
        margin-top: 44px;
    } */
</style>