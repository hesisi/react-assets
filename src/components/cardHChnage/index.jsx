import { useRef, useEffect, useState, memo } from 'react';
import { cloneDeep } from 'lodash';
import { Empty } from 'antd';

import './index.less';

function CardHChnage(props) {
  const cardArrInit = useRef(null);
  const [cardArr, setCardArr] = useState([]);
  const [canShowProject, setShowProject] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canLeft, setCanLeft] = useState(true);
  const [canRight, setCanRight] = useState(true);
  const cardList = useRef(null);
  const cardItem = useRef(null);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    setTimeout(() => {
      handleResize();
    }, 0);
  }, []);

  useEffect(() => {
    setCardArr(props.cardArr);
    cardArrInit.current = props.cardArr;
    setTimeout(() => {
      handleResize();
    }, 0);
  }, [props.cardArr]);

  useEffect(() => {
    console.log(canShowProject, '30----');
    setCanLeft(
      canShowProject === cardArrInit.current.length - 1 || !currentIndex,
    ); // 左侧切换不能使用
    setCanRight(
      cardArrInit.current.length === 0 ||
        canShowProject === cardArrInit.current.length - 1 ||
        currentIndex + canShowProject + 1 === cardArrInit.current.length,
    );
  }, [canShowProject, currentIndex]);

  const handleResize = () => {
    // 监听窗口变化
    if (!(cardList?.current && cardItem?.current)) {
      return;
    }
    const cwidth = cardList.current.clientWidth - 100; // 当前容器宽度
    let totalW = 0;
    console.log(cardItem.current.clientWidth, '43----');
    for (let i = 0; i < cardArrInit.current.length; i++) {
      totalW += cardItem.current.clientWidth + 10;
      if (cwidth < totalW) {
        setShowProject(i);
        return;
      }
    }
    setShowProject(
      cardArrInit.current.length - 1 === -1
        ? 0
        : cardArrInit.current.length - 1,
    );
  };

  const forwardProject = (type) => {
    const newArr = cloneDeep(cardArr);
    if (type === '+') {
      const firstProject = newArr.shift();
      newArr.push(firstProject);
      setCardArr(newArr);
      setCurrentIndex(currentIndex + 1);
    } else {
      const lastProject = newArr.pop();
      newArr.unshift(lastProject);
      setCardArr(newArr);
      setCurrentIndex(currentIndex - 1);
    }
    handleResize();
  };

  const forwardLeft = () => {
    !canLeft && forwardProject('-');
  };

  const forwardRight = () => {
    !canRight && forwardProject('+');
  };

  return (
    <div ref={cardList} className="card-list-wrapper">
      <>
        {cardArr?.length ? (
          cardArr.map((item, index) => {
            return (
              <div
                ref={cardItem}
                className={
                  index === cardArr.length - 1
                    ? 'card-wrapper'
                    : 'card-wrapper jg'
                }
                key={`${index}-${item.name}`}
              >
                {item.cardRender && item.cardRender(item)}
              </div>
            );
          })
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </>
      <div
        className={canLeft ? 'forbid-btn btn-left' : 'btn-left'}
        onClick={() => forwardLeft()}
      >
        left
        {/* <i class="el-icon-arrow-left" /> */}
      </div>
      <div
        className={canRight ? 'forbid-btn btn-right' : 'btn-right'}
        onClick={() => forwardRight()}
      >
        right
        {/* <i class="el-icon-arrow-right" /> */}
      </div>
    </div>
  );
}

export default memo(CardHChnage);
