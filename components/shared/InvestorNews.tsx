'use client';

import {
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Card,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import axios from 'axios';

// Explicitly define styles
const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
}));

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

interface InvestorNewsProps {
  investor: string;
  limit?: number;
  containerClassName?: string;
  articleClassName?: string;
}

export default function InvestorNews({
  investor,
  limit = 6,
  containerClassName,
  articleClassName,
}: InvestorNewsProps) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Correct usage of useStyles
  const classes = useStyles();

  // Fetch relevant news based on the investor
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?category=business&apiKey=852ef605e8ef45b19821c29549e78674`
        );

        if (!response.data.articles || response.data.articles.length === 0) {
          setError("No news articles available.");
        }

        setNews(response.data.articles || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [investor]);

  if (loading) {
    return <p>Loading news...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  const limitedNews = news.slice(0, limit);

  return (
    <div className={`mt-4 ${containerClassName}`}>
      {limitedNews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {limitedNews.map((article: NewsArticle, index: number) => (
            <Card key={index} className={`${classes.root} ${articleClassName}`}>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={article.urlToImage || '/static/images/default-news.jpg'}
                  title={article.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {article.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary" href={article.url} target="_blank">
                  Read More
                </Button>
                <Button size="small" color="primary">
                  Share
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <p>No recent news available for the selected investor.</p>
        </div>
      )}
    </div>
  );
}
