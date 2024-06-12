import { IsString, Length ,IsEmail,IsNotEmpty} from 'class-validator'

export default class User{
    
    @IsNotEmpty()
    @IsString()
    @Length(10, 30)
    readonly name:string
   
    @IsString()
    @IsNotEmpty()
    password:string
    
    @IsString()
    readonly pp_url?:string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;
    
 }

