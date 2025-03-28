import React, { useState, useEffect } from 'react';
import ReactCountryFlag from 'react-country-flag';
import './index.css';

const WatchListItem = ({ fromCurrency, toCurrency }) => {
  const getCountryCode = (currency) => {
    const currencyCountryMap = {
      AUD: 'AU',
      USD: 'US',
      EUR: 'EU',
      JPY: 'JP',
      GBP: 'GB',
      CAD: 'CA'
      // Add more mappings as needed
    };
    return currencyCountryMap[currency];
  };

  return (
    <div className="currency-display">
      <ReactCountryFlag
        countryCode={getCountryCode(fromCurrency)}
        svg
        style={{ width: '20px', height: '20px' }}
      />
      <span className="currency-code">
        {fromCurrency} to {toCurrency}
      </span>
      <ReactCountryFlag
        countryCode={getCountryCode(toCurrency)}
        svg
        style={{ width: '20px', height: '20px' }}
      />
    </div>
  );
};

export default WatchListItem;
