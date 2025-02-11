import { JokeType } from "../types/common";
import { API_URL } from "./constants";

export const fetchJokes = async (amount: number): Promise<Array<JokeType>> => {
  if (amount <= 0) return [];

  const fetchers = Array.from({ length: amount }, () =>
    fetch(API_URL).then<JokeType>((response) => {
      if (response.ok) return response.json();
      else throw new Error("Failed to fetch joke");
    })
  );

  return await Promise.all(fetchers);
};
