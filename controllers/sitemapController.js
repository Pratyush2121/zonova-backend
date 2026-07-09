import Blog from '../models/blogModel.js';
import Project from '../models/projectModel.js';

const BASE_URL = 'https://zonovatechnologies.online';

const staticPages = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'weekly' },
  { url: '/services', priority: '0.9', changefreq: 'weekly' },
  { url: '/startup-partnership', priority: '0.7', changefreq: 'monthly' },
  { url: '/portfolio', priority: '0.8', changefreq: 'weekly' },
  { url: '/blog', priority: '0.8', changefreq: 'daily' },
  { url: '/careers', priority: '0.7', changefreq: 'weekly' },
  { url: '/book-meeting', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact', priority: '0.8', changefreq: 'monthly' },
  { url: '/privacy-policy', priority: '0.5', changefreq: 'monthly' },
  { url: '/terms-conditions', priority: '0.5', changefreq: 'monthly' }
];

const serviceSlugs = [
  'startup-consulting',
  'mvp-development',
  'web-development',
  'mobile-apps',
  'saas-development',
  'ai-solutions',
  'ui-ux-design',
  'branding',
  'seo-services',
  'performance-marketing',
  'lead-generation',
  'business-automation',
  'business-consulting',
  'dedicated-team',
  'growth-consulting',
  'product-management'
];

const locations = [
  'delhi',
  'mumbai',
  'ghaziabad',
  'noida',
  'bengaluru',
  'hyderabad',
  'pune',
  'kolkata',
  'auckland',
  'wellington',
  'johannesburg',
  'cape-town',
  'new-york',
  'los-angeles',
  'chicago',
  'chennai',
  'houston',
  'san-francisco',
  'durban',
  'pretoria',
  'christchurch'
];

const industrySlugs = [
  'digital-marketing-for-healthcare',
  'digital-marketing-for-real-estate',
  'digital-marketing-for-construction',
  'digital-marketing-for-education',
  'digital-marketing-for-restaurants',
  'seo-for-saas-startups',
  'ai-marketing-for-ecommerce',
  'web-development-for-manufacturing',
  'branding-for-startups'
];

// 1. Primary Sitemap Index
export const getSitemapIndex = (req, res) => {
  res.header('Content-Type', 'application/xml');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/blog-sitemap.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/portfolio-sitemap.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/image-sitemap.xml</loc>
  </sitemap>
</sitemapindex>`;
  res.send(xml);
};

// 2. Static Pages Sitemap
export const getStaticSitemap = (req, res) => {
  res.header('Content-Type', 'application/xml');
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Core Static URLs
  staticPages.forEach(p => {
    xml += `
  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`;
  });

  // Services Sub-pages
  serviceSlugs.forEach(slug => {
    xml += `
  <url>
    <loc>${BASE_URL}/services/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Location Landing Pages
  locations.forEach(loc => {
    xml += `
  <url>
    <loc>${BASE_URL}/digital-marketing-agency-${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Industry Landing Pages
  industrySlugs.forEach(ind => {
    xml += `
  <url>
    <loc>${BASE_URL}/industry/${ind}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  xml += '\n</urlset>';
  res.send(xml);
};

// 3. Dynamic Blogs Sitemap
export const getBlogsSitemap = async (req, res) => {
  try {
    res.header('Content-Type', 'application/xml');
    const blogs = await Blog.find({ status: 'published' }).select('slug updatedAt');
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    blogs.forEach(blog => {
      const date = blog.updatedAt ? new Date(blog.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `
  <url>
    <loc>${BASE_URL}/blog/${blog.slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += '\n</urlset>';
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating blogs sitemap.');
  }
};

// 4. Dynamic Portfolio Sitemap
export const getPortfolioSitemap = async (req, res) => {
  try {
    res.header('Content-Type', 'application/xml');
    const projects = await Project.find().select('_id updatedAt');
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    projects.forEach(p => {
      const date = p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `
  <url>
    <loc>${BASE_URL}/portfolio/${p._id}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += '\n</urlset>';
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating portfolio sitemap.');
  }
};

// 5. Image Sitemap
export const getImageSitemap = async (req, res) => {
  try {
    res.header('Content-Type', 'application/xml');
    const [blogs, projects] = await Promise.all([
      Blog.find({ status: 'published' }).select('slug title featuredImage'),
      Project.find().select('_id title screenshots')
    ]);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // Static site assets
    xml += `
  <url>
    <loc>${BASE_URL}</loc>
    <image:image>
      <image:loc>${BASE_URL}/images/logo.jpg</image:loc>
      <image:title>Zonova Technologies Logo</image:title>
      <image:caption>Venture studio corporate logo</image:caption>
    </image:image>
    <image:image>
      <image:loc>${BASE_URL}/hero_illustration.png</image:loc>
      <image:title>Zonova Solutions Engine</image:title>
      <image:caption>Interactive services and capabilities diagram</image:caption>
    </image:image>
  </url>`;

    // Blogs Images
    blogs.forEach(blog => {
      if (blog.featuredImage) {
        const imgUrl = blog.featuredImage.startsWith('http') ? blog.featuredImage : `${BASE_URL}${blog.featuredImage}`;
        xml += `
  <url>
    <loc>${BASE_URL}/blog/${blog.slug}</loc>
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${blog.title}</image:title>
    </image:image>
  </url>`;
      }
    });

    // Case Studies Images
    projects.forEach(p => {
      if (p.screenshots && p.screenshots.length > 0) {
        xml += `
  <url>
    <loc>${BASE_URL}/portfolio/${p._id}</loc>`;
        p.screenshots.forEach((screen, idx) => {
          const imgUrl = screen.startsWith('http') ? screen : `${BASE_URL}${screen}`;
          xml += `
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${p.title} Screenshot ${idx + 1}</image:title>
    </image:image>`;
        });
        xml += `
  </url>`;
      }
    });

    xml += '\n</urlset>';
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating image sitemap.');
  }
};

// 6. Dynamic RSS Feed
export const getRSSFeed = async (req, res) => {
  try {
    res.header('Content-Type', 'application/xml');
    const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 }).limit(20);
    
    let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Zonova Technologies | Tech & Marketing Insights</title>
  <link>${BASE_URL}</link>
  <description>Actionable playbooks, strategic blueprints, and tech analysis written by the builders at Zonova.</description>
  <language>en-us</language>
  <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />`;

    blogs.forEach(blog => {
      const pubDate = blog.createdAt ? new Date(blog.createdAt).toUTCString() : new Date().toUTCString();
      const contentExcerpt = blog.metaDescription || blog.content.replace(/<[^>]*>/g, '').substring(0, 200);
      xml += `
  <item>
    <title><![CDATA[${blog.title}]]></title>
    <link>${BASE_URL}/blog/${blog.slug}</link>
    <guid>${BASE_URL}/blog/${blog.slug}</guid>
    <pubDate>${pubDate}</pubDate>
    <description><![CDATA[${contentExcerpt}]]></description>
    <author>${blog.author || 'Zonova Team'}</author>
  </item>`;
    });

    xml += '\n</channel>\n</rss>';
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating RSS feed.');
  }
};
