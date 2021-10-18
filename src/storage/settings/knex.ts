import { Knex } from "knex";

type KnexSettings = {
    connection: string | Knex.Config<any>;
}

export default KnexSettings;