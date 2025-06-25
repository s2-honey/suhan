import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/EmotionSlider.css';

import api from '../config/axios';
import main1 from '../assets/characters/main1.png';
import main2 from '../assets/characters/main2.png';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EmotionSlider = () => {
  const paginationRef = useRef(null);
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  const [isReady, setIsReady] = useState(false);
  const [nickname, setNickname] = useState('사용자');
  const [status, setStatus] = useState({
    isNewUser: false,
    hasAnyReport: false,
    hasTodayReport: false,
  });
  const [hasRoleCharacter, setHasRoleCharacter] = useState(false);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setIsReady(true);
        return;
      }

      try {
        const [infoRes, statusRes, roleRes] = await Promise.all([
          api.get('/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/api/users/status', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/api/character/${userId}/exists`),
        ]);

        setNickname(infoRes.data.nickname || '사용자');
        setStatus(statusRes.data);
        setHasRoleCharacter(roleRes.data);
      } catch {
        setNickname('사용자');
      } finally {
        setIsReady(true);
      }
    };

    fetchUserInfo();
  }, []);

  // ✅ 인삿말 문구 조건 분기
  const getGreetingMessage = () => {
    const { isNewUser, hasAnyReport, hasTodayReport } = status;

    if (isNewUser) {
      return `${nickname}님, 처음 뵙네요!\n마일로가 당신의 이야기를 기다리고 있어요 :)`;
    }

    if (!hasAnyReport) {
      return '감정을 나누는 첫 걸음,\n마일로가 함께 할게요.';
    }

    if (!hasTodayReport) {
      return `${nickname}님,\n오늘은 어떤 이야기를 나눠볼까요?`;
    }

    return `${nickname}님,\n이어서 이야기 나눠볼까요?`;
  };

  const getRoleplayMessage = () => {
    return hasRoleCharacter
      ? '다시 그 장면으로 가볼까요?\n마일로가 무대를 열어둘게요.'
      : '무대가 준비 중이에요,\n역할을 골라주세요!';
  };

  const slides = [
    {
      title: '상담형',
      description: getGreetingMessage(),
      image: main1,
    },
    {
      title: '감정 리허설',
      description: getRoleplayMessage(),
      image: main2,
    },
  ];

  const handleStart = (index) => {
    const selected = slides[index].title;

    if (selected === '상담형') {
      navigate('/chat');
    } else {
      const storedAnswers = localStorage.getItem('roleplayAnswers');
      if (storedAnswers) {
        const answers = JSON.parse(storedAnswers);
        navigate('/roleplay/chat', { state: { answers } });
      } else {
        navigate('/roleplay');
      }
    }
  };

  return (
    <div className="slider-container">
      {/* 🔽 좌우 네비게이션 화살표 */}
      <div className="slide-nav">
        <button
          className="slide-arrow-button left"
          onClick={() => swiperRef.current?.slidePrev()}
          disabled={isBeginning}
        >
          <ChevronLeft size={28} />
        </button>
        <button
          className="slide-arrow-button right"
          onClick={() => swiperRef.current?.slideNext()}
          disabled={isEnd}
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {isReady && (
        <Swiper
          slidesPerView={1.1}
          spaceBetween={20}
          centeredSlides={true}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: paginationRef.current,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            if (swiper.params.pagination && paginationRef.current) {
              swiper.params.pagination.el = paginationRef.current;
              swiper.pagination.init();
              swiper.pagination.render();
              swiper.pagination.update();
            }

            // ✅ 초기 상태 설정
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);

            // ✅ 슬라이드 변경될 때마다 상태 업데이트
            swiper.on('slideChange', () => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            });
          }}
        >
          {slides.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="slide-card">
                <div className="slide-label">{item.title}</div>
                <div className="slide-content">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="slide-character"
                  />
                  <div className="speech-bubble">
                    <p>
                      {item.description.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
                <button
                  className="slide-button"
                  onClick={() => handleStart(index)}
                >
                  시작하기
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="custom-pagination" ref={paginationRef}></div>
    </div>
  );
};

export default EmotionSlider;
