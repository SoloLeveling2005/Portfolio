import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Authorization from "./views/Authorization/Authorization";
import Home from "./views/Home/Home";
import Warehouse from "./views/old/Warehouse/Warehouse";
import './assets/css/bootstrap.min.css'
import './App.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="auth/" element={<Authorization />} />
          <Route path="warehouse/:warehouseId" element={<Warehouse />} />
      </Routes>
  </BrowserRouter>
);

