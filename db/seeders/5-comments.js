module.exports = {
  up: async (queryInterface) => {
    const userIds = await queryInterface.sequelize.query(
      `SELECT id from "User";`
    );
    const contentIds = await queryInterface.sequelize.query(
      `SELECT id from "NftContent";`
    );

    await queryInterface.bulkInsert('Comment', [
      {
        comment: 'You are so inspiring!',
        userId: userIds[0][0].id,
        contentId: contentIds[0][1].id,
      },
      {
        comment: 'Let me take a nap... great colours, anyway.',
        userId: userIds[0][0].id,
        contentId: contentIds[0][2].id,
      },
      {
        comment: 'Just alluring dude',
        userId: userIds[0][1].id,
        contentId: contentIds[0][3].id,
      },
      {
        comment: 'Nice use of sky blue in this shot =)',
        userId: userIds[0][1].id,
        contentId: contentIds[0][0].id,
      },
      {
        comment: 'Sleek work you have here.',
        userId: userIds[0][3].id,
        contentId: contentIds[0][3].id,
      },
      {
        comment: "<script>alert('we better fix this boys');</script>",
        userId: userIds[0][1].id,
        contentId: contentIds[0][1].id,
      },
      {
        comment:
          '<img src="nonexistentimg.jpg" onerror="alert(\'i mean, this shouldn\'t even be in the db in the first place, but let\'s think about this too)">',
        userId: userIds[0][2].id,
        contentId: contentIds[0][2].id,
      },
      {
        comment: 'This is classic work m8',
        userId: userIds[0][3].id,
        contentId: contentIds[0][3].id,
      },
      {
        comment: 'I want to learn this kind of navigation! Teach me.',
        userId: userIds[0][0].id,
        contentId: contentIds[0][0].id,
      },
      {
        comment: 'Hugely thought out! Contrast.',
        userId: userIds[0][1].id,
        contentId: contentIds[0][1].id,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Comment', null, {});
  },
};
