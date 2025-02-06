import { ChangeEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

export const App = () => {
  const { filtredJokes, error, isLoading, strain } = useJokes(3);

  const renderContent = () => {
    if (isLoading) return <p style={{ color: "#6495EC", fontSize: "28px" }}>Loading...</p>;
    else if (error) return <p style={{ color: "#FF9999", fontSize: "24px" }}>{error}</p>;
    else
      return (
        <section style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <TextInput onChange={strain} deferral={300} />
          <Table<JokeType> records={filtredJokes} />
        </section>
      );
  };

  return (
    <main style={{ padding: "20px", fontFamily: "Arial, sans-serif", color: "#495057" }}>
      <h1 style={{ marginBottom: "30px" }}>Chuck Norris Jokes</h1>
      {renderContent()}
    </main>
  );
};

const TextInput = memo(({ onChange, deferral }: { onChange?: (text: string) => void; deferral?: number }) => {
  const memorizedOnChange = useMemo(() => {
    const handleEvent = (event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value);
    return deferral ? debounce(handleEvent, deferral) : handleEvent;
  }, [deferral, onChange]);

  return (
    <input
      style={{ padding: "8px 12px", width: "30%", fontSize: "22px", borderRadius: "5px", color: "#52796f" }}
      placeholder="Filter jokes..."
      onChange={memorizedOnChange}
      type="text"
    />
  );
});

const Table = <T extends RecordType>({ records }: { records: Array<T> }) => (
  <table border={1} cellPadding={5} style={{ width: "100%", borderCollapse: "collapse", fontSize: "20px" }}>
    <thead>
      <tr>
        <th style={{ width: "75px" }}>#</th>
        <th>Joke</th>
      </tr>
    </thead>
    <tbody>
      {records.length > 0 ? (
        records.map((info) => (
          <tr key={info.id}>
            <td style={{ textAlign: "center", width: "75px" }}>
              <img src={info.icon_url} />
            </td>
            <td>{info.value}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td style={{ textAlign: "center", width: "75px" }}>...</td>
          <td style={{ textAlign: "center", color: "#006d77" }}>There are no records</td>
        </tr>
      )}
    </tbody>
  </table>
);

const useJokes = (count: number) => {
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

const fetchJokes = async (amount: number): Promise<Array<JokeType>> => {
  if (amount <= 0) return [];

  const fetchers = Array.from({ length: amount }, () =>
    fetch(API_URL).then<JokeType>((response) => {
      if (response.ok) return response.json();
      else throw new Error("Failed to fetch joke");
    })
  );

  return await Promise.all(fetchers);
};

const debounce = <T extends (...args: any[]) => unknown>(func: T, delay?: number) => {
  if (delay) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  } else return func;
};

const API_URL = "https://api.chucknorris.io/jokes/random";

type JokeType = RecordType & { url: string };

type RecordType = { id: string; icon_url: string; value: string };
