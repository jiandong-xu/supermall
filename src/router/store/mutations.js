import {
    ADD_COUNTER,
    ADD_TO_CART
} from './mutation-types'

export default{
     //multations唯一的目的就是修改state中状态
        //multations中的每个方法尽可能完成的事件比较单一
        [ADD_COUNTER](state,payload) {
            payload.count++;
        },
        [ADD_TO_CART](state,payload) {
            payload.checked = true;
            state.cartList.push(payload)
        }
    }