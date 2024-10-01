export class AppResponse{
    constructor(status=true , message="Data Fetched Successfully" , data=[] , error=[]){
        this.status = status;
        this.message = message;
        this.data = data;
        this.error = error;
    }

    getResponse(){
        return {
            status:this.status,
            message:this.message,
            data:this.data,
            error:this.error
        }
    }
}