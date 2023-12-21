import './Home.css'
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from "axios";
import Warehouse from "../Warehouse/Warehouse";
import {render} from "@testing-library/react";

function Home() {
    const navigate = useNavigate();

    const [inputWarehouse, setInputWarehouse] = useState('');

    const [warehouses, setWarehouses] = useState([]);
    const [activeWarehouses, setActiveWarehouses] = useState(null);


    const addNewWarehouse = function () {
        axios.post('http://127.0.0.1:8000/api/api/warehouse/', {
            title:inputWarehouse
        }, {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then(response=>{
            if (response.status === 201) {
                alert("Склад успешно создан")
                getAllWarehouses()
            }
        }).catch(error=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                return navigate('auth/');
            }
        })
    }

    const changeTab = function (index) {
        setActiveWarehouses(warehouses[index])
    }

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
                setActiveWarehouses(response.data[0])

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
        <div className="App">
            <div className='w-100 pt-2 px-2 d-flex header'>
                {warehouses.map((warehouse, index)=>{
                    return (
                        <div key={index}>
                            {activeWarehouses === warehouse ? (
                                    <div className='header-elem active' onClick={()=>{setActiveWarehouses(warehouse)}}>
                                        {warehouse.title}
                                    </div>
                                ):(
                                    <div className='header-elem' onClick={()=>{setActiveWarehouses(warehouse)}}>
                                        {warehouse.title}
                                    </div>
                                )
                            }
                        </div>
                    )

                })}
                {activeWarehouses === null ? (
                    <div className='header-elem active' onClick={()=>{setActiveWarehouses(null)}}>
                        Добавить +
                    </div>
                ):(
                    <div className='header-elem' onClick={()=>{setActiveWarehouses(null)}}>
                        Добавить +
                    </div>
                )}
            </div>
            <div className='content'>
                {activeWarehouses !== null &&
                    <div className='pb-3'>
                        <Warehouse warehouse={activeWarehouses}/>
                    </div>
                }
                {activeWarehouses === null &&
                    <div className='m-5'>
                        <h3 className='mb-4'>Создание нового склада</h3>
                        <hr/>
                        <label htmlFor="" className='fs-5 mb-2'>Название</label>
                        <input type="text" value={inputWarehouse} onChange={(event)=>{setInputWarehouse(event.target.value)}} className="form-control border-1 border-dark" placeholder='Введите название склада'/>
                        <button className="btn btn-primary mt-2 w-100" onClick={addNewWarehouse}>Сохранить</button>
                    </div>
                }
            </div>
        </div>
    );
}

export default Home;
