import mongoose from 'mongoose'

const teamMemberSchema = new mongoose.Schema({
    team_id: { type: String, required: [true, "Team Id cannot be blank"] },
    user_id: { type: String, required: [true, "User Id cannot be blank"] },
    is_captain: { type: Boolean },
    subadmin_id: { type: String, required: [true, "Subadmin Id cannot be blank"] }
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

teamMemberSchema.index({ team_id: 1, user_id: 1 }, { unique: true });

teamMemberSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    const curId = user._id;
    delete userObj._id,
        userObj["id"] = curId;
    return userObj
}

const TeamMembers = mongoose.model('TeamMembers', teamMemberSchema);
export default TeamMembers