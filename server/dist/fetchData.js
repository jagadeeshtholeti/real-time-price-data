"use strict";
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
const axios_1 = __importDefault(require("axios"));
const stockModel_1 = __importDefault(require("./Models/stockModel"));
const apiUrl = 'https://api.twelvedata.com/time_series';
const apiKey = process.env.API_key;
const symbols = ['GOOG', 'IBM', 'AAPL', 'TSLA', 'AA'];
const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const responses = yield Promise.all(symbols.map(symbol => axios_1.default.get(apiUrl, {
            params: {
                symbol: symbol,
                interval: '1min',
                apikey: apiKey,
                format: 'JSON',
                outputsize: 20
            }
        })));
        const dataToStore = responses.map(response => ({
            symbol: response.data.meta.symbol,
            metaData: {
                interval: response.data.meta.interval,
                currency: response.data.meta.currency,
                exchange_timezone: response.data.meta.exchange_timezone,
                exchange: response.data.meta.exchange,
                mic_code: response.data.meta.mic_code,
                type: response.data.meta.type,
            },
            timeSeries: response.data.values.map((value) => ({
                datetime: value.datetime,
                open: value.open,
                high: value.high,
                low: value.low,
                close: value.close,
                volume: value.volume
            }))
        }));
        yield Promise.all(dataToStore.map((data) => __awaiter(void 0, void 0, void 0, function* () {
            yield stockModel_1.default.create(data);
            console.log(`Stored data for ${data.symbol}`);
        })));
        console.log('All data stored successfully.');
        return 'success';
    }
    catch (error) {
        console.error('Error fetching or storing data:', error);
        return error;
    }
});
exports.default = fetchData;
