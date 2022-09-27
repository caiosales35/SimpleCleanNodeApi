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
const mongo_helper_1 = require("../helpers/mongo-helper");
const load_user_repository_1 = require("./load-user-repository");
let mongoHelper;
let db;
const makeSut = () => {
    const userModel = db.collection("users");
    const sut = new load_user_repository_1.LoadUserByEmailRepository(userModel);
    return { sut, userModel };
};
describe("LoadUserByEmail Repository", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoHelper = new mongo_helper_1.MongoHelper();
        yield mongoHelper.connect(String(process.env.MONGO_URL));
        db = yield mongoHelper.getDb();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.collection("users").deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoHelper.disconnect();
    }));
    test("should return null if no user is found", () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = makeSut();
        const user = yield sut.load("invalid@email.com");
        expect(user).toBeNull();
    }));
    test("should return an user if user is found", () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, userModel } = makeSut();
        const email = "valid@email.com";
        yield userModel.insertOne({ email });
        const user = yield sut.load(email);
        expect(user).toBeTruthy();
        expect(user === null || user === void 0 ? void 0 : user.email).toBe(email);
    }));
});
