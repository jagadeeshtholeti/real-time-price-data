"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../config.env' });
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const node_cron_1 = __importDefault(require("node-cron"));
const db_config_1 = __importDefault(require("./db.config"));
const ws_1 = __importStar(require("ws"));
const app_1 = __importDefault(require("./app"));
const fetchData_1 = __importDefault(require("./fetchData"));
const stockModel_1 = __importDefault(require("./Models/stockModel"));
(0, db_config_1.default)(); //db connection
app_1.default.use((0, cors_1.default)());
const server = http_1.default.createServer(app_1.default); // creates an HTTP server and uses the Express app to handle incoming HTTP requests
node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Running data fetch job...');
        yield (0, fetchData_1.default)();
    }
    catch (err) {
        console.log(err);
    }
}));
const wss = new ws_1.WebSocketServer({ server }); // Creates a WebSocket server that listens for WebSocket connections on the same HTTP server.
wss.on('connection', (ws) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Client connected to WebSocket');
    ws.on('message', (symbol) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Received symbol: ${symbol}`);
        try {
            // Send initial data when client sends a symbol
            yield sendStockData(ws, symbol);
            // Set up interval to send updates every minute (adjust interval as needed)
            const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
                yield sendStockData(ws, symbol);
            }), 60000);
            ws.on('close', () => {
                console.log('Client disconnected from WebSocket');
                clearInterval(interval); // Clear interval when client disconnects
            });
        }
        catch (err) {
            console.error('Error handling client message:', err);
        }
    }));
    ws.on('close', () => {
        console.log('Client disconnected from WebSocket');
    });
}));
// Function to send stock data to a specific WebSocket client
const sendStockData = (ws, symbol) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('fetch called');
    try {
        if (ws.readyState !== ws_1.default.OPEN) {
            console.log('WebSocket connection is not open');
            return;
        }
        const stocks = yield stockModel_1.default.find({ symbol }).sort({ _id: -1 }).limit(1);
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
    }
    catch (err) {
        console.error('Error sending stock data:', err);
    }
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`server started listening on port ${port}`);
});
