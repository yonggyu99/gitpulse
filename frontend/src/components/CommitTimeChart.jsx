import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getUserRepos, getRepoCommits } from "../apis/github";
import { getCommitTime } from "../utils/commitTime";
import css from "./CommitTimeChart.module.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

const CommitTimeChart = ({ username }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 최신 5개 레포 가져오기
        const repos = await getUserRepos(username, 1, 5);
        const allDates = [];

        // 각 레포에서 30개 커밋 가져와서 날짜만 추출
        for (const repo of repos) {
          const commits = await getRepoCommits(username, repo.name, 30);
          commits
            .map((c) => c.commit?.author?.date)
            .filter(Boolean)
            .forEach((d) => allDates.push(d));
        }

        // 시간대별 집계
        const stats = getCommitTime(allDates);
        setChartData(stats);
      } catch (err) {
        console.error("차트 데이터 불러오기 실패:", err);
      }
    };

    if (username) fetchData();
  }, [username]);

  const total = chartData.reduce((sum, cur) => sum + cur.value, 0);

  return (
    <div className={css.chartWrapper}>
      <div className={css.chartContainer}>
        <PieChart width={280} height={280}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            label
          >
            {chartData.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* 색상 범례: 한 줄 가로 정렬 */}
      <div className={css.colorLegend}>
        {chartData.map((item, idx) => (
          <div key={item.name} className={css.colorLegendItem}>
            <span
              className={css.dot}
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      {/* 퍼센트 리스트: 세로 정렬 */}
      <div className={css.percentageList}>
        {chartData.map((item) => (
          <div key={item.name}>
            {item.name}:{" "}
            {total > 0 ? Math.round((item.value / total) * 100) : 0}%
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommitTimeChart;
