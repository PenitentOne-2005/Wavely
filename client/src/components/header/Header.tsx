"use client";

import type { HeaderProps } from "./interface";
import styles from "./Header.module.css";

const Header = ({ searchQuery, setSearchQuery, onSearch }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Мой Музыкальный Сервис</h1>

      <form onSubmit={onSearch} className={styles.form}>
        <input
          type="text"
          placeholder="Что хотите послушать?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Найти
        </button>
      </form>
    </header>
  );
};

export default Header;
