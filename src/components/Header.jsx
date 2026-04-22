import React from 'react';
import './Header.css';

/**
 * Header 组件 - 页面标题和课程数量统计
 *
 * 通过 props 接收统计数据，展示课程总数、已学习数、当前筛选数
 *
 * @param {number}  props.totalCourses    - 课程总数
 * @param {number}  props.studiedCourses  - 已学习课程数
 * @param {number}  props.filteredCourses - 当前筛选显示的课程数
 * @param {boolean} props.isFiltering     - 是否处于筛选状态
 */
const Header = ({ totalCourses, studiedCourses, filteredCourses, isFiltering }) => {
  // 计算学习进度百分比
  const progressPercent = totalCourses > 0
    ? Math.round((studiedCourses / totalCourses) * 100)
    : 0;

  return (
    <header className="header">
      <div className="header-content">
        {/* 标题区 */}
        <div className="header-title-area">
          <h1 className="header-title">📚 课程管理系统</h1>
          <p className="header-subtitle">React Hooks 实验</p>
        </div>

        {/* 统计数据区 - 通过 props 展示 */}
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-value">{totalCourses}</span>
            <span className="stat-label">课程总数</span>
          </div>

          <div className="stat-card studied">
            <span className="stat-value">{studiedCourses}</span>
            <span className="stat-label">已学习</span>
          </div>

          <div className="stat-card remaining">
            <span className="stat-value">{totalCourses - studiedCourses}</span>
            <span className="stat-label">待学习</span>
          </div>

          {/* 筛选状态统计 - 条件渲染 */}
          {isFiltering && (
            <div className="stat-card filtered">
              <span className="stat-value">{filteredCourses}</span>
              <span className="stat-label">搜索结果</span>
            </div>
          )}
        </div>
      </div>

      {/* 学习进度条 */}
      {totalCourses > 0 && (
        <div className="progress-bar-container">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="progress-label">学习进度 {progressPercent}%</span>
        </div>
      )}
    </header>
  );
};

export default Header;
