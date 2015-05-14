var SwaggerTools = require('swagger-tools');

function validateOutputSwagger(swagger2Document) {
  var spec = require('swagger-tools').specs.v2;
  spec.validate(swagger2Document, function(err, result) {
    if (err) {
      throw err;
    }

    if (typeof result !== 'undefined') {
      if (result.errors.length > 0) {
        console.log('The output Swagger document is invalid...');

        console.log('');

        console.log('Errors');
        console.log('------');

        result.errors.forEach(function (err) {
          console.log('#/' + err.path.join('/') + ': ' + err.message);
        });

        console.log('');
      }

      if (result.warnings.length > 0) {
        console.log('Warnings');
        console.log('--------');

        result.warnings.forEach(function (warn) {
          console.log('#/' + warn.path.join('/') + ': ' + warn.message);
        });
      }

      if (result.errors.length > 0) {
        process.exit(1);
      }
    } else {
      console.log('Output Swagger document is valid.');
    }
  });
}

function validateInputSwagger(resourceListing, apiDeclarations) {
  var spec = require('swagger-tools').specs.v1;
  spec.validate(resourceListing, apiDeclarations, function (err, result) {
    var errorCount = 0;

    if (typeof result !== 'undefined') {
      console.log('Invalid input Swagger document...');

      console.log('');

      if (result.errors.length > 0) {
        errorCount += result.errors.length;

        console.log('Errors');
        console.log('------');

        result.errors.forEach(function (err) {
          console.log('#/' + err.path.join('/') + ': ' + err.message);
        });

        console.log('');
      }

      if (result.warnings.length > 0) {
        console.log('Warnings');
        console.log('--------');

        result.warnings.forEach(function (warn) {
          console.log('#/' + warn.path.join('/') + ': ' + warn.message);
        });

        console.log('');
      }

      if (result.apiDeclarations) {
        result.apiDeclarations.forEach(function (adResult, index) {
          var errorHeader = 'API Declaration (' + apiDeclarations[index].resourcePath + ') Errors';
          var warningHeader = 'API (' + apiDeclarations[index].resourcePath + ') Warnings';

          if (adResult.errors.length > 0) {
            errorCount += adResult.errors.length;

            console.log(errorHeader);
            console.log(new Array(errorHeader.length + 1).join('-'));

            adResult.errors.forEach(function (err) {
              console.log('#/' + err.path.join('/') + ': ' + err.message);
            });

            console.log('');
          }

          if (adResult.warnings.length > 0) {
            console.log(warningHeader);
            console.log(new Array(warningHeader.length + 1).join('-'));

            adResult.warnings.forEach(function (warn) {
              console.log('#/' + warn.path.join('/') + ': ' + warn.message);
            });

            console.log('');
          }
        });
      }

      if (errorCount > 0) {
        process.exit(1);
      }
    } else {
      console.log('Input Swagger document is valid... Continuing');
    }
  });
}

exports.validateInputSwagger = validateInputSwagger;
exports.validateOutputSwagger = validateOutputSwagger;
