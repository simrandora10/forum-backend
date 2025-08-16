const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: '' }
  },
  { timestamps: true }
);

// Password save hone se pehle hash karna
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // agar password change nahi hua to skip
  this.password = await bcrypt.hash(this.password, 10); // 10 salt rounds
  next();
});

// Password compare method
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
