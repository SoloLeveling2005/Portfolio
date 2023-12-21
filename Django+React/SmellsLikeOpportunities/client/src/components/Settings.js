import '../assets/css/bootstrap.css'
import './Settings.css'

import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
function Settings() {

    // Данные
    const navigate = useNavigate();

    const [firstStart, setFirstStart] = useState(true);
    const [userInfo, setUserInfo] = useState({login:'', token:''});
    const [businessUserInfo, setBusinessUserInfo] = useState({});
    const [businessUserInfoStatus, setBusinessUserInfoStatus] = useState(false);

    const getMyInfo = () => {
        axios.get('http://127.0.0.1:8000/api/user/info', {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then((response)=>{
            console.log(response)
            if (response.status === 200) {
                setUserInfo(response.data)
            }
        }).catch((error)=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/auth')
            }
        })
    }
    const getBusinessInfo = () => {
        axios.get('http://127.0.0.1:8000/api/user/businessUser', {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then((response)=>{
            console.log(response)
            if (response.status === 200) {
                setBusinessUserInfo(response.data)
                setBusinessUserInfoStatus(true)
            }
            if (response.status === 204) {
                setBusinessUserInfo({})
                setBusinessUserInfoStatus(false)

            }
        }).catch((error)=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/auth')
            }
        })
    }

    const createBusinessUser = () => {
        axios.post('http://127.0.0.1:8000/api/user/businessUser', {},{
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then((response)=>{
            console.log(response)
            if (response.status === 201) {
                getBusinessInfo()
            }
        }).catch((error)=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/auth')
            }
            if (error.response.status === 409) {
                console.error("Ошибка. Бизнес аккаунт уже был создан")
            }
        })
    }

    const deleteBusinessUser = () => {
        axios.delete('http://127.0.0.1:8000/api/user/businessUser', {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then((response)=>{
            console.log(response)
            if (response.status === 200) {
                getBusinessInfo()
            }
        }).catch((error)=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/auth')
            }
        })
    }

    // const deactivateBusinessUser = () => {
    //
    // }
    //
    // const activateBusinessUser = () => {
    //
    // }

    const addPromptBusinessUser = () => {
        axios.patch('http://127.0.0.1:8000/api/user/businessUser', {
            prompt:businessUserInfo.prompt
        },{
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then((response)=>{
            console.log(response)
            if (response.status === 200) {
                getBusinessInfo()
            }
        }).catch((error)=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/auth')
            }
            if (error.response.status === 409) {
                console.error("Ошибка. Бизнес аккаунт уже был создан")
            }
        })
    }

    if (firstStart) {
        getMyInfo()
        getBusinessInfo()
        setFirstStart(false)
    }

    return (
        <div className="App pb-3 px-2 d-block">
            <header className='pb-3'>
                <Link to='/' className='btn btn-primary text-decoration-none text-white fs-4 px-5'>Home</Link>
            </header>
            <div className="card mb-4 tab-chat-bg text-white border-white">
                <div className='card-header fs-4 border-white'>Инфо пользователя</div>
                <div className='card-body border-white'>
                    <div className="fs-5 mb-2">Логин пользователя:</div>
                    <input type="text" value={userInfo.login} className='form-control mb-3 tab-chat-bg text-white'/>
                    {/*<div className="fs-5 mb-2">Пароль пользователя:</div>*/}
                    {/*<input type="password" className='form-control tab-chat-bg text-white' disabled/>*/}
                </div>
            </div>
            {/*<div className="card tab-chat-bg text-white mb-4 border-1 border-white">*/}
            {/*    <div className='card-body d-flex'>*/}
            {/*        <button className="btn btn-primary me-3">Включить бизнес аккаунт</button>*/}
            {/*        <button className="btn btn-primary me-3">Выключить бизнес аккаунт</button>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="card mb-4 tab-chat-bg text-white border-white">
                <div className='card-header fs-4 border-white d-flex align-items-center'>
                    <span>Пользовательские инструкции</span>
                    {!businessUserInfoStatus && <button className="btn btn-success ms-4 py-1" onClick={createBusinessUser}>Создать бизнес аккаунт</button>}
                    {businessUserInfoStatus && <button className="btn btn-success ms-4 py-1" onClick={deleteBusinessUser}>Удалить бизнес аккаунт</button>}
                </div>
                {businessUserInfoStatus &&
                    <div className='card-body border-white'>
                        <div className="fs-5 mb-3">Как бы вы хотели, чтобы автоответчик отвечал на вопросы?</div>
                        <div className="fs-5">
                            <textarea className='form-control tab-chat-bg text-white' name="" id="" cols="30" rows="10" value={businessUserInfo.prompt} onChange={(event)=>{setBusinessUserInfo({prompt:event.target.value})}}></textarea>
                            <button className="btn btn-primary mt-2 w-100" onClick={addPromptBusinessUser}>Сохранить</button>
                        </div>
                    </div>
                }

            </div>
        </div>
    );
}

export default Settings;
