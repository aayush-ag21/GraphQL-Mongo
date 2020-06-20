const express = require('express');
const bodyparser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');

const app = express();

app.use(bodyparser.json());

app.get('/',(req,res,next) =>{
    res.send('Hello World');
})

//query schema subscription are root methods in Graphql query->Get, mutation-> Post,put, Subscription -> Socket, fragment ->block
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
app.use('/v1/graphql',graphqlHttp({
    schema: buildSchema(`
        type RootQuery{
            events: [String!]!
        }
        type RootMutation{
            createEvent(name:String):String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue:{
        events:()=>{
            return['My','First','GraphQL'];
        },
        createEvent:(args)=>{
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql:true
}));

app.listen(3000);