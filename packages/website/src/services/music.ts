import { T_Object, T_Primitive, T_Song } from "~/types";
import http from "~/utils/http";
import { sortBy, transformObjectKeysFromSnakeCaseToLowerCamelCase } from "~/utils/misc";

class MusicService {
  constructor() {
    this.fetchSongsList = this.fetchSongsList.bind(this);
  }

  async fetchSongsList(): Promise<T_Song[]> {
    const songs = (await this.fetchData())
      .filter((song) => {
        return song.is_published;
      })
      .map((song) => {
        return transformObjectKeysFromSnakeCaseToLowerCamelCase({
          ...song,
          chords: song.chords.sort(),
          sources: song.sources.sort(
            sortBy([
              { param: "score", order: "desc" },
              { param: "title", order: "asc" },
            ]),
          ),
        }) as T_Song;
      });

    const listOfChords = songs.find((song) => !song.artist);

    return (listOfChords ? [listOfChords] : []).concat(
      songs
        .filter((song) => !!song.artist)
        .sort(
          sortBy([
            { param: "progress", order: "desc" },
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

  private async fetchData(): Promise<T_Object> {
    const response = await http.get(
      `${process.env.NEXT_PUBLIC_ASSETS_SERVER}/pages/music/data.json`,
    );
    return response.data.songs;
  }
}

export default new MusicService();
