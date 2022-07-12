import mongoose from 'mongoose'

export interface IBlazeDouble extends mongoose.Types.Subdocument{
    number: number,
    timestamp: Date,
    color: string,
}

const BlazeDouble = new mongoose.Schema(
    {        
        number: {type:Number, required:true},
        timestamp: {type:Date, required:true},
        color: {type:String},
    }
)

export default mongoose.model<IBlazeDouble>('BlazeDouble',BlazeDouble)