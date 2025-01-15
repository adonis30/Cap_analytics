import { Schema, model, models } from 'mongoose';

// Define the UserSchema with roles
const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  photo: { type: String, required: true },
  roles: {
    type: [String],
    enum: ['Admin', 'Editor', 'Viewer'], // Adjust roles as needed
    default: ['Viewer'], // Default role
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Create and export the User model
const User = models.User || model('User', UserSchema);

export default User;
