import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import { RecoilRoot } from 'recoil';
import './index.css';
import App from './App';
import Main from './components/Main'


ReactDOM.render(
  <React.StrictMode>
     <RecoilRoot>
         <BrowserRouter>
             <App/>
         </BrowserRouter>
     </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);

