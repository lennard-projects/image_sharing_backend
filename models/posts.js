import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    name: String,
    message: String,
    creator: String,
    profilePic: String,
    image: String,
    likes: { type: [String], default: [] },
    createdAt: { type: Date, default: new Date() }
})

const Post = mongoose.model('Post', postSchema)

export default Post