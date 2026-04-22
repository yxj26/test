# React 课程管理系统

一个基于 React + CSS 构建的完整课程管理应用，实现了课程的增删改查、搜索筛选、学习状态管理等功能。

## 功能特性

### 基础功能
- ✅ 显示课程列表
- ✅ 展示课程名称与课程简介
- ✅ 新增课程
- ✅ 删除课程
- ✅ "学习"按钮交互
- ✅ 列表渲染（map）
- ✅ 状态管理（useState）
- ✅ 组件间数据传递（props）
- ✅ 输入校验（课程名称不能为空）
- ✅ 基本样式效果

### 挑战功能
- ✅ 课程搜索功能
- ✅ 课程分类筛选功能
- ✅ 课程数量统计
- ✅ 编辑课程功能
- ✅ 本地存储（localStorage）
- ✅ 响应式布局

## 项目结构

```
course-manager/
├── src/
│   ├── components/         # 组件目录
│   │   ├── Header.jsx     # 页面标题组件
│   │   ├── Header.css
│   │   ├── CourseList.jsx # 课程列表组件
│   │   ├── CourseList.css
│   │   ├── CourseCard.jsx # 课程卡片组件
│   │   ├── CourseCard.css
│   │   ├── CourseForm.jsx # 课程表单组件
│   │   ├── CourseForm.css
│   │   ├── CourseFilter.jsx # 筛选组件
│   │   ├── CourseFilter.css
│   │   ├── Footer.jsx     # 底部组件
│   │   └── Footer.css
│   ├── App.jsx            # 主组件
│   ├── App.css            # 全局样式
│   ├── index.css          # 基础重置
│   └── main.jsx           # 入口文件
```

## 技术实现要点

### 1. React 函数组件
所有组件均使用函数组件定义，使用 `useState` Hook 进行状态管理。

```jsx
// 示例：Header 组件
const Header = ({ totalCourses, studiedCourses }) => {
  return (
    <header className="header">
      {/* 组件内容 */}
    </header>
  );
};
```

### 2. props 组件传值
通过 props 实现组件间的数据传递：

- Header 接收 `totalCourses` 和 `studiedCourses` 显示统计数据
- CourseList 接收 `courses` 数组渲染列表
- CourseCard 接收单个 `course` 对象显示课程信息
- CourseForm 接收 `onSubmit`、`onCancel` 回调函数

### 3. state 状态管理
使用 `useState` Hook 管理应用状态：

```jsx
// App.jsx 中的状态
const [courses, setCourses] = useState([]);        // 课程列表
const [showForm, setShowForm] = useState(false);   // 表单显示状态
const [editingCourse, setEditingCourse] = useState(null); // 编辑中的课程
const [filters, setFilters] = useState({...});     // 筛选条件
```

### 4. 事件绑定与处理
所有交互元素都绑定了事件处理函数：

```jsx
// 点击事件
<button onClick={handleAddCourse}>新增课程</button>

// 表单提交
<form onSubmit={handleSubmit}>

// 输入变化
<input value={formData.name} onChange={handleChange} />
```

### 5. 列表渲染（map）
使用 `map` 方法进行列表渲染，注意设置 `key`：

```jsx
{courses.map((course) => (
  <CourseCard key={course.id} course={course} />
))}
```

### 6. 条件渲染
使用条件运算符和逻辑运算符实现条件渲染：

```jsx
// 条件渲染表单
{showForm && <CourseForm />}

// 空状态条件渲染
{courses.length === 0 ? <EmptyState /> : <CourseList />}

// 三元运算符
{isStudied ? '已学习 ✓' : '开始学习'}
```

### 7. 表单输入与受控组件
使用受控组件模式管理表单数据：

```jsx
const [formData, setFormData] = useState({
  name: '',
  description: '',
  category: '编程'
});

// 输入变化时更新状态
const handleChange = (e) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};
```

### 8. 输入校验
在提交前进行表单验证：

```jsx
const validate = () => {
  const newErrors = {};
  if (!formData.name.trim()) {
    newErrors.name = '课程名称不能为空';
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### 9. 本地存储（localStorage）
使用 `useEffect` Hook 实现数据持久化：

```jsx
// 初始化时加载数据
useEffect(() => {
  const savedCourses = localStorage.getItem('courses');
  if (savedCourses) {
    setCourses(JSON.parse(savedCourses));
  }
}, []);

// 数据变化时保存
useEffect(() => {
  localStorage.setItem('courses', JSON.stringify(courses));
}, [courses]);
```

### 10. 组件拆分与组合
按照功能将页面拆分为多个组件，通过组合构建完整页面：

```
App (主组件)
├── Header (顶部)
├── CourseFilter (筛选)
├── CourseList (列表)
│   └── CourseCard (卡片)
├── CourseForm (表单 - 条件渲染)
└── Footer (底部)
```

## 使用方法

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本
```bash
npm run build
```

## 知识点总结

| 知识点 | 使用位置 | 说明 |
|--------|----------|------|
| 函数组件 | 所有组件 | 使用函数定义组件，简洁高效 |
| JSX | 所有组件 | 在 JS 中编写类似 HTML 的语法 |
| props | 所有组件 | 父子组件间数据传递 |
| useState | App, CourseForm, CourseFilter | Hook 管理组件状态 |
| useEffect | App | 处理副作用（localStorage 操作） |
| 事件绑定 | 所有交互组件 | onClick、onChange、onSubmit |
| map 列表渲染 | CourseList | 遍历数组生成组件列表 |
| 条件渲染 | App, CourseCard | 根据条件显示不同内容 |
| 受控组件 | CourseForm | 表单值由 React 状态控制 |
| 组件拆分 | 整体架构 | 按功能拆分为多个组件 |
| 组合模式 | App | 通过组合小组件构建大组件 |

## 设计特点

1. **响应式设计**：使用 Flexbox 和 Grid 布局，适配不同屏幕尺寸
2. **渐变主题**：使用紫蓝渐变色系，视觉统一美观
3. **交互反馈**：按钮悬停、表单验证、删除确认等用户友好的交互
4. **代码规范**：合理的命名、组件注释、清晰的目录结构
5. **数据持久化**：使用 localStorage 保存数据，刷新页面不丢失
