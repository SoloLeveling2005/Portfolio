import '../assets/css/bootstrap.css'
import './Settings.css'

import {useState} from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import axios from "axios";
function Settings() {
    const [authFormMode, setAuthFormMode] = useState('auth');  // auth
    const [authFormLogin, setAuthFormLogin] = useState('');
    const [authFormPassword, setAuthFormPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate();

    if (localStorage.getItem('token')) {
        console.log('redirect')
        return <Navigate to={`/`} />;
    }

    const register = () => {
        axios.post('http://127.0.0.1:8000/api/user/register/', {
            'login':authFormLogin,
            'password':authFormPassword
        }, {

        }).then((response)=>{
            console.log(response)
            if (response.status === 201) {
                login()
            }
        }).catch((error)=>{
            console.log(error)
            if (error.response.status === 409) {
                setErrorMessage('Пользователь с таким логином уже существует')
                setTimeout(()=>{
                    setErrorMessage('')
                }, 6000)
            }
        })
    }

    const login = () => {
        axios.post('http://127.0.0.1:8000/api/user/login/', {
            'login':authFormLogin,
            'password':authFormPassword
        }, {

        }).then((response)=>{
            console.log(response)
            if (response.status === 201) {
                let responseData = response.data
                let token = responseData.token
                localStorage.setItem('token', token)

                if (localStorage.getItem('token')) {
                    navigate('');
                }

            }

        }).catch((error)=>{
            console.log(error)
            if (error.response.status === 403) {
                setErrorMessage('Пользователь с такими данными не найден')
                setTimeout(()=>{
                    setErrorMessage('')
                }, 6000)
            }
        })
    }

    return (
        <div className="App pb-3 px-2 d-block">
            { authFormMode !== '' &&
                <div className="modal-auth">
                    { authFormMode === 'auth' &&
                        <div className="form">
                            <h3 className='mb-4'>Авторизация</h3>
                            <div className='d-flex flex-column align-items-start'>
                                <label htmlFor="">Логин</label>
                                <input type="text" className="form-control text-white" placeholder='Введите ваш логин' value={authFormLogin} onChange={event => {setAuthFormLogin(event.target.value)}}/>
                                <label htmlFor="">Пароль</label>
                                <input type="password" className="form-control text-white" placeholder='Введите ваш пароль' value={authFormPassword} onChange={event => {setAuthFormPassword(event.target.value)}}/>
                                <button className="btn btn-primary w-100 fs-5 mt-2" onClick={login}>Авторизоваться</button>
                                <div className='w-100 text-center text-danger mt-2'>{errorMessage}</div>
                                <div className='login-button text-center w-100 mt-2' onClick={event => setAuthFormMode('login')}>Еще не зарегестрированы?</div>
                            </div>
                        </div>
                    }
                    { authFormMode === 'login' &&
                        <div className="form">
                            <h3 className='mb-4'>Регистрация</h3>
                            <div className='d-flex flex-column align-items-start'>
                                <label htmlFor="">Придумайте логин</label>
                                <input type="text" className="form-control text-white" placeholder='Введите ваш логин' value={authFormLogin} onChange={event => {setAuthFormLogin(event.target.value)}}/>
                                <label htmlFor="">Придумайте пароль</label>
                                <input type="password" className="form-control text-white" placeholder='Введите ваш пароль' value={authFormPassword} onChange={event => {setAuthFormPassword(event.target.value)}}/>
                                <button className="btn btn-primary w-100 fs-5 mt-2" onClick={register}>Зарегистрироваться</button>
                                <div className='w-100 text-center text-danger mt-2'>{errorMessage}</div>
                                <div className='login-button text-center w-100 mt-2' onClick={event => setAuthFormMode('auth')}>Уже зарегистрированы?</div>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    );
}

export default Settings;
