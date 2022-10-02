module.exports = {
  up: async (queryInterface) => {
    const ownerUserId = await queryInterface.sequelize.query(
      `SELECT id from "User";`
    );

    await queryInterface.bulkInsert('Company', [
      {
        companyName: 'Ubisoft',
        website: 'ubisoft.com',
        primaryColor: 'blue',
        secondaryColor: 'white',
        address: 'Montreal, Quebec',
        ownerUserId: ownerUserId[0][0].id,
      },
      {
        companyName: 'Bethesda',
        website: 'bethesda.com',
        primaryColor: 'black',
        secondaryColor: 'white',
        address: 'Bethesda, Maryland',
        ownerUserId: ownerUserId[0][1].id,
      },
      {
        companyName: 'CD Projekt Red',
        website: 'cdprojektred.com',
        primaryColor: 'yellow',
        secondaryColor: 'black',
        address: 'Warsaw, Poland',
        ownerUserId: ownerUserId[0][3].id,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Company', null, {});
  },
};
