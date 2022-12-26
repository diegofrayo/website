import App from "~/app";
import BlogController from "~/routes/blog";
import MusicController from "~/routes/music";
import ReadingsController from "~/routes/readings";

new App([BlogController, MusicController, ReadingsController]).start();
