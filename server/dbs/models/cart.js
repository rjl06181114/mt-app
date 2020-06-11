let mongoose = require('mongoose')
const Schema = mongoose.Schema
const Cart = new Schema({
    id: {
        type: String,
        unique: true,
        require: true
    },
    detail: {
        type: Array,
        require: true
    },
    cartNo: {
        type: String,
        require: true
    },
    user: {
        type: String,
        require: true
    },
    time: {
        type: Date,
        require: true
    }
})

export default mongoose.model('Cart', Cart)