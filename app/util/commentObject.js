exports.commentObject = (comment) => ({
  userName: comment.User.userName,
  avatar: comment.User.avatar,
  comment: comment.comment,
  updatedAt: comment.updatedAt,
});
