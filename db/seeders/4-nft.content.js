module.exports = {
  up: async (queryInterface) => {
    const userIds = await queryInterface.sequelize.query(
      `SELECT id from "User";`
    );

    await queryInterface.bulkInsert('NftContent', [
      {
        title: 'A nice nft',
        userId: userIds[0][0].id,
        categories: ['art', 'music'],
      },
      {
        title: 'A nicer nft',
        userId: userIds[0][1].id,
        categories: ['nsfw', 'anime', 'art'],
      },
      {
        title: 'An even nicer nft',
        userId: userIds[0][2].id,
        categories: ['animals', 'food', 'travel', 'baz'],
      },
      {
        title: 'A beautiful nft',
        userId: userIds[0][3].id,
        categories: ['foo', 'bar', 'baz'],
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('NftContent', null, {});
  },
};
