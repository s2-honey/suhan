import React from 'react';
import '../styles/SettingsDrawer.css';
import { useNavigate } from 'react-router-dom';

import { FaUser, FaLock, FaRegCommentDots } from 'react-icons/fa';
import { RiChatSmile3Line } from 'react-icons/ri';
import { RxReset } from 'react-icons/rx';
import { FiInfo, FiLogOut, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';

const SettingsDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // ✅ 앱 초기화: localStorage 전체 삭제
  const handleResetApp = () => {
    Swal.fire({
      title: '앱초기화',
      text: '기기에 저장된 모든 기록이 삭제돼요',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      confirmButtonColor: '#ff9f4a',
      cancelButtonColor: '#dcdcdc',
      customClass: {
        popup: 'reset-popup',
        title: 'reset-title',
        htmlContainer: 'reset-text',
        confirmButton: 'reset-confirm',
        cancelButton: 'reset-cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.reload();
      }
    });
  };

  // ✅ 로그아웃: 토큰만 삭제 + 로그인 이동
  const handleLogout = () => {
    Swal.fire({
      title: '정말 로그아웃하시겠어요?',
      text: '다시 로그인해야 서비스를 이용할 수 있어요.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '로그아웃',
      cancelButtonText: '취소',
      confirmButtonColor: '#ff9f4a',
      cancelButtonColor: '#dcdcdc',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token'); // ✅ 토큰만 제거
        navigate('/login', { replace: true }); // ✅ replace로 뒤로가기 차단
      }
    });
  };

  return (
    <>
      {/* 반투명 배경 */}
      <div
        className={`drawer-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      ></div>

      {/* 사이드 메뉴 */}
      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <button onClick={onClose} className="drawer-header-back">
            ←
          </button>
          <span>설정</span>
        </div>

        <div className="drawer-section">
          <p className="setting-section-title">회원정보</p>
          <div
            className="drawer-item"
            onClick={() => navigate('/settings/nickname')}
          >
            <FaUser className="drawer-item-icon" />
            닉네임 변경
          </div>
          <div
            className="drawer-item"
            onClick={() => navigate('/settings/password')}
          >
            <FaLock className="drawer-item-icon" />
            비밀번호 변경
          </div>
        </div>

        <div className="drawer-section">
          <p className="setting-section-title">챗봇</p>
          <div
            className="drawer-item"
            onClick={() => navigate('/settings/chat-style')}
          >
            <RiChatSmile3Line className="drawer-item-icon" />
            대화 스타일 변경
          </div>
          <div className="drawer-item" onClick={handleResetApp}>
            <RxReset className="drawer-item-icon" />앱 초기화
          </div>
        </div>

        <div className="drawer-section">
          <p className="setting-section-title">서비스</p>
          <div
            className="drawer-item"
            onClick={() => navigate('/settings/inquiry')}
          >
            <FaRegCommentDots className="drawer-item-icon" />
            문의하기
          </div>
          <div
            className="drawer-item"
            onClick={() => navigate('/settings/terms')}
          >
            <FiInfo className="drawer-item-icon" />
            서비스 이용약관
          </div>
          <div className="drawer-item" onClick={handleLogout}>
            <FiLogOut className="drawer-item-icon" />
            로그아웃
          </div>
        </div>

        <div
          className="drawer-footer"
          onClick={() => navigate('/settings/Withdraw')}
        >
          <FiTrash2 className="drawer-item-icon" />
          회원탈퇴
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;
