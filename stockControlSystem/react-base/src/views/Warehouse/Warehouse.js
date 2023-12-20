import './Warehouse.css'
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from "axios";
import {render} from "@testing-library/react";

function Warehouse(props) {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [createNewProductStatus, setCreateNewProductStatus] = useState(false);
    const [changeNewProductStatus, setChangeNewProductStatus] = useState(false);
    const [changeNewProductIndex, setChangeNewProductIndex] = useState(-1);

    const [titleInput, setTitleInput] = useState('Смартфон Galaxy S20');
    const [categoryInput, setCategoryInput] = useState('Электроника');
    const [measureUnitInput, setMeasureUnitInput] = useState('Штуки');
    const [minimumStockLevelInput, setMinimumStockLevelInput] = useState('10');
    const [maximumStockLevelInput, setMaximumStockLevelInput] = useState('100');

    const [titleInputChange, setTitleInputChange] = useState('');
    const [categoryInputChange, setCategoryInputChange] = useState('');
    const [measureUnitInputChange, setMeasureUnitInputChange] = useState('');
    const [minimumStockLevelInputChange, setMinimumStockLevelInputChange] = useState('');
    const [maximumStockLevelInputChange, setMaximumStockLevelInputChange] = useState('');



    const [tabMenu, setTabMenu] = useState('products')

    const warehouse = props.warehouse

    // Products

    const getProducts = function () {
        axios.get(`http://127.0.0.1:8000/api/api/warehouse/${warehouse.id}/products/`, {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then(response=>{
            console.log(response)
            setProducts(response.data)
        }).catch(error=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                return navigate('auth/');
            }
        })
    }

    const saveProduct = function () {
        if (
            titleInput === '' ||
            categoryInput === '' ||
            measureUnitInput === '' ||
            minimumStockLevelInput === '' ||
            maximumStockLevelInput === ''
        ) {
            return alert("Не все поля заполнены")
        }
        axios.post(`http://127.0.0.1:8000/api/api/warehouse/${warehouse.id}/products/`,{
            "title": titleInput,
            "category": categoryInput,
            "measure_unit": measureUnitInput,
            "minimum_stock_level": minimumStockLevelInput,
            "maximum_stock_level": maximumStockLevelInput,
        }, {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then(response=>{
            if (response.status === 201) {
                getProducts()

                setCreateNewProductStatus(false)
                setChangeNewProductIndex(-1)
            }
        }).catch(error=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                return navigate('auth/');
            }
        })
    }

    const deleteProduct = function (productId) {
        axios.post(`http://127.0.0.1:8000/api/api/warehouse/${warehouse.id}/products/delete`, {
            'product_id':productId
        },{
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then(response=>{
            if (response.status === 200) {
                getProducts()
                getRealizations()

                props.realizations()
            }
        }).catch(error=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                return navigate('auth/');
            }
        })
    }

    const saveChangesProduct = function (product_id) {
        if (
            titleInputChange === '' ||
            categoryInputChange === '' ||
            measureUnitInputChange === '' ||
            minimumStockLevelInputChange === '' ||
            maximumStockLevelInputChange === ''
        ) {
            return alert("Не все поля заполнены")
        }
        axios.patch(`http://127.0.0.1:8000/api/api/warehouse/${warehouse.id}/products/`,{
            "title": titleInputChange,
            "category": categoryInputChange,
            "measure_unit": measureUnitInputChange,
            "minimum_stock_level": minimumStockLevelInputChange,
            "maximum_stock_level": maximumStockLevelInputChange,
            'product_id':product_id
        }, {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then(response=>{
            if (response.status === 200) {
                getProducts()

                setTitleInputChange('')
                setCategoryInputChange('')
                setMeasureUnitInputChange('')
                setMinimumStockLevelInputChange('')
                setMaximumStockLevelInputChange('')

                setCreateNewProductStatus(false)
                setChangeNewProductIndex(-1)
            }
        }).catch(error=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                return navigate('auth/');
            }
        })
    }

    const changeActiveProduct = function (index) {
        setTitleInputChange(products[index].title)
        setCategoryInputChange(products[index].category)
        setMeasureUnitInputChange(products[index].measure_unit)
        setMinimumStockLevelInputChange(products[index].minimum_stock_level)
        setMaximumStockLevelInputChange(products[index].maximum_stock_level)
    }


    // Realizations

    const [productId, setProductId] = useState('')
    const [realizations, setRealizations] = useState([])
    const [realizationFromStatus, setRealizationFromStatus] = useState(false);

    const [date_of_shipment, setDateOfShipment] = useState(new Date().toISOString().split('T')[0])
    const [realization_count, setRealizationCount] = useState('')
    const [client_information, setClientInformation] = useState('')
    const [payment_method, setPaymentMethod] = useState('')

    const [realization_type, setRealizationType] = useState(null);

    const getRealizations = function (warehouse_id) {
        const product_id = 1
        axios.get(`http://127.0.0.1:8000/api/api/warehouse/${warehouse.id}/products/${product_id}/`, {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then(response=>{
            console.log(response)
            setRealizations(response.data)
        }).catch(error=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                return navigate('auth/');
            }
        })
    }

    const saveRealizations = function () {
        if (
            realization_type === null ||
            date_of_shipment === '' ||
            realization_count === '' ||
            client_information === '' ||
            payment_method === ''
        ) {
            console.log(realization_type,date_of_shipment,realization_count,client_information,payment_method)
            return alert('Не все поля заполнены')
        }

        axios.post(`http://127.0.0.1:8000/api/api/warehouse/${warehouse.id}/products/${productId}/`,{
            "date_of_shipment": date_of_shipment,
            "realization_count": realization_count,
            "client_information": client_information,
            "payment_method": payment_method,
            "realization_type": realization_type
        }, {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then(response=>{
            console.log(response)
            // setDateOfShipment('')
            // setRealizationCount('')
            // setClientInformation('')
            // setPaymentMethod('')
            // setProductId('')
            // setRealizationType(null)

            setRealizationFromStatus(false)


            getProducts()
            getRealizations()

            props.realizations()

        }).catch(error=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                return navigate('auth/');
            }
            if (error.response.status === 409) {
                alert('На складе недостаточно товаров')
            }
        })
    }


    useEffect(() => {
        if (!localStorage.getItem('token')) {
            return navigate('auth/');
        }
        getProducts()
        getRealizations()

    }, [props.warehouse]);

    return (
        <div className="App bg-dark text-white w-100 h-100">
            <div className=''>
                <div className=''>
                    <div className='bg-black d-flex align-items-center border-1 border-white'>
                        <div className='py-3 menu-elem w-50 d-flex align-items-center justify-content-center border-end border-1 border-white' onClick={()=>{setTabMenu('products')}}>
                            Products
                        </div>
                        <div className='py-3 menu-elem w-50 d-flex align-items-center justify-content-center' onClick={()=>{setTabMenu('realizations')}}>
                            Realizations
                        </div>
                    </div>
                </div>
                {tabMenu==='products' &&
                    <div className='p-4'>
                        <h3>Products</h3>
                        <hr/>
                        <div className="border-white">
                            <table className="table table-dark">
                                <thead>
                                <tr>
                                    <th scope='col'>#</th>
                                    <th scope="col">Название</th>
                                    <th scope="col">Категория</th>
                                    <th scope="col">В наличии</th>
                                    <th scope="col">Действие</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map((value, index) => {
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{index+1}</th>
                                            <td>{value.title}</td>
                                            <td>{value.category}</td>
                                            <td className={(value.minimum_stock_level > value.quantity_in_stock || value.maximum_stock_level < value.quantity_in_stock)?'text-warning':'text-success'}>{value.quantity_in_stock} {value.measure_unit.toLowerCase()}</td>
                                            <td className='col-1'><button className="btn btn-danger px-5 py-1" onClick={()=>{deleteProduct(value.id)}}>Удалить</button></td>
                                        </tr>
                                    )
                                })}
                                {products.length === 0 &&
                                    <tr>
                                        <td colSpan={5} className='text-center'>Пока тут ничего нет</td>
                                    </tr>
                                }

                                </tbody>
                            </table>
                        </div>

                        {/*{products.map((value, index) => {*/}
                        {/*    if (Number(changeNewProductIndex)!==Number(index)) {*/}
                        {/*        return (*/}
                        {/*            <div className="card mb-3 bg-black text-white border-1 border-white" key={value.id}>*/}
                        {/*                <div className="card-header fw-bold fs-4 border-bottom border-1 border-white">*/}
                        {/*                    {value.title}*/}
                        {/*                </div>*/}
                        {/*                <div className="card-body">*/}
                        {/*                    <div className='d-flex align-items-center justify-content-between mb-1'>*/}
                        {/*                        <div>*/}
                        {/*                            Категория*/}
                        {/*                        </div>*/}
                        {/*                        <div>*/}
                        {/*                            {value.category}*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                    <hr/>*/}
                        {/*                    <div className='d-flex align-items-center justify-content-between mb-1'>*/}
                        {/*                        <div>*/}
                        {/*                            Описание*/}
                        {/*                        </div>*/}
                        {/*                        <div>*/}
                        {/*                            {value.description}*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                    <hr/>*/}
                        {/*                    <div className='d-flex align-items-center justify-content-between mb-1'>*/}
                        {/*                        <div>*/}
                        {/*                            Единица измерения*/}
                        {/*                        </div>*/}
                        {/*                        <div>*/}
                        {/*                            {value.measure_unit}*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                    <hr/>*/}
                        {/*                    <div className='d-flex align-items-center justify-content-between mb-1'>*/}
                        {/*                        <div>*/}
                        {/*                            Количетсво в наличии*/}
                        {/*                        </div>*/}
                        {/*                        <div>*/}
                        {/*                            {value.quantity_in_stock}*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                    <hr/>*/}
                        {/*                    <div className='d-flex align-items-center justify-content-between mb-1'>*/}
                        {/*                        <div>*/}
                        {/*                            Минимальный уровень запасов*/}
                        {/*                        </div>*/}
                        {/*                        <div>*/}
                        {/*                            {value.minimum_stock_level}*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                    <hr/>*/}
                        {/*                    <div className='d-flex align-items-center justify-content-between mb-1'>*/}
                        {/*                        <div>*/}
                        {/*                            Максимальный уровень запасов*/}
                        {/*                        </div>*/}
                        {/*                        <div>*/}
                        {/*                            {value.maximum_stock_level}*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                    <hr/>*/}
                        {/*                    <div className='mt-2'>*/}
                        {/*                        <button className="btn btn-warning px-5 me-3" onClick={()=>{setChangeNewProductStatus(true);setChangeNewProductIndex(index); changeActiveProduct(index)}}>Изменить</button>*/}
                        {/*                        <button className="btn btn-danger px-5" onClick={()=>{deleteProduct(value.id)}}>Удалить</button>*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        )*/}
                        {/*    }*/}
                        {/*    if (Number(changeNewProductIndex)===Number(index)) {*/}

                        {/*        return (*/}
                        {/*            <div className="card mb-3 bg-black text-white border-1 border-white">*/}
                        {/*                <div className="card-header fw-bold fs-4 border-bottom border-1 border-white">*/}
                        {/*                    {products[changeNewProductIndex].title}*/}
                        {/*                </div>*/}
                        {/*                <div className="card-body">*/}
                        {/*                    <div className='d-flex align-items-center justify-content-between mb-1'>*/}
                        {/*                        <div>*/}
                        {/*                            Категория*/}
                        {/*                        </div>*/}
                        {/*                        <div>*/}
                        {/*                            <input type="text" className="form-control" value={categoryInputChange} onChange={(event)=>{setCategoryInputChange(event.target.value)}} placeholder='Категория'/>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                    <hr/>*/}
                        {/*                    <div className='d-flex align-items-center justify-content-between mb-1'>*/}
                        {/*                        <div>*/}
                        {/*                            Описание*/}
                        {/*                        </div>*/}
                        {/*                        <div>*/}
                        {/*                            <input type="text" className="form-control py-1" value={descriptionInputChange} onChange={(event)=>{setDescriptionInputChange(event.target.value)}} placeholder='Описание'/>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                    <hr/>*/}
                        {/*                    <div className='d-flex align-items-center justify-content-between mb-1'>*/}
                        {/*                        <div>*/}
                        {/*                            Единица измерения*/}
                        {/*                        </div>*/}
                        {/*                        <div>*/}
                        {/*                            <input type="text" className="form-control py-1" value={measureUnitInputChange} onChange={(event)=>{setMeasureUnitInputChange(event.target.value)}} placeholder='Единица измерения'/>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                    <hr/>*/}
                        {/*                    <div className='d-flex align-items-center justify-content-between mb-1'>*/}
                        {/*                        <div>*/}
                        {/*                            Минимальный уровень запасов*/}
                        {/*                        </div>*/}
                        {/*                        <div>*/}
                        {/*                            <input type="number" className="form-control py-1" value={minimumStockLevelInputChange} onChange={(event)=>{setMinimumStockLevelInputChange(event.target.value)}} placeholder='Минимальный уровень запасов'/>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                    <hr/>*/}
                        {/*                    <div className='d-flex align-items-center justify-content-between mb-1'>*/}
                        {/*                        <div>*/}
                        {/*                            Максимальный уровень запасов*/}
                        {/*                        </div>*/}
                        {/*                        <div>*/}
                        {/*                            <input type="number" className="form-control py-1" value={maximumStockLevelInputChange} onChange={(event)=>{setMaximumStockLevelInputChange(event.target.value)}} placeholder='Максимальный уровень запасов'/>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                    <hr/>*/}
                        {/*                    <div className='mt-2'>*/}
                        {/*                        <button className="btn btn-success px-5 me-3" onClick={()=>{saveChangesProduct(value.id)}}>Сохранить</button>*/}
                        {/*                        <button className="btn btn-primary px-5" onClick={()=>{setChangeNewProductStatus(false);}}>Отменить</button>*/}
                        {/*                    </div>*/}

                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        )*/}
                        {/*    }*/}
                        {/*})}*/}

                        <div className="mt-4 card bg-dark text-white border-1 border-white">
                            <div className="card-header fw-bold fs-5 border-bottom-0 cursor-pointer  border-bottom border-1 border-white" onClick={()=>{createNewProductStatus?setCreateNewProductStatus(false):setCreateNewProductStatus(true)}}>
                                Добваить продукт
                            </div>
                            {createNewProductStatus &&
                                <div className="card-body">
                                    <div className='d-flex align-items-center justify-content-between mb-1'>
                                        <div>
                                            Название
                                        </div>
                                        <div className='w-25'>
                                            <input value={titleInput} onChange={(event)=>{setTitleInput(event.target.value)}} type="text" className="form-control bg-dark text-white" placeholder='Название'/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className='d-flex align-items-center justify-content-between mb-1'>
                                        <div>
                                            Категория
                                        </div>
                                        <div className='w-25'>
                                            <select name="" id="" className="form-control bg-dark text-white" onChange={(event)=>{setCategoryInput(event.target.value)}}>
                                                <option value="">Выберите категорию</option>
                                                <option value="Обувь">Обувь</option>
                                                <option value="Игрушки">Игрушки</option>
                                                <option value="Дом">Дом</option>
                                                <option value="Аксессуары">Аксессуары</option>
                                                <option value="Электроника">Электроника</option>
                                                <option value="Мебель">Мебель</option>
                                                <option value="Продукты">Продукты</option>
                                                <option value="Бытовая техника">Бытовая техника</option>
                                                <option value="Зоотовары">Зоотовары</option>
                                                <option value="Спорт">Спорт</option>
                                                <option value="Автотовары">Автотовары</option>
                                                <option value="Книги">Книги</option>
                                                <option value="Для ремонта">Для ремонта</option>
                                                <option value="Сад и дача">Сад и дача</option>
                                                <option value="Здоровье">Здоровье</option>
                                                <option value="Канцтовары">Канцтовары</option>
                                            </select>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className='d-flex align-items-center justify-content-between mb-1'>
                                        <div>
                                            Единица измерения
                                        </div>
                                        <div className='w-25'>
                                            <input value={measureUnitInput} onChange={(event)=>{setMeasureUnitInput(event.target.value)}} type="text" className="form-control py-1 bg-dark text-white" placeholder='Единица измерения'/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className='d-flex align-items-center justify-content-between mb-1'>
                                        <div>
                                            Минимальный уровень запасов
                                        </div>
                                        <div className='w-25'>
                                            <input value={minimumStockLevelInput} onChange={(event)=>{setMinimumStockLevelInput(event.target.value)}} type="number" className="form-control py-1 bg-dark text-white" placeholder='Минимальный уровень запасов'/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className='d-flex align-items-center justify-content-between mb-1'>
                                        <div>
                                            Максимальный уровень запасов
                                        </div>
                                        <div className='w-25'>
                                            <input value={maximumStockLevelInput} onChange={(event)=>{setMaximumStockLevelInput(event.target.value)}} type="number" className="form-control py-1 bg-dark text-white" placeholder='Максимальный уровень запасов'/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className='mt-2'>
                                        <button className="btn btn-success px-5 me-3" onClick={saveProduct}>Сохранить</button>
                                        <button className="btn btn-primary px-5" onClick={()=>{setCreateNewProductStatus(false)}}>Отменить</button>
                                    </div>

                                </div>
                            }
                        </div>
                    </div>
                }
                {tabMenu==='realizations' &&
                    <div className='p-4'>
                        <h3>Realizations</h3>
                        <hr/>
                        <div className="border-white">
                            <table className="table table-dark">
                                <thead>
                                    <tr>
                                        <th scope='col'>Номер</th>
                                        <th scope="col">Дата отгрузки</th>
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
                                            <tr>
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

                            <div className="mt-4 card bg-dark text-white border-1 border-white">
                                <div className="card-header fw-bold fs-5 border-bottom-0 cursor-pointer border-bottom border-1 border-white" onClick={()=>{realizationFromStatus?setRealizationFromStatus(false):setRealizationFromStatus(true)}}>
                                    Добавить реализацию
                                </div>
                                {realizationFromStatus &&
                                    <div className="card-body">
                                        <div className='d-flex align-items-center justify-content-between mb-1'>
                                            <div>
                                                Дата отгрузки/погрузки
                                            </div>
                                            <div className='w-25'>
                                                <input type="date" className='form-control mx-2 bg-dark text-white' value={date_of_shipment} onChange={(event)=>{setDateOfShipment(event.target.value)}}/>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className='d-flex align-items-center justify-content-between mb-1'>
                                            <div>
                                                Продукт
                                            </div>
                                            <div className='w-25'>
                                                <select className='form-control bg-dark text-white' name="" id="" onChange={(event)=>{setProductId(event.target.value)}}>
                                                    <option value="1">Выберите продукт</option>
                                                    {products.map((value,index)=>{
                                                        return (
                                                            <option key={index} value={value.id}>{value.id} - {value.title}</option>
                                                        )
                                                    })}

                                                </select>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className='d-flex align-items-center justify-content-between mb-1'>
                                            <div>
                                                Количество реализации
                                            </div>
                                            <div className='w-25'>
                                                <input type="text" className='form-control mx-2 bg-dark text-white' value={realization_count} onChange={(event)=>{setRealizationCount(event.target.value)}}/>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className='d-flex align-items-center justify-content-between mb-1'>
                                            <div>
                                                Клиент
                                            </div>
                                            <div className='w-25'>
                                                <input type="text" className='form-control mx-2 bg-dark text-white' value={client_information} onChange={(event)=>{setClientInformation(event.target.value)}}/>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className='d-flex align-items-center justify-content-between mb-1'>
                                            <div>
                                                Метод оплаты
                                            </div>
                                            <div className='w-25'>
                                                <select name="" id="" className='form-control bg-dark text-white' onChange={(event)=>{setPaymentMethod(event.target.value)}}>
                                                    <option value="">Метод оплаты</option>
                                                    <option value="Наличные">Наличные</option>
                                                    <option value="Карта">Карта</option>
                                                </select>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className='d-flex align-items-center justify-content-between mb-1'>
                                            <div>
                                                Выберите загрузка/отгрузка
                                            </div>
                                            <div className='w-25'>
                                                <select name="" id="" className='form-control bg-dark text-white' onChange={(event)=>{event.target.value === 'true' ? setRealizationType(true) : setRealizationType(false)}}>
                                                    {/*<option value=''>Выберите загрузка/отгрузка</option>*/}
                                                    <option value='true'>Загрузка</option>
                                                    <option value='false'>Отгрузка</option>
                                                </select>
                                            </div>
                                        </div>
                                        {/* todo  */}
                                        <hr/>
                                        <div className='mt-2'>
                                            <button className="btn btn-success px-5 me-3" onClick={saveRealizations}>Сохранить</button>
                                            <button className="btn btn-primary px-5" onClick={()=>{setRealizationFromStatus(false)}}>Отменить</button>
                                        </div>

                                    </div>
                                }
                            </div>
                        </div>
                        {/*<div>*/}
                        {/*    <div className="card bg-black border-1 border-white text-white">*/}
                        {/*        <div className="card-body">*/}
                        {/*            <div className="table w-100 h-100 p-0 m-0">*/}
                        {/*                <div className="row h-50">*/}
                        {/*                    <div className="col fw-bold">Номер заказа</div>*/}
                        {/*                    <div className="col fw-bold">Дата отгрузки</div>*/}
                        {/*                    <div className="col fw-bold">Продукт</div>*/}
                        {/*                    <div className="col-2 fw-bold">Количество реализации</div>*/}
                        {/*                    <div className="col-2 fw-bold">Информация о клиенте</div>*/}
                        {/*                    <div className="col fw-bold">Метод оплаты</div>*/}
                        {/*                    <div className="col-2 fw-bold">Отгрузка/Погрузка</div>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    {realizations.map((value, index)=>{*/}
                        {/*        return (*/}
                        {/*            <div key={index} className="card mt-2 bg-black border-1 border-white text-white">*/}
                        {/*                <div className="card-body">*/}
                        {/*                    <div className="table w-100 h-100 p-0 m-0">*/}
                        {/*                        <div className="row h-50">*/}
                        {/*                            <div className="col">2</div>*/}
                        {/*                            <div className="col">{value.date_of_shipment.split('T')[0]}</div>*/}
                        {/*                            <div className="col">{products.map((valueP,indexP)=>{*/}
                        {/*                                if (valueP.id === value.product) {*/}
                        {/*                                    return valueP.title*/}
                        {/*                                } else {*/}
                        {/*                                    return null*/}
                        {/*                                }*/}

                        {/*                            })}</div>*/}
                        {/*                            <div className="col-2">{value.realization_count}</div>*/}
                        {/*                            <div className="col-3">{value.client_information}</div>*/}
                        {/*                            <div className="col">{value.payment_method}</div>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        )*/}
                        {/*    })}*/}
                        {/*    {realizationFromStatus?(*/}
                        {/*        <div className="card mt-2 bg-black border-1 border-white text-white">*/}
                        {/*            <div className="card-body">*/}
                        {/*                <div className="table w-100 h-100 p-0 m-0">*/}
                        {/*                    <div className="row h-50">*/}
                        {/*                        <div className="col px-2"><button className='btn btn-success bg-success text-white w-100' onClick={saveRealizations}>Сохранить</button></div>*/}
                        {/*                        <div className="col"><input type="date" className='form-control mx-2 bg-black text-white' value={date_of_shipment} onChange={(event)=>{setDateOfShipment(event.target.value)}}/></div>*/}
                        {/*                        <div className="col">*/}
                        {/*                            <select className='form-control bg-black text-white' name="" id="" onChange={(event)=>{setProductId(event.target.value)}}>*/}
                        {/*                                <option value="1">Выберите продукт</option>*/}
                        {/*                                {products.map((value,index)=>{*/}
                        {/*                                    return (*/}
                        {/*                                        <option key={index} value={value.id}>{value.id} - {value.title}</option>*/}
                        {/*                                    )*/}
                        {/*                                })}*/}

                        {/*                            </select>*/}
                        {/*                        </div>*/}
                        {/*                        <div className="col-2"><input type="text" className='form-control mx-2 bg-black text-white' value={realization_count} onChange={(event)=>{setRealizationCount(event.target.value)}}/></div>*/}
                        {/*                        <div className="col-2"><input type="text" className='form-control mx-2 bg-black text-white' value={client_information} onChange={(event)=>{setClientInformation(event.target.value)}}/></div>*/}
                        {/*                        <div className="col"><input type="text" className='form-control mx-2 bg-black text-white' value={payment_method} onChange={(event)=>{setPaymentMethod(event.target.value)}}/></div>*/}
                        {/*                        <div className="col-2"><input type="text" className='form-control mx-2 bg-black text-white' value={payment_method} onChange={(event)=>{setPaymentMethod(event.target.value)}}/></div>*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    ):(*/}
                        {/*        <div className="card mt-2 bg-black border-1 border-white text-white">*/}
                        {/*            <div className="card-body">*/}
                        {/*                <div className="table w-100 h-100 p-0 m-0">*/}
                        {/*                    <div className="row h-50 px-3">*/}
                        {/*                        <button className="btn btn-primary py-2" onClick={()=>{setRealizationFromStatus(true)}}>Добавить</button>*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    )}*/}

                        {/*</div>*/}
                    </div>
                }
            </div>

        </div>
    );
}

export default Warehouse;
