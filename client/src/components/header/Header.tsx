"use client";

import type { HeaderProps } from "./interface";

const Header = ({ searchQuery, setSearchQuery, onSearch }: HeaderProps) => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
      }}
    >
      <h1>Мой Музыкальный Сервис</h1>

      <form onSubmit={onSearch} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Что хотите послушать?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "1px solid #333",
            backgroundColor: "#1f1f1f",
            color: "#fff",
            width: "250px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#1db954",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Найти
        </button>
      </form>
    </header>
  );
};

export default Header;
