module.exports = {
    configureWebpack: {
        resolve: {
            extensions: [],//有了这个后缀名可以不写
            alias: {//配置别名
                'assets':'@/assets',
                'common':'@/common', 
                'components':'@/components',
                'network':'@/network', 
            }
        }
    }
}