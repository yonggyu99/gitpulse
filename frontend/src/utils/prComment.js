// PR review 라인 몇번째 줄인지 찾기
export const getPositionInPatch = (patch, targetIndex) => {
  const lines = patch.split("\n");
  let position = 0;

  for (let i = 0; i <= targetIndex; i++) {
    const line = lines[i];
    if (line.startsWith("+++")) continue;
    if (line.startsWith("---")) continue;

    position++;
  }

  return position;
};
