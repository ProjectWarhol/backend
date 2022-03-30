module.exports = {
  up: async (queryInterface) => {
    const userIds = await queryInterface.sequelize.query(
      `SELECT id from "User";`
    );

    await queryInterface.bulkInsert('Promoting', [
      {
        userId: userIds[0][0].id,
        promotedId: userIds[0][1].id,
        createdAt: new Date(),
      },
      {
        userId: userIds[0][0].id,
        promotedId: userIds[0][2].id,
        createdAt: new Date(),
      },
      {
        userId: userIds[0][0].id,
        promotedId: userIds[0][3].id,
        createdAt: new Date(),
      },
      {
        userId: userIds[0][1].id,
        promotedId: userIds[0][0].id,
        createdAt: new Date(),
      },
      {
        userId: userIds[0][1].id,
        promotedId: userIds[0][3].id,
        createdAt: new Date(),
      },
      {
        userId: userIds[0][3].id,
        promotedId: userIds[0][2].id,
        createdAt: new Date(),
      },
    ]);
    await queryInterface.sequelize.query(
      `CREATE OR REPLACE FUNCTION incrementPromoting() 
      RETURNS TRIGGER 
      LANGUAGE PLPGSQL 
      AS 
      $$ 
      BEGIN 
      UPDATE "User" 
      SET "promoting"="promoting"+1 
      WHERE "id"=NEW."userId"; 
      UPDATE "User" 
      SET "promoters"="promoters"+1 
      WHERE "id"=NEW."promotedId"; 
      RETURN NEW; 
      END; 
      $$;`
    );
    await queryInterface.sequelize.query(
      `CREATE OR REPLACE FUNCTION decrementPromoting() 
      RETURNS TRIGGER 
      LANGUAGE PLPGSQL 
      AS 
      $$ 
      BEGIN 
      UPDATE "User" 
      SET "promoting"="promoting"-1 
      WHERE "id"=OLD."userId"; 
      UPDATE "User" 
      SET "promoters"="promoters"-1 
      WHERE "id"=OLD."promotedId"; 
      RETURN OLD; 
      END; 
      $$;`
    );
    await queryInterface.sequelize.query(
      `CREATE TRIGGER createPromoting 
      AFTER INSERT ON "Promoting" 
      FOR EACH ROW 
      EXECUTE PROCEDURE incrementPromoting();`
    );
    await queryInterface.sequelize.query(
      `CREATE TRIGGER deletePromoting 
      AFTER DELETE ON "Promoting" 
      FOR EACH ROW 
      EXECUTE PROCEDURE decrementPromoting();`
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Promoting', null, {});
  },
};
