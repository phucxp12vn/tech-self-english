import { useContext } from 'react';

import { ChevronLeftIcon, ChevronRightIcon, RepeatIcon } from '@chakra-ui/icons';
import { Box, Button, IconButton, Text, useColorModeValue } from '@chakra-ui/react';

import { LearnBoxContext, LearnBoxType } from '@/contexts/LearnBoxContext';
import { useGetTranscript } from '@/hook/useTranscript';
import { LearnMode } from '@/types/learn';

const availablePlaybackRates = [1, 0.75, 0.5];

const BoxContent = ({
  sentenceIndex,
  playRateIndex,
  learnMode,
  onNext,
  onPrev,
  onChangeRate,
  onChangeLeanMode,
}: any) => {
  const { videoId } = useContext(LearnBoxContext) as LearnBoxType;
  const { data: transcript } = useGetTranscript(videoId);
  const sentences = transcript?.sentences ?? [];
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const iconColor = useColorModeValue('brand.700', 'white');

  return (
    <Box
      rounded="16px"
      border="1px"
      borderColor="gray.200"
      px={10}
      py={5}
      position="relative"
      minHeight="300px"
    >
      <Button variant="outline" size="md" onClick={onChangeRate}>
        {availablePlaybackRates[playRateIndex]}x
      </Button>
      <IconButton
        onClick={onChangeLeanMode}
        aria-label="repeat"
        variant={learnMode === LearnMode.SINGLE ? 'outline' : 'ghost'}
        colorScheme={iconColor}
        ml={4}
        icon={<RepeatIcon />}
      />
      {sentences?.[sentenceIndex] ? (
        <Box h={'calc(100% - 80px)'}>
          <Text color={textColorPrimary} fontWeight="bold" fontSize="xl" mb="4px">
            {sentences?.[sentenceIndex].content}
          </Text>
        </Box>
      ) : (
        <Box>No data for transcript</Box>
      )}
      {(sentences?.length ?? 0) > 0 && (
        <Text>
          <strong>{sentenceIndex + 1}</strong>
          {`/${sentences?.length}`}
        </Text>
      )}
      <IconButton
        size="md"
        aria-label="previous"
        icon={<ChevronLeftIcon />}
        onClick={onPrev}
        position={'absolute'}
        left="0"
        top="50%"
        transform={'translateY(-50%)'}
      />
      <IconButton
        size="md"
        aria-label="next"
        icon={<ChevronRightIcon />}
        onClick={onNext}
        position={'absolute'}
        right="0"
        top="50%"
        transform={'translateY(-50%)'}
      />
    </Box>
  );
};

export default BoxContent;
