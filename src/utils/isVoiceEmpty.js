module.exports = (channel) => {
  return (
    channel && channel.members.filter((member) => !member.user.bot).size === 0
  );
};
