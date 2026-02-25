import { useParams, Link } from 'react-router-dom';
import { Row, Col, Breadcrumb } from 'antd';
import formatSlug from '../../helpers/formatSlug';
import TourFilter from '../../features/tours/TourFilter';
import TourList from '../../features/tours/TourList';
import { useState, useEffect } from 'react';
import { getTours } from '../../services/tourServices';

function ListTours() {
  const { slug } = useParams();
  const categoryName = formatSlug(slug);
  const [loading, setLoading] = useState(false);
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        const result = await getTours(slug);
        if (result && result.data) {
          setTours(result.data);
        }
      } catch (error) {
        console.error("Error download data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [slug]);

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8 font-sans bg-background">
      <div className="flex flex-wrap justify-between items-center text-[14px] text-text1 mb-8">
        <Breadcrumb
          items={[
            { title: <Link to="/">Trang chủ</Link> },
            { title: <Link to="/categories">Loại Tour</Link> },
            { title: categoryName },
          ]}
        />
        <div className="mt-4 sm:mt-0 font-medium text-text1">
          THE 10 BEST {categoryName} Tours & Excursions
        </div>
      </div>

      <h1 className="text-[32px] sm:text-[44px] leading-tight font-extrabold text-text1">
        Explore all things to do in {categoryName}
      </h1>

      <Row gutter={[32, 32]} className="mt-10">
        <Col xs={24} lg={8} xl={6}>
          <TourFilter />
        </Col>

        {/* Tour list */}
        <Col xs={24} lg={16} xl={18}>
          <TourList tours={tours} key={tours.id} />
        </Col>
      </Row>
    </div>
  );
}

export default ListTours;