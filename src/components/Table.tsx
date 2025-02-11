import { RecordType } from "../types/common";

export const Table = <T extends RecordType>({ records }: { records: Array<T> }) => (
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
