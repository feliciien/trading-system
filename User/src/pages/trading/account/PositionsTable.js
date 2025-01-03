import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material";
import Paper from "@mui/material/Paper";
import WatchListItem from "../../../components/WatchListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&.MuiTableRow-root": {
    cursor: "pointer",
  },
  "&:hover": {
    backgroundColor: "black",
    opacity: 1,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    border: 0,
    color: "rgb(200,200,200)",
    fontSize: 14.5,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    border: 0,
    color: "rgb(200,200,200)",
    fontSize: 13.5,
  },
}));

const TableBuyCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: 0,
    color: "#54c88c",
    fontSize: 13.5,
  },
}));

const TableSellCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: 0,
    color: "#ff6f6f",
    fontSize: 10.5,
  },
}));

const PositionsTable = (props) => {
  let totalProfit = 0;
  React.useEffect(() => {
    for (const row of props.positionData) {
      // Parsing all necessary values as floats
      const startPrice = parseFloat(row.startPrice) || 0;
      const size = parseFloat(row.size) || 0;
      const leverage = parseFloat(row.leverage) || 1; // Assuming 1 as a default leverage if not specified
      const commission = parseFloat(row.commission) || 0;
      const symbolIndex = props.symbols.findIndex(
        (symbol) => symbol.code === row.symbolName
      );
      const pipSize =
        symbolIndex !== -1
          ? parseFloat(props.symbols[symbolIndex].pip_size) || 0.0001
          : 0.0001; // Default pipSize if not found

      if (symbolIndex !== -1) {
        const currentPrice =
          row.type !== "Sell"
            ? parseFloat(props.bids[symbolIndex]) || 0
            : parseFloat(props.asks[symbolIndex]) || 0;

        const profit =
          ((row.type !== "Sell"
            ? startPrice - currentPrice
            : currentPrice - startPrice) /
            pipSize) *
            size *
            leverage *
            -1 -
          commission;

        totalProfit += profit;
      }
    }
    props.setEquity(totalProfit);
  });

  return (
    <TableContainer sx={{ fontWeight: 600 }}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Instrument</StyledTableCell>
            <StyledTableCell>Position ID</StyledTableCell>
            <StyledTableCell>Time</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Size</StyledTableCell>
            <StyledTableCell>Start Price</StyledTableCell>
            <StyledTableCell>Stop Loss</StyledTableCell>
            <StyledTableCell>Take Profit</StyledTableCell>
            <StyledTableCell>Current Price</StyledTableCell>
            <StyledTableCell>Commission</StyledTableCell>
            <StyledTableCell>Profit</StyledTableCell>
            <StyledTableCell>Final Profit</StyledTableCell>
            <StyledTableCell>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.positionData.map((row, index) => (
            <StyledTableRow
              key={row.positionID || index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                <WatchListItem
                  fromCurrency={row.symbolName.slice(0, 3)}
                  toCurrency={row.symbolName.slice(3, 6)}
                />
              </StyledTableCell>
              <StyledTableCell>{row.id}</StyledTableCell>
              <StyledTableCell>{row.createdAt}</StyledTableCell>
              <TableBuyCell
                style={{ color: row.type === "Sell" ? "#ff6f6f" : "#54c88c" }}
              >
                {row.type}
              </TableBuyCell>
              <StyledTableCell>{row.size}</StyledTableCell>
              <StyledTableCell>{row.startPrice}</StyledTableCell>
              <StyledTableCell>{row.stopLoss}</StyledTableCell>
              <StyledTableCell>{row.takeProfit}</StyledTableCell>
              <StyledTableCell>
                {isNaN(
                  row.type !== "Sell"
                    ? props.bids[
                        props.symbols
                          .map((item) => item.code)
                          .indexOf(row.symbolName)
                      ]
                    : props.asks[
                        props.symbols
                          .map((item) => item.code)
                          .indexOf(row.symbolName)
                      ]
                )
                  ? 0.0
                  : row.type !== "Sell"
                  ? props.bids[
                      props.symbols
                        .map((item) => item.code)
                        .indexOf(row.symbolName)
                    ]
                  : props.asks[
                      props.symbols
                        .map((item) => item.code)
                        .indexOf(row.symbolName)
                    ]}
              </StyledTableCell>
              <StyledTableCell>{row.commission}</StyledTableCell>
              <StyledTableCell>
                <p
                  className={
                    (row.type !== "Sell"
                      ? row.startPrice -
                        props.bids[
                          props.symbols
                            .map((item) => item.code)
                            .indexOf(row.symbolName)
                        ]
                      : props.asks[
                          props.symbols
                            .map((item) => item.code)
                            .indexOf(row.symbolName)
                        ] - row.startPrice) *
                      row.size *
                      row.leverage *
                      -1 >
                    0
                      ? "text-[#28A745]" // Green color for positive values
                      : "text-[#FB3746]" // Red color for negative values
                  }
                >
                  {isNaN(
                    ((row.type !== "Sell"
                      ? row.startPrice -
                        props.bids[
                          props.symbols
                            .map((item) => item.code)
                            .indexOf(row.symbolName)
                        ]
                      : props.asks[
                          props.symbols
                            .map((item) => item.code)
                            .indexOf(row.symbolName)
                        ] - row.startPrice) /
                      props.symbols.filter(
                        (symbol) => symbol.code === row.symbolName
                      )[0].pip_size) *
                      row.size *
                      row.leverage *
                      -1
                  )
                    ? 0.0
                    : (
                        ((row.type !== "Sell"
                          ? row.startPrice -
                            props.bids[
                              props.symbols
                                .map((item) => item.code)
                                .indexOf(row.symbolName)
                            ]
                          : props.asks[
                              props.symbols
                                .map((item) => item.code)
                                .indexOf(row.symbolName)
                            ] - row.startPrice) /
                          props.symbols.filter(
                            (symbol) => symbol.code === row.symbolName
                          )[0].pip_size) *
                        row.size *
                        row.leverage *
                        -1
                      ).toFixed(2)}
                </p>
              </StyledTableCell>

              <StyledTableCell>
                <p
                  className={
                    (row.type !== "Sell"
                      ? row.startPrice -
                        props.bids[
                          props.symbols
                            .map((item) => item.code)
                            .indexOf(row.symbolName)
                        ]
                      : props.asks[
                          props.symbols
                            .map((item) => item.code)
                            .indexOf(row.symbolName)
                        ] - row.startPrice) *
                      row.size *
                      row.leverage *
                      -1 -
                      row.commission >
                    0
                      ? "text-[#28A745]" // Green color for positive values
                      : "text-[#FB3746]" // Red color for negative values
                  }
                >
                  {isNaN(
                    ((row.type !== "Sell"
                      ? row.startPrice -
                        props.bids[
                          props.symbols
                            .map((item) => item.code)
                            .indexOf(row.symbolName)
                        ]
                      : props.asks[
                          props.symbols
                            .map((item) => item.code)
                            .indexOf(row.symbolName)
                        ] - row.startPrice) /
                      props.symbols.filter(
                        (symbol) => symbol.code === row.symbolName
                      )[0].pip_size) *
                      row.size *
                      row.leverage *
                      -1 -
                      row.commission
                  )
                    ? 0.0
                    : (
                        ((row.type !== "Sell"
                          ? row.startPrice -
                            props.bids[
                              props.symbols
                                .map((item) => item.code)
                                .indexOf(row.symbolName)
                            ]
                          : props.asks[
                              props.symbols
                                .map((item) => item.code)
                                .indexOf(row.symbolName)
                            ] - row.startPrice) /
                          props.symbols.filter(
                            (symbol) => symbol.code === row.symbolName
                          )[0].pip_size) *
                          row.size *
                          row.leverage *
                          -1 -
                        row.commission
                      ).toFixed(2)}
                </p>
              </StyledTableCell>
              <StyledTableCell className="space-x-5">
                <button
                  onClick={() => {
                    props.handleCancel(row.id);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <button
                  onClick={() => {
                    props.handleUpdate(row.id);
                  }}
                >
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

PositionsTable.propTypes = {
  positionData: PropTypes.array.isRequired,
  symbols: PropTypes.array.isRequired,
  bids: PropTypes.array.isRequired,
  asks: PropTypes.array.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
};

export default PositionsTable;
