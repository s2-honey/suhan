import React, { useEffect, useRef, useState } from 'react';
import FolderDetailView from '../components/FolderDetailView';
import '../styles/MindDrawerPage.css';
import api from '../config/axios';
import { AiFillHeart } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import Swal from 'sweetalert2';

const COLOR_CLASS_COUNT = 7;

const generateColorClasses = (length) => {
  const result = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * COLOR_CLASS_COUNT) + 1;
    result.push(`color-${randomIndex}`);
  }
  return result;
};

const sortFoldersByLatest = (folders) => {
  return [...folders].sort((a, b) => b.folderId - a.folderId);
};

const MindDrawerPage = () => {
  const [drawerList, setDrawerList] = useState([]);
  const [colorClasses, setColorClasses] = useState([]);
  const [allFolders, setAllFolders] = useState([]);
  const [allColors, setAllColors] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState(null);
  const [expandedFolderIndex, setExpandedFolderIndex] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editFolderName, setEditFolderName] = useState('');
  const [editTargetIndex, setEditTargetIndex] = useState(null);

  const menuRef = useRef(null);

  // ✅ 폴더 목록 불러오기
  const fetchFolders = async () => {
    try {
      const res = await api.get('/api/recovery/folders');
      const folders = res.data.map((folder) => ({
        title: folder.folderName,
        folderId: folder.folderId,
        count: folder.sentenceCount || 0,
      }));
      const sorted = sortFoldersByLatest(folders);
      const colors = generateColorClasses(sorted.length);

      setAllFolders(sorted);
      setAllColors(colors);
      setDrawerList(sorted);
      setColorClasses(colors);
    } catch (err) {
      console.error('서버에서 폴더 목록 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  // ✅ 검색어 필터링 (이름 기준)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setDrawerList(allFolders);
      setColorClasses(allColors);
    } else {
      const filtered = allFolders.filter((folder) =>
        folder.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const filteredIndexes = filtered.map((f) =>
        allFolders.findIndex((af) => af.folderId === f.folderId)
      );
      setDrawerList(filtered);
      setColorClasses(filteredIndexes.map((i) => allColors[i]));
    }
  }, [searchTerm, allFolders, allColors]);

  // ✅ 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddFolder = () => setShowModal(true);

  // ✅ 폴더 생성
  const handleConfirm = async () => {
    if (!newFolderName.trim()) return;

    try {
      const res = await api.post('/api/recovery/folder/create', {
        folderName: newFolderName.trim(),
      });

      const newFolder = {
        title: res.data.folderName,
        folderId: res.data.folderId,
        count: 0,
      };
      const newColor = `color-${Math.floor(Math.random() * COLOR_CLASS_COUNT) + 1}`;

      const updatedFolders = sortFoldersByLatest([...allFolders, newFolder]);
      const updatedColors = [newColor, ...allColors];

      setAllFolders(updatedFolders);
      setAllColors(updatedColors);
      setDrawerList(updatedFolders);
      setShowModal(false);
      setNewFolderName('');
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.includes('이미 존재')
      ) {
        Swal.fire('중복된 이름', '이미 존재하는 폴더 이름이에요.', 'warning');
      } else {
        console.error('폴더 생성 실패:', error);
        Swal.fire('생성 실패', '새 폴더를 만드는 데 실패했어요.', 'error');
      }
    }
  };

  // ✅ 폴더 수정
  const handleEditConfirm = async () => {
    if (!editFolderName.trim()) return;

    try {
      await api.put('/api/recovery/folder/update', {
        folderId: drawerList[editTargetIndex].folderId,
        updatedName: editFolderName.trim(),
      });

      const updatedFolders = allFolders.map((folder) =>
        folder.folderId === drawerList[editTargetIndex].folderId
          ? { ...folder, title: editFolderName.trim() }
          : folder
      );

      setAllFolders(updatedFolders);
      setDrawerList(updatedFolders);
      setShowEditModal(false);
      setEditTargetIndex(null);

      // ✅ 수정 완료 알림
      Swal.fire('수정 완료', '폴더 이름이 성공적으로 수정되었어요.', 'success');
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.includes('이미 존재')
      ) {
        Swal.fire('중복된 이름', '이미 존재하는 폴더 이름이에요.', 'warning');
      } else {
        Swal.fire('수정 실패', '폴더 이름 수정 중 문제가 발생했어요.', 'error');
      }
    }
  };

  // ✅ 폴더 삭제
  const handleDelete = async (index) => {
    const targetFolder = drawerList[index];

    try {
      await api.delete('/api/recovery/folder', {
        data: { folderId: targetFolder.folderId },
      });

      const updatedFolders = allFolders.filter(
        (f) => f.folderId !== targetFolder.folderId
      );
      const idxToDelete = allFolders.findIndex(
        (f) => f.folderId === targetFolder.folderId
      );
      const updatedColors = allColors.filter((_, i) => i !== idxToDelete);

      setAllFolders(updatedFolders);
      setAllColors(updatedColors);
      setSearchTerm('');
      setActiveMenuIndex(null);
      setDeleteTargetIndex(null);
      setShowDeleteModal(false);

      // ✅ 삭제 완료 알림
      Swal.fire('삭제 완료', '폴더가 성공적으로 삭제되었어요.', 'success');
    } catch (err) {
      console.error('❌ 폴더 삭제 실패:', err);
      Swal.fire('삭제 실패', '폴더를 삭제하는 데 실패했어요.', 'error');
    }
  };

  const handleFolderClick = (idx) => {
    setExpandedFolderIndex(idx === expandedFolderIndex ? null : idx);
  };

  return (
    <div className="mind-drawer-container">
      <div className="mind-drawer-header-wrapper">
        <div className="mind-drawer-header">
          <button
            className="mind-drawer-back-button"
            onClick={() => window.history.back()}
          >
            ←
          </button>
          <h2 className="mind-drawer-title">마음 서랍장</h2>
        </div>
      </div>

      <div className="mind-drawer-top-buttons">
        <button className="icon-button" onClick={handleAddFolder}>
          ＋
        </button>
        <button
          className="icon-button"
          onClick={() => {
            setShowSearch((prev) => {
              const next = !prev;
              if (!next) setSearchTerm('');
              return next;
            });
          }}
        >
          <BiSearch size={20} />
        </button>
        {showSearch && (
          <input
            type="text"
            className="search-input"
            placeholder="폴더를 검색해보세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>새 폴더 추가</h3>
            <input
              type="text"
              placeholder="폴더 이름을 입력하세요"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowModal(false);
                  setNewFolderName('');
                }}
              >
                취소
              </button>
              <button className="confirm-btn" onClick={handleConfirm}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mind-drawer-list">
        {drawerList.length === 0 ? (
          <p className="no-folder-message">검색된 폴더가 없습니다.</p>
        ) : (
          drawerList.map((item, idx) => (
            <div
              key={item.folderId}
              className={`mind-card ${colorClasses[idx] || 'color-1'}`}
              onClick={() => handleFolderClick(idx)}
            >
              <div className="folder-tab" />
              <div className="folder-inner">
                <div
                  className="folder-header"
                  onClick={() => handleFolderClick(idx)}
                >
                  <div
                    className="folder-menu-wrapper"
                    ref={activeMenuIndex === idx ? menuRef : null}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuIndex(
                          activeMenuIndex === idx ? null : idx
                        );
                      }}
                    >
                      ⋮
                    </span>
                    {activeMenuIndex === idx && (
                      <div className="folder-menu-buttons">
                        <button
                          className="folder-menu-buttons-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditTargetIndex(idx);
                            setEditFolderName(item.title);
                            setShowEditModal(true);
                            setActiveMenuIndex(null); // 닫기
                          }}
                        >
                          수정
                        </button>
                        <button
                          className="folder-menu-buttons-update"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTargetIndex(idx);
                            setShowDeleteModal(true);
                            setActiveMenuIndex(null); // 닫기
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="folder-icon">
                    <AiFillHeart />
                  </span>
                  <span className="folder-title">{item.title}</span>
                  <span className="folder-count">{item.count}</span>
                </div>

                {expandedFolderIndex === idx && (
                  <div
                    className="folder-inner-wrapper"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FolderDetailView
                      folder={{ ...item, colorClass: colorClasses[idx] }}
                      onSentenceDelete={fetchFolders}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>폴더 이름 수정</h3>
            <input
              type="text"
              value={editFolderName}
              onChange={(e) => setEditFolderName(e.target.value)}
            />
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowEditModal(false);
                  setEditTargetIndex(null);
                }}
              >
                취소
              </button>
              <button className="confirm-btn" onClick={handleEditConfirm}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>정말 삭제하시겠습니까?</h3>
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTargetIndex(null);
                }}
              >
                취소
              </button>
              <button
                className="confirm-btn"
                onClick={() => handleDelete(deleteTargetIndex)}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MindDrawerPage;
