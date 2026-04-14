import { model, Schema } from "mongoose";

const schema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: function () {
            return !this.phoneNumber;
        },
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    // ================= FORGET PASSWORD =================
    resetCode: {
        type: String
    },
    resetCodeExpires: {
        type: Date
    },
    isResetVerified: {
        type: Boolean,
        default: false
    },

    // ================= OPTIONAL =================
    phoneNumber: {
        type: String,
        required: function () {
            return !this.email;
        },
        unique: true
    },

    dob: {
        type: Date
    },

    otp: {
        type: Number
    },

    otpExpire: {
        type: Date
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    // ================= PROFILE =================
    profilePicture: {
        type: String
    },

    profilePictureCloud: {
        secure_url: String,
        public_id: String
    },

    credentialsUpdatedAt: {
        type: Date,
        default: Date.now
    },

    deletedAt: {
        type: Date
    }

}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});


// ================= VIRTUALS =================

schema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

schema.virtual("fullName").set(function (value) {
    const [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
});

schema.virtual("Age").get(function () {
    if (!this.dob) return null;
    return new Date().getFullYear() - new Date(this.dob).getFullYear();
});

schema.virtual("messages", {
    ref: "Message",
    localField: "_id",
    foreignField: "receiver"
});

export const User = model("User", schema);


//E:\ECO LINK\ecolink-backend\src\DB\models\user.model.js