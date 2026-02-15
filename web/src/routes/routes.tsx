import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

const Contact = lazy(() => import('@pages/contact/contact'))
const Lead = lazy(() => import('@pages/lead/lead'))
const SignIn = lazy(() => import('@pages/auth/sign-in/sign-in'))
const SignUp = lazy(() => import('@pages/auth/sign-up/sign-up'))
const Dashboard = lazy(() => import('@/pages/dashboard/dashboard'))

import { authLoader } from './loaders/auth-loader'
import AppLayout from '@/pages/_layout/app-layout'
import AuthLayout from '@/pages/_layout/auth-layout'
import NotFound from '@/components/errors/not-found-error'
import Forbidden from '@/components/errors/forbidden-error'

export const router = createBrowserRouter([
  {
    path: '/sign-in',
    element: <AuthLayout />,
    children: [{ index: true, element: <SignIn /> }],
  },
  {
    path: '/sign-up',
    element: <AuthLayout />,
    children: [{ index: true, element: <SignUp /> }],
  },
  {
    path: '/',
    loader: authLoader,
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'leads', element: <Lead /> },
      { path: 'contacts', element: <Contact /> },
    ],
  },
  {
    path: '/errors/forbidden',
    element: <Forbidden />,
  },
])
