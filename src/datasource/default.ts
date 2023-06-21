import { getConfig } from "../config.js";
import { getDataSource } from "./definitions.js";

// Expose the default data source for typeorm cli
const defaultDataSource = await getDataSource(getConfig())
export default defaultDataSource