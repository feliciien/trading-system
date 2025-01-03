import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import StatusBar from "./StatusBar";
import PositionsTable from "./PositionsTable";
import RealPositionsTable from "./RealPositionsTable";
import axiosInstance from "../../../utils/axios";
import { Modal } from "@mui/material";
import global, { symbols } from "../../../utils/global";
import {
  fetchAPIs,
  fetchRealTimeData,
  fetchTradingDatas,
} from "../../../utils/api";
import "./DropdownMenu.css";
import { useEquity } from "../../../hooks/useEquity";
import { useMargin } from "../../../hooks/useMargin";
import { usePnL } from "../../../hooks/usePnL";
import { useStopLoss } from "../../../hooks/useStopLoss";
import { toast } from "react-hot-toast";
import debounce from "lodash/debounce";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const AntTabs = styled(Tabs)({
  borderBottom: "1px solid #1b1b1f",
  "& .MuiTabs-indicator": {
    backgroundColor: "white",
    height: "1px",
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },
    fontWeight: theme.typography.fontWeightMedium,
    marginRight: theme.spacing(1),
    fontSize: "12px",
    color: "#89898b",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      color: "white",
      opacity: 1,
    },
    "&.Mui-selected": {
      color: "white",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#101013",
    },
  })
);

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

class TradingErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Trading page error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: "red" }}>
          <h2>Something went wrong loading the trading page.</h2>
          <pre>{this.state.error?.toString()}</pre>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AccountManagement(props) {
  const [value, setValue] = React.useState(0);
  const [commissions, setCommissions] = React.useState(1);

  const [openPositionsData, setOpenPositionsData] = React.useState([]);
  const [realPositionsData, setRealPositionsData] = React.useState([]);

  const [updateModalVisible, setUpdateModalVisible] = React.useState(false);
  const [updateID, setUpdateID] = React.useState(0);

  const { updateStopLoss, position } = useStopLoss(
    openPositionsData.find((position) => position.id === updateID),
    props.bid
  );

  const [updateProfit, setUpdateProfit] = React.useState(0);
  const [updateLoss, setUpdateLoss] = React.useState(0);

  React.useEffect(() => {
    // setOpenPositionsData(props.openPositionsData)
    getAllPositions();
  }, [props]);

  const [profit, setProfit] = React.useState(0);
  const [marginUsed, setMarginUsed] = React.useState(0);
  const [marginAvailable, setMarginAvailable] = React.useState(0);
  const [equity, setEquity] = React.useState(10000);

  const positionInterval = React.useRef(null);

  const { equity: calculatedEquity, loading: equityLoading } = useEquity(
    props.balance,
    openPositionsData
  );
  const { usedMargin, availableMargin } = useMargin(
    openPositionsData,
    props.balance
  );
  // const { pnl, loading: pnlLoading } = usePnL(openPositionsData, { ...props.bid, ...props.ask });

  const [currentEquity, setCurrentEquity] = React.useState(0);
  const isProduction = window.location.hostname === "demo.lasertrader.co";
  const environment = isProduction ? "production" : "local";

  const [isLoading, setIsLoading] = React.useState(true);
  const [lastUpdateTime, setLastUpdateTime] = React.useState(null);

  const handleNaN = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      console.warn({
        event: "INVALID_VALUE_HANDLED",
        value,
        type: typeof value,
        timestamp: new Date().toISOString(),
      });
      return 0;
    }
    return Number(value);
  };

  const calculateEquity = (balance, positions, prices) => {
    console.log("calculateEquity inputs:", {
      balance,
      positionsCount: positions?.length,
      prices,
      timestamp: new Date().toISOString(),
    });

    try {
      if (!balance || !positions || !prices) {
        console.warn("Missing required data:", { balance, positions, prices });
        throw new Error("Missing required data for equity calculation");
      }

      const unrealizedPnL = positions.reduce((acc, pos) => {
        const currentPrice = prices[pos.symbolName];
        console.log("Position calculation:", {
          symbol: pos.symbolName,
          currentPrice,
          startPrice: pos.startPrice,
          size: pos.size,
          leverage: pos.leverage,
        });

        if (!currentPrice) {
          console.warn("Missing price for symbol:", pos.symbolName);
          return acc;
        }

        const pipSize = handleNaN(pos.pipSize) || 0.0001;
        const direction = pos.type === "Buy" ? 1 : -1;
        const priceDiff = (currentPrice - pos.startPrice) * direction;
        const positionPnL =
          (priceDiff / pipSize) * pos.size * pos.leverage - pos.commission;

        console.log("Position PnL calculation:", {
          priceDiff,
          pipSize,
          direction,
          positionPnL,
        });

        return acc + handleNaN(positionPnL);
      }, 0);

      const newEquity = handleNaN(balance) + handleNaN(unrealizedPnL);

      console.log("Final equity calculation:", {
        balance: handleNaN(balance),
        unrealizedPnL,
        newEquity,
      });

      return newEquity;
    } catch (error) {
      console.error("Equity calculation error:", error);
      return handleNaN(balance);
    }
  };

  const fetchMarketData = async (symbols) => {
    setIsLoading(true);
    try {
      const result = await fetchRealTimeData();
      setLastUpdateTime(new Date().toISOString());
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const POLL_INTERVAL = 5000;
  const MARKET_DATA_POLL_INTERVAL = 3000;

  React.useEffect(() => {
    let pollInterval;
    let isSubscribed = true;

    const fetchData = debounce(async () => {
      try {
        if (!isSubscribed) return;

        const Symbols_total = props.symbols?.map((item) => item.code) || [];

        if (Symbols_total.length === 0) {
          console.warn({
            message: "Market data polling skipped",
            reason: "No symbols available",
            timestamp: new Date().toISOString(),
          });
          return;
        }

        const realtimeData = await fetchMarketData(Symbols_total);

        if (realtimeData.symbols.length > 0 && isSubscribed) {
          realtimeData.symbols.forEach((quote, index) => {
            const symbolIndex = props.symbols.findIndex(
              (item) => item.code === quote
            );
            if (symbolIndex !== -1) {
              updateAsk(symbolIndex, realtimeData.asks[index]);
              updateBid(symbolIndex, realtimeData.bids[index]);
            }
          });
        }
      } catch (error) {
        console.error({
          message: "Polling cycle failed",
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    }, 1000);

    pollInterval = setInterval(fetchData, MARKET_DATA_POLL_INTERVAL);
    fetchData(); // Initial fetch

    return () => {
      isSubscribed = false;
      clearInterval(pollInterval);
    };
  }, [props.symbols]);

  const getAllPositions = () => {
    axiosInstance
      .post("/getAllPositions")
      .then((res) => {
        //console.log("Response data:", res.data);
        if (res.data.state) {
          if (res.data.state !== "Your balance is not enough") {
            props.setIsAuth(false);
            localStorage.removeItem("tradeToken");
            window.location.reload();
          }
          return;
        }
        // console.log("data : ", res.data);
        const { positions, realPositions, margin, balance } = res.data;
        setOpenPositionsData(positions);
        setRealPositionsData(realPositions);
        props.setBalance(handleNaN(balance));
        setMarginUsed(handleNaN(margin));
        setMarginAvailable(handleNaN(balance) - handleNaN(margin));
      })
      .catch((err) => {
        console.log("Axios Error with ", err);
        props.setIsAuth(false);
        localStorage.removeItem("tradeToken");
        window.location.reload();
      });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCancel = (id) => {
    axiosInstance
      .post("/cancelPosition", { id })
      .then((res) => {
        // console.log("data : ", res.data);
        const { positions, realPositions, margin, balance } = res.data;
        setOpenPositionsData(positions);
        setRealPositionsData(realPositions);
        props.setBalance(handleNaN(balance));
        setMarginUsed(handleNaN(margin));
        setMarginAvailable(handleNaN(balance) - handleNaN(margin));
      })
      .catch((err) => {
        console.log("Axios Error with ", err);
      });
  };

  const handleUpdate = (id, startPrice) => {
    setUpdateModalVisible(true);
    setUpdateID(id);
    setUpdateProfit(startPrice);
    setUpdateLoss(startPrice);
  };

  const handleModalClose = () => {
    setUpdateModalVisible(false);
  };

  const handleUpdateSave = async () => {
    const success = await updateStopLoss(updateID, updateProfit, updateLoss);
    if (success) {
      getAllPositions();
      setUpdateModalVisible(false);
    } else {
      toast.error("Failed to update stop loss");
    }
  };

  const updateBid = (index, newValue) => {
    props.setBid((prevBids) => {
      const newBids = [...prevBids];
      // newBids[index] = newValue;
      newBids[index] = isNaN(newValue) ? 0 : newValue;
      return newBids;
    });
  };

  const updateAsk = (index, newValue) => {
    props.setAsk((prevAsks) => {
      const newAsks = [...prevAsks];
      // newAsks[index] = newValue;
      newAsks[index] = isNaN(newValue) ? 0 : newValue;
      return newAsks;
    });
  };

  const logEquityUpdate = (environment, data) => {
    console.info({
      event: "EQUITY_UPDATE",
      environment: environment,
      currentEquity: data.equity,
      previousEquity: data.previousEquity,
      delta: data.equity - data.previousEquity,
      quoteCount: data.quotes?.length || 0,
      timestamp: new Date().toISOString(),
      host: window.location.hostname,
    });

    // Log detailed quote information in debug level
    if (data.quotes?.length > 0) {
      console.debug({
        event: "QUOTE_DETAILS",
        environment: environment,
        quotes: data.quotes.map((quote) => ({
          symbol: quote.symbol,
          bid: quote.bid,
          ask: quote.ask,
        })),
        timestamp: new Date().toISOString(),
      });
    }
  };

  const EquityDisplay = () => (
    <div>
      Equity:{" "}
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        `$${handleNaN(currentEquity).toFixed(2)}`
      )}
      {lastUpdateTime && (
        <small>
          Last updated: {new Date(lastUpdateTime).toLocaleTimeString()}
        </small>
      )}
    </div>
  );

  return (
    <TradingErrorBoundary>
      <>
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <StatusBar
            balance={props.balance}
            equity={calculatedEquity}
            profit={profit}
            marginUsed={usedMargin}
            marginAvailable={availableMargin}
            loading={equityLoading}
          />
        </div>
        <Box
          my={0}
          sx={{
            width: "100%",
            marginBottom: "0px",
            bgcolor: "#101013",
            height: "100%",
            borderRadius: "10px",
          }}
        >
          <div style={{ display: "flex" }}>
            <AntTabs
              value={value}
              onChange={handleChange}
              aria-label="ant example"
            >
              <AntTab label="Positions" />
              <AntTab label="Real Positions" />
            </AntTabs>
          </div>

          <CustomTabPanel value={value} index={0}>
            <PositionsTable
              positionData={openPositionsData}
              symbols={props.symbols}
              commissions={commissions}
              bids={props.bid}
              asks={props.ask}
              setEquity={setEquity}
              handleCancel={handleCancel}
              handleUpdate={handleUpdate}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <RealPositionsTable positionData={realPositionsData} />
          </CustomTabPanel>
        </Box>
        <Modal
          open={updateModalVisible}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              width: "20%",
              margin: "10% auto",
              bgcolor: "#dddddd",
              height: "200px",
              borderRadius: "10px",
              padding: "10px 0 0 0",
            }}
          >
            <TextField
              label="Take Profit"
              variant="standard"
              value={updateProfit}
              onChange={(e) => setUpdateProfit(e.target.value)}
              style={{ margin: "auto", display: "block", width: "60%" }}
            />
            <TextField
              label="Stop Loss"
              variant="standard"
              value={updateLoss}
              onChange={(e) => setUpdateLoss(e.target.value)}
              style={{ margin: "auto", display: "block", width: "60%" }}
            />
            <div style={{ margin: "15px auto", width: "60%" }}>
              <Button
                variant="outlined"
                onClick={handleUpdateSave}
                style={{ margin: "5px 10px" }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={handleModalClose}
                style={{ margin: "5px 10px" }}
              >
                Close
              </Button>
            </div>
          </Box>
        </Modal>
      </>
    </TradingErrorBoundary>
  );
}
