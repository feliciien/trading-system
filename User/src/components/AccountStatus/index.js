import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import './index.css';
const AccountStatus = (props) => {
  return (
    <div className="account-status-container">
      <Typography align="center" fontSize={'10px'} color={'#89898b'}>
        {props.title}
      </Typography>
      <Typography
        align="center"
        fontSize={'14px'}
        color={props.color || 'white'}
      >
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(props.value)}
      </Typography>
    </div>
  );
};

export default AccountStatus;
