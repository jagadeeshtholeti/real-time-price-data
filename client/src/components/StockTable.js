import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from './Modal';
import { setStock, setSymbol, setIsModalOpen, setServerStatus } from '../redux/stockSlice';

const StockTable = () => {
    const dispatch = useDispatch();
    const { stock, symbol, isModalOpen, serverStatus } = useSelector((state) => state.stock);

    const selectRef = useRef(null);

    const symbolMapping = {
        GOOG: 'Google',
        AAPL: 'Apple',
        IBM: 'IBM',
        TSLA: 'Tesla',
        AA: 'Alcoa',
    };

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('Connected to WebSocket');
            ws.send(symbol); // Send initial symbol to the server
            dispatch(setServerStatus('up'));
        };

        ws.onmessage = (event) => {
            console.log('Received');
            const stockData = JSON.parse(event.data);
            dispatch(setStock(stockData));

            if (stockData.status === 'fail') {
                ws.close();
            }
        };

        ws.onerror = () => {
            console.log('WebSocket error');
            dispatch(setServerStatus('down'));
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
            dispatch(setServerStatus('down'));
        };


        return () => {
            ws.close();
        };
    }, [symbol, dispatch]);

    if(serverStatus === 'down') {
        return <div className='cmp-stockTable__loading'>Server Not Running Referesh Aftter Some Time</div>;
    }

    if (stock.status === 'fail') {
        return <div className='cmp-stockTable__errorMessage'>Error: {stock.message}</div>;
    }

    if (!stock.data.timeSeries || stock.data.timeSeries.length === 0) {
        return <div className='cmp-stockTable__loading'>Loading...</div>;
    }

    return (
        <div className='cmp-stockcontainer'>
            <h2>
                Latest Stock Data for <span className="cmp-stockcontainer__symbol">{symbolMapping[symbol]}-{stock.data.symbol}</span> with <span className="cmp-stockcontainer__timeinterval">{stock.data.metaData.interval}</span> interval
            </h2>
            <div className='cmp-stockcontainer__metadata'>
                <p><strong>Currency:</strong> {stock.data.metaData.currency}</p>
                <p><strong>Exchange Timezone:</strong> {stock.data.metaData.exchange_timezone}</p>
                <p><strong>Exchange:</strong> {stock.data.metaData.exchange}</p>
                <p><strong>MIC Code:</strong> {stock.data.metaData.mic_code}</p>
                <p><strong>Type:</strong> {stock.data.metaData.type}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>DateTime</th>
                        <th>Open</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Close</th>
                        <th>Volume</th>
                    </tr>
                </thead>
                <tbody>
                    {stock.data.timeSeries.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.datetime}</td>
                            <td>{entry.open}</td>
                            <td>{entry.high}</td>
                            <td>{entry.low}</td>
                            <td>{entry.close}</td>
                            <td>{entry.volume}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={() => dispatch(setIsModalOpen(true))} className='cmp-stockTable__button' disabled={serverStatus === 'down'}>Change Stock</button>

            {serverStatus === 'down' && <div className='cmp-stockTable__warningMessage'>Warning: Server is down, unable to fetch new data refersh page after some time.</div>}

            <Modal isOpen={isModalOpen} onClose={() => dispatch(setIsModalOpen(false))}>
                <h2>Change Stock Symbol</h2>
                <select ref={selectRef}>
                    <option value="GOOG">GOOG</option>
                    <option value="AAPL">AAPL</option>
                    <option value="IBM">IBM</option>
                    <option value="TSLA">TSLA</option>
                    <option value="AA">AA</option>
                </select>
                <button onClick={() => {
                    dispatch(setSymbol(selectRef.current.value));
                    dispatch(setIsModalOpen(false));
                }}>Submit</button>
            </Modal>
        </div>
    );
}

export default StockTable;