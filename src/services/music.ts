import http from "~/lib/http";
import type { T_Object, T_Primitive, T_Song } from "~/types";
import { sortBy, transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/misc";

class MusicService {
  constructor() {
    this.fetchSongsList = this.fetchSongsList.bind(this);
  }

  async fetchSongsList(): Promise<T_Song[]> {
    const songs = (await this.fetchData()).map((song) => {
      return transformObjectKeysFromSnakeCaseToLowerCamelCase({
        ...song,
        artist: Array.isArray(song.artist) ? song.artist.join(", ") : song.artist,
        chords: song.chords.sort(),
        sources: (song.sources || []).sort(
          sortBy([
            { param: "order", order: "asc" },
            { param: "title", order: "asc" },
          ]),
        ),
      }) as T_Song;
    });

    const chordsPage = songs.find((song) => this.isChordsPage(song));

    return (chordsPage ? [chordsPage] : []).concat(
      songs
        .filter((song) => !this.isChordsPage(song))
        .sort(
          sortBy([
            { param: "progress", order: "desc" },
            { param: "order", order: "desc" },
            { param: "title", order: "asc" },
          ]),
        ),
    );
  }

  async getSong(config: Record<"id", T_Primitive>): Promise<T_Song> {
    const songs = await this.fetchSongsList();
    const song = songs.find((song) => song.id === config.id);

    if (song === undefined) {
      throw new Error(`Song not found. { config: "${JSON.stringify(config)}" }`);
    }

    return song;
  }

  isChordsPage(song) {
    return song.id === "chords";
  }

  private async fetchData(): Promise<T_Object> {
    const { data } = await http.post(
      `${process.env.NEXT_PUBLIC_ASSETS_SERVER_URL}/api/diegofrayo`,
      {
        path: "/assets",
        payload: "music",
        source: "firebase",
      },
    );

    return data.songs;
  }
}

export default new MusicService();
