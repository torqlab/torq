import { useEffect, useState } from 'react';

/**
 * Removes OAuth callback parameters from URL.
 * Security: don't expose internal OAuth details.
*/
const useRemoveAuthUrlParameters = (): void => {
  const [hasAuthParams, setHasAuthParams] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authParams = ['code', 'state', 'scope'];

    authParams.forEach((param) => {
      if (urlParams.has(param)) {
        urlParams.delete(param);
        setHasAuthParams(true);
      }
    });

    if (hasAuthParams) {
      const newUrlParams = urlParams.toString() ? `?${urlParams.toString()}` : '';
      const cleanUrl = `${window.location.pathname}${newUrlParams}`;

      window.history.replaceState({}, '', cleanUrl);
    }
  }, []);
};

export default useRemoveAuthUrlParameters;
