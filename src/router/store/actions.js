import {
    ADD_COUNTER,
    ADD_TO_CART
} from './mutation-types'

export default {
    addCart(context,payload) {
        //payload是新添加的商品
        
        //方法一：
        // let oldProduct = null;
        // for(let item of state.cartList) {
        //     if(item.iid === payload.iid) {
        //         oldProduct = item;
        //     }
        // }
        //方法二
        // let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

        // //2.判断oldProduct
        // if(oldProduct) {
        //     // oldProduct.count += 1;
        //     context.commit(ADD_COUNTER,oldProduct);
        // }else {
        //     payload.count = 1;
        //     // context.cartList.push(payload)
        //     context.commit(ADD_TO_CART,payload);
        // }
          
        return new Promise((resoolve,reject) => {
            let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

            //2.判断oldProduct
            if(oldProduct) {
                // oldProduct.count += 1;
                context.commit(ADD_COUNTER,oldProduct);
                resoolve('当前商品数量+1')
            }else {
                payload.count = 1;
                // context.cartList.push(payload)
                context.commit(ADD_TO_CART,payload);
                resoolve('添加了新的商品')
            }
        })
    }
}