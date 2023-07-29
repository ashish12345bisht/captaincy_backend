import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name cannot be blank"] },
    description: { type: String, required: [true, "Description cannot be blank"] },
    status: { type: String, enum: ['pending', 'completed', 'approved'] },
    subadmin_id: { type: String, required: [true, "Subadmin Id cannot be blank"] },
    team_id: { type: String, required: [true, "Team Id cannot be blank"] },
    user_id: { type: String, required: [true, "User Id cannot be blank"] }
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

taskSchema.index({ name: 'text' }, { default_language: 'none', language_override: 'dummy', minWeight: 1 });

taskSchema.methods.toJSON = function () {
    const task = this;
    const taskObj = task.toObject();
    const curId = task._id;
    delete taskObj._id,
        taskObj["id"] = curId;
    return taskObj
}

const Tasks = mongoose.model('Tasks', taskSchema);
export default Tasks