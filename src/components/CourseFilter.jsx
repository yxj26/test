import React from 'react';
import './CourseFilter.css';

/**
 * CourseFilter组件 - 课程搜索和分类筛选
 *
 * 设计说明：
 * - 搜索词状态提升到 App.jsx，由父组件统一管理
 * - 父组件通过 useDebounce 对搜索词做防抖处理
 * - 本组件为受控组件，通过 props 接收当前值并回调通知变化
 *
 * @param {string}   props.searchTerm       - 当前搜索关键词（受控）
 * @param {string}   props.selectedCategory - 当前选中分类（受控）
 * @param {Function} props.onSearchChange   - 搜索词变化回调（接收字符串）
 * @param {Function} props.onCategoryChange - 分类变化回调（接收分类字符串）
 */
const CourseFilter = ({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange
}) => {
  const categories = ['全部', '编程', '设计', '语言', '其他'];

  return (
    <div className="course-filter">
      {/* 搜索框 - 受控组件，value 由父组件提供 */}
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="搜索课程名称或简介..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {/* 清除按钮 - 条件渲染 */}
        {searchTerm && (
          <button
            className="search-clear"
            onClick={() => onSearchChange('')}
            title="清除搜索"
          >
            ✕
          </button>
        )}
      </div>

      {/* 分类筛选按钮组 */}
      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CourseFilter;
