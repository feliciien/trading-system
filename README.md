# Trading System

A full-stack trading platform with real-time market data and trading capabilities.

## Project Structure

- `/Backend` - Node.js backend server
- `/User` - React.js frontend application

## Technologies Used

### Backend
- Node.js
- Express.js
- MySQL
- WebSocket for real-time data

### Frontend
- React.js
- Redux for state management
- Material-UI for components
- TradingView charts

## Getting Started

### Prerequisites
- Node.js
- MySQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trading-system
```

2. Install Backend Dependencies:
```bash
cd Backend
npm install
```

3. Install Frontend Dependencies:
```bash
cd ../User
npm install
```

4. Set up environment variables:
Create a `.env` file in the Backend directory with the following:
```
PORT=8000
DB_TYPE=mysql
DB_HOST=localhost
DB_NAME=trading
DB_USER=root
DB_PORT=3306
DB_PASS=your_password
DB_LOGGING=false
```

5. Start the Backend:
```bash
cd Backend
npm start
```

6. Start the Frontend:
```bash
cd User
npm start
```

## Features

- Real-time market data
- Live trading capabilities
- Position management
- Account management
- TradingView charts integration

## License

This project is licensed under the MIT License.
