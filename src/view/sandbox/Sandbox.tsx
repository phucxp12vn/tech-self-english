import { useContext } from 'react';

import { Card } from '@chakra-ui/react';

import LearnBoxProvider, { LearnBoxContext, LearnBoxType } from '@/contexts/LearnBoxContext';

import NoChoseVideo from './components/NoChoseVideo';
import LearnBox from './LearnBox';

const Sandbox = () => {
  const { videoId } = useContext(LearnBoxContext) as LearnBoxType;

  return (
    <LearnBoxProvider>
      <Card p={4} minH="100vh">
        {videoId !== '' ? <LearnBox /> : <NoChoseVideo />}
      </Card>
    </LearnBoxProvider>
  );
};

export default Sandbox;
