"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const metaDataSchema = new mongoose_1.default.Schema({
    interval: String,
    currency: String,
    exchange_timezone: String,
    exchange: String,
    mic_code: String,
    type: String
}, { _id: false });
const timeSeriesSchema = new mongoose_1.default.Schema({
    datetime: String,
    open: String,
    high: String,
    low: String,
    close: String,
    volume: String
});
const stockSchema = new mongoose_1.default.Schema({
    symbol: String,
    metaData: metaDataSchema,
    timeSeries: [timeSeriesSchema]
});
const Stock = mongoose_1.default.model('Stock', stockSchema);
exports.default = Stock;
