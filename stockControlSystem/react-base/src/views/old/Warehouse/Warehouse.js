import './Warehouse.css'
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from "axios";
import {render} from "@testing-library/react";

function Warehouse(props) {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [realizations, setRealizations] = useState([]);

    const [createNewProductStatus, setCreateNewProductStatus] = useState(false);
    const [changeNewProductStatus, setChangeNewProductStatus] = useState(false);
    const [changeNewProductIndex, setChangeNewProductIndex] = useState(-1);

    const [titleInput, setTitleInput] = useState('Смартфон Galaxy S20');
    const [categoryInput, setCategoryInput] = useState('Электроника');
    const [descriptionInput, setDescriptionInput] = useState('Премиальный смартфон с высоким разрешением камеры');
    const [measureUnitInput, setMeasureUnitInput] = useState('Штуки');
    const [unitPriceInput, setUnitPriceInput] = useState('899');
    const [quantityInStockInput, setQuantityInStockInput] = useState('50');
    const [minimumStockLevelInput, setMinimumStockLevelInput] = useState('10');
    const [maximumStockLevelInput, setMaximumStockLevelInput] = useState('100');
    const [supplierInput, setSupplierInput] = useState('Samsung Electronics');

    const [titleInputChange, setTitleInputChange] = useState('');
    const [categoryInputChange, setCategoryInputChange] = useState('');
    const [descriptionInputChange, setDescriptionInputChange] = useState('');
    const [measureUnitInputChange, setMeasureUnitInputChange] = useState('');
    const [unitPriceInputChange, setUnitPriceInputChange] = useState('');
    const [quantityInStockInputChange, setQuantityInStockInputChange] = useState('');
    const [minimumStockLevelInputChange, setMinimumStockLevelInputChange] = useState('');
    const [maximumStockLevelInputChange, setMaximumStockLevelInputChange] = useState('');
    const [supplierInputChange, setSupplierInputChange] = useState('');

    const [dateOfShipment, setDateOfShipment] = useState('');
    const [realizationCount, setRealizationCount] = useState('');
    const [clientInformation, setClientInformation] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

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
            descriptionInput === '' ||
            measureUnitInput === '' ||
            unitPriceInput === '' ||
            quantityInStockInput === '' ||
            minimumStockLevelInput === '' ||
            maximumStockLevelInput === '' ||
            supplierInput === ''
        ) {
            return alert("Не все поля заполнены")
        }
        axios.post(`http://127.0.0.1:8000/api/api/warehouse/${warehouse.id}/products/`,{
            "title": titleInput,
            "category": categoryInput,
            "description": descriptionInput,
            "measure_unit": measureUnitInput,
            "unit_price": unitPriceInput,
            "quantity_in_stock": quantityInStockInput,
            "minimum_stock_level": minimumStockLevelInput,
            "maximum_stock_level": maximumStockLevelInput,
            "supplier": supplierInput,
        }, {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then(response=>{
            if (response.status === 201) {
                getProducts()

                setTitleInput('')
                setCategoryInput('')
                setDescriptionInput('')
                setMeasureUnitInput('')
                setUnitPriceInput('')
                setQuantityInStockInput('')
                setMinimumStockLevelInput('')
                setMaximumStockLevelInput('')
                setSupplierInput('')

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
            descriptionInputChange === '' ||
            measureUnitInputChange === '' ||
            unitPriceInputChange === '' ||
            quantityInStockInputChange === '' ||
            minimumStockLevelInputChange === '' ||
            maximumStockLevelInputChange === '' ||
            supplierInputChange === ''
        ) {
            return alert("Не все поля заполнены")
        }
        axios.patch(`http://127.0.0.1:8000/api/api/warehouse/${warehouse.id}/products/`,{
            "title": titleInputChange,
            "category": categoryInputChange,
            "description": descriptionInputChange,
            "measure_unit": measureUnitInputChange,
            "unit_price": unitPriceInputChange,
            "quantity_in_stock": quantityInStockInputChange,
            "minimum_stock_level": minimumStockLevelInputChange,
            "maximum_stock_level": maximumStockLevelInputChange,
            "supplier": supplierInputChange,
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
                setDescriptionInputChange('')
                setMeasureUnitInputChange('')
                setUnitPriceInputChange('')
                setQuantityInStockInputChange('')
                setMinimumStockLevelInputChange('')
                setMaximumStockLevelInputChange('')
                setSupplierInputChange('')

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
        setDescriptionInputChange(products[index].description)
        setMeasureUnitInputChange(products[index].measure_unit)
        setUnitPriceInputChange(products[index].unit_price)
        setQuantityInStockInputChange(products[index].quantity_in_stock)
        setMinimumStockLevelInputChange(products[index].minimum_stock_level)
        setMaximumStockLevelInputChange(products[index].maximum_stock_level)
        setSupplierInputChange(products[index].supplier)
    }


    // Realizations

    const getRealizations = function (warehouse_id) {
        const product_id = products[changeNewProductIndex]
        axios.get(`http://127.0.0.1:8000/api/api/warehouse/${warehouse_id}/products/${product_id}/`, {
            headers:{
                Authorization:`Token ${localStorage.getItem('token')}`
            }
        }).then(response=>{
            console.log(response)
        }).catch(error=>{
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                return navigate('auth/');
            }
        })
    }

    const saveRealizations = function () {

    }




    useEffect(() => {
        if (!localStorage.getItem('token')) {
            return navigate('auth/');
        }
        getProducts()

    }, [props.warehouse]);

    return (
        <div className="App w-100 h-100">
            <div className='m-5 mb-6'>

                <div className='mb-4'>
                    <button className='btn btn-primary me-3 px-5' onClick={()=>{setTabMenu('products')}}>Продукты</button>
                    <button className='btn btn-primary me-3 px-5' onClick={()=>{setTabMenu('realizations');getRealizations()}}>Реализация</button>
                </div>
                {tabMenu==='products'&&
                    <div>
                        <h3>Products</h3>
                        <hr/>
                        {products.map((value, index) => {
                            // category "1"
                            // created_at "2023-12-14T10:00:58.709153Z"
                            // date_of_last_receipt "2023-12-14T10:00:58.708152Z"
                            // description "1"
                            // id 1
                            // maximum_stock_level 1
                            // measure_unit "1"
                            // minimum_stock_level 1
                            // quantity_in_stock 1
                            // supplier "1"
                            // title "1"
                            // unit_price 1
                            // warehouse 1

                            if (Number(changeNewProductIndex)!==Number(index)) {
                                return (
                                    <div className="card mb-3" key={value.id}>
                                        <div className="card-header fw-bold fs-4">
                                            {value.title}
                                        </div>
                                        <div className="card-body">
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Категория
                                                </div>
                                                <div>
                                                    {value.category}
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Описание
                                                </div>
                                                <div>
                                                    {value.description}
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Единица измерения
                                                </div>
                                                <div>
                                                    {value.measure_unit}
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Цена за единицу
                                                </div>
                                                <div>
                                                    {value.unit_price}
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Количетсво в наличии
                                                </div>
                                                <div>
                                                    {value.quantity_in_stock}
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Минимальный уровень запасов
                                                </div>
                                                <div>
                                                    {value.minimum_stock_level}
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Максимальный уровень запасов
                                                </div>
                                                <div>
                                                    {value.maximum_stock_level}
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Поставщик
                                                </div>
                                                <div>
                                                    {value.supplier}
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='mt-2'>
                                                <button className="btn btn-warning px-5 me-3" onClick={()=>{setChangeNewProductStatus(true);setChangeNewProductIndex(index); changeActiveProduct(index)}}>Изменить</button>
                                                <button className="btn btn-danger px-5" onClick={()=>{deleteProduct(value.id)}}>Удалить</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            if (Number(changeNewProductIndex)===Number(index)) {

                                return (
                                    <div className="card mb-3">
                                        <div className="card-header fw-bold fs-4">
                                            {products[changeNewProductIndex].title}
                                        </div>
                                        <div className="card-body">
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Категория
                                                </div>
                                                <div>
                                                    <input type="text" className="form-control" value={categoryInputChange} onChange={(event)=>{setCategoryInputChange(event.target.value)}} placeholder='Категория'/>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Описание
                                                </div>
                                                <div>
                                                    <input type="text" className="form-control py-1" value={descriptionInputChange} onChange={(event)=>{setDescriptionInputChange(event.target.value)}} placeholder='Описание'/>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Единица измерения
                                                </div>
                                                <div>
                                                    <input type="text" className="form-control py-1" value={measureUnitInputChange} onChange={(event)=>{setMeasureUnitInputChange(event.target.value)}} placeholder='Единица измерения'/>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Цена за единицу
                                                </div>
                                                <div>
                                                    <input type="number" className="form-control py-1" value={unitPriceInputChange} onChange={(event)=>{setUnitPriceInputChange(event.target.value)}} placeholder='Цена за единицу'/>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Количетсво в наличии
                                                </div>
                                                <div>
                                                    <input type="number" className="form-control py-1" value={quantityInStockInputChange} onChange={(event)=>{setQuantityInStockInputChange(event.target.value)}} placeholder='Количетсво в наличии'/>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Минимальный уровень запасов
                                                </div>
                                                <div>
                                                    <input type="number" className="form-control py-1" value={minimumStockLevelInputChange} onChange={(event)=>{setMinimumStockLevelInputChange(event.target.value)}} placeholder='Минимальный уровень запасов'/>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Максимальный уровень запасов
                                                </div>
                                                <div>
                                                    <input type="number" className="form-control py-1" value={maximumStockLevelInputChange} onChange={(event)=>{setMaximumStockLevelInputChange(event.target.value)}} placeholder='Максимальный уровень запасов'/>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='d-flex align-items-center justify-content-between mb-1'>
                                                <div>
                                                    Поставщик
                                                </div>
                                                <div>
                                                    <input type="text" className="form-control py-1" value={supplierInputChange} onChange={(event)=>{setSupplierInputChange(event.target.value)}} placeholder='Поставщик'/>
                                                </div>
                                            </div>
                                            <hr/>
                                            <div className='mt-2'>
                                                <button className="btn btn-success px-5 me-3" onClick={()=>{saveChangesProduct(value.id)}}>Сохранить</button>
                                                <button className="btn btn-primary px-5" onClick={()=>{setChangeNewProductStatus(false);}}>Отменить</button>
                                            </div>

                                        </div>
                                    </div>
                                )
                            }
                        })}

                        <div className="card">
                            <div className="card-header fw-bold fs-4 border-bottom-0 cursor-pointer" onClick={()=>{createNewProductStatus?setCreateNewProductStatus(false):setCreateNewProductStatus(true)}}>
                                Добваить продукт
                            </div>
                            {createNewProductStatus &&
                                <div className="card-body">
                                    <div className='d-flex align-items-center justify-content-between mb-1'>
                                        <div>
                                            Название
                                        </div>
                                        <div>
                                            <input value={titleInput} onChange={(event)=>{setTitleInput(event.target.value)}} type="text" className="form-control" placeholder='Название'/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className='d-flex align-items-center justify-content-between mb-1'>
                                        <div>
                                            Категория
                                        </div>
                                        <div>
                                            <input value={categoryInput} onChange={(event)=>{setCategoryInput(event.target.value)}} type="text" className="form-control" placeholder='Категория'/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className='d-flex align-items-center justify-content-between mb-1'>
                                        <div>
                                            Описание
                                        </div>
                                        <div>
                                            <input value={descriptionInput} onChange={(event)=>{setDescriptionInput(event.target.value)}} type="text" className="form-control py-1" placeholder='Описание'/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className='d-flex align-items-center justify-content-between mb-1'>
                                        <div>
                                            Единица измерения
                                        </div>
                                        <div>
                                            <input value={measureUnitInput} onChange={(event)=>{setMeasureUnitInput(event.target.value)}} type="text" className="form-control py-1" placeholder='Единица измерения'/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className='d-flex align-items-center justify-content-between mb-1'>
                                        <div>
                                            Цена за единицу
                                        </div>
                                        <div>
                                            <input value={unitPriceInput} onChange={(event)=>{setUnitPriceInput(event.target.value)}} type="number" className="form-control py-1" placeholder='Цена за единицу'/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className='d-flex align-items-center justify-content-between mb-1'>
                                        <div>
                                            Количетсво в наличии
                                        </div>
                                        <div>
                                            <input value={quantityInStockInput} onChange={(event)=>{setQuantityInStockInput(event.target.value)}} type="number" className="form-control py-1" placeholder='Количетсво в наличии'/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className='d-flex align-items-center justify-content-between mb-1'>
                                        <div>
                                            Минимальный уровень запасов
                                        </div>
                                        <div>
                                            <input value={minimumStockLevelInput} onChange={(event)=>{setMinimumStockLevelInput(event.target.value)}} type="number" className="form-control py-1" placeholder='Минимальный уровень запасов'/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className='d-flex align-items-center justify-content-between mb-1'>
                                        <div>
                                            Максимальный уровень запасов
                                        </div>
                                        <div>
                                            <input value={maximumStockLevelInput} onChange={(event)=>{setMaximumStockLevelInput(event.target.value)}} type="number" className="form-control py-1" placeholder='Максимальный уровень запасов'/>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className='d-flex align-items-center justify-content-between mb-1'>
                                        <div>
                                            Поставщик
                                        </div>
                                        <div>
                                            <input value={supplierInput} onChange={(event)=>{setSupplierInput(event.target.value)}} type="text" className="form-control py-1" placeholder='Поставщик'/>
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
                    <div>
                        <h3>Realizations</h3>
                        <hr/>
                        <div>
                            <div className="card">
                                <div className="card-body">
                                    <div className="table w-100 h-100 p-0 m-0">
                                        <div className="row h-50">
                                            <div className="col fw-bold">Номер заказа</div>
                                            <div className="col fw-bold">Дата отгрузки</div>
                                            <div className="col fw-bold">Продукт</div>
                                            <div className="col fw-bold">Количество реализации</div>
                                            <div className="col-3 fw-bold">Информация о клиенте</div>
                                            <div className="col fw-bold">Метод оплаты</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card mt-2">
                                <div className="card-body">
                                    <div className="table w-100 h-100 p-0 m-0">
                                        <div className="row h-50">
                                            <div className="col">2</div>
                                            <div className="col">2</div>
                                            <div className="col">2</div>
                                            <div className="col">2</div>
                                            <div className="col-3">2</div>
                                            <div className="col">2</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>

        </div>
    );
}

export default Warehouse;
