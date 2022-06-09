import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  // Check for secret to confirm this is a valid request
  if (req.body.secret !== process.env["NEXT_PUBLIC_ISR_TOKEN"]) {
    console.log("Invalid token", req.query.secret, process.env["NEXT_PUBLIC_ISR_TOKEN"]);
    res.status(401).json({ message: "Invalid token" });

    return;
  }

  try {
    await res.unstable_revalidate(req.body.path);
    res.json({ revalidated: true, date: new Date() });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    res.status(500).send("Error revalidating");
  }
}
