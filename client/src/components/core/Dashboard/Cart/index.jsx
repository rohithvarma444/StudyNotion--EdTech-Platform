import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartCourses from './RenderCartCourses';
import RenderTotalAmount from './RenderTotalAmount';


function Cart() {

    const {total,totalItems} = useSelector((state)=> state.cart);
  return (
    <div className='text-white w-10/12 mx-auto'>
        <div className='flex items-center justify-between mt-10'>
            <h1 className='text-3xl font-medium'>Your Whishlist</h1>
            <p className='text-sm text-richblack-300'>{total} in your cart</p>
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