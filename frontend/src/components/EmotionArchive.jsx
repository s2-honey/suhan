// src/components/EmotionArchive.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EmotionArchive.css';
import archiveCharacter from '../assets/characters/main3-character.png';
import api from '../config/axios';

const EmotionArchive = () => {
  const navigate = useNavigate();
  const [recordCount, setRecordCount] = useState(0);

  // ✅ 이번달 감정 기록 수 가져오기
  useEffect(() => {
    const fetchRecordCount = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const today = new Date();
        const yearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

        const response = await api.get(
          `/api/report/records?month=${yearMonth}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRecordCount(response.data.length);
      } catch (error) {
        console.error('감정 기록 조회 실패:', error);
        setRecordCount(0);
      }
    };

    fetchRecordCount();
  }, []);

  // ✅ 기록 수에 따른 문구 설정
  const getArchiveSub = () => {
    if (recordCount <= 2)
      return '오늘의 감정을 한 번 더 남겨보는 건 어때요? 🌱';
    if (recordCount <= 5) return '조금씩 나를 이해해가는 중이에요 😊';
    return '감정 흐름을 잘 관리하고 있어요. 멋져요! 💛';
  };

  return (
    <div
      className="archive-section"
      onClick={() => navigate('/emotion-archive')}
    >
      <div className="archive-header">
        <span className="archive-title">감정 아카이브</span>
        <span className="archive-arrow">›</span>
      </div>

      <div className="archive-content">
        <div className="archive-title-row">
          <img
            src={archiveCharacter}
            alt="감정 캐릭터"
            className="archive-icon"
          />
          <div className="archive-texts">
            <p className="archive-bold">이번 달 채팅 {recordCount}회</p>
            <p className="archive-sub">{getArchiveSub()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionArchive;
