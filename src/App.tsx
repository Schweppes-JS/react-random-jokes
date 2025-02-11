import { Table } from "./components/Table";
import { TextInput } from "./components/TextInput";
import { useJokes } from "./hooks/use-jokes";
import { JokeType } from "./types/common";

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
