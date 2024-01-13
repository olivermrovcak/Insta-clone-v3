import React from 'react';
import ReactDOM from 'react-dom/client';
import {RecoilRoot} from 'recoil';
import './index.css';
import App from './App';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

const queryClient = new QueryClient()

root.render(
    <React.StrictMode>
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>
                <App/>
            </QueryClientProvider>
        </RecoilRoot>
    </React.StrictMode>
);