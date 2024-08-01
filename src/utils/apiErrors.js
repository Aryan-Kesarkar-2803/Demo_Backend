// creating cutoms Errors 

class ApiErrors extends Error{
    constructor(
        statusCode,
        message="something went wrong",
        errors=[],
    ){
        super(message)
        this.statusCode = statusCode,
        this.data = null,
        this.message = message,
        this.success = false,
        this.errors = errors
    }
}
export default ApiErrors

