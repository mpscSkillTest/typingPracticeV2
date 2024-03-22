import { useEffect, useState } from "react";

export type HashParams = Record<string, string>;

function useHashParams() {
  const [hashParams, setHashParams] = useState<HashParams>({});

  useEffect(() => {
    // this added to handle access token provided by supabase
    const hash = window.location.hash.substring(1); // Remove the leading '#'
    const params = new URLSearchParams(hash);
    const paramsObject: HashParams = {};
    for (const [key, value] of params) {
      paramsObject[key] = value;
    }
    setHashParams(paramsObject);
  }, []);

  return hashParams;
}

export default useHashParams;
