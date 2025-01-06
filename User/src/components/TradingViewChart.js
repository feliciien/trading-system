import { Tune } from '@mui/icons-material';
import React, { useEffect, useRef } from 'react';

const TradingViewWidget = ({ selectedSymbol = 'EURUSD', setSelectedSymbol }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!selectedSymbol) {
      console.warn('TradingViewWidget: selectedSymbol is required');
      return;
    }

    if (containerRef.current) {
      const containerId = `tradingview_${Math.random().toString(36).substring(7)}`;
      containerRef.current.id = containerId;

      const widget = new window.TradingView.widget({
        symbol: selectedSymbol.toUpperCase(),
        autosize: true,
        interval: '1',
        timezone: 'America/Argentina/Buenos_Aires',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: false,
        withdateranges: true,
        container_id: containerId,
        height: '100%',
        width: '100%'
      });

      // Use setTimeout to ensure the widget is loaded before interaction
      setTimeout(() => {
        if (widget.chart) {
          widget
            .chart()
            .onSymbolChanged()
            .subscribe(null, (newSymbol) => {
              if (newSymbol && setSelectedSymbol) {
                setSelectedSymbol(newSymbol.toUpperCase());
              }
            });

          widget
            .chart()
            .createPositionLine()
            .onModify(function () {
              this.setText('Position Modified');
            })
            .onReverse('Position Reversed', function (text) {
              this.setText(text);
            })
            .onClose('Position Closed', function (text) {
              this.setText(text);
            });
        }
      }, 1000);

      return () => {
        if (widget && typeof widget.remove === 'function') {
          widget.remove();
        }
      };
    }
  }, [selectedSymbol, setSelectedSymbol]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        height: '100%',
        width: '100%',
        minHeight: '500px'
      }}
    />
  );
};

export default TradingViewWidget;
