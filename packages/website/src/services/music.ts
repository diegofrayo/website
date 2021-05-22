import Data from "~/data/music/songs.json";
import { T_Primitive, T_Song } from "~/types";
import {
  isDevelopmentEnvironment,
  sortBy,
  transformObjectKeysFromSnakeCaseToLowerCamelCase,
} from "~/utils/misc";

class MusicService {
  async fetchSongsList(): Promise<T_Song[]> {
    const songs = Data.songs
      .filter((song) => {
        if (!song.id) return false;
        if (isDevelopmentEnvironment()) return true;
        return song.is_published;
      })
      .map((song) => {
        return transformObjectKeysFromSnakeCaseToLowerCamelCase(song) as T_Song;
      })
      .sort(
        sortBy([
          { param: "progress", order: "desc" },
          { param: "title", order: "asc" },
        ]),
      );

    const listOfChords = songs.find((song) => !song.artist);

    return (listOfChords ? [listOfChords] : []).concat(songs.filter((song) => !!song.artist));
  }

  async getSong(config: Record<"id", T_Primitive>): Promise<T_Song> {
    const songs = await this.fetchSongsList();
    const song = songs.find((song) => song.id === config.id);

    if (song === undefined) {
      throw new Error(`Song not found. { config: "${JSON.stringify(config)}" }`);
    }

    return song;
  }
}

export default new MusicService();
