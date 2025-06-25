import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';

import '../styles/EmotionArchivePage.css';

import joyIcon from '../assets/icons/joy.png';
import stableIcon from '../assets/icons/stable.png';
import anxietyIcon from '../assets/icons/anxiety.png';
import sadnessIcon from '../assets/icons/sadness.png';
import angerIcon from '../assets/icons/anger.png';
import summaryIcon from '../assets/icons/summary.png';
import EmotionRadarChart from '../components/EmotionRadarChart';

const iconMap = {
  JOY: joyIcon,
  SADNESS: sadnessIcon,
  ANXIETY: anxietyIcon,
  ANGER: angerIcon,
  STABLE: stableIcon,
};
const korToEng = {
  기쁨: 'JOY',
  슬픔: 'SADNESS',
  불안: 'ANXIETY',
  분노: 'ANGER',
  안정: 'STABLE',
};
const getIcon = (e) => iconMap[korToEng[e] || e] || stableIcon;

const EmotionArchivePage = () => {
  const navigate = useNavigate();
  const today = new Date();
  const thisMonth = new Date(today.getFullYear(), today.getMonth());

  const [viewMonth, setViewMonth] = useState(thisMonth);
  const [records, setRecords] = useState([]);
  const [gptFeedback, setGptFeedback] = useState('');
  const [hasEmotionData, setHasEmotionData] = useState(true);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const scrollRef = useRef(null);

  const yearMonthStr = `${viewMonth.getFullYear()}-${String(viewMonth.getMonth() + 1).padStart(2, '0')}`;

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const { data } = await api.get(
          `/api/report/records?month=${yearMonthStr}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const list = data
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((v) => ({
            day: new Date(v.date).getDate(),
            icon: getIcon(v.mainEmotion),
            label: v.mainEmotion,
          }));
        setRecords(list);
      } catch (e) {
        console.error('기록 조회 실패:', e);
        setRecords([]);
      }
    };
    fetch();
  }, [yearMonthStr]);

  useEffect(() => {
    const fetchFeedback = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const { data } = await api.get(`/api/emotion/monthly-summary`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { yearMonth: yearMonthStr },
        });
        const feedback = data.gptFeedback;
        const values = [
          data.avgJoy,
          data.avgStable,
          data.avgAnxiety,
          data.avgSadness,
          data.avgAnger,
        ];
        const hasData = values.some((v) => v > 0);
        setHasEmotionData(hasData);
        setGptFeedback(feedback || '총평이 아직 생성되지 않았습니다.');
      } catch (e) {
        console.error('총평 조회 실패:', e);
        setGptFeedback('-');
        setHasEmotionData(false);
      }
    };
    fetchFeedback();
  }, [yearMonthStr]);

  useEffect(() => {
    const box = scrollRef.current;
    if (!box) return;
    setTimeout(() => {
      box.scrollLeft = box.scrollWidth - box.clientWidth;
    }, 0);
  }, [records]);

  useEffect(() => {
    const box = scrollRef.current;
    if (!box) return;
    let isDown = false,
      startX = 0,
      startScroll = 0;

    const down = (e) => {
      isDown = true;
      box.classList.add('dragging');
      startX = e.pageX;
      startScroll = box.scrollLeft;
    };
    const move = (e) => {
      if (!isDown) return;
      e.preventDefault();
      box.scrollLeft = startScroll - (e.pageX - startX);
    };
    const up = () => {
      isDown = false;
      box.classList.remove('dragging');
    };

    box.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      box.removeEventListener('mousedown', down);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, []);

  const shiftMonth = (delta) => {
    const m = new Date(viewMonth);
    m.setMonth(viewMonth.getMonth() + delta);
    if (delta > 0 && m > thisMonth) return;
    setViewMonth(m);
  };

  const monthLabel = viewMonth.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
  const disableNext =
    viewMonth.getFullYear() === thisMonth.getFullYear() &&
    viewMonth.getMonth() === thisMonth.getMonth();

  return (
    <div className="archive-page-container">
      <div className="archive-page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2>감정 아카이브</h2>
      </div>

      <div className="archive-page-month-selector">
        <span className="arrow" onClick={() => shiftMonth(-1)}>
          ‹
        </span>
        <span className="month-text">{monthLabel}</span>
        <span
          className={`arrow ${disableNext ? 'disabled' : ''}`}
          onClick={() => shiftMonth(1)}
        >
          ›
        </span>
      </div>

      <div className="archive-page-record-section">
        <div className="archive-page-record-header">
          <span className="record-title">이번달 기록</span>
          <span className="record-count">
            이번달 총 기록:{' '}
            <span className="highlight">{records.length}번</span>
          </span>
        </div>

        <div className="record-track">
          <span className="track-line" />
          <div className="icon-scroll" ref={scrollRef}>
            {records.map((r, idx) => (
              <div key={idx} className="record-item">
                <img src={r.icon} alt={r.label} draggable={false} />
                <span>{r.day}</span>
              </div>
            ))}
          </div>
          <span className="record-total">{records.length}</span>
        </div>
      </div>

      <h3 className="emotion-archive-title">감정 분포</h3>
      <div
        className={`emotion-archive-section ${!hasEmotionData ? 'dimmed' : ''}`}
      >
        <div className="emotion-chart-wrapper">
          <EmotionRadarChart yearMonth={yearMonthStr} />
        </div>
        {!hasEmotionData && (
          <p className="dimmed-text">
            이번 달의 감정 기록이 없어 분석을 제공할 수 없습니다.
          </p>
        )}
      </div>

      <h3 className="emotion-archive-title">이번달 총평</h3>
      <div
        className={`archive-page-summary ${!hasEmotionData ? 'dimmed' : ''}`}
      >
        <img
          src={summaryIcon}
          alt="총평"
          className="archive-page-summary-icon"
        />
        <div style={{ flex: 1 }}>
          <p
            className={`summary-text ${isFeedbackOpen ? 'summary-text-expanded' : 'summary-text-collapsed'}`}
          >
            {gptFeedback}
          </p>
          {gptFeedback.length > 80 && (
            <button
              className="summary-toggle-button"
              onClick={() => setIsFeedbackOpen((prev) => !prev)}
            >
              {isFeedbackOpen ? '접기 ▲' : '펼치기 ▼'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmotionArchivePage;
