const { DEFAULT_EXTENSIONS } = require('@babel/core');
const pkg = require('../package.json');

const isProd = process.env.BUILD === 'production';

const reactNamedExports = [
  'Children',
  'Component',
  'Fragment',
  'Profiler',
  'PureComponent',
  'StrictMode',
  'Suspense',
  '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  'cloneElement',
  'createContext',
  'createElement',
  'createFactory',
  'createRef',
  'forwardRef',
  'isValidElement',
  'lazy',
  'memo',
  'useCallback',
  'useContext',
  'useDebugValue',
  'useEffect',
  'useImperativeHandle',
  'useLayoutEffect',
  'useMemo',
  'useReducer',
  'useRef',
  'useState',
  'version'
];

const reactDOMNamedExports = [
  '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  'createPortal',
  'findDOMNode',
  'flushSync',
  'hydrate',
  'render',
  'unmountComponentAtNode',
  'unstable_batchedUpdates',
  'unstable_createPortal',
  'unstable_renderSubtreeIntoContainer',
  'version'
];

const reactIsNamedExports = [
  'AsyncMode',
  'ConcurrentMode',
  'ContextConsumer',
  'ContextProvider',
  'Element',
  'ForwardRef',
  'Fragment',
  'Lazy',
  'Memo',
  'Portal',
  'Profiler',
  'StrictMode',
  'Suspense',
  'isAsyncMode',
  'isConcurrentMode',
  'isContextConsumer',
  'isContextProvider',
  'isElement',
  'isForwardRef',
  'isFragment',
  'isLazy',
  'isMemo',
  'isPortal',
  'isProfiler',
  'isStrictMode',
  'isSuspense',
  'isValidElementType',
  'typeOf'
];

const extensions = [...DEFAULT_EXTENSIONS, '.jsx', '.ts', '.tsx'];

const commonExternal = ['react', 'react-is', 'styled-components'];

module.exports = {
  DEFAULT_EXTENSIONS,
  pkg,
  isProd,
  reactNamedExports,
  reactDOMNamedExports,
  reactIsNamedExports,
  extensions,
  commonExternal
};
