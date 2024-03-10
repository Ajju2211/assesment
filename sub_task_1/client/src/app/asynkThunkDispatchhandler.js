import { dispatcher } from "./store";

const defaultFunc = (...args) => {
    console.log(args)
}

const executeThunk = (asyncThunkActionPromise, successCallback=defaultFunc, rejectCallback=defaultFunc) => {
      dispatcher(asyncThunkActionPromise).then(res=>{
        if (res.type.endsWith("fulfilled")) {
            successCallback(res.payload);
          } else {
            rejectCallback(res.error.message);
          }
      }).catch(error =>{
      rejectCallback(error.message);
    })
  };

  export default executeThunk;