<template>
    <swiper>
            <swiper-item v-for="(item,index) in banners" :key="index">
                <a :href="item.link">
                    <img :src="item.image" alt="" @load="imageLoad">
                </a>
            </swiper-item>
        </swiper>
</template>

<script>
    import {Swiper,SwiperItem} from 'components/common/swiper'

    export default {
    name:"HomeSwiper",
    data() {
        return {
            isLoad:false//用于记录HomeSwiper状态，如果事件发出过就改为true
        }
    },
    props: {
        banners: {
            type:Array,
            default() {
                return []
            }
        }
    },
    components: {
        Swiper,
        SwiperItem
    },
    methods: {
        imageLoad() {
            if(!this.isLoad){
                // console.log('图片是否加载完成');
                this.$emit('swiperImageLoad');
                this.isLoad = true;
            }

        }
    }        
    }
</script>

<style scoped>

</style>