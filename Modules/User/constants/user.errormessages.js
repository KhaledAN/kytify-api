import ResponseCodes from "../../constants/ResponseCodes";

export default {
  USER_NOT_ACTIVE: { error: "User not activated", errCode: ResponseCodes.BAD_REQUEST },
  INVALID_CREDENTIALS: { error: "Invalid email and password combination", errCode: ResponseCodes.UNAUTHORIZED },
  ACCOUNT_NOT_VERIFIED: { error: "Account not activated", errCode: ResponseCodes.UNAUTHORIZED },
};
