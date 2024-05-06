
export const errorHandler = (err:any):string=>{
    let message:string = ''
    if(err.name == 'CastError'){
        return message = 'Invalid ID please go through it'
    }if(err.code==11000){
       return message = 'Please be unique cause category already exist'
    }
    for(const key in err.errors){
        message+=err.errors[key].message;
        message+=", "
    }
    return message.slice(0,message.length-2)
}