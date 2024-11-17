import { useContext, useEffect, useRef, useState } from 'react';

import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube';

import { LearnBoxContext, LearnBoxType } from '@/contexts/LearnBoxContext';
import { useGetTranscript } from '@/hook/useTranscript';
import { LearnModeType, LearnMode } from '@/types/learn';

import BoxAction from './components/boxAction/BoxAction';
import BoxContent from './components/BoxContent';
import YoutubeVideo from './components/YoutubeVideo';

const availablePlaybackRates = [1, 0.75, 0.5];

const LearnBox = () => {
  const { videoId } = useContext(LearnBoxContext) as LearnBoxType;
  const { data: transcript } = useGetTranscript(videoId);
  const sentences = transcript?.sentences ?? [];
  const [learnMode, setLearnMode] = useState<LearnModeType>(LearnMode.STORY);

  const playerVideo = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [playRateIndex, setPlayRateIndex] = useState(0);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    playerVideo.current = null;
    setSentenceIndex(0);
  }, [videoId]);

  useEffect(() => {
    handlePlaySpecificSentence(sentenceIndex);
  }, [learnMode]);

  const handlePlayerReady: YouTubeProps['onReady'] = (event) => {
    playerVideo.current = event.target;
    playerVideo.current.playVideo();
  };

  const handlePlayerChange: YouTubeProps['onStateChange'] = (event) => {
    switch (event.data) {
      case YouTube.PlayerState.CUED:
        playerVideo.current.playVideo();
        break;
      case YouTube.PlayerState.PLAYING:
        handlePlay();
        break;
      case YouTube.PlayerState.ENDED:
        playerVideo.current.seekTo(0);
        handlePauseOrEnd();
        break;
      case YouTube.PlayerState.PAUSED:
        handlePauseOrEnd();
        break;
    }
  };

  const handleChangePlayRate = () => {
    const newPlayRateIndex =
      playRateIndex === availablePlaybackRates.length - 1 ? 0 : playRateIndex + 1;
    const newPlayRate = availablePlaybackRates[newPlayRateIndex];
    playerVideo?.current.setPlaybackRate(newPlayRate);
    setPlayRateIndex(newPlayRateIndex);
  };

  const handleChangeLearnMode = () => {
    setLearnMode((preMode) => (preMode === LearnMode.SINGLE ? LearnMode.STORY : LearnMode.SINGLE));
  };

  const handlePlaySpecificSentence = (newSentenceIndex: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const focusSentence = sentences[newSentenceIndex];

    if (focusSentence) {
      playerVideo.current?.seekTo(focusSentence.startTime / 1000);
    }
  };

  const handlePlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const currentTime = playerVideo.current.getCurrentTime() * 1000;
      const currentSentenceIndex = sentences.findIndex(
        (sentence) => currentTime >= sentence.startTime && currentTime <= sentence.endTime
      );

      switch (learnMode) {
        case LearnMode.SINGLE:
          currentSentenceIndex !== -1 &&
            currentSentenceIndex !== sentenceIndex &&
            handlePlaySpecificSentence(sentenceIndex);
          break;
        case LearnMode.STORY:
          currentSentenceIndex >= 10 && playerVideo.current?.seekTo(0);
          setSentenceIndex((prevIndex) => {
            if (currentSentenceIndex === -1 || currentSentenceIndex === prevIndex) {
              return prevIndex;
            }

            return currentSentenceIndex >= 10 ? 0 : currentSentenceIndex;
          });
          break;
      }
    }, 60);
  };

  const handlePauseOrEnd = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleNext = () => {
    setSentenceIndex((preIndex) => {
      const newSentenceIndex = sentences?.length - 1 === preIndex ? preIndex : preIndex + 1;
      handlePlaySpecificSentence(newSentenceIndex);

      return newSentenceIndex;
    });
  };

  const handlePrevious = () => {
    setSentenceIndex((preIndex) => {
      const newSentenceIndex = preIndex === 0 ? 0 : preIndex - 1;
      handlePlaySpecificSentence(newSentenceIndex);

      return newSentenceIndex;
    });
  };

  return (
    <>
      <YoutubeVideo
        videoId={videoId}
        onReady={handlePlayerReady}
        onStateChange={handlePlayerChange}
      />
      <BoxAction />
      <BoxContent
        sentenceIndex={sentenceIndex}
        playRateIndex={playRateIndex}
        learnMode={learnMode}
        onNext={handleNext}
        onPrev={handlePrevious}
        onChangeRate={handleChangePlayRate}
        onChangeLeanMode={handleChangeLearnMode}
      />
    </>
  );
};

export default LearnBox;
