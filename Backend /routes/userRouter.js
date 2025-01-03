const express = require('express');
const router = express.Router();
const tradeControl = require("../control/tradeController")
const authControl = require("../control/authController");
const { authmiddleware } = require('../middleware/authmiddleware');
const adminControl = require('../control/adminController');

// Add debug logging
console.log('Loading route handlers:', {
    login: typeof authControl.login,
    createPosition: typeof tradeControl.createPosition,
    closePosition: typeof tradeControl.closePosition,
    getAllPosition: typeof tradeControl.getAllPosition,
    updatePosition: typeof tradeControl.updatePosition,
    getSymbols: typeof tradeControl.getSymbols,
    getTradingDatas: typeof tradeControl.getTradingDatas,
    getUserAPIs: typeof authControl.getUserAPIs,
    createUserOfCompany: typeof adminControl.createUserOfCompany
});

const app = express();

router.post("/login", authControl.login);

router.post("/createPosition", authmiddleware, tradeControl.createPosition);
router.post("/cancelPosition", authmiddleware, tradeControl.closePosition);
router.post("/getAllPositions", authmiddleware, tradeControl.getAllPosition);
router.post("/updatePosition", authmiddleware, tradeControl.updatePosition);
router.get("/getSymbols", authmiddleware, tradeControl.getSymbols);
router.get("/getTradingDatas", authmiddleware, tradeControl.getTradingDatas);
router.get('/getUserAPIs', authmiddleware, authControl.getUserAPIs);

router.post("/create-user", adminControl.createUserOfCompany);

module.exports = router;