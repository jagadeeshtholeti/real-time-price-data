import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    stock: {
        status: '',
        data: {
            metaData: {},
            timeSeries: []
        },
        message: ''
    },
    symbol: 'GOOG',
    isModalOpen: false,
    serverStatus: 'up'
};

const stockSlice = createSlice({
    name: 'stock',
    initialState: JSON.parse(localStorage.getItem('stockState')) || initialState,
    reducers: {
        setStock: (state, action) => {
            state.stock = action.payload;
            localStorage.setItem('stockState', JSON.stringify(state));
        },
        setSymbol: (state, action) => {
            state.symbol = action.payload;
            localStorage.setItem('stockState', JSON.stringify(state));
        },
        setIsModalOpen: (state, action) => {
            state.isModalOpen = action.payload;
            localStorage.setItem('stockState', JSON.stringify(state));
        },
        setServerStatus: (state, action) => {
            state.serverStatus = action.payload;
            localStorage.setItem('stockState', JSON.stringify(state));
        }
    }
});

export const { setStock, setSymbol, setIsModalOpen, setServerStatus } = stockSlice.actions;

export default stockSlice.reducer;