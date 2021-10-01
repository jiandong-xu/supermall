<template>
<!--
ref通常绑定到组件上，
ref如果是绑定在组件上，那么通过this.$refs.refname获取到的是一个组件对象
ref如果绑定在普通的元素中，那么通过this.$refs.refname获取到的是一个元素对象
 -->
    <div class="wrapper" ref="wrapper">
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll' 

    export default {
        name:"Scroll",
        data() {
            return {
                scroll:null,
               
            }
        },
        props:{
             probeType: {
                    type:Number,
                    default:0
                },
                pullUpLoad: {
                    type:Boolean,
                    default:false
                }
        },
        mounted() {
            //1.创建BScroll对象
            this.scroll = new BScroll(this.$refs.wrapper,{
               click:true,
               probeType:this.probeType,
               pullUpLoad:this.pullUpLoad//监听上拉的开关
            })

            //2.监听滚动的位置
            if(this.probetype ===2 || this.probeType ===3) {//判断是否全部监听，为了逻辑更加严谨，提高性能
            this.scroll.on('scroll',(position) => {
                this.$emit('scroll',position)
            })
        }
            //3.监听scroll滚动到底部
            if(this.pullUpLoad){
                this.scroll.on('pullingUp',() => {
                    // console.log('上拉加载更多');
                    this.$emit('pullingUp')
                    // console.log('监听到底部');
                })
            }
        },
        methods:{
            scrollTo(x,y,time=300) {
                this.scroll.scrollTo(x,y,time)
            },
            finishPullUp() {
                this.scroll.finishPullUp()
            },
            refresh() {
                this.scroll && this.scroll.refresh();
            }
        }
    }
</script>

<style scoped>
   
</style>