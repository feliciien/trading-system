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

const Trading = () => {
  const [isAuth, setIsAuth] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [symbols, setSymbols] = useState([]);
  const [bid, setBid] = useState([0, 0, 0, 0, 0, 0]);
  const [ask, setAsk] = useState([0, 0, 0, 0, 0, 0]);
  const [APIs, setAPIs] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = React.useState(10000);
  const [amount, setAmount] = React.useState('0.01');
  const [stopLoss, setStopLoss] = React.useState(0);
  const [takeProfit, setTakeProfit] = React.useState(0);
  const [marginUsed, setMarginUsed] = React.useState(0);
  const [marginAvailable, setMarginAvailable] = React.useState(0);
  const [openPositionsData, setOpenPositionsData] = React.useState([]);

  const user = useSelector((state) => state.auth.user);

  const [activeGroup, setActiveGroup] = React.useState(null);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const groupedSymbols = symbols.reduce((acc, value) => {
    const group = acc.find((g) => g.assetName === value.assetName);
    if (group) {
      group.symbols.push(value);
    } else {
      acc.push({ assetName: value.assetName, symbols: [value] });
    }
    return acc;
  }, []);
  const handleMouseEnter = () => {
    setMenuVisible(true);
  };

  const handleMouseLeave = () => {
    setMenuVisible(false);
    setActiveGroup(null); // Reset active group on leave
  };
  const handleNaN = (value) => {
    return isNaN(value) ? 0 : value;
  };
  const handleOption = (option) => {
    const data = {
      amount: amount,
      symbol: selectedSymbol,
      stopLoss: stopLoss,
      takeProfit: takeProfit,
      option: option,
      leverage: 1
    };
    console.log('data', data);
    axiosInstance
      .post('/createPosition', data)
      .then((res) => {
        if (res.data.state) {
          if (res.data.state != 'Your balance is not enough') {
            setIsAuth(false);
            localStorage.removeItem('tradeToken');
            window.location.reload();
          }
          return;
        }
        // console.log("data : ", res.data);
        const { positions, balance, margin } = res.data;
        console.log('Hello res', res);
        setOpenPositionsData(positions);
        setBalance(handleNaN(balance));
        setMarginUsed(handleNaN(margin));
        setMarginAvailable(handleNaN(balance) - handleNaN(margin));
      })
      .catch((err) => {
        console.log('Axios Error with ', err);
      });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const symbolsData = await fetchSymbols();
        console.log(symbolsData, 'SymbolData')
        if (symbolsData) {
          setSymbols(symbolsData);
        }

        const apisData = await fetchAPIs();
        if (apisData) {
          setAPIs(apisData);
        }

        const tradingData = await fetchTradingDatas();
        if (tradingData?.accounts) {
          setAccounts(tradingData.accounts);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [balance]);

  const handleAccountChange = (e) => {
    const selectedAccount = accounts.find(
      (account) => account.token === e.target.value
    );
    if (selectedAccount) {
      localStorage.setItem('tradeToken', selectedAccount.token);
    }
    setLoading(true);
    setTimeout(() => setLoading(false), 5000);
  };
  const getBidIndex = (symbol) => {
    const index = symbols.findIndex((sym) => sym.code === symbol);
    return index;
  };
  const calculateProfit = (entryPrice, exitPrice, quantity) => {
    return (exitPrice - entryPrice) * quantity;
  };

  const calculateLoss = (entryPrice, exitPrice, quantity) => {
    return (entryPrice - exitPrice) * quantity;
  };

  const calculateTicks = (entryPrice, exitPrice, tickSize) => {
    const priceChange = exitPrice - entryPrice;
    return priceChange / tickSize;
  };

  const [useSimulator, setUseSimulator] = useState(() => {
    const saved = localStorage.getItem('useSimulator');
    return saved === null ? true : JSON.parse(saved);  // Default to true if not set
  });

  useEffect(() => {
    localStorage.setItem('useSimulator', JSON.stringify(useSimulator));
    // Trigger API endpoint change when simulator toggle changes
    if (useSimulator) {
        console.log('Switching to simulator mode');
    } else {
        console.log('Switching to live mode');
    }
  }, [useSimulator]);

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
