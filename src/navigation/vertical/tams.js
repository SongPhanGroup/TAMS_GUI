// ** Icons Import
import { FileMinus, FilePlus, FileText } from 'react-feather'

export default [
  {
    header: 'Tài liệu'
  },
  {
    id: 'document',
    title: 'Tài liệu',
    icon: <FileText size={20} />,
    navLink: '/tams/document'
  },
  {
    id: 'checking-document',
    title: 'Kiểm tra tài liệu',
    icon: <FilePlus size={20} />,
    navLink: '/tams/checking-document'
  }
  // {
  //   id: 'checking-sentence',
  //   title: 'Kiểm tra câu',
  //   icon: <FileMinus size={20} />,
  //   navLink: '/tams/checking-sentence'
  // }
]
