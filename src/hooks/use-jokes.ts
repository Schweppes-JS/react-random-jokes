import { useCallback, useEffect, useRef, useState } from "react";

import { fetchJokes } from "../helpers/api";
import { JokeType } from "../types/common";

export const useJokes = (count: number) => {
  const [filtredJokes, setFiltredJokes] = useState<Array<JokeType>>([]);
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(true);
  const allJokes = useRef<Array<JokeType>>([]);

  useEffect(() => {
    (async () => {
      try {
        const jokes = await fetchJokes(count);
        allJokes.current = jokes;
        setFiltredJokes(jokes);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [count]);

  const strain = useCallback((text: string) => {
    setFiltredJokes(text ? allJokes.current.filter((joke) => joke.value.toLowerCase().includes(text.toLowerCase())) : allJokes.current);
  }, []);

  return { filtredJokes, error, isLoading, strain };
};
