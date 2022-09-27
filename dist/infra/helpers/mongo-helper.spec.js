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
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_helper_1 = require("./mongo-helper");
describe("Mongo Helper", () => {
    test("Should reconnect when getDb is invoked and client is disconnected", () => __awaiter(void 0, void 0, void 0, function* () {
        const sut = new mongo_helper_1.MongoHelper();
        yield sut.connect(String(process.env.MONGO_URL));
        expect(sut.db).toBeTruthy();
        yield sut.disconnect();
        expect(sut.db).toBeFalsy();
        yield sut.getDb();
        expect(sut.db).toBeTruthy();
        yield sut.disconnect();
    }));
});
