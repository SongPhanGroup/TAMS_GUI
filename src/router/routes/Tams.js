import { lazy } from 'react'

const Document = lazy(() => import('../../views/tams/document'))
const CheckingDocument = lazy(() => import('../../views/tams/checking_document'))
const CheckingDocumentResult = lazy(() => import('../../views/tams/checking_document/CheckingResult'))
const DetailComparationResult = lazy(() => import('../../views/tams/checking_document/DetailComparation'))
const Course = lazy(() => import('../../views/tams/course'))
const Major = lazy(() => import('../../views/tams/major'))
const DocumentType = lazy(() => import('../../views/tams/document_type'))
const DocumentSource = lazy(() => import('../../views/tams/document_source'))
// const TypeChecking = lazy(() => import('../../views/tams/type_checking'))
// const Role = lazy(() => import('../../views/tams/role'))
// const Permission = lazy(() => import('../../views/tams/permission'))
// const RolePermissions = lazy(() => import('../../views/tams/role_permissions'))
// const Organization = lazy(() => import('../../views/tams/organization'))
// const User = lazy(() => import('../../views/tams/user'))
// const CheckingDocumentVersion = lazy(() => import('../../views/tams/checking_document_version'))
const Organization = lazy(() => import('../../views/nentangloi/quanlydanhmuc/organizations'))
const Config = lazy(() => import('../../views/nentangloi/quanlyhethong/config'))

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
        path: '/tams/checking-result/:id',
        element: <CheckingDocumentResult />
    },
    {
        path: '/tams/detail-comparation/:id',
        element: <DetailComparationResult />
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
        path: '/tams/document-source',
        element: <DocumentSource />
    },
    //   {
    //     path: '/tams/type-checking',
    //     element: <TypeChecking />
    //   },
    //   {
    //     path: '/tams/role',
    //     element: <Role />
    //   },
    //   {
    //     path: '/tams/permission',
    //     element: <Permission />
    //   },
    //   {
    //     path: '/tams/role_permissions',
    //     element: <RolePermissions />
    //   },
      {
        path: '/tams/organization',
        element: <Organization />
    },
    {
        path: '/tams/config',
        element: <Config />
    },
    //   {
    //     path: '/tams/user',
    //     element: <User />
    //   },
    //   {
    //     path: '/tams/checking-document-version',
    //     element: <CheckingDocumentVersion />
    //   }
]

export default TamsRoutes