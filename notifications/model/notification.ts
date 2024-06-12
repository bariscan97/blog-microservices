import { Schema, model } from 'mongoose';


interface INotifitacation {
  user_name : string
  content: string,
  target:string,
  from : string
  unread : boolean
}


const notifitacationSchema = new Schema<INotifitacation>({
    user_name : {type : String},
    content : { type: String  },
    target :{type: String},
    from : {type :String },
    unread : { type: Boolean }
    
});

export default model<INotifitacation>('Notifitacation', notifitacationSchema);

