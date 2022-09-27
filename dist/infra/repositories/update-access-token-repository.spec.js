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
const update_access_token_repository_1 = require("./update-access-token-repository");
let mongoHelper;
let db;
const makeSut = () => {
    const userModel = db.collection("users");
    const sut = new update_access_token_repository_1.UpdateAccessTokenRepositorySpy(userModel);
    return { sut, userModel };
};
describe("UpdateAccessTokenRepository", () => {
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
    test("should update the user with the given accessToken", () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, userModel } = makeSut();
        const email = "valid@email.com";
        const fakeUser = yield userModel.insertOne({ email });
        const fakeUserId = fakeUser.insertedId;
        const validToken = "valid_token";
        yield sut.update(fakeUserId, validToken);
        const updatedFakeUser = yield userModel.findOne({ _id: fakeUserId });
        expect(updatedFakeUser === null || updatedFakeUser === void 0 ? void 0 : updatedFakeUser.accessToken).toBe(validToken);
    }));
});
