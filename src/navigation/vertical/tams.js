// ** Icons Import
import { Book, Calendar, ChevronsDown, ChevronsUp, Clipboard, FileMinus, FilePlus, FileText, Grid, UserCheck } from 'react-feather'

export default [
  {
    header: 'Tài liệu'
  },
  {
    id: 'document',
    title: 'QL kho tài liệu mẫu',
    icon: <FileText size={20} />,
    navLink: '/tams/document'
  },
  {
    header: 'Kiểm tra tài liệu'
  },
  {
    id: 'course',
    title: 'Đợt kiểm tra',
    icon: <Calendar size={20} />,
    navLink: '/tams/course'
  },
  {
    id: 'checking-document',
    title: 'KT tài liệu theo đợt',
    icon: <Clipboard size={20} />,
    navLink: '/tams/checking-document'
  },
  {
    header: 'Quản lý danh mục'
  },
  {
    id: 'document-type',
    title: 'Loại tài liệu',
    icon: <Book size={20} />,
    navLink: '/tams/document-type'
  },
  {
    id: 'type-checking',
    title: 'Loại kiểm tra',
    icon: <FileMinus size={20} />,
    navLink: '/tams/type-checking'
  },
  {
    id: 'checking-document-version',
    title: 'Phiên bản KT tài liệu',
    icon: <FilePlus size={20} />,
    navLink: '/tams/checking-document-version'
  },
  {
    id: 'major',
    title: 'Chuyên ngành',
    icon: <Grid size={20} />,
    navLink: '/tams/major'
  },
  {
    header: 'Quản lý người dùng'
  },
  {
    id: 'role',
    title: 'Vai trò',
    icon: <UserCheck size={20} />,
    navLink: '/tams/role'
  }
]
