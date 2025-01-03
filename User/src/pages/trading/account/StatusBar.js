import React, { useState, useEffect } from 'react';
import AccountStatus from '../../../components/AccountStatus';
import { Hidden } from '@mui/material';
const StatusBar = (props) => {
  const equityValue = Number(props.equity) || Number(props.balance) || 0;
  
  return (
    <div className="flex gap-4 bg-[#101013] px-4 py-2 rounded-lg">
      <AccountStatus
        title="Balance"
        value={Number(props.balance).toFixed(2)}
      />
      <AccountStatus
        title="Equity" 
        value={equityValue.toFixed(2)}
        loading={props.loading}
      />
      <AccountStatus
        title="Margin Used"
        value={Number(props.marginUsed).toFixed(2)}
      />
      <AccountStatus
        title="Margin Available"
        value={Number(props.marginAvailable).toFixed(2)} 
      />
    </div>
  );
};

export default StatusBar;
