import express from 'express';
import { 
  getSitemapIndex, 
  getStaticSitemap, 
  getBlogsSitemap, 
  getPortfolioSitemap, 
  getImageSitemap, 
  getRSSFeed 
} from '../controllers/sitemapController.js';

const router = express.Router();

router.get('/sitemap.xml', getSitemapIndex);
router.get('/sitemap-static.xml', getStaticSitemap);
router.get('/blog-sitemap.xml', getBlogsSitemap);
router.get('/portfolio-sitemap.xml', getPortfolioSitemap);
router.get('/image-sitemap.xml', getImageSitemap);
router.get('/rss.xml', getRSSFeed);

export default router;
