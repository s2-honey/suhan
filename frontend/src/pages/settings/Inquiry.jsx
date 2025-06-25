import { useNavigate } from 'react-router-dom';
import '../../styles/Inquiry.css';
import { useDrawerStore } from '../../stores/useDrawerStore';
import Swal from 'sweetalert2';

export default function Inquiry() {
  const navigate = useNavigate();
  const { setShouldAutoOpen } = useDrawerStore();

  const handleSubmit = () => {
    // 실제 전송 로직 생략 (API 연동 가능)
    Swal.fire({
      icon: 'success',
      title: '문의가 완료되었습니다.',
      confirmButtonText: '확인',
      confirmButtonColor: '#ff9f4a',
    }).then(() => {
      navigate('/main');
    });
  };

  return (
    <div className="inquiry-container">
      <div className="inquiry-header">
        <span
          className="inquiry-back"
          onClick={() => {
            setShouldAutoOpen(true); // 플래그 설정
            navigate('/main');
          }}
        >
          ←
        </span>
        <span className="inquiry-title">문의하기</span>
      </div>

      <div className="inquiry-body">
        <p className="inquiry-label">답변받으실 이메일</p>
        <input
          type="email"
          className="inquiry-input"
          placeholder="000님(이메일)"
        />
        <input className="inquiry-input" placeholder="제목" />
        <textarea className="inquiry-textarea" placeholder="내용 작성" />
        <button className="inquiry-submit" onClick={handleSubmit}>
          문의하기
        </button>
      </div>
    </div>
  );
}
