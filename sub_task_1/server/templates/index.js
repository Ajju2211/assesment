import pug from "pug";
import path from "path";


export default {
    emailVerification: pug.compileFile(path.join(import.meta.dirname, '../templates/emailOtp.pug'))
}