module.exports = {
  up: async (queryInterface) => {
    const parentId = await queryInterface.sequelize.query(
      `SELECT id from "NftContent";`
    );

    await queryInterface.bulkInsert('NftChild', [
      {
        parentId: parentId[0][0].id,
      },
      {
        userId: parentId[0][1].id,
      },
      {
        userId: parentId[0][2].id,
      },
      {
        userId: parentId[0][3].id,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('NftChild', null, {});
  },
};
