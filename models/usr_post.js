import mongoose from "mongoose";

const usr_post_schema = mongoose.Schema(
    {
        picturePath: {
            type: String,
        },
        caption:{
            type: String,
            required: [true, "Veuillez entrer de quelle ref il s'agit"],
        },
        hashtags:{
            type: String,
            default: "simbtech",
        }
    },
    {
        timestamps : true
    }
);

const new_post = mongoose.model('new_post', usr_post_schema);

module.export = new_post;