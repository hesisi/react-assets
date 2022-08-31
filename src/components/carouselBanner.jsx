import { Carousel } from 'antd';
import React, { Component } from 'react';
const banner1 = require('../assets/picture.webp');
const banner2 = require('../assets/picture2.webp');
const banner3 = require('../assets/picture3.webp');
const banner = [banner1, banner2, banner3];
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './public.less';

export default class carouselBanner extends Component {
  handleChange = (data) => {
    data === 'left' ? this.carouselBanner.prev() : this.carouselBanner.next();
  };
  render() {
    return (
      <div style={{ position: 'relative' }} className={this.props.className}>
        <p className="left" onClick={() => this.handleChange('left')}>
          <LeftOutlined />
        </p>
        <p className="right" onClick={() => this.handleChange('right')}>
          <RightOutlined />
        </p>
        <Carousel autoplay ref={(c) => (this.carouselBanner = c)}>
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
  }
}
