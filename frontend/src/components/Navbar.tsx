import React, { useState } from 'react';
import '../App.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/bootstrap.css';
import { Link } from 'react-router-dom';
function Navbar(props:{'page':string}) {
    let page = props.page
    return (
        <div className="Navbar text-dark-emphasis w-100 bg-white">
            <div className="container d-flex py-3 justify-content-between align-items-center">
                <div className='d-flex justify-content-between align-items-center'>
                    <Link to={`/`} className='text-black me-4'>Лента</Link>
                    
                    <Link to={`/messenger/0`} className='text-black me-4'>Мессенджер</Link>
                    <Link to={`/comrades`} className='text-black me-4'>Друзья и коллеги</Link>                    
                    <Link to={`/communities`} className='text-black me-4'>Сообщества</Link>                    
                    <Link to={`/settings`} className='text-black me-4'>Настройки</Link>
                </div>
                <Link to={`/user/${localStorage.getItem('user_id')}`} className='d-flex'>
                    <img src="/img/user3.png" alt="Профиль" title='Профиль' className='img-small-24 cursor-pointer ms-4' />
                </Link>
            </div>
        </div>
    );
}

export default Navbar;
