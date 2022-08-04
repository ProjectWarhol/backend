module.exports = {
  up: async (queryInterface) => {
    const userIds = await queryInterface.sequelize.query(
      `SELECT id from "User";`
    );

    await queryInterface.bulkInsert('NftContent', [
      {
        title: 'A nice nft',
        userId: userIds[0][0].id,
        upvotes: 10,
        hasChild: true,
      },
      {
        title: 'A nicer nft',
        userId: userIds[0][1].id,
        upvotes: 1,
        hasChild: false,
      },
      {
        title: 'An even nicer nft',
        userId: userIds[0][2].id,
        upvotes: 4,
        hasChild: true,
      },
      {
        title: 'A beautiful nft',
        userId: userIds[0][3].id,
        upvotes: 2,
        hasChild: false,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('NftContent', null, {});
  },
};
