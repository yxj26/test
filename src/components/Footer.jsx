import React from 'react';
import './Footer.css';

/**
 * Footer组件 - 页面底部说明区域
 */
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          📚 课程管理系统 | 使用 React + CSS 构建
        </p>
        <p className="footer-subtext">
          支持：课程增删改查、搜索筛选、本地存储、学习状态管理
        </p>
      </div>
    </footer>
  );
};

export default Footer;
