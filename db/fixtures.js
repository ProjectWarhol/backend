/* eslint-disable no-console */
/* eslint no-param-reassign: ["error", { "props": false }] */
const bcrypt = require('bcrypt');

const db = require('../app/models');

const { User, UserWallet } = db;

const seed = async () => {
  await db.sequelize.sync({ alter: true });

  const userWallet = await UserWallet.bulkCreate([
    {
      id: 'abcdefab-abcd-abcd-abcd-abcdefabcdef',
      publicKey: 'abcdefab-abcd-abcd-ab',
      passwordHash: 'OmarBadawy',
    },
    {
      id: 'hfueuwij-agfd-wecfg-12v4-7u6yefab8ujk',
      publicKey: 'abcdefab-abcd-abcd-ab',
      passwordHash: 'JulianRomer',
    },
    {
      id: 'uri3hjk-8ui9-kmnh-iud4-8uhjnbgt65rf',
      publicKey: 'abcdefab-abcd-abcd-ab',
      passwordHash: 'TakahiroMitsui',
    },
    {
      id: 'ufjen7u8-jkiu-ujki-8iu7-123ewq4r5t6y',
      publicKey: 'abcdefab-abcd-abcd-ab',
      passwordHash: 'MassiRicci',
    },
  ]);
  console.log('create user wallets');

  // eslint-disable-next-line no-unused-vars
  const users = await User.bulkCreate([
    {
      id: 'qwertyui-asdf-asdf-asdf-zxcvbnmnbvcx',
      userName: 'Omar_Badawy',
      email: 'omar.badawy@warhol.com',
      passwordHash: await bcrypt.hash('OmarBadawy', 12),
      promoters: 1000,
      promoting: 1001,
      verified: true,
      walletId: userWallet[0].id,
    },
    {
      id: '1q2w3e4r-aisu-woei-poiu-yhnbgtrfuytr',
      userName: 'Julian_Romer',
      email: 'julian.romer@warhol.com',
      passwordHash: await bcrypt.hash('JulianRomer', 12),
      promoters: 2000,
      promoting: 1234,
      verified: true,
      walletId: userWallet[1].id,
    },
    {
      id: 'abcdabcd-wdfg-3f4f-fsef-ahsiru75839e',
      userName: 'Takahiro_Mitsui',
      email: 'takahiro.Mitsui@warhol.com',
      passwordHash: await bcrypt.hash('TakahiroMitsui', 12),
      promoters: 9876,
      promoting: 7654,
      verified: false,
      walletId: userWallet[2].id,
    },
    {
      id: 'hgytjudk-74hf-98uh-jhdi-sysuh87u6vc2',
      userName: 'Massi_Ricci',
      email: 'massi.ricci@warhol.com',
      passwordHash: await bcrypt.hash('MassiRicci', 12),
      promoters: 250,
      promoting: 900,
      verified: false,
      walletId: userWallet[3].id,
    },
  ]);
  console.log('create users');
};

seed().then(() => process.exit());
