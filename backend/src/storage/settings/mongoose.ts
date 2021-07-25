import { ConnectionOptions } from "mongoose";

interface MongooseSettings {
    uri: string
    options: ConnectionOptions
}

export default MongooseSettings;