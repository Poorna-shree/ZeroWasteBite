import mongoose from "mongoose"

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    category: {
        type: String,
        enum: [
            "carrot",
            "tomato",
            "onion",
            "mango",
            "apple",
            "chilli",
            "rice",
            "Others"
        ],
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    foodType: {   // renamed to match your controller
        type: String,
        enum: [
            "vegitables",
            "fruites"
        ],
        required: true
    },
    rating:{
        average:{type:Number,dafault:0},
        count:{type:Number,dafault:0},

    }
}, { timestamps: true })

const Item = mongoose.model("Item", itemSchema)
export default Item
