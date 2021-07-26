

class CustomErrorHandler extends Error{
    constructor(status,msg){
        super();
        this.status =status,
        this.message = msg
    }

    static alreadyExists(message){
        return new CustomErrorHandler(409,message)
    }

    static wrongCredentials(message){
        return new CustomErrorHandler(401,message)
    }

    static unAuthorization(message){
        return new CustomErrorHandler(401,message)
    }


    static noFound(message){
        return new CustomErrorHandler(404,message)
    }

    static serverProblem (message){
        return new CustomErrorHandler(500 ,message)
    }



}

export default CustomErrorHandler;