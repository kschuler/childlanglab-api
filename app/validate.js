const config = require('./config')
const { header, query, body, validationResult } = require('express-validator');

function pcibexValidationRules () {

    return [
        header('origin') // check that request is originating from a trusted origin
            .isIn(config.validation.origins)
            .withMessage("Request must come from a trusted origin."),
        query(config.validation.urlvars)  // check that the query string contains required URL variables 
            .exists()
            .withMessage("Request is missing a required url variable"),
        body() // make sure we have the pcibex structure we expect;
            .isArray()  
            .notEmpty()
            .withMessage("Request body must be an array"),
        body("[2]") // make sure the second element is an array 
            .isArray()
            .notEmpty()
            .withMessage("Request is missing PCIbex column headers"),
        body("[3]") // make sure the third element is an array 
            .isArray()
            // .notEmpty() // skip this since first request was empty
            .withMessage("Request is missing PCIbex row data"),
        body("[4]") // make sure the fourth element is a string (should be a hash, but isHash('md5') not working)
            .isString()
            .withMessage("Request is missing PCIBex unique identifier string")
        ]
}

function jspsychValidationRules () {

    return [
        header('origin') // check that request is originating from a trusted origin
            .isIn(config.validation.origins)
            .withMessage("Request must come from a trusted origin."),
       // body(config.validation.urlvars)
       body("randomid")
            .isString()
            .withMessage("Request body must include lab-required URL variables"),
        body("data") // make sure we have the pcibex structure we expect;
            .isString()
            .withMessage("Data json payload must be formatted as json"),
        ]
}

function validateRequest (req, res, next) {

    // get the error report from express-validator
    const errors = validationResult(req)

    // if no validation errors, keep going; otherwise return 400 
    if (errors.isEmpty()) return next()
    else return res.status(400).json(errors);

}

module.exports = { pcibexValidationRules, jspsychValidationRules, validateRequest }

