import mongoose from 'mongoose'
import mongodb from 'mongodb';
import pkg from 'validator';
const { ObjectId } = mongodb;

const teamSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name cannot be blank"], unique: true },
  status: { type: String, enum: ['active', 'inactive', 'deleted'] },
  subadmin_id: { type: String, required: [true, "Subadmin Id cannot be blank"] },
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

teamSchema.index({ name: 'text' }, { default_language: 'none', language_override: 'dummy', minWeight: 1 });

teamSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  const curId = user._id;
  delete userObj._id,
    userObj["id"] = curId;
  return userObj
}

const Teams = mongoose.model('Teams', teamSchema);
export default Teams