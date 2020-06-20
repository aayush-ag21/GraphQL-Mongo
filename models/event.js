const mongoose = require('mongoose');
/* Data types in MongoDB : Double(double), String(string), Object(object), Array(array)
Binary Data(binData),ObjectID(objectId),Boolean(bool),Date(date),Null(null),
Regular Expression(regex),JavaScript(javascript),JavaScript-with-scope(javascriptWithScope),
32-bit integer(int),Timestamp(timestamp),64-bit integer	(long),Decimal128(decimal),
Min key	(minKey),Max key(maxKey)	
*/
//need to convert string to Date in date
const Schema = mongoose.Schema;

const eventSchema=new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    creator:{
        type: Schema.Types.ObjectId,
        ref:'UserModel'
    }
});

module.exports = mongoose.model('EventModel',eventSchema);