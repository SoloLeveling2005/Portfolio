import './Home.css'
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from "axios";
import {render} from "@testing-library/react";
import NewWarehouse from "../../components/newWarehouse/NewWarehouse";
import Warehouse from "../Warehouse/Warehouse";

function Home() {
    const navigate = useNavigate();

    const [inputWarehouse, setInputWarehouse] = useState('');

    const [warehouses, setWarehouses] = useState([]);
    const [activeWarehouses, setActiveWarehouses] = useState('home');

    const [realizations, setRealizations] = useState([]);
    const [products, setProducts] = useState([]);

    const addNewWarehouse = function (title) {
        axios.post('http://127.0.0.1:8000/api/api/warehouse/', {
            title:title
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


    // const getRemains = function () {
    //     axios.get(`http://127.0.0.1:8000/api/api/warehouse/remains`, {
    //         headers:{
    //             Authorization:`Token ${localStorage.getItem('token')}`
    //         }
    //     }).then((response)=> {
    //         console.log(response)
    //     }).catch((error)=>{
    //         console.log(error)
    //     })
    // }

    const realizationsF = function () {
        axios.get(`http://127.0.0.1:8000/api/api/warehouse/realizations`, {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then((response)=> {
            setRealizations(response.data)
        }).catch((error)=>{
            console.log(error)
        })
    }

    const productsF = function () {
        axios.get(`http://127.0.0.1:8000/api/api/warehouse/products`, {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then((response)=> {
            setProducts(response.data)
            realizationsF()
        }).catch((error)=>{
            console.log(error)
        })
    }


    useEffect(() => {
        if (!localStorage.getItem('token')) {
            return navigate('auth/');
        }
        realizationsF()
        productsF()
        getAllWarehouses()
    }, []);

    return (
        <div className="App bg-dark text-white d-flex">
            <div style={{width:"17vw"}} className="h-auto bg-black text-white border-end border-dark">
                <div className={activeWarehouses==='home'?'px-5 py-3 menu-elem fs-5 opacity-1':'px-5 py-3 menu-elem fs-5'} onClick={()=>{setActiveWarehouses('home')}}>
                    Главная
                </div>
                <hr className='p-0 m-0'/>
                {warehouses.map((value, index)=>{
                    return (
                        <div key={index} onClick={()=>{setActiveWarehouses(String(index))}}>
                            <div className={(String(activeWarehouses)===String(index))?'px-5 py-3 menu-elem opacity-1':'px-5 py-3 menu-elem'}>
                                {value.title}
                            </div>
                            <hr className='p-0 m-0'/>
                        </div>
                    )
                })}

                <hr className='p-0 m-0'/>
                <div className={activeWarehouses==='newWarehouse'?'px-5 py-3 menu-elem opacity-1':'px-5 py-3 menu-elem'} onClick={()=>{setActiveWarehouses('newWarehouse')}}>
                    Добавить склад +
                </div>
            </div>
            <div style={{width:"83vw"}} className="h-100 overflow-y-scroll">
                {activeWarehouses==='newWarehouse' &&
                    <NewWarehouse  addNewWarehouse={addNewWarehouse} warehouse={activeWarehouses}/>
                }
                {activeWarehouses==='home' &&
                    <div className='p-5'>
                        <h3>Главная</h3>
                        <hr className='bg-white border-white border-1'/>
                        <div className="d-flex justify-content-around mt-5">
                            <div className='card bg-dark text-white border-1 border-white fs-4 w-25'>
                                <div className="card-body text-center">
                                    <div className='pb-3 fs-4 fw-bold'>Складов</div>
                                    <div className="value fs-5 text-success">{warehouses.length}</div>
                                </div>
                            </div>
                            <div className='card bg-dark text-white border-1 border-white fs-4 w-25'>
                                <div className="card-body text-center">
                                    <div className='pb-3 fs-4 fw-bold'>Товаров</div>
                                    <div className="value fs-5 text-success">{products.length}</div>
                                </div>
                            </div>
                            <div className='card bg-dark text-white border-1 border-white fs-4 w-25'>
                                <div className="card-body text-center">
                                    <div className='pb-3 fs-4 fw-bold'>Реализации</div>
                                    <div className="value fs-5 text-success">{realizations.length}</div>
                                </div>
                            </div>
                        </div>

                        <h3 className='mt-5 fs-4'>Активность</h3>
                        <hr/>
                        <div className="border-white">
                            <table className="table table-dark">
                                <thead>
                                <tr>
                                    <th scope='col'>Номер</th>
                                    <th scope="col">Дата</th>
                                    <th scope="col">Продукт</th>
                                    <th scope="col">Количество реализации</th>
                                    <th scope="col">Информация о клиенте</th>
                                    <th scope="col">Метод оплаты</th>
                                    <th scope="col">Отгрузка/Погрузка</th>
                                </tr>
                                </thead>
                                <tbody>
                                {realizations.map((value, index)=>{
                                    return (
                                        <tr key={index}>
                                            <td>{value.id}</td>
                                            <td>{value.date_of_shipment.split('T')[0]}</td>
                                            <td>
                                                {products.map((valueP,indexP)=>{
                                                    if (valueP.id === value.product) {
                                                        return valueP.title
                                                    } else {
                                                        return null
                                                    }

                                                })}
                                            </td>
                                            <td>{value.realization_count}</td>
                                            <td>{value.client_information}</td>
                                            <td>{value.payment_method}</td>
                                            <td>{(value.realization_type)?'Погрузка':'Отгрузка'}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
                { activeWarehouses!=='newWarehouse'&&activeWarehouses!=='home'&&
                    <div>
                        <Warehouse realizations={realizationsF} warehouse={warehouses[activeWarehouses]}/>
                    </div>
                }
            </div>
        </div>
    );
}

export default Home;
