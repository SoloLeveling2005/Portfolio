import './NewWarehouse.css'
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from "axios";
import {render} from "@testing-library/react";

function Home(props) {
    const navigate = useNavigate();

    const [warehouseInput, setWarehouseInput] = useState('');



    useEffect(() => {
        if (!localStorage.getItem('token')) {
            return navigate('auth/');
        }
    }, []);

    return (
        <div className="App w-100 h-100 bg-black text-white">
            <div className="p-5">
                <h3>Добавить склад</h3>
                <hr className='p-0 m-0 pb-3'/>
                <label htmlFor="" className='fs-5 mt-3'>Title</label>
                <input type="text" className="form-control bg-black text-white mt-2" value={warehouseInput} onChange={(event)=>{setWarehouseInput(event.target.value)}}/>
                <button className='btn btn-success w-100 mt-2' onClick={()=>{props.addNewWarehouse(warehouseInput)}}>Save</button>
            </div>
        </div>
    );
}

export default Home;
