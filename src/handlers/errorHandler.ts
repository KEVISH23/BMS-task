
export const errorHandler = (err:any):string=>{
    let message:string = ''
    if(err.name == 'CastError'){
        return message = 'Invalid ID please go through it'
    }if(err.code==11000){
       return message = 'Please be unique cause category already exist'
    }
    if(err.name === 'ValidationError'){
        console.log("here")
        for(const key in err.errors){
            // console.log(err.errors[key].name === 'CastError')
            if(err.errors[key].name === 'CastError'){
                 message += `The Id for reference is not valid at ${key}`
            }else{
                message+=err.errors[key].message;
            }
            message+=", "
        }
        return message.slice(0,message.length-2)
    }
    return err.message
} 