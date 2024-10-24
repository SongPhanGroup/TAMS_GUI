import { lazy } from 'react'

const Document = lazy(() => import('../../views/tams/document'))
const CheckingDocument = lazy(() => import('../../views/tams/checking_document'))
const CheckingDocumentResult = lazy(() => import('../../views/tams/checking_document/CheckingResult'))
const Course = lazy(() => import('../../views/tams/course'))
const Major = lazy(() => import('../../views/tams/major'))
const DocumentType = lazy(() => import('../../views/tams/document_type'))
const DocumentSource = lazy(() => import('../../views/tams/document_source'))
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
      {
        path: '/tams/organization',
        element: <Organization />
    },
    {
        path: '/tams/config',
        element: <Config />
    }
]

export default TamsRoutes