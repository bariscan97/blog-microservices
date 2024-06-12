export default function findTag(text:string) : string[]{
    
    const result : string[] = []
    let str :string = ""
    let flag : boolean = false
    
    for (let i = 0; i < text.length ; i ++){
        if (text[i] === "@"){
            flag = true
        }
        if (flag){
            if (str.length > 0 && text[i] === "@"){
                result.push(str)
                str = ""
            }
            if(text[i] === "@") continue
            else if (text[i] === " "){
                flag = false
                result.push(str)
                str = ""
                continue
            }
            str += text[i]
        }
        if (i === text.length -1 && str.length > 0){
            result.push(str)
        }
    }
    
    return result

}

