import { ERROR_CODE, SUCCESS_CODE } from "../constants/constants.js"

export const successResponse = (res, message = "Success", data = {}) => {
    res.json({ statusCode: SUCCESS_CODE, data, message })
}

export const errorResponse = (res, message = "Server Error") => {
    res.json({ statusCode: ERROR_CODE, message })
}