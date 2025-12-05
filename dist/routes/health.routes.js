"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_controller_1 = require("../controllers/health.controller");
const router = (0, express_1.Router)();
/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', health_controller_1.healthController.check);
exports.default = router;
