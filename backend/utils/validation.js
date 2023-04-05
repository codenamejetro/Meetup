const { validationResult } = require('express-validator');


const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);
    console.log(validationErrors)
    if (!validationErrors.isEmpty()) {
      // const errors = {};
      // validationErrors
      //   .array()
      //   .forEach(error => errors[error.param] = error.msg);
        const errorsObj = {};
      validationErrors
        .array()
        .forEach(error => errorsObj[error.param] = error.msg);
        const errors = Object.values(errorsObj)

      const err = Error("Validation Error");
      err.errors = errors;
      err.status = 400;
      err.title = "Bad request.";
      next(err);
    }
    next();
  };

  module.exports = {
    handleValidationErrors
  };
