import mongoose from 'mongoose'
import Post from '../models/posts.js'

export const createPost = async (req, res) => {
    const post = req.body
    const newPost = new Post({ ...post, creator: req.userId, createdAt: new Date().toISOString() })
    try {
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export const getPosts = async (req, res) => {
    const { page } = req.query
    try {
        const LIMIT = 5
        const startIndex = (Number(page) - 1) * LIMIT
        const posts = await Post.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex)
        const lastPage = await Post.countDocuments()
        res.status(200).json({ data: posts, lastPage: lastPage })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const likePost = async (req, res) => {
    const { id } = req.params
    
    if(!req.userId) return res.json({ message: 'Unauthenticated.' })

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id.')

    const post = await Post.findById(id)

    const index = post.likes.findIndex((id) => id === String(req.userId))

    if(index === -1){
        post.likes.push(req.userId)
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }

    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true })

    res.json(updatedPost)
}

export const deletePost = async (req, res) => {
    const { id } = req.params
   
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id.')

    await Post.findByIdAndDelete(id)
    res.status(201).json({ message: 'Deleted successfully.' })
   
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params
    const post = req.body

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id.')

    const updatedPost = await Post.findByIdAndUpdate(_id, { ...post, _id }, { new: true })

    res.json(updatedPost)
}