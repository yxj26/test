import React, { memo } from 'react';
import './CourseCard.css';

/**
 * CourseCard 组件 - 显示单个课程卡片
 *
 * 使用 React.memo 包裹，配合父组件的 useCallback，
 * 当 course、onStudy、onDelete、onEdit 均未变化时跳过重渲染。
 *
 * @param {Object}   props.course    - 课程对象 {id, name, description, category, isStudied}
 * @param {Function} props.onStudy  - 学习按钮点击回调（父组件用 useCallback 包裹）
 * @param {Function} props.onDelete - 删除按钮点击回调（父组件用 useCallback 包裹）
 * @param {Function} props.onEdit   - 编辑按钮点击回调（父组件用 useCallback 包裹）
 */
const CourseCard = memo(({ course, onStudy, onDelete, onEdit }) => {
  const { id, name, description, category, isStudied } = course;

  // 分类对应的颜色标签
  const categoryColors = {
    编程: '#667eea',
    设计: '#f093fb',
    语言: '#4facfe',
    其他: '#43e97b'
  };
  const categoryColor = categoryColors[category] || '#9ca3af';

  return (
    <div className={`course-card ${isStudied ? 'studied' : ''}`}>
      {/* 卡片头部：标题 + 分类标签 */}
      <div className="card-header">
        <h3 className="card-title">{name}</h3>
        <span
          className="card-category"
          style={{ backgroundColor: categoryColor }}
        >
          {category}
        </span>
      </div>

      {/* 课程简介 */}
      <p className="card-description">{description}</p>

      {/* 操作按钮区 */}
      <div className="card-footer">
        {/* 学习按钮 - 点击后 App.jsx 的 handleStudyCourse 会弹出提示 */}
        <button
          className={`btn btn-study ${isStudied ? 'studied' : ''}`}
          onClick={() => onStudy(id)}
          title={isStudied ? '取消学习状态' : `开始学习「${name}」`}
        >
          {isStudied ? '✓ 已学习' : '开始学习'}
        </button>

        {/* 编辑按钮 */}
        <button
          className="btn btn-edit"
          onClick={() => onEdit(course)}
          title="编辑课程"
        >
          编辑
        </button>

        {/* 删除按钮 */}
        <button
          className="btn btn-delete"
          onClick={() => onDelete(id)}
          title="删除课程"
        >
          删除
        </button>
      </div>

      {/* 已完成徽章 - 条件渲染 */}
      {isStudied && <div className="studied-badge">已完成</div>}
    </div>
  );
});

CourseCard.displayName = 'CourseCard';

export default CourseCard;
