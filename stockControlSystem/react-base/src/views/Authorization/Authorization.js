import './Authorization.css'
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Authorization() {
    const navigate = useNavigate();

    const [mode, setMode] = useState(false)

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const loginH = function () {
        if (login==='' || password==='') {
            return alert('Данные не введены')
        }

        axios.post('http://127.0.0.1:8000/api/user/login', {
            "password":login,
            "login":password,
        }, {
            headers:{
                "Content-Type":'application/json',
                "Accept":"application/json"
            }
        }).then(response=>{
            const token = response.data.token

            alert('Авторизация прошла успешно')

            localStorage.setItem('token', token)

            return navigate('/');

        }).catch(error=>{
            console.log(error)
            if (error.response.status === 403) {
                return alert('Пользователя не существует')
            }
            if (error.response.status === 400) {
                return alert('Пароль введен неверно')
            }
        })
    }

    const registerH = function () {

        if (login==='' || password==='') {
            return alert('Данные не введены')
        }

        axios.post('http://127.0.0.1:8000/api/user/register', {
            "password":login,
            "login":password,
        }, {
            headers:{
                "Content-Type":'application/json',
                "Accept":"application/json"
            }
        }).then(response=>{
            loginH()
        }).catch(error=>{
            console.log(error)
            if (error.response.status === 409) {
                return alert('Пользователь уже существует')
            }
        })
    }

    useEffect(() => {

        if (localStorage.getItem('token')) {
            return navigate('/');
        }


    }, []);

    return (
        <div className="App bg-dark text-white d-flex align-items-center justify-content-center">
            {mode &&
                <div className='w-50 h-50'>
                    <div className='w-100 mb-5 text-center'>
                        <h3>Авторизация</h3>
                    </div>
                    <div className='mb-3'>
                        <label className='mb-2 fs-5' htmlFor="">Login</label>
                        <input value={login} onChange={(event)=>{setLogin(event.target.value)}} type="text" className="form-control bg-dark text-white" placeholder='login'/>
                    </div>
                    <div className='mb-2'>
                        <label className='mb-2 fs-5' htmlFor="">Password</label>
                        <input value={password} onChange={(event)=>{setPassword(event.target.value)}} type="password" className="form-control bg-dark text-white" placeholder='password'/>
                    </div>
                    <button className='btn btn-primary w-100' onClick={()=>{loginH()}}>Авторизоваться</button>

                    <div onClick={()=>{setMode(false)}} className='text-center mt-2' style={{cursor:"pointer"}}>Еще не зарегестрированы?</div>
                </div>
            }
            {!mode &&
                <div className='w-50 h-50'>
                    <div className='w-100 mb-5 text-center'>
                        <h3>Регистрация</h3>
                    </div>
                    <div className='mb-3'>
                        <label className='mb-2 fs-5' htmlFor="">Login</label>
                        <input value={login} onChange={(event)=>{setLogin(event.target.value)}} type="text" className="form-control bg-dark text-white" placeholder='login'/>
                    </div>
                    <div className='mb-2'>
                        <label className='mb-2 fs-5' htmlFor="">Password</label>
                        <input value={password} onChange={(event)=>{setPassword(event.target.value)}} type="password" className="form-control bg-dark text-white" placeholder='password'/>
                    </div>
                    <button className='btn btn-primary w-100' onClick={()=>{registerH()}}>Зарегестрироваться</button>

                    <div onClick={()=>{setMode(true)}} className='text-center mt-2' style={{cursor:"pointer"}}>Уже авторизован?</div>
                </div>
            }
        </div>
    );
}

export default Authorization;
