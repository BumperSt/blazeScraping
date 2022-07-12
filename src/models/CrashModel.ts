import mongoose from 'mongoose'

export interface IBlazeCrash extends mongoose.Types.Subdocument{
    number: number,
    timestamp: Date,
}

const BlazeCrash = new mongoose.Schema(
    {        
        number: {type:Number, required:true},
        timestamp: {type:Date, required:true},
    }
)

export default mongoose.model<IBlazeCrash>('BlazeCrash',BlazeCrash)