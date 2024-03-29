import tw, { styled } from 'twin.macro';
import { useEffect, useState } from 'react';
import SearchBar from '../../utils/SearchBar';
import UseAxios from '../../utils/UseAxios';
import LikedDong from './reuse/LikedDong';

interface LikeProps {
  name: string | null;
}

const LikeWrapper = styled.section`
  ${tw`w-[90%]
  max-sm:flex-col max-sm:w-full max-sm:pt-5`}
`;
const LikeTop = styled.div`
  ${tw`flex justify-between mx-5 my-3
  max-sm:flex-col max-sm:mx-1`}
`;

const LikeTitle = styled.h1`
  ${tw`text-3xl font-bold w-[90%]
  max-sm:text-xl max-sm:mb-2 max-sm:mx-1`}
`;

const LikeContent = styled.ul`
  ${tw`flex-cc`}
`;

const Like: React.FC<LikeProps> = ({ name }) => {
  const [likedDongList, setLikedDongList] = useState<any[]>([]);
  const [searchDong, setSearchDong] = useState('');

  const axios = UseAxios();

  useEffect(() => {
    axios
      .get('/api/mypage/likelist')
      .then((response) => {
        const newLikedDongList = response.data.object.map((dong: any) => dong);
        setLikedDongList(newLikedDongList);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <LikeWrapper>
      <LikeTop>
        <LikeTitle>{name}님이 찜한 동네</LikeTitle>
        <SearchBar searchDong={searchDong} setSearchDong={setSearchDong} />
      </LikeTop>
      <LikeContent>
        {likedDongList.map((likedDong: any, index: number) => (
          <LikedDong
            key={index}
            likedDongName={likedDong.dongName}
            likedDongId={likedDong.dongId}
            setLikedDongList={setLikedDongList}
          />
        ))}
      </LikeContent>
    </LikeWrapper>
  );
};

export default Like;
