import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../utils/client";
import { uuid } from "uuidv4";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { userId, pinId } = req.body;

    const data = await client
      .patch(pinId)
      .setIfMissing({ save: [] })
      .insert("after", "save[-1]", [
        {
          _key: uuid(),
          userId: userId,
          postedBy: { _type: "postedBy", _ref: userId },
        },
      ])
      .commit();

    res.status(200).json(data);
  }
}
