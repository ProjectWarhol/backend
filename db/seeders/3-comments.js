module.exports = {
  up: async (queryInterface) => {
    const userIds = await queryInterface.sequelize.query(
      `SELECT id from "User";`
    );

    await queryInterface.bulkInsert('Comments', [
      {
        comment: 'You are so inspiring!',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userIds[0][0].id,
      },
      {
        comment: 'Let me take a nap... great colours, anyway.',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userIds[0][1].id,
      },
      {
        comment: 'Just alluring dude',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userIds[0][2].id,
      },
      {
        comment: 'Nice use of sky blue in this shot =)',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userIds[0][3].id,
      },
      {
        comment: 'Sleek work you have here.',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userIds[0][0].id,
      },
      {
        comment: '<script>alert(\'we better fix this boys\');</script>',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userIds[0][1].id,
      },
      {
        comment: '<img src="nonexistentimg.jpg" onerror="alert(\'i mean, this shouldn\'t even be in the db in the first place, but let\'s think about this too)">',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userIds[0][2].id,
      },
      {
        comment: 'This is classic work m8',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userIds[0][3].id,
      },
      {
        comment: 'I want to learn this kind of navigation! Teach me.',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userIds[0][0].id,
      },
      {
        comment: 'Hugely thought out! Contrast.',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userIds[0][1].id,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Comments', null, {});
  },
};