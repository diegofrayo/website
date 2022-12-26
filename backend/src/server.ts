import App from "~/app";
import BlogController from "~/routes/blog";
import MusicController from "~/routes/music";

new App([BlogController, MusicController]).start();
