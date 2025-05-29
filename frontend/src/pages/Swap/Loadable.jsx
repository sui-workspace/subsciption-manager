import LoadingIndicator from '@/components/LoadingIndicator';
import loadable from '@/utils/loadable';

// eslint-disable-next-line react-refresh/only-export-components
export default loadable(() => import('./index'), {
  fallback: <LoadingIndicator />
});
