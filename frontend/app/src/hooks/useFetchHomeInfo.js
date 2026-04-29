import { useState, useEffect } from 'react';
import { getHomePage } from '../services/homeServices';

export const useFetchHomeInfo = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [featuredTours, setFeaturedTours] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        const result = await getHomePage();
        if (result && result.data) {
          setCategories(result.data.categories);
          setFeaturedTours(result.data.featuredTours);
          setReviews(result.data.reviews || []);
        }
      } catch (error) {
        console.error("Error fetching home page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, []);

  return { loading, categories, featuredTours, reviews };
};
