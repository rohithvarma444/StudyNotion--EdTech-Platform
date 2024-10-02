import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartCourses from './RenderCartCourses';
import RenderTotalAmount from './RenderTotalAmount';


function Cart() {

    const {total,totalItems} = useSelector((state)=> state.cart);
  return (
    <div className='text-white'>
        <div>
            <h1>Your Whishlist</h1>
            <p>{total} in your cart</p>
        </div>
        {
            total > 0 ? (
                <div>
                    <RenderCartCourses />
                    <RenderTotalAmount />
                </div>
            ) : (<p>Your cart is empty</p>)
        }
    </div>
  )
}

export default Cart