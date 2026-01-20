const formatCount = (count) => {
  if (count < 1000) return count;

  if (count < 1_000_000) {
    const value = count / 1000;
    return value % 1 === 0 ? `${value}k` : `${value.toFixed(1)}k`;
  }

  const value = count / 1_000_000;
  return value % 1 === 0 ? `${value}M` : `${value.toFixed(1)}M`;
};


export default formatCount;
