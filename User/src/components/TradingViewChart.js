import { Tune } from '@mui/icons-material';
import React, { useEffect, useRef } from 'react';

const TradingViewWidget = ({ selectedSymbol, setSelectedSymbol }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const widget = new window.TradingView.widget({
        symbol: selectedSymbol,
        autosize: true,
        interval: '1',
        timezone: 'America/Argentina/Buenos_Aires',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        // hide_legend: true,
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: false,
        withdateranges: true,
        container_id: containerRef.current.id
      });
      // widget.chart().createPriceLine({
      //   price: 80.0,
      //   color: 'green',
      //   lineWidth: 2,
      //   axisLabelVisible: true,
      //   title: 'P/L 500'
      // });
      // Use setTimeout to ensure the widget is loaded before interaction
      setTimeout(() => {
        console.log(widget);
        if (widget.chart) {
          widget
            .chart()
            .onSymbolChanged()
            .subscribe(null, (newSymbol) => {
              setSelectedSymbol(newSymbol);
            });
          widget
            .chart()
            .createPositionLine()
            .onModify(function () {
              this.setText('onModify called');
            })
            .onReverse('onReverse called', function (text) {
              this.setText(text);
            })
            .onClose('onClose called', function (text) {
              this.setText(text);
            })
            .setText('PROFIT: 71.1 (3.31%)')
            .setTooltip('Additional position information')
            .setProtectTooltip('Protect position')
            .setCloseTooltip('Close position')
            .setReverseTooltip('Reverse position')
            .setQuantity('8.235')
            .setPrice(160)
            .setExtendLeft(false)
            .setLineStyle(0)
            .setLineLength(25);
        }
      }, 1000); // Adjust timeout as needed
    }
  }, [selectedSymbol]);

  useEffect(() => {
    const chart = document.getElementById('tradingview_89893');
    if (containerRef.current && window.tvWidget) {
      window.tvWidget.setSymbol(selectedSymbol);
    }
  }, [selectedSymbol]);

  return (
    <div
      id="trading-view-chart-container"
      ref={containerRef}
      className="tradingview-widget-container"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default TradingViewWidget;
