// Chart.js 3 이상부터는 반드시 Chart.register()를 개발자가 직접 해줘야 함
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// ⛔️ 없으면 radar 차트 안 뜨고 radialLinear 에러남
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
