import './Menu.css'
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from "axios";
import {render} from "@testing-library/react";

function Home() {
    const navigate = useNavigate();

    const [warehouses, setWarehouses] = useState([]);

    const getAllWarehouses = function () {
        axios.get('http://127.0.0.1:8000/api/api/warehouse/', {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then(response=>{
            console.log(response)
            if (response.data.length === 0) {

            } else {
                setWarehouses(response.data)

            }
        }).catch(error=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                return navigate('auth/');
            }
        })
    }


    useEffect(() => {
        if (!localStorage.getItem('token')) {
            return navigate('auth/');
        }
        getAllWarehouses()
    }, []);

    return (
        <div className="App w-25 h-100 bg-dark text-white">
            <div className='px-5 py-3 menu-elem fs-5'>
                Главная
            </div>
            <hr className='p-0 m-0'/>
            {warehouses.map((value, index)=>{
                return (
                    <div>
                        <div className='px-5 py-3 menu-elem'>
                            {value.title}
                        </div>
                        <hr className='p-0 m-0'/>
                    </div>
                )
            })}

            <hr className='p-0 m-0'/>
            <div className='px-5 py-3 menu-elem'>
                Добавить склад +
            </div>
        </div>
    );
}

export default Home;
