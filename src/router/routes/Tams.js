import { lazy } from 'react'

const Document = lazy(() => import('../../views/tams/document'))
const CheckingDocument = lazy(() => import('../../views/tams/checking_document'))
const Course = lazy(() => import('../../views/tams/course'))
const Major = lazy(() => import('../../views/tams/major'))
const DocumentType = lazy(() => import('../../views/tams/document_type'))
const TypeChecking = lazy(() => import('../../views/tams/type_checking'))
const Role = lazy(() => import('../../views/tams/role'))
const Permission = lazy(() => import('../../views/tams/permission'))
const RolePermissions = lazy(() => import('../../views/tams/role_permissions'))
const Organization = lazy(() => import('../../views/tams/organization'))
const User = lazy(() => import('../../views/tams/user'))
const CheckingDocumentVersion = lazy(() => import('../../views/tams/checking_document_version'))

const TamsRoutes = [
  {
    path: '/tams/document',
    element: <Document />
  },
  {
    path: '/tams/checking-document',
    element: <CheckingDocument />
  },
  {
    path: '/tams/course',
    element: <Course />
  },
  {
    path: '/tams/major',
    element: <Major />
  },
  {
    path: '/tams/document-type',
    element: <DocumentType />
  },
  {
    path: '/tams/type-checking',
    element: <TypeChecking />
  },
  {
    path: '/tams/role',
    element: <Role />
  },
  {
    path: '/tams/permission',
    element: <Permission />
  },
  {
    path: '/tams/role_permissions',
    element: <RolePermissions />
  },
  {
    path: '/tams/organization',
    element: <Organization />
  },
  {
    path: '/tams/user',
    element: <User />
  },
  {
    path: '/tams/checking-document-version',
    element: <CheckingDocumentVersion />
  }
]

export default TamsRoutes