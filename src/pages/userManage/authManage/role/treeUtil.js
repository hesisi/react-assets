/* 构建右树 */
const creatRightTree = (tree, targetsKeys = []) => {
  if (!(tree && tree.length) || !targetsKeys?.length) {
    return [];
  }
  let newArr = [];
  newArr = tree.map((item) => {
    if (targetsKeys.includes(item.key) && !item?.children?.length) {
      return item;
    }
    if (item.children && item.children.length) {
      const newChildren = creatRightTree(item.children, targetsKeys);
      if (newChildren && newChildren.length) {
        return {
          ...item,
          children: newChildren,
        };
      }
      return null;
    }
    return null;
  });
  newArr = newArr.filter((item) => item != null);
  return newArr;
};

/* 树搜索 */
const filterArrForKey = (tree, searchValue) => {
  if (!(tree && tree.length)) {
    return [];
  }
  let newArr = [];
  newArr = tree.map((item) => {
    if (item?.title?.indexOf(searchValue) !== -1) {
      return item;
    }
    if (item.children && item.children.length) {
      const newChildren = filterArrForKey(item.children, searchValue);
      if (newChildren && newChildren.length) {
        return {
          ...item,
          children: newChildren,
        };
      }
      return null;
    }
    return null;
  });
  newArr = newArr.filter((item) => item != null);
  return newArr;
};

export { creatRightTree, filterArrForKey };
