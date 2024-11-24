import React , {useState} from 'react'
import BtnRender from './BtnRender'
import axios from 'axios'
import Loading from '../loading/Loading'

function ProductItem({product , isAdmin , token , callBack , setCallBack , setProducts , deleteProduct , handleCheck}) {

    const [loading , setLoading] = useState(false)

    


    if(loading) return <div className='product_card'><Loading/></div> 
    return (
        <div className='product_card'>
            {
                isAdmin && <input type='checkbox' checked={product.checked} 
                    onChange={() => handleCheck(product._id)}
                />
            }
            <img src={product.images.url} alt='' />

            <div className='product_box'>
                <h2 title={product.title}>{product.title}</h2>
                <span>${product.price}</span>
                <p>{product.description}</p>
            </div>

            <BtnRender product={product} deleteProduct={deleteProduct}/>
            
        </div>
    )
}

export default ProductItem
