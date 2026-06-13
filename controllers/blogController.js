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

    let blogs = await Blog.find(filter);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const totalBlogs = blogs.length;
    
    if (limit > 0) {
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      blogs = blogs.slice(startIndex, endIndex);
    }
    
    const totalPages = limit > 0 ? Math.ceil(totalBlogs / limit) : 1;

    res.json({ 
      success: true, 
      blogs,
      pagination: {
        totalBlogs,
        totalPages,
        currentPage: page,
        limit
      }
    });
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

export const seedBlogs = async () => {
  try {
    const count = await Blog.countDocuments();
    if (count >= 15) {
      console.log(`[Seed] Database already contains ${count} blogs. Skipping seeding.`);
      return;
    }

    const initialBlogs = [
      {
        title: "10 Essential SEO Strategies for Local Businesses in 2026",
        content: "Search Engine Optimization (SEO) continues to evolve rapidly. For local businesses, staying ahead of local search algorithms is crucial to driving foot traffic and online queries. In this article, we explore the top ten strategies that local businesses can implement today. From optimizing Google Business Profile attributes to leveraging hyper-local backlinks and generating authentic user reviews, these practical tips will boost your visibility in local map packs. Remember, local SEO is not a one-time setup but an ongoing process of local engagement and content updates.",
        author: "Zonava Team",
        category: "SEO Services",
        tags: ["SEO", "Local Business", "Marketing"],
        featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "10 Essential SEO Strategies for Local Businesses in 2026",
        metaDescription: "Boost your local search visibility and drive business growth with our top 10 actionable local SEO strategies for 2026.",
        readTime: "5 min read"
      },
      {
        title: "The Future of Web Development: Trends to Watch",
        content: "Modern web development is shifting towards faster page loads, server components, and edge rendering. As tools like Next.js and Vite continue to mature, developers must keep up with best practices like partial hydration, island architecture, and server actions. In this comprehensive guide, we dissect the rising adoption of framework-agnostic micro-frontends, Rust-based tooling, and AI-assisted programming. We also look at how WebAssembly is bringing desktop-level performance to web browsers worldwide.",
        author: "Zonava Team",
        category: "Website Development",
        tags: ["Web Dev", "NextJS", "Tech Trends"],
        featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "Future of Web Development: Trends to Watch in 2026",
        metaDescription: "Explore the next wave of web technologies, including server actions, edge computing, rust-based tooling, and WebAssembly.",
        readTime: "6 min read"
      },
      {
        title: "Maximizing ROI: A Guide to Paid Advertising Campaigns",
        content: "Pay-Per-Click (PPC) and paid social media campaigns offer unmatched targeting precision, but they can quickly drain your budget if not configured correctly. To maximize your return on investment (ROI), you must align your ad creatives with search intent, design laser-focused landing pages, and conduct regular A/B testing on headlines and call-to-actions. This article walks you through configuring custom conversions, setting bid strategies, and interpreting complex analytics reports to scale your paid media successfully.",
        author: "Zonava Team",
        category: "Digital Marketing",
        tags: ["PPC", "Paid Ads", "Marketing ROI"],
        featuredImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "Maximizing PPC ROI: Advertising Campaigns Guide",
        metaDescription: "Master the art of high-ROI paid advertising campaigns. Learn targeting, bid strategies, and creative testing.",
        readTime: "5 min read"
      },
      {
        title: "How to Build a Memorable Brand Identity from Scratch",
        content: "A brand is far more than a logo and a color scheme; it is the emotional connection your customers form with your company. Building a memorable brand identity requires defining your core values, understanding your target demographic, and crafting a unique tone of voice. In this deep dive, we outline a step-by-step branding roadmap: from competitive research and mission statements to visual design libraries, typography choices, and consistent multi-channel communication.",
        author: "Zonava Team",
        category: "Branding",
        tags: ["Branding", "Identity", "Design System"],
        featuredImage: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "How to Build a Memorable Brand Identity from Scratch",
        metaDescription: "Learn the fundamentals of brand identity, styling, logo design, value propositions, and messaging to build a stand-out brand.",
        readTime: "7 min read"
      },
      {
        title: "Unlocking Social Media Algorithms for Organic Reach",
        content: "Organic social media reach is harder to earn than ever, but it remains a critical pillar of digital marketing. Understanding how algorithms rank posts on platforms like LinkedIn, Instagram, and Twitter is the first step to unlocking visibility. This post explains the mechanisms of user engagement signals, dwell time, video retention, and how creating conversation-starting threads can trigger exponential viral amplification without a dollar of ad spend.",
        author: "Zonava Team",
        category: "Social Media Marketing",
        tags: ["Social Media", "Organic Reach", "Algorithms"],
        featuredImage: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "Unlocking Social Media Algorithms for Organic Reach",
        metaDescription: "Get the insights needed to beat social media algorithms. Learn engagement strategies that increase organic reach.",
        readTime: "4 min read"
      },
      {
        title: "Why Mobile-First Design is No Longer Optional",
        content: "With over 60% of global web traffic originating from mobile devices, mobile-first design is a fundamental engineering requirement. Designing for the smallest screen first forces developers to prioritize content, simplify interactions, and optimize assets. We cover key principles of mobile design including touch target sizing, hamburger menu accessibility, responsive typography scales, and performance strategies to keep your mobile pages loading in under a second.",
        author: "Zonava Team",
        category: "Website Development",
        tags: ["Mobile First", "Responsive Design", "UX/UI"],
        featuredImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "Why Mobile-First Design is Crucial in 2026",
        metaDescription: "Discover why mobile-first design is essential for modern web application development and learn key UX principles.",
        readTime: "5 min read"
      },
      {
        title: "The Role of Artificial Intelligence in Modern Marketing",
        content: "Artificial Intelligence is shifting from a futuristic concept to an everyday marketing tool. Marketers are leveraging machine learning models for predictive analytics, personalized email sequencing, dynamic pricing, and content generation. However, integrating AI ethically and maintaining an authentic brand voice is a delicate balance. This post examines successful AI implementations and highlights pitfalls to avoid, such as over-automation and lack of human oversight.",
        author: "Zonava Team",
        category: "Digital Marketing",
        tags: ["AI Marketing", "Machine Learning", "Automation"],
        featuredImage: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "The Role of Artificial Intelligence in Modern Marketing",
        metaDescription: "Discover how AI and machine learning are revolutionizing audience segmentation, content personalization, and lead scoring.",
        readTime: "6 min read"
      },
      {
        title: "A Step-by-Step Guide to High-Converting Landing Pages",
        content: "What makes a landing page convert visitors into customers? It is a combination of precise messaging, clean visual design, and frictionless layout. By removing distracting links, utilizing strong social proof, and positioning a single, compelling call-to-action (CTA), you can turn an underperforming webpage into a lead generation machine. We review wireframes, copy-writing frameworks, and heat-map optimization tactics to maximize landing page conversion rates.",
        author: "Zonava Team",
        category: "Lead Generation",
        tags: ["Landing Pages", "Conversion Rate", "UX Design"],
        featuredImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "A Step-by-Step Guide to High-Converting Landing Pages",
        metaDescription: "Optimize your landing pages for maximum leads. Learn about hero sections, layouts, trust signals, and clear CTAs.",
        readTime: "6 min read"
      },
      {
        title: "Understanding Search Intent: The Core of Modern SEO",
        content: "Gone are the days when stuffing keywords into a blog post was enough to rank on the first page of Google. Today, search engines prioritize content that accurately matches user search intent. Search intent is categorized into four main buckets: informational, navigational, transactional, and commercial. This guide explains how to analyze search engine result pages (SERPs) to determine user intent and map out your content calendar to resolve searchers' questions perfectly.",
        author: "Zonava Team",
        category: "SEO Services",
        tags: ["SEO", "Search Intent", "Content Strategy"],
        featuredImage: "https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "Understanding Search Intent: The Core of Modern SEO",
        metaDescription: "Master search intent to align your contents with what Google and users want. Read our detailed guide.",
        readTime: "5 min read"
      },
      {
        title: "Email Marketing Best Practices for E-commerce Growth",
        content: "Email marketing remains the highest-yielding direct-response marketing channel, boasting an average return of $36 for every dollar spent. But to tap into this growth, e-commerce stores must move away from generic batch-and-blast newsletters and embrace automated, behavior-driven flows. We break down the absolute essentials: welcome series, abandoned cart recovery, browse abandonment triggers, and list segmentation tactics that keep unsubscribe rates low and customer lifetime value high.",
        author: "Zonava Team",
        category: "Digital Marketing",
        tags: ["Email Marketing", "E-commerce", "Automation"],
        featuredImage: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "Email Marketing Best Practices for E-commerce Growth",
        metaDescription: "Boost e-commerce store revenue with high-performing email automation campaigns, cart recovery, and segments.",
        readTime: "5 min read"
      },
      {
        title: "The Ultimate Guide to Core Web Vitals Optimization",
        content: "Core Web Vitals are a set of specific factors that Google considers crucial in a webpage's overall user experience. They consist of Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS). This technical guide provides web developers with actionable fixes: from optimizing image sizes and deferring non-critical JavaScript to setting explicit aspect ratios on containers to prevent visual layout shifts.",
        author: "Zonava Team",
        category: "Website Development",
        tags: ["Web Performance", "Core Web Vitals", "SEO"],
        featuredImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "Ultimate Guide to Core Web Vitals Optimization",
        metaDescription: "Optimize LCP, INP, and CLS scores of your website with our technical guidelines. Improve rankings and UX.",
        readTime: "8 min read"
      },
      {
        title: "Content Marketing: Crafting Stories That Convert",
        content: "At its heart, marketing is telling a compelling story. In content marketing, those stories must build trust, educate the reader, and guide them down the customer journey. We discuss the hero's journey framework applied to business cases, how to format complex white papers for high readability, and how to distribute content effectively across LinkedIn, newsletter lists, and medium publications to establish strong thought leadership.",
        author: "Zonava Team",
        category: "Branding",
        tags: ["Content Marketing", "Storytelling", "Copywriting"],
        featuredImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "Content Marketing: Crafting Stories That Convert",
        metaDescription: "Learn storytelling techniques for B2B and B2C content marketing campaigns that build trust and drive conversions.",
        readTime: "5 min read"
      },
      {
        title: "Demystifying Technical SEO: A Checklist for Audits",
        content: "While creative content is essential, search engine crawl bots must be able to discover, render, and index your website. That is where technical SEO comes in. This blog post acts as an audit checklist covering XML sitemaps, robots.txt directives, canonical link tag implementation, structured schema markup, and handling duplicate content issues caused by dynamic URL queries. Run this checklist once a quarter to ensure your rankings never slip.",
        author: "Zonava Team",
        category: "SEO Services",
        tags: ["SEO Audit", "Technical SEO", "Sitemaps"],
        featuredImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "Demystifying Technical SEO: A Checklist for Audits",
        metaDescription: "Follow our technical SEO checklist to inspect sitemaps, robots.txt, schema markup, redirects, and crawl issues.",
        readTime: "6 min read"
      },
      {
        title: "Building Trust Online: Web Security Basics for Businesses",
        content: "In an era of rising cyber threats, security is not just an IT concern; it is a critical branding necessity. Customers will not transact on websites they do not trust. We cover essential web security measures that every small and medium business must deploy. From configuring SSL/TLS certificates and implementing content security policies (CSP) to mitigating cross-site scripting (XSS) and establishing strict password hygiene across your team.",
        author: "Zonava Team",
        category: "Website Development",
        tags: ["Web Security", "SSL", "Cyber Security"],
        featuredImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "Building Trust Online: Web Security Basics for Businesses",
        metaDescription: "Protect customer data and maintain trust. Explore essential web security guidelines, SSL, and CSP rules.",
        readTime: "5 min read"
      },
      {
        title: "Leveraging Video Marketing for Higher Engagement",
        content: "Video content dominates internet traffic and command search rankings. Whether you are producing short-form reels, product demonstration videos, or detailed client testimonials, video is the most engaging media format. This article discusses writing video scripts, choosing budget-friendly recording equipment, optimization strategies for YouTube search, and embedding techniques to ensure your web pages load fast even with rich media elements.",
        author: "Zonava Team",
        category: "Digital Marketing",
        tags: ["Video Marketing", "YouTube SEO", "Engagement"],
        featuredImage: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "Leveraging Video Marketing for Higher Engagement",
        metaDescription: "Learn how to use video across your marketing channels to boost customer engagement, conversion rates, and SEO rankings.",
        readTime: "5 min read"
      },
      {
        title: "Defining Your Value Proposition: Lessons in Branding",
        content: "A value proposition is the core promise of value to be delivered. It is the primary reason a prospect should buy from you. In this lesson, we study iconic value propositions from global brands and walk through a copywriting framework to define your own. Learn how to identify your customer's pain points, list the benefits of your service, and summarize it in a clear, compelling headline that resonates instantly.",
        author: "Zonava Team",
        category: "Branding",
        tags: ["Branding", "Value Proposition", "Copywriting"],
        featuredImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
        status: "published",
        metaTitle: "Defining Your Value Proposition: Lessons in Branding",
        metaDescription: "Establish a clear, compelling value proposition for your brand that speaks directly to customer pain points.",
        readTime: "5 min read"
      }
    ];

    for (const blogData of initialBlogs) {
      const slug = blogData.title
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
        
      const existing = await Blog.findOne({ slug });
      if (!existing) {
        await Blog.create({
          ...blogData,
          slug
        });
        console.log(`[Seed] Seeded blog: "${blogData.title}"`);
      }
    }
    console.log('[Seed] Blog seeding completed successfully.');
  } catch (error) {
    console.error('[Seed] Error seeding blogs:', error);
  }
};
