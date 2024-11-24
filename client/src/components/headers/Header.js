import React ,{ useContext , useState} from "react";
import {GlobalState} from '../../GlobalState';
import Bars from './icon/bars.svg';
import Close from './icon/close.svg';
import Cart from './icon/cart.svg';
import { Link } from "react-router-dom";
import axios from "axios";

function Header() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin
    const [cart] = state.userAPI.cart
    const [menu, setMenu] = useState(false)



    const logoutUser = async () => {
        await axios.get('/user/logout')

        localStorage.removeItem('firstLogin')
        window.location.href = '/'
    }


    const adminRouter = () =>{
        return(
            <>
                <li onClick={() => setMenu(!menu)}><Link to='/create_product'>Create Product</Link></li>
                <li onClick={() => setMenu(!menu)}><Link to='/category'>Categories</Link></li>
            </>
        )
    }

    const loggedRouter = () =>{
        return(
            <>
                <li onClick={() => setMenu(!menu)}><Link to='/history'>History</Link></li>
                <li onClick={() => setMenu(!menu)}><Link to='/' onClick={logoutUser}>Logout</Link></li>
            </>
        )
    }

    const styleMenu = {
        left: menu ? 0 : "-100%"
    }
  return (
    <header>
        <div className='menu' onClick={() => setMenu(!menu)}>
            <img src={Bars} alt="" width={30} className="menu"/>
        </div>
        <div className="logo">
            <h1>
                <Link to="/">{isAdmin ? 'Admin' : 'E-Mart'}</Link>
            </h1>
        </div>

        <ul style={styleMenu}>
            <li onClick={() => setMenu(!menu)}><Link to="">{isAdmin ? 'Products' : 'Shop'}</Link></li>

            {isAdmin && adminRouter()}
            {
                isLogged ? loggedRouter() : <li><Link to="login">Login</Link></li>
            }
            
            <li onClick={() => setMenu(!menu)}>
                <img src={Close} alt="" width={30} className="menu"/>
            </li>
        </ul>

        {
            isAdmin ? '' :
            <div className="cart-icon">
            <span>{cart.length}</span>
            <Link to="/cart">
                <img src={Cart} alt="" width={30} />
            </Link>
            </div>
        }
       {/* <div style={{backgroundColor : 'black' , width : '100%' , height : '200px'}}>
       </div> */}
    </header>
  );
}

export default Header;
