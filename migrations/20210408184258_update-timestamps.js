// https://dev.to/morz/knex-psql-updating-timestamps-like-a-pro-2fg6
exports.up = async knex => {
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$;
  `)

  await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON links
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `)
  await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `)
}

exports.down = function (knex) {
  return knex.raw(`
    DROP FUNCTION IF EXISTS update_timestamp() CASCADE;
  `)
}
