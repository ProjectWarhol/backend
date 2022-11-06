module.exports = {
  up: async (queryInterface) => {
    const userIds = await queryInterface.sequelize.query(
      `SELECT id from "User";`
    );

    const companyIds = (
      await queryInterface.sequelize.query(`SELECT id from "Company";`)
    )[0];

    await queryInterface.bulkInsert('NftContent', [
      {
        title: 'A nice nft',
        userId: userIds[0][0].id,
        categories: ['art', 'music'],
        companyId: companyIds[0].id,
      },
      {
        title: 'A nicer nft',
        userId: userIds[0][1].id,
        categories: ['nsfw', 'anime', 'art'],
        companyId: companyIds[1].id,
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
        companyId: companyIds[2].id,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('NftContent', null, {});
  },
};
