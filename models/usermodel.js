const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

const UserSchema = new Schema({
    name: {
         type: String,
          required: [true, 'First Name is Required']
    },
    
    roll: {
        type: String, 
        unique: true,
        required:[true, "Roll Number is required"]
    },

    email: {
        type : String,
        unique :true,
        required: true,
        trim: true
    },
    phone: {
        type : String,
        unique :true,
        required: true,
        trim: true
    },
    branch: {
        type : String,
        unique :true,
        required: true,
    },
    
    password: {
        type :String, 
        required: true
    },
    createdDate :{ 
        type: Date, 
        default: Date.now
    }
});

UserSchema.statics.authenticate = function(email, password, callback){
    User.findOne({email: email})
    .exec(function(err, user){
        if(err){
            return callback(err)
        }else if(!user){
            var err = new Error('User Not Found');
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, user.password, function(err, result){
            if(result === true){
                return callback(null, user);
            } else {
                return callback();
            }
        })
    });
}


UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });


const User = mongoose.model('User', UserSchema);

module.exports = User;