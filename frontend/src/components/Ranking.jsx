import rank0 from '@/images/ranks/rank-0.png';
import rank1 from '@/images/ranks/rank-1.png';
import rank2 from '@/images/ranks/rank-2.png';
import rank3 from '@/images/ranks/rank-3.png';
import rank4 from '@/images/ranks/rank-4.png';
import rank5 from '@/images/ranks/rank-5.png';
import rank6 from '@/images/ranks/rank-6.png';
import rank7 from '@/images/ranks/rank-7.png';

const RANKS = [rank0, rank1, rank2, rank3, rank4, rank5, rank6, rank7];

const Ranking = ({ rank, size = 32 }) => {
  return <img src={RANKS[rank]} alt={`Rank ${rank}`} width={size} />;
};

export default Ranking;
