import { getConfig } from "../config.js";
import { getDataSource } from "./definitions.js";

// Expose the default data source for typeorm cli
export const defaultDataSource = getDataSource(getConfig(), false)
