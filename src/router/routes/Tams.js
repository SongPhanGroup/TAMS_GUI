import { lazy } from 'react'

const Document = lazy(() => import('../../views/tams/document'))
const CheckingDocument = lazy(() => import('../../views/tams/checking_document'))
const CheckingSentence = lazy(() => import('../../views/tams/checking_sentence'))

const TamsRoutes = [
  {
    path: '/tams/document',
    element: <Document />
  },
  {
    path: '/tams/checking-document',
    element: <CheckingDocument />
  }
  // {
  //   path: '/tams/checking-sentence',
  //   element: <CheckingSentence />
  // }
]

export default TamsRoutes