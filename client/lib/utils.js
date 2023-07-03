export const handleClick = (e, id) => {
  if (e.target.id === id) {
    e.target.children[0].className.baseVal = "icon hidden";
    e.target.children[1].className.baseVal = "icon show";
    setTimeout(() => {
      e.target.children[0].className.baseVal = "icon show";
      e.target.children[1].className.baseVal = "icon hidden";
    }, 1000);
  }
};
