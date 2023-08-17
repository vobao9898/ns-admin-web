const Util = (text) => {
  switch(text) {
    case 1:
      return "Backlog";
    case 2:
      return "In progess";
    case 3:
      return "Waiting";
    default:
      return "Complete";
  }
};
export default Util;
