import { validationResult } from "express-validator";
import logger from "./logger.js";

export const ErrorCodes = {
  Internal: Symbol("internal-server-error"),
  GenerationUnavailable: Symbol("message-generation-unavailable"),
  BadRequest: Symbol("bad-request"),
};

const toStatus = {
  [ErrorCodes.Internal]: 500,
  [ErrorCodes.GenerationUnavailable]: 500,
  [ErrorCodes.BadRequest]: 400,
};

export class ServerError extends Error {
  constructor(errorCode, ...defaultParams) {
    super(...defaultParams);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError);
    }

    this.name = "ServerError";
    this.errorCode = errorCode;
  }

  status() {
    return toStatus[this.errorCode] ?? 500;
  }
}

export class RequestError extends ServerError {
  constructor(details, ...defaultParams) {
    super(...defaultParams);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError);
    }

    this.name = "RequestError";
    this.details = details;
  }
}

const getResult = validationResult.withDefaults({
  formatter: (error) => {
    return {
      error: `${error.type} error: ${error.path}`,
      message: error.msg,
      value: error.value
    };
  },
});

export const validateOrThrow = (req) => {
  const result = getResult(req);
  if (!result.isEmpty()) {
    const details = result.array();

    logger.error(req.body);

    throw new RequestError(
      details,
      ErrorCodes.BadRequest,
      "Invalid Server Request"
    );
  }
};

export const errorHandler = (error, req, res, _next) => {
  logger.error(error);

  if (error instanceof ServerError) {
    res.status(error.status()).json({
      error: error.errorCode.description,
      message: error.message,
      // Only for RequestErrors
      details: error.details,
    });
    return;
  }

  //Unknown error handler.
  res.status(error.status ?? 500);
  res.json({
    error: ErrorCodes.Internal,
    message: "Internal Server error",
  });
};
