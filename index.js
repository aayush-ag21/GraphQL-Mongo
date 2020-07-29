const express = require('express');
const bodyparser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphqlResolvers=require('./graphql/resolvers/index');
const graphqlSchema=require('./graphql/schema/index');
//need to use transactions in mongoDB
const app = express();

app.use(bodyparser.json());

app.get('/',(req,res,next) =>{
    res.send('Hello World');
})

app.use('/v1/graphql',graphqlHttp({
    schema: graphqlSchema,//,_id:event._doc is an override to translate the special ObjectId type of MongoDB to a form understood by graphql
    rootValue:graphqlResolvers,
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

//MongoClient.c
