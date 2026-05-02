import axios from 'axios';
import { load } from 'cheerio';
import * as xml2js from 'xml2js';

async function parseFeed(xml: string) {
    const parser = new xml2js.Parser({ explicitArray: false });
    return new Promise((resolve, reject) => {
        parser.parseString(xml, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

const SCRAPERS: Record<string, () => Promise<any[]>> = {
    async lenskart() {
        const url = 'https://blog.lenskart.com/feed';
        const { data } = await axios.get(url);
        const result: any = await parseFeed(data);
        const items = result?.rss?.channel?.item || [];
        const itemsArray = Array.isArray(items) ? items : [items];
        
        return itemsArray.slice(0, 5).map((item: any) => {
            const content = item?.['content:encoded'] || item?.description || '';
            const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
            const imageUrl = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800';
            
            return {
                title: item?.title || 'No Title',
                description: item?.description || item?.['content:encoded'] || '',
                link: item?.link || '',
                imageUrl,
                competitor: 'Lenskart'
            };
        });
    },
    async johnJacobs() {
        const url = 'https://www.johnjacobseyewear.com/blogs/john-jacobs-eyewear.atom';
        const { data } = await axios.get(url);
        const result: any = await parseFeed(data);
        const entries = result?.feed?.entry || [];
        const entriesArray = Array.isArray(entries) ? entries : [entries];

        return entriesArray.slice(0, 5).map((entry: any) => {
            const content = entry?.content?._ || entry?.content || '';
            const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
            const imageUrl = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1511499767390-91f19760a0ac?auto=format&fit=crop&q=80&w=800';

            return {
                title: entry?.title?._ || entry?.title || 'No Title',
                description: entry?.summary?._ || entry?.summary || '',
                link: entry?.link?.['$']?.href || entry?.link?.href || '',
                imageUrl,
                competitor: 'John Jacobs'
            };
        });
    },
    async titanEyeplus() {
        const url = 'https://www.titaneyeplus.com/blogs';
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = load(data);
        const results: any[] = [];
        
        $('.blog-item, .post-item, article').each((i, el) => {
            const href = $(el).find('a').attr('href');
            const title = $(el).find('h2, h3, .title').text().trim();
            const imageUrl = $(el).find('img').attr('src');

            if (href && title.length > 5) {
                if (!results.find(r => r.link === href)) {
                    results.push({
                        title: title,
                        description: '',
                        link: href.startsWith('http') ? href : 'https://www.titaneyeplus.com' + href,
                        imageUrl: imageUrl?.startsWith('http') ? imageUrl : (imageUrl ? 'https://www.titaneyeplus.com' + imageUrl : 'https://images.unsplash.com/photo-1577803541814-1100778c8577?auto=format&fit=crop&q=80&w=800'),
                        competitor: 'Titan Eyeplus'
                    });
                }
            }
        });

        if (results.length === 0) {
            $('a').each((i, el) => {
                const href = $(el).attr('href');
                const title = $(el).text().trim();
                if (href && href.includes('/blogs/') && title.length > 20) {
                    if (!results.find(r => r.link === href)) {
                        results.push({
                            title: title,
                            description: '',
                            link: href.startsWith('http') ? href : 'https://www.titaneyeplus.com' + href,
                            imageUrl: 'https://images.unsplash.com/photo-1577803541814-1100778c8577?auto=format&fit=crop&q=80&w=800',
                            competitor: 'Titan Eyeplus'
                        });
                    }
                }
            });
        }

        return results.slice(0, 5);
    }
};

export async function scrapeCompetitor(name: string) {
    try {
        if (SCRAPERS[name]) {
            return await SCRAPERS[name]();
        }
        throw new Error(`Unknown competitor: ${name}`);
    } catch (error: any) {
        console.error(`Error scraping ${name}:`, error.message);
        return [];
    }
}
