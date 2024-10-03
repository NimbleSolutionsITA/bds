import {useEffect, useState} from "react";

const useClientSideRendering = () => {
	  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
	setIsClient(true);
  }, []);

  return isClient;
}

export default useClientSideRendering;