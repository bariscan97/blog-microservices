import { IsString, Length ,IsEmail,IsNotEmpty , IsDate} from 'class-validator'

export default class Post{
    
    @IsString()
    public readonly content?:string
   
    @IsString()
    public readonly img_url:string

    @IsString()
    public readonly parent_id: number;

    @IsString()
    public readonly cat?: string
  }

