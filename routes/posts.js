import express from 'express'
import { createPost, getPosts, likePost, deletePost, updatePost } from '../controllers/posts.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/', auth, createPost)

router.get('/', getPosts)

router.patch('/:id/likePost', auth, likePost)

router.delete('/:id', auth, deletePost)

router.patch('/:id', auth, updatePost)

export default router
