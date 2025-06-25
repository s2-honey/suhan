import { useNavigate } from 'react-router-dom';
import '../../styles/Terms.css';
import { useDrawerStore } from '../../stores/useDrawerStore';

export default function Terms() {
  const navigate = useNavigate();
  const { setShouldAutoOpen } = useDrawerStore();

  return (
    <div className="terms-container">
      <div className="terms-header">
        <span
          className="terms-back"
          onClick={() => {
            setShouldAutoOpen(true); // 플래그 설정
            navigate('/main');
          }}
        >
          ←
        </span>
        <span className="terms-title">서비스 이용약관</span>
      </div>

      <div className="terms-body">
        <h4>[면책 조항]</h4>
        <div className="terms-box">
          <p>
            본 앱에서 제공하는 모든 심리상담 서비스는 정신의학적 진단, 치료,
            의료행위를 목적으로 하지 않으며, 보조적 예방과 목적의 정서지원
            서비스입니다.
          </p>
          <p>
            사용자는 상담 결과를 참고용으로만 사용해야 하며, 정확한 진단은
            전문적인 자격을 갖춘 전문가와 상의해야 합니다.
          </p>
          <p>
            본 앱은 제공된 정보나 상담 내용에 대해 책임지지 않으며, 이용자의
            자율적인 판단 하에 활용됩니다.
          </p>
          <p>
            심리적 위급 상황이나 응급위치는 즉시 전문 의료기관이나 긴급 전화를
            이용하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}
