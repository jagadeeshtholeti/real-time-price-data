import axios from 'axios';
import Stock from './Models/stockModel';
import cron from 'node-cron';

const apiUrl = 'https://api.twelvedata.com/time_series';
const apiKey = process.env.API_key;
const symbols = ['GOOG', 'IBM', 'AAPL', 'TSLA', 'AA'];

interface Value {
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
}
const fetchData = async () => {
    try {
        const responses = await Promise.all(symbols.map(symbol =>
            axios.get(apiUrl, {
                params: {
                    symbol: symbol,
                    interval: '1min',
                    apikey: apiKey,
                    format: 'JSON',
                    outputsize: 20
                }
            })
        ));

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
            timeSeries: response.data.values.map((value: Value) => ({
                datetime: value.datetime,
                open: value.open,
                high: value.high,
                low: value.low,
                close: value.close,
                volume: value.volume
            }))
        }));

        await Promise.all(dataToStore.map(async (data) => {
            await Stock.create(data);
            console.log(`Stored data for ${data.symbol}`);
        }));

        console.log('All data stored successfully.');
        return 'success';

    } catch (error) {
        console.error('Error fetching or storing data:', error);
        return error;
    }
};

export default fetchData;
