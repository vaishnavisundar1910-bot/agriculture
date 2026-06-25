src/App.tsx [77 lines]
     1|import { lazy, Suspense } from 'react';
     2|import {
     3|  Outlet,
     4|  RouterProvider,
     5|  createBrowserRouter,
     6|  type RouteObject,
     7|} from 'react-router-dom';
     8|
     9|import AiroErrorBoundary from '../dev-tools/src/AiroErrorBoundary';
    10|import CookieBannerErrorBoundary from '@/components/CookieBannerErrorBoundary';
    11|import RootLayout from './layouts/RootLayout';
    12|import Spinner from './components/Spinner';
    13|import { routes } from './routes';
    14|
    15|const CookieBanner = lazy(() =>
    16|  import('@/components/CookieBanner').catch((error) => {
    17|    console.warn('Failed to load CookieBanner:', error);
    18|    return { default: () => null };
    19|  })
    20|);
    21|
    22|const SpinnerFallback = () => (
    23|  <div className="flex justify-center py-8 h-screen items-center">
    24|    <Spinner />
    25|  </div>
    26|);
    27|
    28|const rootElement = (
    29|  <Suspense fallback={<SpinnerFallback />}>
    30|    <RootLayout>
    31|      <Outlet />
    32|    </RootLayout>
    33|  </Suspense>
    34|);
    35|
    36|// Wrap the agent-editable flat `routes` array in a layout route so ScrollRestoration
    37|// + shared chrome live once above every page. Keeping the wrap here (instead of
    38|// in routes.tsx) preserves the agent's simple flat-route contract. The dev
    39|// boundary must live inside the route element so React Router doesn't replace it
    40|// with its default route error UI before our boundary can catch render errors.
    41|//
    42|// `captureGlobalErrors={false}`: the ROOT boundary in main.tsx owns the global
    43|// window.onerror/unhandledrejection handlers. This inner boundary only catches
    44|// route render errors via componentDidCatch — installing window handlers here
    45|// too would double-forward async errors and stack a second overlay.
    46|const routeTree: RouteObject[] = [
    47|  {
    48|    element:
    49|      import.meta.env.MODE === 'development' ? (
    50|        <AiroErrorBoundary captureGlobalErrors={false}>{rootElement}</AiroErrorBoundary>
    51|      ) : (
    52|        rootElement
    53|      ),
    54|    children: routes,
    55|  },
    56|];
    57|
    58|const router = createBrowserRouter(routeTree);
    59|
    60|export default function App() {
    61|  return (
    62|    <>
    63|      <RouterProvider router={router} />
    64|      {/*
    65|        CookieBanner reads document.cookie and subscribes to browser events.
    66|        App.tsx is client-only (entry-server.tsx renders the route tree
    67|        directly without importing App), so no SSR gate is needed here.
    68|      */}
    69|      <CookieBannerErrorBoundary>
    70|        <Suspense fallback={null}>
    71|          <CookieBanner />
    72|        </Suspense>
    73|      </CookieBannerErrorBoundary>
    74|    </>
    75|  );
    76|}
    77|
