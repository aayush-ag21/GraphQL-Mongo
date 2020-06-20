const express = require('express');
const bodyparser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose= require('mongoose');

const EventModel=require('./models/event')

const app = express();

app.use(bodyparser.json());

app.get('/',(req,res,next) =>{
    res.send('Hello World');
})

/*query schema subscription are root methods in Graphql query->Get, mutation-> Post,put, Subscription -> Socket, fragment ->block
//schema and type are keywords
//all types of queries and mutations are listed in types and then refered in schema
//RootQuery and RootMutation are not keywords
//events is not a keyword, it can be GetEvents also, however in GraphQl generally field name map to query name 
//[] is for list, [<datatype>], all supported type can be refered in GraphQL documentation
//! means it cannot be null, inner one means cannot be list of nulls, outer one means cannot be null
//CreateEvent(<fieldname>:<fieldtype):<returntype>
//rootvalue is resolver
//event and createEvent are called properties
//arguments can be added to any property, even events
//graphiql true activates inbuilt debugger, else use postman with put request and query in body
//args should be in double quotes from client side
//_ for compatibility with mongodb
//default types are String,Int,Float,Boolean and ID
// we can add mode types based on these types which can be further nested
//so that we do not have to pass all types in a nested type, we use the input propert -> standard-> <typePropertyName>Input
//+ added to convert to float
*/
app.use('/v1/graphql',graphqlHttp({
    schema: buildSchema(`
    type Event{
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    type User{
        _id:ID!
        email:String!
        password:String

    }
    input EventInput{
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    input UserInput{
        email:String!
        password:String!
    }
    type RootQuery{
        events: [Event!]!
    }
    type RootMutation{
        createEvent(eventInput:EventInput):Event
        createUser(userInput:UserInput):User
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),//,_id:event._doc is an override to translate the special ObjectId type of MongoDB to a form understood by graphql
    rootValue:{
        events:()=>{
            return EventModel.find().then(events=>{
                console.log(events);
                return events.map(event=>{
                    return{...event._doc,_id:event._doc._id.toString()};
                });
            })
            return events;
        },
        createEvent:(args)=>{
            const event = EventModel({
                title: args.eventInput.title,
                description:args.eventInput.description,
                price:+args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            //return is added here, to tell node that this function is async, if we dont add it, it will not wait for promise success => error
            return event
                .save()
                .then(result=>{
                    console.log(result);//result will be an event, as defined before
                    return {...result._doc,_id:event.id}; //unpacking-- event.id is alternate
                })
                .catch(err =>{
                    console.log(err);
                    throw err;
                });
            return event;
        }
    },
    graphiql:true
}));
//instead of this can always start server and try re connecting with server
mongoose
.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DB}-im876.mongodb.net/first-db?retryWrites=true&w=majority`,{useNewUrlParser:true,useUnifiedTopology:true},)
.then(()=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
});
//MongoClient.connect(`mongodb+srv://first-app:UpBhjfZoyRwPKFdy@firstcluster-im876.mongodb.net/first-db?retryWrites=true&w=majority`,{useNewUrlParser:true});