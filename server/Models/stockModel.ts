import mongoose from "mongoose";

const metaDataSchema = new mongoose.Schema({
    interval: String,
    currency: String,
    exchange_timezone: String,
    exchange: String,
    mic_code: String,
    type: String
}, { _id: false });

const timeSeriesSchema = new mongoose.Schema({
    datetime: String,
    open: String,
    high: String,
    low: String,
    close: String,
    volume: String
});

const stockSchema = new mongoose.Schema({
    symbol: String,
    metaData: metaDataSchema,
    timeSeries: [timeSeriesSchema]
});

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;