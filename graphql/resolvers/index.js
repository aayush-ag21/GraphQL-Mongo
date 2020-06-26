const bcrypt = require('bcryptjs');
const EventModel=require('../../models/event');
const UserModel = require('../../models/user');


const events = eventIds =>{
    return EventModel.find({_id:{$in:eventIds}})
    .then(events=>{
        return events.map(event=>{
            return {...event._doc,date:new Date(event._doc.date).toISOString(),creator:user.bind(this,event.creator)};
        })
    })
}

const user= userId =>{
    return UserModel.findById(userId)
    .then(user =>{
        return {...user._doc,password:'nai dunga',createdEvents: events.bind(this,user._doc.createdEvents)};
    })
    .catch(err =>{
        throw err;
    });
}


module.exports= {
    events:()=>{//populate adds user data from relation, otherwise would give error
        return EventModel.find()
        //.populate('creator')//issue with populate method is nesting, therefore we will mannually query
        .then(events=>{
            //did not have to override user id as in tutorial
            return events.map(event=>{
                return{...event._doc,date:new Date(event._doc.date).toISOString(),creator: user.bind(this,event._doc.creator)};
            });
        })
        .catch(err=>{
            throw err;
        });
    },

    createEvent:(args)=>{
        const event = new EventModel({
            title: args.eventInput.title,
            description:args.eventInput.description,
            price:+args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator:'5eee70c8d19c1907703f8428'
        })
        let createdEvent;
        //return is added here, to tell node that this function is async, if we dont add it, it will not wait for promise success => error
        return event
        .save()
        .then(result=>{
            createdEvent={...result._doc,date:new Date(event._doc.date).toISOString(),creator:user.bind(this,result._doc.creator)};
            return UserModel.findById('5eee70c8d19c1907703f8428');
            //console.log(result);//result will be an event, as defined before
            //return {...result._doc,_id:event.id}; //unpacking-- event.id is alternate
        })
        .then(user=>{
            if (!user){
                throw new Error('User Not Found');
            }//change event to event id
            user.createdEvents.push(event);
            return user.save();
        })
        .then(result=>{
            return createdEvent;
        })
        .catch(err =>{
            throw err;
        });
    },

    createUser:(args)=>{
        return UserModel.findOne({email:args.userInput.email}).then(user=>{
            if(user){
                throw new Error('User exists already');
            }
            return bcrypt.hash(args.userInput.password,12)
        })
        .then(hashedPassword=>{
            const user=new UserModel({
                email: args.userInput.email,
                password:hashedPassword
            });
            return user.save();
        })
        .then(result=>{
            return{...result._doc,password:'nai dunga'};
        })
        .catch(err=>{
            throw err;
        })
    }
}