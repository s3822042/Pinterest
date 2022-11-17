import type { NextApiRequest, NextApiResponse } from "next";

import { client } from "../../../utils/client";
import { searchQuery } from "../../../utils/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;

    const query = searchQuery(id);
    const pins = await client.fetch(query);

    res.status(200).json(pins);
  }
}
