const JOB_TITLE = "Software Developer";
const SHORT_NAME = "Diego Rayo";
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

module.exports = {
  SEO_METADATA: {
    title: `${SHORT_NAME} | ${JOB_TITLE}`,
    description:
      "Hi, I'm Diego, a Software Developer. I have over 5 years of experience developing Web Solutions. I usually work using JavaScript, React, Next.js, Tailwind CSS, Node.js, and GraphQL.",
    url: WEBSITE_URL,
  },
  WEBSITE_METADATA: {
    email: "diegofrayo@gmail.com",
    jobTitle: JOB_TITLE,
    fullName: "Diego Fernando Rayo Zamora",
    shortName: SHORT_NAME,
    url: WEBSITE_URL,
    urlProd: "https://diegofrayo.vercel.app",
    username: "diegofrayo",
    social: {
      github: "https://www.github.com/diegofrayo",
      linkedin: "https://www.linkedin.com/in/diegofrayo",
      twitter: "https://www.twitter.com/diegofrayo",
      spotify:
        "https://open.spotify.com/user/225gv7ppksrad4xzfwoyej4iq?si=iITcpGN7RjiwbgTFXy5P6Q",
      "500px": "https://500px.com/p/diegofrayo?view=photos",
    },
  },
};
