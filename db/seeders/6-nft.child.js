module.exports = {
  up: async (queryInterface) => {
    const id = await queryInterface.sequelize.query(
      `SELECT id from "NftContent";`
    );

    await queryInterface.bulkInsert('NftChild', [
      {
        childId: '856907ff-dbd3-4970-8b71-fb43c2ab7f8a',
        favoriteChild: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: id[0][0].id,
      },
      {
        childId: '856907ff-dbd3-4970-8b71-fb43c2ab7f8b',
        favoriteChild: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: id[0][0].id,
      },
      {
        childId: '856907ff-dbd3-4970-8b71-fb43c2ab7f8c',
        favoriteChild: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: id[0][2].id,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('NftChild', null, {});
  },
};
