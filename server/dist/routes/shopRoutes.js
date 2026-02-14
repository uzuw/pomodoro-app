"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/shopRoutes.ts
const express_1 = __importDefault(require("express"));
const shopControllers_1 = require("../controllers/shopControllers");
const router = express_1.default.Router();
router.get("/", shopControllers_1.getAllItems);
router.get("/:id", shopControllers_1.getItemById);
router.post("/", shopControllers_1.createItem);
router.put("/:id", shopControllers_1.updateItem);
router.delete("/:id", shopControllers_1.deleteItem);
exports.default = router;
