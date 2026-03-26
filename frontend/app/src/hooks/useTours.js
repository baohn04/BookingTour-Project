import { useState, useEffect } from 'react';
import { getTours, getTourDetail, getReviews } from '../services/tourServices';

export const useFetchTours = (slug, searchParams) => {
  const [loading, setLoading] = useState(false);
  const [infoCategory, setInfoCategory] = useState({});
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        const query = searchParams.toString();
        const result = await getTours(slug, query);
        if (result && result.data) {
          setTours(result.data);
          setInfoCategory(result.infoCategory);
        }
      } catch (error) {
        console.error("Error fetching tours data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
  }, [slug, searchParams]);

  return { loading, infoCategory, tours };
};

export const useFetchTourDetail = (slug) => {
  const [loading, setLoading] = useState(true);
  const [tourDetail, setTourDetail] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  
  const INITIAL_LIMIT = 2;

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const result = await getTourDetail(slug);
        if (result.data) {
          setTourDetail(result.data);
        }
      } catch (error) {
        console.error("Error fetching tour detail data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [slug]);

  const fetchReviews = async (tourId, skip = 0, limit = INITIAL_LIMIT) => {
    try {
      const result = await getReviews(tourId, limit, skip);
      if (result && result.data) {
        if (skip === 0) {
          setReviews(result.data);
        } else {
          setReviews(prev => [...prev, ...result.data]);
        }
        setTotalReviews(result.totalReviews || 0);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (tourDetail?._id) {
      fetchReviews(tourDetail._id, 0, INITIAL_LIMIT);
    }
  }, [tourDetail]);

  return { loading, tourDetail, reviews, totalReviews, fetchReviews, INITIAL_LIMIT };
};
