
import express from "express";
import logger from "./logger.js";
import pinoHTTP from "pino-http";
import { body, matchedData, param } from "express-validator";
import { env } from "process";
import { bootstrapServer } from "./helpers.js";


const app = express();

const port = env.PORT ?? 3000;

app.use(express.json(), pinoHTTP({ logger }));

// const MAX_QUERY_LEN = 2048;

const SUPPORTED_CC = ['dcc'];


const dummy_compile_error = {
  "compiler_message": "test.c:5:1: error: use of undeclared identifier 'asdfadsf'\nasdfadsf\n^",
  "type": "error",
  "file": "test.c",
  "line": "5",
  "col": "1",
  "explanation": " you have used the name '\u001b[1masdfadsf\u001b[0m' on line 5 of test.c without previously declaring it.\nIf you meant to use '\u001b[1masdfadsf\u001b[0m' as a variable, check you have declared it by specifying its type\nAlso  check you have spelled '\u001b[1masdfadsf\u001b[0m' correctly everywhere.",
  "label": "use_of_undeclared_identifier",
  "source": "#include <stdio.h>\n#include <stdlib.h>\nint main(int argc, char *argv[]) {\n    malloc(1000 * 1000 * 100);\nasdfadsf\n    while (1); \n    return 0;\n}\n",
  "language": "C",
  "implementation": "dcc-compile"
}

/**
 * Request the compilation of some C code.
 * Currently returns some dummy output.
 *
 * Errors:
 * ...
 *
 */
app.post(
  "/api/compile",
  body("source")
    .isString()
    .trim()
    .notEmpty(),

  body("cc").trim().default("dcc").isIn(SUPPORTED_CC),
  (req, res, next) => {
    // TODO: validation
    // validateOrThrow(req);

    const {cc: compiler, source} = matchedData(req);

    logger.info('Returning dummy response');
    res.send({
      compile_status: 'error',
      error_details: {...dummy_compile_error, source: source},
    });
  }
);

// app.use(errorHandler);

bootstrapServer()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Backend listening on port ${port}`);
      logger.info(env.NODE_ENV);
    });
  })
  .catch(() => logger.fatal("Failed to bootstrap server"));

