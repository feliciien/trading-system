const verifyBalance = async (userId, expectedBalance) => {
    try {
      const response = await fetch('/api/account/verify-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, expectedBalance })
      });
      
      const data = await response.json();
      return data.isValid;
    } catch (error) {
      console.error('Balance verification failed:', error);
      return false;
    }
  };
  
  export const balanceService = {
    verifyBalance
  };