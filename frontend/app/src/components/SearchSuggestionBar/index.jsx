import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import {
  SearchOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FireOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { searchTours } from '../../services/tourServices';
import { useDebounce, useClickOutside } from '../../hooks/useDebounce';
import formatPriceHelper from '../../helpers/formatPriceHelper';
import formatDateHelper from '../../helpers/formatDateHelper';
import { Link } from 'react-router-dom';

const MAX_SUGGESTIONS = 6;

function SearchSuggestionBar(props) {
  const { size = 'large', className = '', placeholder = 'Tìm kiếm tour du lịch...' } = props;
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // keyboard nav

  const debouncedKeyword = useDebounce(inputValue, 350);

  // Đóng dropdown khi click ra ngoài
  const handleClose = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);
  useClickOutside(wrapperRef, handleClose);

  // Fetch suggestions khi keyword thay đổi
  useEffect(() => {
    if (!debouncedKeyword.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    searchTours({ keyword: debouncedKeyword })
      .then((result) => {
        if (cancelled) return;
        const items = result?.data?.slice(0, MAX_SUGGESTIONS) ?? [];
        setSuggestions(items);
        setOpen(true);
        setActiveIndex(-1);
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedKeyword]);

  // Điều hướng sang trang kết quả đầy đủ
  const handleSubmit = (keyword = inputValue) => {
    const kw = keyword.trim();
    if (!kw) return;
    handleClose();
    navigate(`/tours/search?keyword=${encodeURIComponent(kw)}`);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleClose();
        navigate(`/tours/detail/${suggestions[activeIndex].slug}`);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  const inputPaddingClass = size === 'large' ? 'py-3 text-[15px]' : 'py-2 text-sm';

  return (
    <div ref={wrapperRef} className={`relative w-full max-w-[500px] ${className}`}>
      {/* ── Input ── */}
      <div
        className={`flex items-center gap-2 bg-background border rounded-3xl px-4 transition-all duration-200
          ${open && suggestions.length > 0 ? 'border-primary shadow-md shadow-primary/10 rounded-b-none rounded-t-3xl' : 'border-[#d9d9d9] hover:border-primary'}
        `}
      >
        {loading
          ? <Spin size="small" className="flex-shrink-0" />
          : <SearchOutlined className="text-text1 flex-shrink-0 text-[16px]" />
        }
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
          placeholder={placeholder}
          className={`flex-1 border-none outline-none bg-transparent text-text1 placeholder:text-gray-400 font-medium ${inputPaddingClass}`}
          autoComplete="off"
          spellCheck={false}
        />
        {inputValue && (
          <button
            onClick={() => { setInputValue(''); setSuggestions([]); setOpen(false); }}
            className="text-gray-400 hover:text-text1 transition-colors flex-shrink-0 text-xs leading-none"
            tabIndex={-1}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Dropdown ── */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-[9999] bg-background border border-primary border-t-0 rounded-b-2xl shadow-xl shadow-primary/10 overflow-hidden">
          {suggestions.length === 0 && !loading ? (
            <div className="px-5 py-6 text-center text-gray-400 text-sm">
              Không tìm thấy tour nào cho "<span className="text-text1 font-medium">{inputValue}</span>"
            </div>
          ) : (
            <>
              <ul className="py-1 max-h-[420px] overflow-y-auto">
                {suggestions.map((tour, index) => (
                  <li key={tour._id || tour.id}>
                    <Link
                      to={`/tours/detail/${tour.slug}`}
                      onClick={handleClose}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-orange-50 no-underline group
                        ${index === activeIndex ? 'bg-orange-50' : ''}
                      `}
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img
                          src={tour.images?.[0]}
                          alt={tour.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://placehold.co/56x56?text=Tour'; }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-text1 font-semibold text-sm leading-tight mb-1 line-clamp-1">
                          {tour.title}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
                          {tour.startDeparture && (
                            <span className="flex items-center gap-1">
                              <EnvironmentOutlined className="text-primary" />
                              {tour.startDeparture}
                            </span>
                          )}
                          {tour.timeStart && (
                            <span className="flex items-center gap-1">
                              <ClockCircleOutlined className="text-primary" />
                              {formatDateHelper(tour.timeStart)}
                            </span>
                          )}
                          {tour.stock <= 5 && tour.stock > 0 && (
                            <span className="flex items-center gap-1 text-red-500">
                              <FireOutlined /> Sắp hết chỗ
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        {tour.discount > 0 && (
                          <p className="text-[11px] text-gray-400 line-through leading-none mb-0.5">
                            {formatPriceHelper(tour.price)}
                          </p>
                        )}
                        <p className="text-primary font-bold text-sm leading-none">
                          {formatPriceHelper(tour.price_special ?? tour.price)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Footer – xem tất cả */}
              <button
                onClick={() => handleSubmit()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border-t border-gray-100 text-primary text-sm font-semibold hover:bg-orange-50 transition-colors"
              >
                <SearchOutlined />
                Xem tất cả kết quả cho "<span className="max-w-[200px] truncate inline-block">{inputValue}</span>"
                <RightOutlined className="text-xs" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchSuggestionBar;
