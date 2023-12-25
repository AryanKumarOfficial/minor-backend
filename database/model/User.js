const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: Number,
        default: null,
        trim: true
    },
    address: {
        type: String,
        default: null,
        trim: true
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    resetToken: {
        type: String,
        default: null
    },

    expireToken: {
        type: Date,
        default: null
    },

    avatar: {
        type: String,
        default: null
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    isBlocked: {
        type: Boolean,
        default: false
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    isSuperAdmin: {
        type: Boolean,
        default: false
    },

    isStaff: {
        type: Boolean,
        default: false
    },

    isManager: {
        type: Boolean,
        default: false
    },

    isDriver: {
        type: Boolean,
        default: false
    },

    isCustomer: {
        type: Boolean,
        default: false
    },

    isSeller: {
        type: Boolean,
        default: false
    },

    isAffiliate: {
        type: Boolean,
        default: false
    },

    isAgent: {
        type: Boolean,
        default: false
    },

    isPartner: {
        type: Boolean,
        default: false
    },

    isEmployee: {
        type: Boolean,
        default: false
    },

    isVendor: {
        type: Boolean,
        default: false
    },

    isMerchant: {
        type: Boolean,
        default: false
    },

    isManufacturer: {
        type: Boolean,
        default: false
    },

    isWholesaler: {
        type: Boolean,
        default: false
    },

    isDistributor: {
        type: Boolean,
        default: false
    },

    isSupplier: {
        type: Boolean,
        default: false
    },

    isDropshipper: {
        type: Boolean,
        default: false
    },

    isFranchisee: {
        type: Boolean,
        default: false
    },

    isReseller: {
        type: Boolean,
        default: false
    },

    isCustomerService: {
        type: Boolean,
        default: false
    },

    isCustomerSupport: {
        type: Boolean,
        default: false
    },

    isCustomerCare: {
        type: Boolean,
        default: false
    },

    isCustomerAssistant: {
        type: Boolean,
        default: false
    },

    isCustomerRepresentative: {
        type: Boolean,
        default: false
    },

    isCustomerExecutive: {
        type: Boolean,
        default: false
    },

    isCustomerManager: {
        type: Boolean,
        default: false
    },

    isCustomerAgent: {
        type: Boolean,
        default: false
    },

    isCustomerConsultant: {
        type: Boolean,
        default: false
    },

    isCustomerAdvisor: {
        type: Boolean,
        default: false
    },

    isCustomerHandler: {
        type: Boolean,
        default: false
    },

    isCustomerOfficer: {
        type: Boolean,
        default: false
    },

    isCustomerProfessional: {
        type: Boolean,
        default: false
    },

    isCustomerLeader: {
        type: Boolean,
        default: false
    },

    isCustomerHead: {
        type: Boolean,
        default: false
    },

    isCustomerCoordinator: {
        type: Boolean,
        default: false
    },

    isCustomerAdministrator: {
        type: Boolean,
        default: false
    },

    isCustomerSecretary: {
        type: Boolean,
        default: false
    },

    isCustomerReceptionist: {
        type: Boolean,
        default: false
    },

    isCustomerOperator: {
        type: Boolean,
        default: false
    },

    isCustomerAssistant: {
        type: Boolean,
        default: false
    },

    isCustomerAssociate: {
        type: Boolean,
        default: false
    },

    isCustomerRepresentative: {
        type: Boolean,
        default: false
    },

    isCustomerSupervisor: {
        type: Boolean,
        default: false
    },

    isCustomerManager: {
        type: Boolean,
        default: false
    },

    isCustomerDirector: {
        type: Boolean,
        default: false
    },

    isCustomerChief: {
        type: Boolean,
        default: false
    },

    isCustomerOfficer: {
        type: Boolean,
        default: false
    },

    isCustomerLeader: {
        type: Boolean,
        default: false
    },

    isCustomerHead: {
        type: Boolean,
        default: false
    },

    isCustomerCoordinator: {
        type: Boolean,
        default: false
    },


}, { timestamps: true });

const User = mongoose.model('User', UserSchema) || mongoose.models.User;
module.exports = User;