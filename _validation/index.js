const validation = {
    schema: {},
    result: true,
    error: null,
    // call a function to set the schema
    setSchema: function (input) {
        this.schema = {};
        this.result = true;
        this.error = null;
        this.schema = input   // schema layout is object with field: type
    },
    execute: function (body) {
        for (const [key, value] of Object.entries(this.schema)) {
            if (!body.hasOwnProperty(key) && value[1] == true) {
                validation.error = 'The property `' + key + '` is required, yet was not provided in the body of the request.'
                validation.result = false;
                return {
                    result: validation.result,
                    error: validation.error
                  }
            }
            if (typeof body[key] !== value[0] && value[1] == true){
                validation.error = 'The field `' + key + '` is invalid. The type established in the schema is ' + value[0] + ', while the type provided is ' + typeof body[key] + '.'
                validation.result = false;
                return {
                    result: validation.result,
                    error: validation.error
                  }
            }
            if (body[key] && body[key].length < value[2]){
                validation.error = 'The field `' + key + '` does not meet minimum length requirements.'
                validation.result = false;
                return {
                    result: validation.result,
                    error: validation.error
                  }
            }
          };
          return {
            result: validation.result,
            error: validation.error
          }
    }
    
};


module.exports = validation