import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EmotionKeyword.css';
import bookIcon from '../assets/icons/report_image.png';
import api from '../config/axios'; // ✅ axios 추가

const EmotionKeyword = () => {
  const [keywords, setKeywords] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodayReport = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const token = localStorage.getItem('accessToken');

        const res = await api.get(`/api/report/daily?date=${today}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const mainEmotion = res.data?.mainEmotion;
        if (mainEmotion) {
          setKeywords([mainEmotion]); // ✅ 배열로 변환하여 키워드처럼 사용
          setNotFound(false);
        } else {
          setKeywords([]);
          setNotFound(true);
        }
      } catch (err) {
        if ([400, 404].includes(err.response?.status)) {
          setNotFound(true);
        } else {
          console.error('오늘의 리포트 조회 실패:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTodayReport();
  }, []);

  const handleClick = () => {
    navigate('/emotion-report');
  };

  return (
    <div className="report-section card-section" onClick={handleClick}>
      <div className="keyword-header">
        <span className="report-title">분석 리포트</span>
        <span className="report-arrow">›</span>
      </div>

      <div className="report-keyword-title">
        <div className="title-row">
          <img src={bookIcon} alt="아이콘" className="icon" />
          <span>오늘의 감정 키워드</span>
        </div>

        <div className="keyword-list">
          {loading ? (
            <span className="keyword-badge">불러오는 중...</span>
          ) : notFound ? (
            <span className="keyword-badge">
              감정을 찾는 중... 로딩이 조금 긴가 봐요 🙃
            </span>
          ) : (
            keywords.map((word, idx) => (
              <span key={idx} className="keyword-badge">
                {word}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="report-description">
        오늘 대화에서 마일로가 감정을 분석해 요약해줘요
      </div>
    </div>
  );
};

export default EmotionKeyword;
