import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../utils/productItem/ProductItem";

function DetailProduct() {
  const params = useParams();
  const state = useContext(GlobalState);
  const addCart = state.userAPI.addCart
  const [products] = state.productsAPI.products;
  const [detailProduct, setDeatilProduct] = useState([]);

  useEffect(() => {
    console.log('re render')
    if (params.id) {
      products.forEach( (product) => {
        if (product._id === params.id) setDeatilProduct(product);
      });
    }
  }, [params.id, products]);

  if (detailProduct.length === 0) return null;
  return (
    <>
      <div className="detail">
        <img src={detailProduct.images.url} alt="" />
        <div className="box-detail">
          <div className="row">
            <h2>{detailProduct.title}</h2>
            <h6 className="pid">#id: {detailProduct.product_id}</h6>
          </div>
          <span>$ {detailProduct.price}</span>
          <p>{detailProduct.description}</p>
          <p>{detailProduct.content}</p>
          <p>sold: {detailProduct.sold}</p>
          <Link to="/cart" className="cart" style={{width : '25%'}}
          onClick={() => addCart(detailProduct)}>
            Buy Now
          </Link>
        </div>
      </div>

      <div>
          <h2>Related Products</h2>
          <div className="products">
              {
                  products.map(product => {
                      return product.category === detailProduct.category
                      ? <ProductItem key={product._id} product={product}/> : null
                  })
              }
          </div>
      </div>
    </>
  );
}

export default DetailProduct;
