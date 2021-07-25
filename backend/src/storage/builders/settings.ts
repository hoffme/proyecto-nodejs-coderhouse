import FileSettings from "../settings/file";
import FirestoreSettings from "../settings/firestore";
import KnexSettings from "../settings/knex";
import MemorySettings from "../settings/memory";
import MongooseSettings from "../settings/mongoose";

type BuilderSettings = {
    memory?: MemorySettings
    file?: FileSettings
    mongoose?: MongooseSettings
    knex?: KnexSettings
    firestore?: FirestoreSettings
}

export default BuilderSettings;