import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

const Contact = lazy(() => import('@pages/contact/contact'))
const Lead = lazy(() => import('@pages/lead/lead'))
const AppLayout = lazy(() => import('@/pages/_layout/app-layout'))
const AuthLayout = lazy(() => import('@/pages/_layout/auth-layout'))
const SignIn = lazy(() => import('@pages/auth/sign-in/sign-in'))
const NotFound = lazy(() => import('@/components/errors/not-found-error'))
const Forbidden = lazy(() => import('@/components/errors/forbidden-error'))
const Dashboard = lazy(() => import('@/pages/dashboard/dashboard'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <AppLayout />
      </>
    ),
    errorElement: <NotFound />,
    children: [
      { path: 'contacts', element: <Contact /> },
      { path: 'leads', element: <Lead /> },
      { path: 'dashboard', element: <Dashboard /> },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [{ path: '/sign-in', element: <SignIn /> }],
  },

  {
    path: '/errors',
    children: [{ path: '/errors/forbidden', element: <Forbidden /> }],
  },
])
