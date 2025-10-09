import {env} from "./config/env.js";
import app from "./app.js";

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
})