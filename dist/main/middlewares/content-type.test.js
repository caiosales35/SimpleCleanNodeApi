"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../config/app"));
describe("Content-type middleware", () => {
    test("should return json content-type as default", () => __awaiter(void 0, void 0, void 0, function* () {
        app_1.default.get("/", (req, res) => {
            res.send("");
        });
        yield (0, supertest_1.default)(app_1.default).get("/").expect("content-type", /json/);
    }));
    test("should return xml content-type if forced", () => __awaiter(void 0, void 0, void 0, function* () {
        app_1.default.get("/xml", (req, res) => {
            res.type("xml");
            res.send("");
        });
        yield (0, supertest_1.default)(app_1.default).get("/xml").expect("content-type", /xml/);
    }));
});
