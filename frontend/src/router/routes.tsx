import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { MainLayout } from '@/layouts/MainLayout';

const HomePage = lazy(() =>
  import('@/pages/Home').then((module) => ({ default: module.HomePage }))
);
const PropertyCreatePage = lazy(() =>
  import('@/pages/PropertyCreate').then((module) => ({ default: module.PropertyCreatePage }))
);
const PropertyUpdatePage = lazy(() =>
  import('@/pages/PropertyUpdate').then((module) => ({ default: module.PropertyUpdatePage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound').then((module) => ({ default: module.NotFoundPage }))
);

const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense
        fallback={
          <div className="flex h-screen w-screen items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'properties/create',
        element: (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <PropertyCreatePage />
          </Suspense>
        ),
      },
      {
        path: 'properties/:id/edit',
        element: (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <PropertyUpdatePage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export { routes };
