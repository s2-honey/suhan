// src/components/AppLayout.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import SettingsDrawer from './SettingsDrawer';
import { useDrawerStore } from '../stores/useDrawerStore';
import '../styles/App.css';

const AppLayout = ({ children }) => {
  const {
    isDrawerOpen,
    closeDrawer,
    openDrawer,
    shouldAutoOpen,
    setShouldAutoOpen,
  } = useDrawerStore(); // ✅ openDrawer 추가
  const location = useLocation();

  const isMainPage = location.pathname === '/main';
  const allowDrawerPaths = ['/main'];

  const isDrawerAllowed = allowDrawerPaths.includes(location.pathname);

  useEffect(() => {
    if (isMainPage) {
      if (shouldAutoOpen) {
        openDrawer(); // 뒤로가기에서만 열기
        setShouldAutoOpen(false); // 한 번 쓰면 다시 false
      } else {
        closeDrawer(); // 직접 이동은 닫기
      }
    } else {
      closeDrawer(); // 메인 외는 무조건 닫기
    }
  }, [location.pathname]);

  return (
    <div className="app-frame">
      {isDrawerAllowed && <Header onDrawerToggle={openDrawer} />}
      {isDrawerAllowed && (
        <SettingsDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
      )}
      {children}
    </div>
  );
};

export default AppLayout;
