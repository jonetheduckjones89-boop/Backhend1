"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_config_1 = require("../config/multer.config");
const upload_controller_1 = require("../controllers/upload.controller");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = (0, express_1.Router)();
/**
 * POST /api/upload
 * Upload and analyze document
 */
router.post('/', multer_config_1.upload.single('file'), validation_middleware_1.validateFile, upload_controller_1.uploadController.uploadAndAnalyze);
exports.default = router;
