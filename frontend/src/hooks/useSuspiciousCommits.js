import { useEffect, useState } from "react";
import { fetchWithToken } from "../apis/github";

export const useSuspiciousCommits = ({ name, repo }) => {
  const [suspiciousCommits, setSuspiciousCommits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuspicious = async () => {
      setLoading(true);
      const since = new Date(
        Date.now() - 14 * 24 * 60 * 60 * 1000
      ).toISOString(); // 2주

      if (!name || !repo) return;
      const commits = await fetchWithToken(
        `/repos/${name}/${repo}/commits?since=${since}`,
        {
          per_page: 50,
        }
      );

      if (!commits || !commits.length) {
        setLoading(false);
        return;
      }

      const results = [];

      for (const commit of commits) {
        try {
          const sha = commit.sha;
          const detail = await fetchWithToken(
            `/repos/${name}/${repo}/commits/${sha}`
          );

          const files = detail.files || [];
          const message = detail.commit.message;
          const additions = detail.stats.additions;
          const deletions = detail.stats.deletions;

          const reasons = [];
          let score = 0;

          if (message.length < 6) {
            score += 3;
            reasons.push("커밋 메세지가 너무 짧습니다.");
          }
          if (additions + deletions < 6) {
            score += 10;
            reasons.push("변경량이 적습니다.");
          }
          if (files.length <= 1) {
            score += 3;
            reasons.push("파일 1개만 변경되었습니다.");
          }

          // 수정된 내용이 콘솔만 있는 경우
          const onlyConsole = files.every((file) => {
            if (!file.patch) return false;
            const patchLines = file.patch.split("\n");
            const addedLines = patchLines.filter(
              (line) => line.startsWith("+") && !line.startsWith("+++")
            );
            const removedLines = patchLines.filter(
              (line) => line.startsWith("-") && !line.startsWith("---")
            );
            const isOnlyConsole = [...addedLines, ...removedLines].every(
              (line) => /console\.log/.test(line)
            );

            return isOnlyConsole;
          });

          if (onlyConsole) {
            score += 10;
            reasons.push("console.log만 수정되었습니다.");
          }

          const nonCodeFilesOnly = files.every(
            (file) =>
              /\.(md|json|yml|lock|env|txt)$/i.test(file.filename) ||
              !/\.(js|ts|jsx|tsx|java|py|go|cpp|cs|css)$/i.test(file.filename)
          );
          if (nonCodeFilesOnly) {
            score += 10;
            reasons.push("코드 파일 아님이 아닙니다.");
          }

          if (score >= 5) {
            results.push({
              sha,
              author: commit.commit.author?.name || "unknown",
              date: commit.commit.author?.date || "unknown",
              message,
              additions,
              deletions,
              fileCount: files.length,
              files,
              containsConsole: onlyConsole,
              reasons,
              score,
              isSuspicious: true,
            });
          }
        } catch (err) {
          console.error("허수 분석 실패", err);
        }
      }

      setSuspiciousCommits(results);
      setLoading(false);
    };
    fetchSuspicious();
  }, [name, repo]);

  return {
    suspiciousCommits,
    loading,
  };
};
