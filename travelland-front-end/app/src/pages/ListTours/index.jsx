import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Row, Col, Breadcrumb } from 'antd';
import TourFilter from '../../features/tours/TourFilter';
import TourList from '../../features/tours/TourList';
import { useState, useEffect } from 'react';
import { getTours } from '../../services/tourServices';

function ListTours() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [infoCategory, setInfoCategory] = useState({});
  const [tours, setTours] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  let currentSort = 'all';
  if (searchParams.get('sortKey') === 'price' && searchParams.get('sortValue') === 'desc') currentSort = 'price_desc';
  else if (searchParams.get('sortKey') === 'price' && searchParams.get('sortValue') === 'asc') currentSort = 'price_asc';
  else if (searchParams.get('sortKey') === 'timeStart' && searchParams.get('sortValue') === 'asc') currentSort = 'time_start_asc';

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
        console.error("Error download data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
  }, [slug, searchParams]);

  const handleSortChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      newParams.delete('sortKey');
      newParams.delete('sortValue');
    } else if (value === 'price_desc') {
      newParams.set('sortKey', 'price');
      newParams.set('sortValue', 'desc');
    } else if (value === 'price_asc') {
      newParams.set('sortKey', 'price');
      newParams.set('sortValue', 'asc');
    } else if (value === 'time_start_asc') {
      newParams.set('sortKey', 'timeStart');
      newParams.set('sortValue', 'asc');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8 font-sans bg-background">
      <div className="flex flex-wrap justify-between items-center text-[14px] text-text1 mb-8">
        <Breadcrumb
          items={[
            { title: <Link to="/">Trang chủ</Link> },
            { title: <Link to="/categories">Loại Tour</Link> },
            { title: infoCategory.title },
          ]}
        />
      </div>

      <h1 className="text-[32px] sm:text-[44px] leading-tight font-extrabold text-text1">
        Khám phá các tour {infoCategory.title}
      </h1>

      <Row gutter={[32, 32]} className="mt-10">
        <Col xs={24} lg={8} xl={6}>
          <div className="sticky top-6">
            <TourFilter />
          </div>
        </Col>

        {/* Tour list */}
        <Col xs={24} lg={16} xl={18}>
          <TourList loading={loading} tours={tours} onSortChange={handleSortChange} currentSort={currentSort} />
        </Col>
      </Row>
    </div>
  );
}

export default ListTours;