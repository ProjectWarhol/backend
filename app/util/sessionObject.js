exports.sessionObject = (userObject) => ({
  id: userObject.id,
  userName: userObject.userName,
  email: userObject.email,
  avatar: userObject.avatar,
  bio: userObject.bio,
  promoters: userObject.promoters,
  promoting: userObject.promoting,
  verified: userObject.verified,
});
