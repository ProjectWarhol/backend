module.exports = {
  up: async (queryInterface) => {
    const userIds = await queryInterface.sequelize.query(
      `SELECT id from "User";`
    );

    await queryInterface.bulkInsert('NftContent', [
      {
        title: 'A nice nft',
        createdAt: new Date(),
        ownerId: userIds[0][0].id,
      },
      {
        title: 'A nicer nft',
        createdAt: new Date(),
        ownerId: userIds[0][1].id,
      },
      {
        title: 'An even nicer nft',
        createdAt: new Date(),
        ownerId: userIds[0][2].id,
      },
      {
        title: 'A beautiful nft',
        createdAt: new Date(),
        ownerId: userIds[0][3].id,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('NftContent', null, {});
  },
};
