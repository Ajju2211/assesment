import mongoose from 'mongoose';
import constants from '../utils/constants.json' assert {type: 'json'};

const { Schema } = mongoose;

const verificationSchema = new Schema(
  {
    otp: String,
    token: String,
    // can be userID,email,or any unique field over the purpose which otp is getting verified
    tokenSignedFor: {
      type: String,
      String
    },
    purpose: {
      type: String,
      enum: [constants.VERIFICATION_PURPOSES.AUTHENTICATION,constants.VERIFICATION_PURPOSES.RESET_PASSWORD]
    },
    expiresAt: {
      type: Date,
      default: Date.now,
      index: { expireAfterSeconds: 300 }
    }
  },
  { timestamps: true },
);

// composite unique index key
verificationSchema.index({tokenSignedFor: 1,purpose: 1}, {unique: true});

const Verification = mongoose.model('Verification', verificationSchema);

export default Verification;