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
        categories: ['rpg', 'fantasy'],
        companyId: companyIds[0].id,
      },
      {
        title: 'A nicer nft',
        userId: userIds[0][1].id,
        categories: ['fps', 'war-sim', 'sci-fi'],
        companyId: companyIds[1].id,
      },
      {
        title: 'An even nicer nft',
        userId: userIds[0][2].id,
        categories: ['metroidvania', 'rpg'],
      },
      {
        title: 'A beautiful nft',
        userId: userIds[0][3].id,
        categories: ['space-sim', 'flight-sim'],
        companyId: companyIds[2].id,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('NftContent', null, {});
  },
};
