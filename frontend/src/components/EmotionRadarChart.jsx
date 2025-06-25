import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import api from '../config/axios';

import joyIcon from '../assets/icons/joy.png';
import stableIcon from '../assets/icons/stable.png';
import anxietyIcon from '../assets/icons/anxiety.png';
import sadnessIcon from '../assets/icons/sadness.png';
import angerIcon from '../assets/icons/anger.png';

const emotionLabels = ['기쁨', '안정', '불안', '슬픔', '분노'];
const emotionIcons = [joyIcon, stableIcon, anxietyIcon, sadnessIcon, angerIcon];

const EmotionRadarChart = ({ yearMonth = '2025-06' }) => {
  const [emotionValues, setEmotionValues] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    setEmotionValues([0, 0, 0, 0, 0]);

    const fetchEmotionSummary = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get(`/api/emotion/monthly-summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            yearMonth,
          },
        });

        const { avgJoy, avgStable, avgAnxiety, avgSadness, avgAnger } =
          response.data;

        // ✅ 총합 정규화 방식
        const sum =
          avgJoy + avgStable + avgAnxiety + avgSadness + avgAnger || 1;
        const values = [
          (avgJoy / sum) * 100,
          (avgStable / sum) * 100,
          (avgAnxiety / sum) * 100,
          (avgSadness / sum) * 100,
          (avgAnger / sum) * 100,
        ];

        setEmotionValues(values);
      } catch (error) {
        console.error('감정 요약 조회 실패:', error);
      }
    };

    fetchEmotionSummary();
  }, [yearMonth]);

  const chartSize = 280;
  const center = chartSize / 2;
  const iconRadius = 170;
  const iconSize = 32;

  const data = {
    labels: ['', '', '', '', ''],
    datasets: [
      {
        label: '감정 분포',
        data: emotionValues,
        backgroundColor: 'rgba(255, 182, 128, 0.4)',
        borderColor: '#FF944D',
        borderWidth: 2,
        pointBackgroundColor: '#FF944D',
        pointRadius: 5,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const value = context.raw;
            return `${emotionLabels[index]}: ${Math.round(value)}%`;
          },
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 40, // ✅ 감정 값 강조를 위한 축 최대값 조정
        ticks: { display: false },
        pointLabels: { display: false },
        grid: { color: '#ccc' },
        angleLines: { display: true },
      },
    },
  };

  return (
    <div
      className="radar-chart-container"
      style={{
        width: chartSize,
        height: chartSize,
        position: 'relative',
        margin: '0 auto',
      }}
    >
      <Radar data={data} options={options} />

      {emotionIcons.map((icon, idx) => {
        const angle = ((Math.PI * 2) / emotionIcons.length) * idx - Math.PI / 2;
        const x = center + iconRadius * Math.cos(angle) - iconSize / 2;
        const y = center + iconRadius * Math.sin(angle) - iconSize / 2;

        return (
          <div
            key={idx}
            className="radar-icon"
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '12px',
              color: '#444',
              width: `${iconSize}px`,
              height: `${iconSize + 12}px`,
            }}
          >
            <img
              src={icon}
              alt={emotionLabels[idx]}
              style={{ width: '28px', height: '28px', marginBottom: '2px' }}
            />
            <span>{Math.round(emotionValues[idx])}%</span>
          </div>
        );
      })}
    </div>
  );
};

export default EmotionRadarChart;
