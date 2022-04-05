module.exports = {
  up: async (queryInterface) => {
    const userIds = await queryInterface.sequelize.query(
      `SELECT id from "User";`
    );
    const contentIds = await queryInterface.sequelize.query(
      `SELECT id from "NftContent";`
    );

    await queryInterface.sequelize.query(
      `CREATE OR REPLACE FUNCTION incrementVote() 
      RETURNS TRIGGER 
      LANGUAGE PLPGSQL 
      AS 
      $$ 
      BEGIN 
      IF NEW."type" IS TRUE THEN
        UPDATE "NftContent" 
        SET "upvotes"="upvotes"+1 
        WHERE "id"=NEW."contentId";
      ELSE 
        UPDATE "NftContent" 
        SET "downvotes"="downvotes"+1 
        WHERE "id"=NEW."contentId";
      END IF;
      RETURN NEW; 
      END; 
      $$;`
    );
    await queryInterface.sequelize.query(
      `CREATE OR REPLACE FUNCTION decrementVote() 
      RETURNS TRIGGER 
      LANGUAGE PLPGSQL 
      AS 
      $$ 
      BEGIN 
      IF OLD."type" IS TRUE THEN
        UPDATE "NftContent" 
        SET "upvotes"="upvotes"-1 
        WHERE "id"=OLD."contentId";
      ELSE 
        UPDATE "NftContent" 
        SET "downvotes"="downvotes"-1 
        WHERE "id"=OLD."contentId";
      END IF;
      RETURN OLD; 
      END; 
      $$;`
    );
    // await queryInterface.sequelize.query(
    //   `CREATE OR REPLACE FUNCTION updateVote() 
    //   RETURNS TRIGGER 
    //   LANGUAGE PLPGSQL 
    //   AS 
    //   $$ 
    //   BEGIN 
    //   IF NEW."type" IS TRUE THEN
    //     UPDATE "NftContent" 
    //     SET "upvotes"="upvotes"+1,
    //     "downvotes"="downvotes"-1
    //     WHERE "id"=NEW."contentId";
    //   ELSE 
    //     UPDATE "NftContent" 
    //     SET "upvotes"="upvotes"-1,
    //     "downvotes"="downvotes"+1
    //     WHERE "id"=NEW."contentId";
    //   END IF;
    //   RETURN NEW; 
    //   END; 
    //   $$;`
    // );
    await queryInterface.sequelize.query(
      `CREATE TRIGGER createNftVote 
      AFTER INSERT ON "NftVote" 
      FOR EACH ROW 
      EXECUTE PROCEDURE incrementVote();`
    );
    await queryInterface.sequelize.query(
      `CREATE TRIGGER deleteNftVote 
      AFTER DELETE ON "NftVote" 
      FOR EACH ROW 
      EXECUTE PROCEDURE decrementVote();`
    );
    // await queryInterface.sequelize.query(
    //   `CREATE TRIGGER updateNftVote 
    //   AFTER UPDATE ON "NftVote" 
    //   FOR EACH ROW WHEN (
    //     OLD."type"
    //     IS DISTINCT FROM
    //     NEW."type"
    //   )
    //   EXECUTE PROCEDURE updateVote();`
    // );
    await queryInterface.bulkInsert('NftVote', [
      {
        userId: userIds[0][0].id,
        contentId: contentIds[0][1].id,
        type: true,
        createdAt: new Date(),
      },
      {
        userId: userIds[0][0].id,
        contentId: contentIds[0][2].id,
        type: false,
        createdAt: new Date(),
      },
      {
        userId: userIds[0][0].id,
        contentId: contentIds[0][3].id,
        type: true,
        createdAt: new Date(),
      },
      {
        userId: userIds[0][1].id,
        contentId: contentIds[0][0].id,
        type: false,
        createdAt: new Date(),
      },
      {
        userId: userIds[0][1].id,
        contentId: contentIds[0][2].id,
        type: true,
        createdAt: new Date(),
      },
      {
        userId: userIds[0][1].id,
        contentId: contentIds[0][3].id,
        type: true,
        createdAt: new Date(),
      },
      {
        userId: userIds[0][2].id,
        contentId: contentIds[0][0].id,
        type: true,
        createdAt: new Date(),
      },
      {
        userId: userIds[0][2].id,
        contentId: contentIds[0][3].id,
        type: false,
        createdAt: new Date(),
      },
      {
        userId: userIds[0][3].id,
        contentId: contentIds[0][0].id,
        type: true,
        createdAt: new Date(),
      },
      {
        userId: userIds[0][3].id,
        contentId: contentIds[0][2].id,
        type: false,
        createdAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('NftVote', null, {});
  },
};
