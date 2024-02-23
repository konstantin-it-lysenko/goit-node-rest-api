import handleMongooseError from "./handleMongooseError.js";
import isValidId from "./isValidId.js";
import validateBody from "./validateBody.js";

export const middlewares = {
    handleMongooseError,
    isValidId,
    validateBody
}
