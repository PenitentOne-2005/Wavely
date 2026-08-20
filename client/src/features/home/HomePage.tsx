"use client";

import { useReducer } from "react";
import {
  homeReducer,
  initialState,
  useHomeActions,
  useHomeInit,
  useSyncPlayerQueue,
} from "./hooks";
import { Header, PlaylistList, TrackList } from "./components";
import { Loader } from "@/shared/ui";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const [state, dispatch] = useReducer(homeReducer, initialState);
  const {
    playlists,
    selectedPlaylist,
    playlistTracks,
    loading,
    playlistLoading,
    isCreating,
    newPlaylistName,
    searchQuery,
    tracks,
    searchLoading,
  } = state;

  const actions = useHomeActions(state, dispatch);
  const displayTracks = selectedPlaylist ? playlistTracks : tracks;

  useHomeInit(dispatch);
  useSyncPlayerQueue(displayTracks);

  if (loading) {
    return <Loader />;
  }

  return (
    <main className={styles.main}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={actions.setSearchQuery}
        onSearch={actions.handleSearch}
      />

      <div className={styles.content}>
        <PlaylistList
          playlists={playlists}
          selectedPlaylist={selectedPlaylist}
          onSelectPlaylist={actions.handleSelectPlaylist}
          isCreating={isCreating}
          setIsCreating={actions.setIsCreating}
          newPlaylistName={newPlaylistName}
          setNewPlaylistName={actions.setNewPlaylistName}
          onCreatePlaylist={actions.handleCreatePlaylist}
        />

        <TrackList
          selectedPlaylist={selectedPlaylist}
          searchQuery={searchQuery}
          searchLoading={searchLoading}
          playlistLoading={playlistLoading}
          displayTracks={displayTracks}
          playlists={playlists}
          onBackToPopular={actions.onBackToPopular}
          onAddTrackToPlaylist={actions.handleAddTrackToPlaylist}
          onRemoveTrackFromPlaylist={actions.handleRemoveTrackFromPlaylist}
        />
      </div>
    </main>
  );
};

export default HomePage;
