import crypto from "crypto"

export default function generateRandomToken(){
    const randomHexString = crypto.randomBytes(15).toString("hex");
    const randomToken = crypto
     .createHash("SHA256")
     .update(randomHexString)
     .digest("hex")
    
    return randomToken
}