import createSchema from "part:@sanity/base/schema-creator";

import schemaTypes from "all:part:@sanity/base/schema-type";
import pin from "./pin";
import user from "./user";
import comment from "./comment";
import postedBy from "./postedBy";
import save from "./save";

export default createSchema({
  name: "default",

  types: schemaTypes.concat([pin, user, postedBy, comment, save]),
});
