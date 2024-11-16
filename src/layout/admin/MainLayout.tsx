import { Portal, Box } from '@chakra-ui/react';
import { Outlet, useLocation } from 'react-router-dom';

import { menuRoutes as routes } from '@/routes';

import Navbar from './components/navbar/Navbar';
import Sidebar from './components/sidebar/SideBar';

const MainLayout = () => {
  const location = useLocation();
  const getActiveRoute = (routes: RoutesType[]): string => {
    const activeRoute = 'Default Brand Text';
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname === routes[i].path) {
        return routes[i].name;
      }
    }
    return activeRoute;
  };

  return (
    <Box>
      <Sidebar routes={routes} />
      <Box
        float="right"
        minHeight="100vh"
        height="100%"
        overflow="auto"
        position="relative"
        maxHeight="100%"
        w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
        maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
        transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
        transitionDuration=".2s, .2s, .35s"
        transitionProperty="top, bottom, width"
        transitionTimingFunction="linear, linear, ease"
      >
        <Portal>
          <Box>
            <Navbar brandText={getActiveRoute(routes)} secondary={true} fixed={true} />
          </Box>
        </Portal>
        <Box mx="auto" p={{ base: '20px', md: '30px' }} pe="20px" minH="100vh">
          <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
