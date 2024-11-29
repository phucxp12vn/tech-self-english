import { useContext, useEffect, useRef, useState } from 'react';

import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube';

import { LearnBoxContext, LearnBoxType } from '@/contexts/LearnBoxContext';
import { useGetTranscript, useUpdateTranscriptSettings } from '@/hook/useTranscript';
import { LearnModeType, LearnMode } from '@/types/learn';

import BoxAction from './components/boxAction/BoxAction';
import BoxContent from './components/BoxContent';
import SelectLearnPart from './components/SelectLearnPart';
import YoutubeVideo from './components/YoutubeVideo';

const availablePlaybackRates = [1, 0.75, 0.5];

const LearnBox = () => {
  const { videoId } = useContext(LearnBoxContext) as LearnBoxType;
  const { data: transcript } = useGetTranscript(videoId);
  const sentences = transcript?.sentences ?? [];
  const storyRange = transcript?.storyRange ?? 0;
  const startPoint = transcript?.startPoint ?? 0;
  const endPoint = transcript?.endPoint ?? 0;
  const [learnMode, setLearnMode] = useState<LearnModeType>(LearnMode.STORY);
  const playerVideo = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [sentenceIndex, setSentenceIndex] = useState(startPoint);
  const [playRateIndex, setPlayRateIndex] = useState(0);
  const [startStorySentence, setStartStorySentence] = useState(startPoint);
  const [endStorySentence, setEndStorySentence] = useState(endPoint);
  const { mutate: updateTranscriptSettings } = useUpdateTranscriptSettings(videoId);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setStartStorySentence(startPoint);
    setSentenceIndex(startPoint);
  }, [startPoint]);

  useEffect(() => {
    setEndStorySentence(endPoint);
  }, [endPoint]);

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
    playVideoSeekTo(sentenceIndex);
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

    playVideoSeekTo(newSentenceIndex);
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

      if (currentSentenceIndex === -1) {
        return;
      }

      switch (learnMode) {
        case LearnMode.SINGLE:
          currentSentenceIndex !== sentenceIndex && handlePlaySpecificSentence(sentenceIndex);
          break;
        case LearnMode.STORY:
          if (
            currentSentenceIndex < startStorySentence ||
            currentSentenceIndex >= endStorySentence
          ) {
            handlePlaySpecificSentence(startStorySentence);
          }

          setSentenceIndex((prevIndex) => {
            if (currentSentenceIndex === prevIndex) {
              return prevIndex;
            }

            return currentSentenceIndex >= endStorySentence
              ? startStorySentence
              : currentSentenceIndex;
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

  const handleChangeStorySentence = (startSentence: number, endSentence: number) => {
    setStartStorySentence(startSentence);
    setEndStorySentence(endSentence);
    handlePlaySpecificSentence(startSentence);
    updateTranscriptSettings({ storyRange, startPoint: startSentence, endPoint: endSentence });
  };

  const playVideoSeekTo = (sentenceIndex: number) => {
    const focusSentence = sentences[sentenceIndex];

    if (focusSentence) {
      playerVideo.current?.seekTo(focusSentence.startTime / 1000);
    }
  };

  if (!transcript) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <YoutubeVideo
        videoId={videoId}
        onReady={handlePlayerReady}
        onStateChange={handlePlayerChange}
      />
      <BoxAction />
      <SelectLearnPart
        partRange={storyRange}
        totalSentence={sentences.length}
        currentPart={Math.floor(startStorySentence / storyRange)}
        onChangeVideoPart={handleChangeStorySentence}
      />
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
