import { getConfig } from "../config.js";
import { getDataSource } from "./definitions.js";

// Expose the default data source for typeorm cli
let defaultDataSource = await getDataSource(getConfig())
defaultDataSource = await defaultDataSource.initialize()

export default defaultDataSource