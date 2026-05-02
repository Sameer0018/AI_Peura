import express from 'express';
import Blog from '../models/Blog';

const router = express.Router();

// Create a blog post
router.post('/create', async (req, res) => {
  try {
    const { title, slug, category, tags, excerpt, content, imageUrl, author, publishDate, metaDescription, focusKeyword, readTime } = req.body;
    const newBlog = new Blog({
      title,
      slug,
      category,
      tags,
      excerpt,
      content,
      imageUrl,
      author,
      publishDate,
      metaDescription,
      focusKeyword,
      readTime
    });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single blog post
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
