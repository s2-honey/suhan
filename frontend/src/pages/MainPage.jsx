// src/pages/MainPage.jsx
import React from 'react';
import EmotionSlider from 'components/EmotionSlider';
import EmotionKeyword from 'components/EmotionKeyword';
import EmotionArchive from 'components/EmotionArchive';
import 'styles/App.css'; // global css 연결

const MainPage = () => {
  return (
    <div className="#root">
      <EmotionSlider />
      <EmotionKeyword />
      <EmotionArchive />
    </div>
  );
};

export default MainPage;
