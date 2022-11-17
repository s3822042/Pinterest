import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../utils/client";
import {
  singleUserQuery,
  userCreatedPinsQuery,
  userSavedPinsQuery,
} from "../../../utils/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id }: any = req.query;

    const query = singleUserQuery(id);
    const userCreatedQuery = userCreatedPinsQuery(id);
    const userSavedQuery = userSavedPinsQuery(id);

    const user = await client.fetch(query);
    const userPins = await client.fetch(userCreatedQuery);
    const userSavedPins = await client.fetch(userSavedQuery);

    res.status(200).json({ user: user[0], userPins, userSavedPins });
  }
}
