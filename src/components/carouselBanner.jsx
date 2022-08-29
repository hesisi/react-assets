import { Carousel } from 'antd';
import React from 'react';
// const banner1 = require('../assets/pic.jpg');
// const banner2 = require('../assets/test.jpg');
// const banner3 = require('../assets/panda.jpg');
const banner1 = require('../assets/picture.webp');
const banner2 = require('../assets/picture2.webp');
const banner3 = require('../assets/picture3.webp');
const banner = [banner1, banner2, banner3];
const contentStyle = {
  height: '100%',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};
const CarouselBanner = (props) => (
  <div className={props.className}>
    <Carousel autoplay>
      {banner.map((e, i) => {
        return (
          <div style={{ height: '100%' }} key={i}>
            <img src={e} />
          </div>
        );
      })}
    </Carousel>
  </div>
);

export default CarouselBanner;
