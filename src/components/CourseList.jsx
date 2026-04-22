import React, { memo } from 'react';
import CourseCard from './CourseCard';
import './CourseList.css';

/**
 * CourseList 组件 - 课程列表容器
 * 使用 React.memo 优化：props 不变时跳过重渲染
 * 配合父组件传入的 useCallback 缓存回调函数，效果最佳
 *
 * @param {Array}    props.courses   - 课程数组（父组件用 useMemo 缓存）
 * @param {Function} props.onStudy  - 学习回调（父组件用 useCallback 缓存）
 * @param {Function} props.onDelete - 删除回调（父组件用 useCallback 缓存）
 * @param {Function} props.onEdit   - 编辑回调（父组件用 useCallback 缓存）
 */
const CourseList = memo(({ courses, onStudy, onDelete, onEdit }) => {
  // 空状态 - 条件渲染
  if (courses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h3>暂无课程</h3>
        <p>试试调整搜索关键词，或点击上方按钮添加新课程</p>
      </div>
    );
  }

  // 使用 map 进行列表渲染
  return (
    <div className="course-list">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onStudy={onStudy}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
});

CourseList.displayName = 'CourseList';

export default CourseList;
