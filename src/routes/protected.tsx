import { Icon } from '@chakra-ui/react';
import { AiFillCustomerService } from 'react-icons/ai';
import { MdHome } from 'react-icons/md';
import { RouteObject } from 'react-router-dom';

import { RouteClass } from '@/constant/index';
import SandBox from '@/view/sandbox/Sandbox';

export const menuRoutes: RoutesType[] = [
  {
    name: 'Main Dashboard',
    classification: RouteClass.PRIVATE,
    path: '/',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: () => <></>,
  },
  {
    name: 'Sandbox Learning',
    classification: RouteClass.PRIVATE,
    path: '/sandbox',
    icon: <Icon as={AiFillCustomerService} width="20px" height="20px" color="inherit" />,
    component: SandBox,
  },
];

export const protectedRoutes: RouteObject[] = menuRoutes
  .filter((route) => route.classification === RouteClass.PRIVATE)
  .map((route) => ({ path: route.path, element: <route.component /> }));
