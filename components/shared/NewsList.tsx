import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  author: string;
  source: {
    id: string | null;
    name: string;
  };
}

interface NewsListProps {
  limit?: number; // Optional limit on the number of news articles
}

export default function NewsList({ limit = 6 }: NewsListProps) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news from the API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Axios request
        const response = await axios.get('/api/news');

        
        setNews(response.data.articles || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <p>Loading news...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Limit the number of displayed news articles to the specified limit
  const limitedNews = news.slice(0, limit);

  return (
    <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
      {limitedNews.map((article: NewsArticle, index: number) => (
        <React.Fragment key={index}>
          <ListItem 
            alignItems="flex-start" 
            component="a" // No need for the 'button' prop
            href={article.url}
            target="_blank"
          >
            <ListItemAvatar>
              <Avatar alt={article.author || 'News'} src={article.urlToImage || '/static/images/avatar/1.jpg'} />
            </ListItemAvatar>
            <ListItemText
              primary={article.title}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'text.primary', display: 'inline' }}
                  >
                    {article.author || article.source.name}
                  </Typography>
                  {` — ${article.description}`}
                </React.Fragment>
              }
            />
          </ListItem>
          {index < limitedNews.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
}
