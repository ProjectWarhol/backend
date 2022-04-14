module.exports = {
  up: async (queryInterface) => {
    const userIds = await queryInterface.sequelize.query(
      `SELECT id from "User";`
    );
    const contentIds = await queryInterface.sequelize.query(
      `SELECT id from "NftContent";`
    );
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
