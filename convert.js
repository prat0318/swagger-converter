/* Swagger-Converter Script
 * ------------------------
 *
 *  Usage Instructions:
 *  $ git clone git@github.com:prat0318/swagger-converter.git
 *  $ npm install swagger-converter
 *  $ node swagger-converter/convert.js /path/to/api-docs.json
 */

var convert = require('swagger-converter');
var path = require('path');
var fs = require('fs');
var validator = require('./validate.js');

var args = process.argv.slice(2);

if(args.length != 1) {
    throw new Error("Usage: node convert.js <listingPath>");
}

function getFilePath(listingFilePath, resource) {
  return path.join(path.dirname(listingFilePath), resource+'.json');
}

var listingFilePath = args[0];
var resourceListing = JSON.parse(fs.readFileSync(listingFilePath).toString());
var apiDeclarations = [];

if (Array.isArray(resourceListing.apis)) {
  resourceListing.apis.forEach(function(api) {
    resource = api.path.replace(/^\//,"");
    var resourcePath = getFilePath(listingFilePath, resource);
    var apiDeclaration = JSON.parse(fs.readFileSync(resourcePath).toString());
    apiDeclaration.resourcePath = apiDeclaration.resourcePath || api.path;

    apiDeclarations.push(apiDeclaration);
  });
}

console.log('\nValidating Input Swagger 1.2 spec...');
validator.validateInputSwagger(resourceListing, apiDeclarations);

var swagger2Document = convert(resourceListing, apiDeclarations);

console.log('\nValidating Output Swagger 2.0 spec...');
validator.validateOutputSwagger(swagger2Document);

var swagger2 = JSON.stringify(swagger2Document, null, 2);
var outputPath = getFilePath(listingFilePath, "swagger");

fs.writeFile(outputPath, swagger2);
console.log("\nSuccessful. Output has been stored at: " + outputPath);
