const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const compression = require('compression');
const i18n = require('i18n');
const config = require("./config/main");
const logger = require("./utils/logger");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter")
const loaders = require("./loaders");
const getRealtimeData = require("./getFetchData");
const {Symbols} = require("./models");
const global = require('./config/global');
const tradermadeMock = require('./mockApi/tradermadeSimulator');
const equityRoutes = require('./routes/equityRoutes');
const orderRouter = require('./routes/orderRouter');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const server = http.createServer(app);

const startServer = async () => {
    // Only mount simulator routes if useSimulator is true
    if (config.useSimulator) {
        app.use('/api/v1', tradermadeMock);
        logger("info", "Server", "TraderMade simulator initialized");
    }

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    }));
    app.use(bodyParser.json({ limit: "10mb" }));
    app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
    app.use(compression());

    i18n.configure({
        locales: ["en"],
        directory: path.join(__dirname, "lang")
    });
    app.use(i18n.init);

    // Request logging middleware
    app.use((req, res, next) => {
        if (!req.url.startsWith('/static') && !req.url.includes('/health')) {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`, {
                body: req.body,
                headers: req.headers
            });
        }
        next();
    });

    // Mount routes
    app.use("/api", userRouter);
    app.use("/admin", adminRouter);
    app.use('/api', equityRoutes);
    app.use('/api/orders', orderRouter);
    await loaders({ app });

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        if (err.code === 'EBADCSRFTOKEN') {
            res.status(403).send('CSRF Attack Detected');
        } else if (err instanceof SyntaxError) {
            res.status(400).send("JSON_ERROR");
        } else {
            next(err);
        }
    });

    app.use((err, req, res, next) => {
        console.error('Server Error:', err);
        res.status(500).json({
            error: 'Internal Server Error',
            message: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    });

    // 404 handler - must be last
    app.use((req, res) => {
        console.log('404 Not Found:', {
            method: req.method,
            url: req.url,
            body: req.body,
            headers: req.headers
        });
        res.status(404).json({ detail: "Not Found" });
    });

    server.listen(config.port, () => {
        logger("info", "Server", `Server is started on ${config.port} port`);
        logger("info", "Server", `TraderMade simulator available at http://localhost:${config.port}/api/v1`);
    });

    const symbols = await Symbols.findAll({attributes: ['code']});
    global.symbols = symbols.map(item => item.code);
    getRealtimeData(symbols);
}

startServer();
