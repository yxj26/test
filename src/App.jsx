import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import CourseFilter from './components/CourseFilter';
import Footer from './components/Footer';
import useLocalStorage from './hooks/useLocalStorage';
import useDebounce from './hooks/useDebounce';
import './App.css';

// 初始课程数据
const INITIAL_COURSES = [
  {
    id: 1,
    name: 'React 基础入门',
    description: '学习 React 框架的核心概念，包括组件、props、state 等',
    category: '编程',
    isStudied: false
  },
  {
    id: 2,
    name: 'UI 设计原理',
    description: '掌握用户界面设计的基本原则和实践方法',
    category: '设计',
    isStudied: false
  },
  {
    id: 3,
    name: '英语口语进阶',
    description: '提升日常英语对话和商务英语沟通能力',
    category: '语言',
    isStudied: true
  }
];

/**
 * App组件 - 课程管理应用主组件
 *
 * Hooks 使用说明：
 * - useState       管理表单显示状态、编辑状态、搜索关键词、分类筛选
 * - useEffect      在首次加载时处理聚焦（副作用）
 * - useRef         保存课程名称输入框的 DOM 引用，实现自动聚焦
 * - useMemo        缓存筛选后的课程列表，避免重复计算
 * - useCallback    缓存事件处理函数，减少子组件不必要的重渲染
 * - useLocalStorage(自定义) 将课程列表持久化到 localStorage
 * - useDebounce(自定义)     对搜索词防抖，减少不必要的筛选计算
 */
function App() {
  // ===== 自定义 Hook：useLocalStorage =====
  // 替代原有的 useState + useEffect 组合，封装了 localStorage 读写逻辑
  const [courses, setCourses] = useLocalStorage('courses_v2', INITIAL_COURSES);

  // ===== 其他状态管理（useState） =====
  // 表单显示状态（条件渲染）
  const [showForm, setShowForm] = useState(false);

  // 编辑中的课程（null 表示新增模式）
  const [editingCourse, setEditingCourse] = useState(null);

  // 搜索关键词（原始输入值，实时更新）
  const [searchTerm, setSearchTerm] = useState('');

  // 分类筛选
  const [selectedCategory, setSelectedCategory] = useState('全部');

  // ===== 自定义 Hook：useDebounce =====
  // 对搜索词进行防抖处理，300ms 后才触发实际筛选
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // ===== useRef 说明（聚焦逻辑已移入 CourseForm 内部）=====
  // CourseForm 自身通过 useRef + useEffect 管理输入框聚焦：
  //   - 组件挂载后立即聚焦（[] 依赖）
  //   - 新增成功后 setTimeout(() => ref.current.focus(), 0) 重新聚焦
  // App 层无需再持有 ref，组件职责更清晰

  // ===== useMemo：缓存筛选后的课程列表 =====
  // 只有 courses、debouncedSearchTerm、selectedCategory 三者之一变化时才重新计算
  // 避免每次渲染都重新执行过滤逻辑
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // 搜索匹配（课程名称或简介）
      const matchesSearch =
        debouncedSearchTerm === '' ||
        course.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      // 分类匹配
      const matchesCategory =
        selectedCategory === '全部' || course.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [courses, debouncedSearchTerm, selectedCategory]);

  // ===== 统计数据（useMemo 缓存） =====
  const stats = useMemo(() => ({
    total: courses.length,
    studied: courses.filter((c) => c.isStudied).length,
    filtered: filteredCourses.length
  }), [courses, filteredCourses]);

  // ===== useCallback：缓存事件处理函数 =====
  // 避免每次 App 渲染时都创建新函数，减少子组件的不必要重渲染

  /**
   * 打开新增课程表单
   */
  const handleAddCourse = useCallback(() => {
    setEditingCourse(null);
    setShowForm(true);
  }, []);

  /**
   * 打开编辑课程表单
   * @param {Object} course - 要编辑的课程对象
   */
  const handleEditCourse = useCallback((course) => {
    setEditingCourse(course);
    setShowForm(true);
  }, []);

  /**
   * 保存课程（新增或更新）
   * @param {Object} courseData - 表单提交的课程数据
   *
   * 关键设计：
   * - 新增模式：只追加课程，不关闭表单（setShowForm(false) 不调用）
   *   表单自身会清空输入并重新聚焦，方便用户连续添加
   * - 编辑模式：保存后关闭表单，回到列表视图
   */
  const handleSaveCourse = useCallback((courseData) => {
    if (editingCourse) {
      // 编辑模式：更新现有课程，保留 isStudied 状态，然后关闭表单
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseData.id ? { ...courseData, isStudied: c.isStudied } : c
        )
      );
      setShowForm(false);
      setEditingCourse(null);
    } else {
      // 新增模式：追加课程，表单保持打开（CourseForm 自行清空并重新聚焦）
      setCourses((prev) => [...prev, { ...courseData, isStudied: false }]);
      // 不调用 setShowForm(false)，表单继续显示
    }
  }, [editingCourse, setCourses]);

  /**
   * 删除课程
   * @param {number} id - 课程 ID
   */
  const handleDeleteCourse = useCallback((id) => {
    if (window.confirm('确定要删除这门课程吗？')) {
      setCourses((prev) => prev.filter((course) => course.id !== id));
    }
  }, [setCourses]);

  /**
   * 学习/取消学习（弹出提示）
   * @param {number} id - 课程 ID
   */
  const handleStudyCourse = useCallback((id) => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      if (!course.isStudied) {
        alert(`🎓 正在学习「${course.name}」，加油！`);
      }
      setCourses((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, isStudied: !c.isStudied } : c
        )
      );
    }
  }, [courses, setCourses]);

  /**
   * 取消表单
   */
  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setEditingCourse(null);
  }, []);

  /**
   * 搜索词变化回调（由 CourseFilter 触发）
   */
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  /**
   * 分类筛选变化回调（由 CourseFilter 触发）
   */
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className="app">
      {/* Header组件 - 通过 props 传递统计数据 */}
      <Header
        totalCourses={stats.total}
        studiedCourses={stats.studied}
        filteredCourses={stats.filtered}
        isFiltering={debouncedSearchTerm !== '' || selectedCategory !== '全部'}
      />

      <main className="main-content">
        <div className="content-wrapper">
          {/* 新增课程按钮 */}
          <button className="btn btn-add" onClick={handleAddCourse}>
            + 新增课程
          </button>

          {/* 搜索与筛选组件 - 通过 props 传递回调 */}
          <CourseFilter
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
          />

          {/* 课程列表 - 使用 useMemo 缓存后的 filteredCourses，通过 props 传递回调 */}
          <CourseList
            courses={filteredCourses}
            onStudy={handleStudyCourse}
            onDelete={handleDeleteCourse}
            onEdit={handleEditCourse}
          />

          {/* 表单 - 条件渲染
              CourseForm 内部通过 useRef + useEffect 自动聚焦名称输入框
              新增模式：提交后表单保持打开，清空并重新聚焦，方便连续添加
              编辑模式：提交后由 handleSaveCourse 调用 setShowForm(false) 关闭
          */}
          {showForm && (
            <CourseForm
              onSubmit={handleSaveCourse}
              onCancel={handleCancelForm}
              editingCourse={editingCourse}
            />
          )}
        </div>
      </main>

      {/* Footer 组件 */}
      <Footer />
    </div>
  );
}

export default App;
