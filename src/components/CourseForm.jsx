import React, { useState, useEffect, useRef } from 'react';
import './CourseForm.css';

/**
 * CourseForm 组件 - 课程表单（新增 / 编辑）
 *
 * useRef + useEffect 自动聚焦实现：
 * 1. 组件内部用 useRef 获取课程名称输入框的 DOM 引用
 * 2. useEffect 在以下时机执行聚焦（副作用 - DOM 操作）：
 *    - 表单首次挂载时（组件出现后立即聚焦）
 *    - 新增课程提交成功后（通过 focusTrigger 状态驱动）
 * 3. 新增模式：提交后表单不关闭，清空输入并重新聚焦，方便连续添加
 * 4. 编辑模式：提交后调用 onSubmit，由父组件决定是否关闭
 *
 * @param {Function} props.onSubmit       - 表单提交回调（父组件处理保存逻辑）
 * @param {Function} props.onCancel       - 取消/关闭表单回调
 * @param {Object}   props.editingCourse  - 正在编辑的课程对象（null 表示新增模式）
 */
const CourseForm = ({ onSubmit, onCancel, editingCourse }) => {
  // ===== useRef：获取课程名称输入框的 DOM 节点 =====
  // useRef 不会触发重渲染，适合保存 DOM 引用
  const nameInputRef = useRef(null);

  // ===== useState：受控组件表单数据 =====
  const [formData, setFormData] = useState({
    name: editingCourse?.name || '',
    description: editingCourse?.description || '',
    category: editingCourse?.category || '编程'
  });

  // 错误信息状态
  const [errors, setErrors] = useState({});

  // 成功提示状态（新增后短暂显示）
  const [successMsg, setSuccessMsg] = useState('');

  // ===== useEffect 1：表单首次挂载时自动聚焦 =====
  // 依赖数组为空 [] → 只在组件挂载后执行一次（副作用：DOM 操作）
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // ===== useEffect 2：编辑课程切换时同步表单内容并聚焦 =====
  // 依赖 editingCourse → 每次切换编辑目标时重新填充表单
  useEffect(() => {
    if (editingCourse) {
      setFormData({
        name: editingCourse.name || '',
        description: editingCourse.description || '',
        category: editingCourse.category || '编程'
      });
    } else {
      setFormData({ name: '', description: '', category: '编程' });
    }
    setErrors({});
    // 切换编辑目标后也重新聚焦（副作用：DOM 操作）
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editingCourse]);

  // 处理输入变化（受控组件）
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 表单验证
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = '课程名称不能为空';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '课程名称至少 2 个字符';
    }
    if (!formData.description.trim()) {
      newErrors.description = '课程简介不能为空';
    } else if (formData.description.trim().length < 5) {
      newErrors.description = '课程简介至少 5 个字符';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // 调用父组件的保存逻辑
    onSubmit({
      ...formData,
      id: editingCourse?.id || Date.now()
    });

    // ===== 新增模式：提交后清空表单并重新聚焦，表单保持打开 =====
    // 编辑模式下父组件会调用 onCancel 关闭表单，这里只处理新增场景
    if (!editingCourse) {
      // 清空表单内容，准备下一条输入
      setFormData({ name: '', description: '', category: '编程' });
      setErrors({});

      // 显示成功提示
      setSuccessMsg(`✅ 「${formData.name}」已添加！`);
      setTimeout(() => setSuccessMsg(''), 2000);

      // ===== useRef 聚焦：直接操作 DOM，让光标回到名称输入框 =====
      // 使用 setTimeout 确保 React 完成本次渲染后再聚焦
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 0);
    }
  };

  const isEditing = Boolean(editingCourse);

  return (
    <div className="form-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="form-container">
        <h2 className="form-title">
          {isEditing ? '✏️ 编辑课程' : '➕ 新增课程'}
        </h2>

        {/* 成功提示 - 条件渲染，新增后短暂显示 */}
        {successMsg && (
          <div className="success-toast">{successMsg}</div>
        )}

        <form onSubmit={handleSubmit} className="course-form">
          {/* 课程名称输入 - 绑定 nameInputRef 实现自动聚焦 */}
          <div className="form-group">
            <label htmlFor="name">
              课程名称 <span className="required">*</span>
            </label>
            <input
              ref={nameInputRef}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="请输入课程名称"
              className={errors.name ? 'error' : ''}
              autoComplete="off"
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          {/* 课程分类选择 */}
          <div className="form-group">
            <label htmlFor="category">课程分类</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="编程">编程</option>
              <option value="设计">设计</option>
              <option value="语言">语言</option>
              <option value="其他">其他</option>
            </select>
          </div>

          {/* 课程简介输入 */}
          <div className="form-group">
            <label htmlFor="description">
              课程简介 <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="请输入课程简介（至少 5 个字符）"
              rows={4}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          {/* 按钮组 */}
          <div className="form-buttons">
            <button type="submit" className="btn btn-submit">
              {isEditing ? '保存修改' : '添加课程'}
            </button>
            <button type="button" className="btn btn-cancel" onClick={onCancel}>
              {isEditing ? '取消' : '关闭'}
            </button>
          </div>

          {/* 新增模式下的提示文字 */}
          {!isEditing && (
            <p className="form-hint">
              💡 添加后表单保持打开，方便连续添加多门课程
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
