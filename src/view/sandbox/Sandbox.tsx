import { useContext } from 'react';

import { Card } from '@chakra-ui/react';

import LearnBoxProvider, { LearnBoxContext, LearnBoxType } from '@/contexts/LearnBoxContext';

import NoChoseVideo from './components/NoChoseVideo';
import LearnBox from './LearnBox';

const SandBoxCard = () => {
  const { videoId } = useContext(LearnBoxContext) as LearnBoxType;

  return (
    <Card p={4} minH="100vh">
      {videoId !== '' ? <LearnBox /> : <NoChoseVideo />}
    </Card>
  );
};

const Sandbox = () => {
  return (
    <LearnBoxProvider>
      <SandBoxCard />
    </LearnBoxProvider>
  );
};

export default Sandbox;
