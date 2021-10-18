import FileSettings from "../settings/file";
import MemorySettings from "../settings/memory";
import MongooseSettings from "../settings/mongoose";

type BuilderSettings = {
    memory?: MemorySettings
    file?: FileSettings
    mongoose?: MongooseSettings
}

export default BuilderSettings;