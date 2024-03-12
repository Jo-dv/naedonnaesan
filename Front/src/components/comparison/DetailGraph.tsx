import React, { useState, useEffect } from 'react';
import tw, { styled } from 'twin.macro';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

const GraphWrapper = styled.figure`
  ${tw`w-[80%] h-[400px]`}
`;
const Graph: React.FC<{ category: string | null }> = ({ category }) => {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  // 상태를 사용하여 창 크기 변화 감지
  const [, setWindowSize] = useState({
    width: window.innerWidth,
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };
    window.addEventListener('resize', handleResize);
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `OO동 OO동 ${category} 수 비교`,
      },
    },
    scales: {
      // 구분선 보이게
      x: { display: true },
      y: { display: true },
    },
  };

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: 'OO구 OO동',
        data: labels.map(() => [0, 122]),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'OO구 OO동',
        data: labels.map(() => [0, 232]),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <GraphWrapper>
      <Bar options={options} data={data} />
    </GraphWrapper>
  );
};

export default Graph;
