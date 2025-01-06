import React, { useEffect, useState } from 'react';
import TradingViewChart from '../../components/TradingViewChart';
import WatchList from '../../components/WatchList';
import './index.css';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AccountManagement from './account/AccountManagement';
import { useSelector } from 'react-redux';
import Logout from '../../components/Auth/Logout';
import { fetchAPIs, fetchSymbols, fetchTradingDatas } from '../../utils/api';
import { CircularProgress } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import WatchListItem from '../../components/WatchListItem';
import StatusBar from './account/StatusBar';
import axiosInstance from '../../utils/axios';
import { FormControlLabel, Switch } from '@mui/material';
import TradingPage from './TradingPage';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    border: 0,
    color: '#89898b',
    fontSize: '10.5px'
  },
  [`&.${tableCellClasses.body}`]: {
    border: 0,
    color: '#89898b',
    fontSize: 10.5
  }
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#101013',
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: '10px'
}));

const defaultSymbols = ['EURUSD', 'USDJPY', 'GBPUSD', 'USDCHF', 'AUDUSD', 'USDCAD'];

const Trading = () => {
  const [isAuth, setIsAuth] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [symbols, setSymbols] = useState(defaultSymbols);
  const [bid, setBid] = useState([0, 0, 0, 0, 0, 0]);
  const [ask, setAsk] = useState([0, 0, 0, 0, 0, 0]);
  const [APIs, setAPIs] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useSimulator, setUseSimulator] = useState(false);
  const [balance, setBalance] = useState(10000);
  const [amount, setAmount] = useState(0.01);
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeGroup, setActiveGroup] = useState('Popular');
  const [openPositionsData, setOpenPositionsData] = useState([]);
  const [marginUsed, setMarginUsed] = useState(0);
  const [marginAvailable, setMarginAvailable] = useState(balance);

  // Group symbols by category
  const groupedSymbols = {
    Popular: ['EURUSD', 'USDJPY', 'GBPUSD', 'USDCHF', 'AUDUSD', 'USDCAD'],
    Forex: ['EURUSD', 'USDJPY', 'GBPUSD', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD', 'EURGBP', 'EURJPY'],
    Metals: ['XAUUSD', 'XAGUSD', 'XPTUSD', 'XPDUSD'],
    Crypto: ['BTCUSD', 'ETHUSD', 'LTCUSD', 'XRPUSD'],
    Indices: ['US30', 'SPX500', 'NAS100', 'UK100', 'GER30', 'JPN225']
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [symbolsData, apisData] = await Promise.all([
          fetchSymbols(),
          fetchAPIs()
        ]);
        
        if (symbolsData && symbolsData.length > 0) {
          setSymbols(symbolsData);
        }
        
        if (apisData) {
          setAPIs(apisData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAccountChange = (account) => {
    setBalance(account.balance);
    setMarginAvailable(account.balance - marginUsed);
  };

  const handleOption = (option) => {
    setAmount(option);
  };

  const getBidIndex = (symbol) => {
    return symbols.findIndex((s) => s === symbol);
  };

  const calculateProfit = (askPrice, bidPrice, quantity = 1) => {
    if (!askPrice || !bidPrice) return '0.00';
    const profit = (bidPrice - askPrice) * quantity * 100000;
    return Number(profit).toFixed(4);
  };

  const calculateLoss = (askPrice, bidPrice, quantity = 1) => {
    if (!askPrice || !bidPrice) return '0.00';
    const loss = (askPrice - bidPrice) * quantity * 100000;
    return Number(loss).toFixed(4);
  };

  const handleMouseEnter = () => {
    setMenuVisible(true);
  };

  const handleMouseLeave = () => {
    setMenuVisible(false);
  };

  return (
    <TradingPage
      setIsAuth={setIsAuth}
      setActiveGroup={setActiveGroup}
      loading={loading}
      useSimulator={useSimulator}
      setUseSimulator={setUseSimulator}
      handleAccountChange={handleAccountChange}
      accounts={accounts}
      selectedSymbol={selectedSymbol}
      setSelectedSymbol={setSelectedSymbol}
      isAuth={isAuth}
      symbols={symbols}
      bid={bid}
      ask={ask}
      setBid={setBid}
      setAsk={setAsk}
      balance={balance}
      setBalance={setBalance}
      amount={amount}
      setAmount={setAmount}
      handleOption={handleOption}
      getBidIndex={getBidIndex}
      calculateProfit={calculateProfit}
      calculateLoss={calculateLoss}
      menuVisible={menuVisible}
      setMenuVisible={setMenuVisible}
      handleMouseEnter={handleMouseEnter}
      handleMouseLeave={handleMouseLeave}
      groupedSymbols={groupedSymbols}
      activeGroup={activeGroup}
      APIs={APIs}
      openPositionsData={openPositionsData}
      marginUsed={marginUsed}
      marginAvailable={marginAvailable}
    />
  );
};

export default Trading;
