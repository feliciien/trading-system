-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: trading
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `apis`
--

DROP TABLE IF EXISTS `apis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) DEFAULT '1',
  `api` varchar(255) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apis`
--

LOCK TABLES `apis` WRITE;
/*!40000 ALTER TABLE `apis` DISABLE KEYS */;
INSERT INTO `apis` VALUES (1,0,'','2024-11-28 20:40:33','2024-11-28 20:40:46');
/*!40000 ALTER TABLE `apis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `pip_size` double(20,6) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (1,'Forex',0.000100,'2024-12-15 22:12:14','2024-12-15 22:12:14'),(2,'Indices',0.000100,'2024-12-15 22:12:14','2024-12-15 22:12:14'),(3,'Crypto',0.000100,'2024-12-15 22:12:14','2024-12-15 22:12:14'),(4,'Futures',0.000100,'2024-12-15 22:12:14','2024-12-15 22:12:14');
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commission`
--

DROP TABLE IF EXISTS `commission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `companyEmail` varchar(255) NOT NULL,
  `Forex` double(20,6) NOT NULL,
  `Indices` double(20,6) NOT NULL,
  `Crypto` double(20,6) NOT NULL,
  `Futures` double(20,6) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commission`
--

LOCK TABLES `commission` WRITE;
/*!40000 ALTER TABLE `commission` DISABLE KEYS */;
INSERT INTO `commission` VALUES (1,'admin@gmail.com',0.030000,0.000000,0.030000,0.030000,'2024-11-21 20:58:13','2024-11-21 20:58:13'),(2,'AdminSystems@NowTradeFunded.com',0.030000,0.000000,0.030000,0.030000,'2024-11-21 20:58:14','2024-11-21 20:58:14');
/*!40000 ALTER TABLE `commission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `role` enum('Admin','Company') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (1,'admin@gmail.com','$2b$10$KHGjPLO7nZw4NFyF4iR2weO52u8Dpd0SY.ipDcqJQLZk6jP7Ltipq','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGFzc3dvcmQiOiIkMmIkMTAkS0hHalBMTzduWnc0TkZ5RjRpUjJ3ZU81MnU4RHBkMFNZLmlwRGNxSlFMWms2alA3THRpcHEiLCJpYXQiOjE3MzQ0NzM0MDEsImV4cCI6MTczNDQ3NzAwMX0.5C6YqD43qhp8-lfol-ujUqzaTWAZOD-XmKqOXZuMivs','Admin','2024-11-21 20:58:11','2024-12-18 01:10:01');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_user`
--

DROP TABLE IF EXISTS `company_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `api_key` varchar(255) DEFAULT NULL,
  `end_point` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_user`
--

LOCK TABLES `company_user` WRITE;
/*!40000 ALTER TABLE `company_user` DISABLE KEYS */;
INSERT INTO `company_user` VALUES (1,'admin@gmail.com','My Company','google.com',NULL,NULL,'2024-11-21 20:54:31','2024-11-21 20:54:31'),(3,'20enttv@gmail.com','Avery Evans','Maat University','8fb95c5814ad9aaa4c63550dd9b16064185f9ea6650dabb15b1fe49db0c119b6','google.com','2024-11-28 20:38:37','2024-11-28 20:38:37'),(4,'sarfaraz@gmail.com','Sarfaraz Tech','sarfaraztech.com','6516473d02d9301348d3625ae5aada93575bfcea847a0595a1839f0b04c2d174','google.com','2024-12-17 14:54:04','2024-12-17 14:54:04');
/*!40000 ALTER TABLE `company_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formula`
--

DROP TABLE IF EXISTS `formula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formula` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `formula` varchar(255) NOT NULL,
  `pip_size` double(20,6) NOT NULL,
  `assetId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `assetId` (`assetId`),
  CONSTRAINT `formula_ibfk_1` FOREIGN KEY (`assetId`) REFERENCES `assets` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formula`
--

LOCK TABLES `formula` WRITE;
/*!40000 ALTER TABLE `formula` DISABLE KEYS */;
INSERT INTO `formula` VALUES (1,'Any pair/USD','1',0.000100,1,'2024-12-16 00:04:59','2024-12-16 00:04:59'),(2,'USD/any pair','2',0.000100,1,'2024-12-16 00:04:59','2024-12-16 00:04:59'),(3,'USD/JPY','3',0.010000,1,'2024-12-16 00:04:59','2024-12-16 00:04:59'),(4,'JPY/Any pair converted to USD','4',0.010000,1,'2024-12-16 00:04:59','2024-12-16 00:04:59'),(5,'Any/Any converted to USD','5',0.000100,2,'2024-12-16 00:04:59','2024-12-16 00:04:59'),(6,'Indices','6',0.100000,2,'2024-12-16 00:04:59','2024-12-16 00:04:59'),(7,'Crypto/USD','7',0.010000,3,'2024-12-16 00:04:59','2024-12-16 00:04:59'),(8,'Crypto/Crypto converted to USD','8',0.010000,3,'2024-12-16 00:04:59','2024-12-16 00:04:59'),(9,'Metals to USD','9',0.010000,4,'2024-12-16 00:04:59','2024-12-16 00:04:59');
/*!40000 ALTER TABLE `formula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leverage`
--

DROP TABLE IF EXISTS `leverage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leverage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `companyEmail` varchar(255) NOT NULL,
  `Forex` int NOT NULL,
  `Indices` int NOT NULL,
  `Crypto` int NOT NULL,
  `Futures` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leverage`
--

LOCK TABLES `leverage` WRITE;
/*!40000 ALTER TABLE `leverage` DISABLE KEYS */;
INSERT INTO `leverage` VALUES (1,'admin@gmail.com',1,1,1,1,'2024-11-21 20:58:14','2024-11-21 20:58:14'),(2,'AdminSystems@NowTradeFunded.com',1,1,1,1,'2024-11-21 20:58:14','2024-11-21 20:58:14');
/*!40000 ALTER TABLE `leverage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `positions`
--

DROP TABLE IF EXISTS `positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `positions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `type` enum('Sell','Buy') NOT NULL,
  `size` double(20,6) NOT NULL DEFAULT '0.000000',
  `symbolName` varchar(255) NOT NULL,
  `status` enum('Open','Close') NOT NULL,
  `startPrice` double(20,6) NOT NULL DEFAULT '1.000000',
  `stopPrice` double(20,6) DEFAULT NULL,
  `stopLoss` double(20,6) DEFAULT '0.000000',
  `takeProfit` double(20,6) DEFAULT '0.000000',
  `commission` double(20,6) NOT NULL,
  `leverage` int NOT NULL,
  `realProfit` double(20,6) DEFAULT NULL,
  `closeReason` enum('TakeProfit','StopLoss','UserClose','None') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `positions`
--

LOCK TABLES `positions` WRITE;
/*!40000 ALTER TABLE `positions` DISABLE KEYS */;
INSERT INTO `positions` VALUES (1,1,'Sell',0.030000,'EURUSD','Open',1.048100,NULL,1.058100,1.038100,0.090000,1,NULL,NULL,'2024-12-17 23:25:55','2024-12-18 01:07:03'),(2,1,'Buy',0.010000,'EURUSD','Close',1.047980,1.047780,1.047780,1.048980,0.030000,1,-0.050000,'StopLoss','2024-12-17 23:28:59','2024-12-18 01:02:44'),(3,1,'Sell',0.020000,'EURUSD','Open',1.048140,NULL,1.078140,1.038140,0.060000,1,NULL,NULL,'2024-12-17 23:29:07','2024-12-18 01:09:31'),(4,7,'Sell',0.010000,'SPX500','Open',4779.987310,NULL,5779.048980,4778.048990,0.000000,1,NULL,NULL,'2024-12-17 23:38:12','2024-12-18 00:50:59'),(5,1,'Sell',0.010000,'GBPUSD','Close',1.259410,1.259110,1.259510,1.259110,0.030000,1,0.000000,'TakeProfit','2024-12-18 01:13:40','2024-12-18 01:14:15');
/*!40000 ALTER TABLE `positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `symbol`
--

DROP TABLE IF EXISTS `symbol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `symbol` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `assetName` enum('Forex','Indices','Crypto','Futures') NOT NULL,
  `formulaName` enum('Any pair/USD','USD/any pair','USD/JPY','JPY/Any pair converted to USD','Any/Any converted to USD','Indices','Crypto/USD','Crypto/Crypto converted to USD','Metals to USD') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `symbol`
--

LOCK TABLES `symbol` WRITE;
/*!40000 ALTER TABLE `symbol` DISABLE KEYS */;
INSERT INTO `symbol` VALUES (1,'EUR to USD','FX:EURUSD','EURUSD','Forex','Any pair/USD','2024-12-15 23:48:27','2024-12-15 23:48:27'),(3,'GBP to USD','FX:GBPUSD','GBPUSD','Forex','Any pair/USD','2024-12-17 13:57:27','2024-12-17 13:57:27'),(4,'USD to CHF','FX:USDCHF','USDCHF','Forex','USD/any pair','2024-12-17 14:00:00','2024-12-17 14:00:00'),(5,'AUD to USD','FX:AUDUSD','AUDUSD','Forex','Any pair/USD','2024-12-17 14:00:41','2024-12-17 14:00:41'),(6,'USD to CAD','FX:USDCAD','USDCAD','Forex','USD/any pair','2024-12-17 14:01:12','2024-12-17 14:01:12'),(7,'US30','BLACKBULL:US30','US30','Indices','Indices','2024-12-17 14:01:57','2024-12-17 14:01:57'),(8,'SPX500','BLACKBULL:SPX500','SPX500','Indices','Indices','2024-12-17 14:02:24','2024-12-17 14:02:24'),(9,'GER30','BLACKBULL:GER30','GER30','Indices','Indices','2024-12-17 14:02:53','2024-12-17 14:02:53'),(10,'BTC to USD','CRYPTO:BTCUSD','BTCUSD','Crypto','Crypto/USD','2024-12-17 14:03:29','2024-12-17 14:03:29'),(11,'ETH to USD','CRYPTO:ETHUSD','ETHUSD','Crypto','Crypto/USD','2024-12-17 14:04:24','2024-12-17 14:04:24'),(12,'USDT to USD','CRYPTO:USDTUSD','USDTUSD','Crypto','Crypto/USD','2024-12-17 14:05:08','2024-12-17 14:05:08'),(13,'Gold','OANDA:XAUUSD','XAUUSD','Futures','Metals to USD','2024-12-17 14:05:42','2024-12-17 14:05:42'),(14,'Silver','OANDA:XAGUSD','XAGUSD','Futures','Metals to USD','2024-12-17 14:06:12','2024-12-17 14:06:12'),(15,'Gas','SKILLING:NATGAS','NATGAS','Futures','Metals to USD','2024-12-17 14:06:44','2024-12-17 14:06:44'),(16,'Oil','EASYMARKETS:OILUSD','OIL','Futures','Metals to USD','2024-12-17 14:07:16','2024-12-17 14:07:16');
/*!40000 ALTER TABLE `symbol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `companyEmail` varchar(255) DEFAULT 'admin@gmail.com',
  `password` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `balance` double(20,2) DEFAULT '10000.00',
  `equity` double(20,2) DEFAULT '10000.00',
  `usedMargin` double(20,2) DEFAULT '0.00',
  `allow` enum('Allow','Block') DEFAULT NULL,
  `totalProfit` varchar(255) DEFAULT '0',
  `plan` varchar(255) DEFAULT NULL,
  `drawdown` varchar(255) DEFAULT NULL,
  `leverage` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'Admin','test@gmail.com','admin@gmail.com','$2b$10$OfVFBUC4IAhMseK734jCSOy0N7R5BteoEZYR1oakW19RReKpK8lMK','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzM0NDY2MjkwLCJleHAiOjE3MzQ1NTI2OTB9.k4ksmlmESjWALmHcM7l91rkTVw0T-O2oSRAISb2pUAc',9999.38,10000.00,0.00,'Allow','0',NULL,NULL,NULL,'Demo','2024-11-21 20:58:09','2024-12-18 01:14:15'),(2,NULL,'Admin','test@gmail.com','admin@gmail.com','$2b$10$OfVFBUC4IAhMseK734jCSOy0N7R5BteoEZYR1oakW19RReKpK8lMK','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNoZWRQYXNzd29yZCI6IiQyYiQxMCRPZlZGQlVDNElBaE1zZUs3MzRqQ1NPeTBON1I1QnRlb0VaWVIxb2FrVzE5UlJlS3BLOGxNSyIsInR5cGUiOiJMaXZlIiwiaWF0IjoxNzMyMjExODg5fQ.mVc4NBk2gh1WTnNM6OJ0DV4T9kUatjDrsDhGFYaPbkQ',10000.00,10000.00,0.00,'Allow','0',NULL,NULL,NULL,'Live','2024-11-21 20:58:09','2024-11-28 17:44:53'),(5,NULL,'Admin','admin@lasertrader.co','admin@lasertrader.co','$2b$10$D0o4BIrej7SMultfnHL3eOiywrJJ8WZ8j8BhoJrG0N9OrTSgNsuNa','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNoZWRQYXNzd29yZCI6IiQyYiQxMCREMG80QklyZWo3U011bHRmbkhMM2VPaXl3ckpKOFdaOGo4QmhvSnJHME45T3JUU2dOc3VOYSIsInR5cGUiOiJEZW1vIiwiaWF0IjoxNzMyMjI0NzU1fQ.McTVnMuaHOQhtS35Uf5xdclIJY3eDVmQNW2E6Pf2Mfw',10000.00,10000.00,0.00,'Allow','0.00',NULL,NULL,'100.00','Demo','2024-11-21 21:41:03','2024-11-21 21:41:03'),(6,1,'Admin','admin@lasertrader.co','admin@lasertrader.co','$2b$10$D0o4BIrej7SMultfnHL3eOiywrJJ8WZ8j8BhoJrG0N9OrTSgNsuNa','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNoZWRQYXNzd29yZCI6IiQyYiQxMCREMG80QklyZWo3U011bHRmbkhMM2VPaXl3ckpKOFdaOGo4QmhvSnJHME45T3JUU2dOc3VOYSIsInR5cGUiOiJMaXZlIiwiaWF0IjoxNzMyMjI0NzU1fQ.7rBj0rSARApI8dT3tzG_GKRYlzV_Ju-YM0FsPT8fdjM',10000.00,10000.00,0.00,'Allow','0.00',NULL,NULL,'100.00','Live','2024-11-21 21:41:03','2024-11-21 21:41:03'),(7,1,'Admin','sarfaraz@gmail.com','admin@gmail.com','$2b$10$4GQfzfmfOi2c4af/VfeSse70shVsjBfe0mlfHUNzcUEtomwmiK/4S','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzM0NDcwOTUzLCJleHAiOjE3MzQ1NTczNTN9.TZ06cAsDGKAQzNuxuitK8dE7UJX9viIyPw7pXlMLZBg',99999.58,10000.00,47.80,'Allow','0',NULL,NULL,'1','Live','2024-12-17 14:55:53','2024-12-18 00:29:13');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-18  4:31:31
