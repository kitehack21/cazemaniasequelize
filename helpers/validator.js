var validator = require('validator')

module.exports = {
    validate(data){
        var validationResults = []
        Object.keys(data).map((item) => {
            if(item === "email"){
                if(!validator.isEmail(data[item])){
                    validationResults.push({field: item, error:"Invalid Email Format"})
                }
            }
            else{
                if(validator.isEmpty(data[item])){
                    validationResults.push({field: item, error:"Cannot be empty"})
                }
            }
        })

        return validationResults;
    }
}