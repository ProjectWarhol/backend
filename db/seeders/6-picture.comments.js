module.exports = {
  up: async (queryInterface) => {
    const contentIds = await queryInterface.sequelize.query(
      `SELECT id from "NftContent";`
    );
    const commentIds = await queryInterface.sequelize.query(
      `SELECT id from "Comments";`
    );

    await queryInterface.bulkInsert('PictureComments', [
      {
        pictureId: contentIds[0][0].id,
        commentId: commentIds[0][0].id,
      },
      {
        pictureId: contentIds[0][0].id,
        commentId: commentIds[0][4].id,
      },
      {
        pictureId: contentIds[0][0].id,
        commentId: commentIds[0][9].id,
      },
      {
        pictureId: contentIds[0][0].id,
        commentId: commentIds[0][7].id,
      },
      {
        pictureId: contentIds[0][1].id,
        commentId: commentIds[0][3].id,
      },
      {
        pictureId: contentIds[0][2].id,
        commentId: commentIds[0][1].id,
      },
      {
        pictureId: contentIds[0][2].id,
        commentId: commentIds[0][2].id,
      },
      {
        pictureId: contentIds[0][3].id,
        commentId: commentIds[0][5].id,
      },
      {
        pictureId: contentIds[0][3].id,
        commentId: commentIds[0][6].id,
      },
      {
        pictureId: contentIds[0][3].id,
        commentId: commentIds[0][8].id,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('PictureComments', null, {});
  },
};
