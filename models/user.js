import mongoose from 'mongoose'
import mongodb from 'mongodb';
import pkg from 'validator';
import Teams from './team.js';
const { isEmail } = pkg;
const { ObjectId } = mongodb;

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name cannot be blank"] },
    email: { type: String, unique: true, index: true, required: [true, "Email cannot be blank"], validate: [isEmail, "Invalid email"] },
    password: { type: String, required: [true, "Password cannot be blank"] },
    token: { type: String, required: [true, "Token required"] },
    status: { type: String, enum: ['active', 'inactive', 'deleted'] },
    type: { type: String, enum: ['ADMIN', 'SUBADMIN', 'TEAM_MEMBER'] },
    team_id: { type: String },
    subadmin_id: { type: String },
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

userSchema.index({ name: 'text', email: 'text' }, { default_language: 'none', language_override: 'dummy', minWeight: 1 });

userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    const curId = user._id;
    delete userObj._id,
        delete userObj.password;
    userObj["id"] = curId;
    return userObj
}

const Users = mongoose.model('Users', userSchema);
export default Users