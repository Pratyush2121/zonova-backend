import BlogModel from '../models/blogModel.js';
const Blog = (BlogModel && BlogModel.default) ? (BlogModel.default.default || BlogModel.default) : BlogModel;

// Helper to convert title to URL-safe slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
};

// Helper to calculate reading time
const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const noOfWords = content.split(/\s+/).length;
  const minutes = Math.ceil(noOfWords / wordsPerMinute);
  return `${minutes} min read`;
};

export const getBlogs = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status; // e.g. public only sees 'published'
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const blogs = await Blog.find(filter);
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, author, category, tags, status, metaTitle, metaDescription } = req.body;

    if (!title || !content || !author || !category) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const slug = slugify(title);
    
    // Check if slug is unique
    const existing = await Blog.findOne({ slug });
    let finalSlug = slug;
    if (existing) {
      finalSlug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let featuredImage = '/uploads/blog-placeholder.png';
    if (req.file) {
      featuredImage = `/uploads/${req.file.filename}`;
    } else if (req.body.featuredImage) {
      featuredImage = req.body.featuredImage;
    }

    const tagList = Array.isArray(tags) 
      ? tags 
      : (tags ? tags.split(',').map(tag => tag.trim()) : []);

    const readTime = calculateReadTime(content);

    const blog = await Blog.create({
      title,
      content,
      slug: finalSlug,
      author,
      category,
      tags: tagList,
      featuredImage,
      status: status || 'draft',
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || content.substring(0, 150),
      readTime
    });

    res.status(201).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const { title, content, author, category, tags, status, metaTitle, metaDescription } = req.body;

    let finalSlug = blog.slug;
    if (title && title !== blog.title) {
      const slug = slugify(title);
      const existing = await Blog.findOne({ slug });
      finalSlug = slug;
      if (existing) {
        finalSlug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    let featuredImage = blog.featuredImage;
    if (req.file) {
      featuredImage = `/uploads/${req.file.filename}`;
    } else if (req.body.featuredImage) {
      featuredImage = req.body.featuredImage;
    }

    const tagList = Array.isArray(tags) 
      ? tags 
      : (tags ? tags.split(',').map(tag => tag.trim()) : blog.tags);

    let readTime = blog.readTime;
    if (content) {
      readTime = calculateReadTime(content);
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, {
      title: title || blog.title,
      content: content || blog.content,
      slug: finalSlug,
      author: author || blog.author,
      category: category || blog.category,
      tags: tagList,
      featuredImage,
      status: status || blog.status,
      metaTitle: metaTitle || blog.metaTitle,
      metaDescription: metaDescription || blog.metaDescription,
      readTime
    }, { new: true });

    res.json({ success: true, blog: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
