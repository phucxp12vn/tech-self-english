import { useContext } from 'react';

import { Select } from '@chakra-ui/react';

import { LearnBoxContext, LearnBoxType } from '@/contexts/LearnBoxContext';
import { useGetTranscriptTitle } from '@/hook/useTranscript';

const SelectLearnVideo = () => {
  const { videoId, updateVideoId } = useContext(LearnBoxContext) as LearnBoxType;
  const { data: videoTitles } = useGetTranscriptTitle();

  const handleSelectVideo = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateVideoId(videoTitles?.[e.target.selectedIndex - 1].videoId ?? '');
  };

  return (
    <Select
      placeholder="Select video"
      value={(videoTitles ?? []).find((video) => video.videoId === videoId)?.title ?? ''}
      onChange={handleSelectVideo}
    >
      {videoTitles?.map(({ videoId, title }) => (
        <option key={videoId}>{title}</option>
      ))}
    </Select>
  );
};

export default SelectLearnVideo;
