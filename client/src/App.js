import './App.css';
import './components/StockTable.css';
import StockTable from './components/StockTable';
import Footer from './components/Footer';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element=<StockTable /> />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
