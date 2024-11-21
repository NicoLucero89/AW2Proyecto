import jwt from 'jsonwebtoken';
const SECRET = "BmGgwl2fIR99Wd0o0Ov76YSyOlCGbjAtF2Mp8DWuKyMp9ajo8UQbL5GX2tya_h9k"
// crear pagina de agregar contactos para utilizar este codigo
export const verifyToken = async (token) => {

    console.log(token)
    if (!token) {
      return false; 
    }
  
    try {
      const decode = await jwt.verify(token, SECRET);
      console.log(decode)
      return true;  
    } catch (error) {
      console.log(error);
      return false
    }
} 

export const decodeToken=async(token)=>{

    if(!verifyToken){
        return false
    }
    const decode = await jwt.verify(token, SECRET)
    return decode
}
