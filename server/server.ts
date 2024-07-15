import dotenv from 'dotenv';
dotenv.config({ path: '../config.env' });

import http from 'http';
import cors from 'cors';
import cron from 'node-cron';
import connectDB from './db.config';
import WebSocket, { WebSocketServer } from 'ws';
import app from './app';
import fetchData from './fetchData';
import Stock from './Models/stockModel';

connectDB(); //db connection

app.use(cors());

const server = http.createServer(app); // creates an HTTP server and uses the Express app to handle incoming HTTP requests

cron.schedule('* * * * *', async () => {
    try {
        console.log('Running data fetch job...');
        await fetchData();
    } catch (err) {
        console.log(err);
    }
})

const wss = new WebSocketServer({ server }); // Creates a WebSocket server that listens for WebSocket connections on the same HTTP server.

wss.on('connection', async (ws: WebSocket) => {
    console.log('Client connected to WebSocket');

    ws.on('message', async (symbol: string) => {
        console.log(`Received symbol: ${symbol}`);
        try {
            // Send initial data when client sends a symbol
            await sendStockData(ws, symbol);

            // Set up interval to send updates every minute (adjust interval as needed)
            const interval = setInterval(async () => {
                await sendStockData(ws, symbol);
            }, 60000);

            ws.on('close', () => {
                console.log('Client disconnected from WebSocket');
                clearInterval(interval); // Clear interval when client disconnects
            });
        } catch (err) {
            console.error('Error handling client message:', err);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected from WebSocket');
    });
});

// Function to send stock data to a specific WebSocket client
const sendStockData = async (ws: WebSocket, symbol: string) => {
    console.log('fetch called');
    try {
        if (ws.readyState !== WebSocket.OPEN) {
            console.log('WebSocket connection is not open');
            return;
        }
        const stocks = await Stock.find({ symbol }).sort({ _id: -1 }).limit(1);
        const stock = stocks[0];
        if (!stock) {
            ws.send(JSON.stringify({ status: 'fail', message: 'Symbol not found' }));
            return;
        }

        const dataToSend = {
            status: 'success',
            data: {
                symbol: stock.symbol,
                metaData: stock.metaData,
                timeSeries: stock.timeSeries
            }
        };
        ws.send(JSON.stringify(dataToSend));
    } catch (err) {
        console.error('Error sending stock data:', err);
    }
};

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`server started listening on port ${port}`);
});
